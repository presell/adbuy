// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars SUPABASE_URL / SUPABASE_ANON_KEY"
  );
}

// RLS is off on user_payment_methods, so anon key is fine here
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

/**
 * Upsert a payment method row for a given user.
 * - Always keeps one row per Stripe PaymentMethod.
 * - Optionally updates the `default` flag when `isDefault` is provided.
 */
async function upsertUserPaymentMethod(
  userId: string,
  pm: Stripe.PaymentMethod,
  isDefault?: boolean
) {
  if (pm.type !== "card" || !pm.card) {
    console.log("[stripeWebhook] payment method is not a card, skipping", pm.id);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  const basePayload: any = {
    user_id: userId,
    payment_method_id: pm.id,
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  if (typeof isDefault === "boolean") {
    basePayload.default = isDefault;
  }

  // We expect payment_method_id to be unique per user.
  // If you add a unique constraint on payment_method_id in Supabase,
  // this upsert becomes fully race-proof.
  const { error } = await supabase
    .from("user_payment_methods")
    .upsert(basePayload, { onConflict: "payment_method_id" });

  if (error) {
    console.error("[stripeWebhook] upsertUserPaymentMethod error:", error);
    throw error;
  }

  console.log(
    "[stripeWebhook] Upserted card",
    pm.id,
    "for user",
    userId,
    "default=",
    isDefault
  );
}

/**
 * When a payment method is attached to a customer (via Billing Portal etc.),
 * we:
 *  - resolve the internal user id from customer.metadata.internalUserId
 *  - upsert a row for this card
 *  - do NOT touch the `default` flag here; that is handled by customer.updated
 */
async function syncFromPaymentMethod(pm: Stripe.PaymentMethod) {
  if (!pm.customer) {
    console.log("[stripeWebhook] pm.customer missing, skipping", pm.id);
    return;
  }

  const customer = (await stripe.customers.retrieve(
    pm.customer as string
  )) as Stripe.Customer;

  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.log(
      "[stripeWebhook] customer has no internalUserId, skipping",
      customer.id
    );
    return;
  }

  await upsertUserPaymentMethod(internalUserId, pm);
}

/**
 * When Stripe tells us the customer was updated, we use this ONLY to sync
 * the `default` flag:
 *  - If there is no default payment method, set all user's rows default=false.
 *  - If there is a default, set all rows default=false, then set that PM to default=true
 *    (creating the row if it doesn't exist yet).
 */
async function syncFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;

  if (!internalUserId) {
    console.log(
      "[stripeWebhook] customer.updated without internalUserId, skipping",
      customer.id
    );
    return;
  }

  const rawDefaultPm = customer.invoice_settings?.default_payment_method;

  // No default -> clear default flags, keep the cards
  if (!rawDefaultPm) {
    console.log(
      "[stripeWebhook] customer has no default payment method; clearing default flags for user",
      internalUserId
    );
    const { error } = await supabase
      .from("user_payment_methods")
      .update({ default: false })
      .eq("user_id", internalUserId);

    if (error) {
      console.error(
        "[stripeWebhook] failed to clear default flags:",
        error
      );
      throw error;
    }

    return;
  }

  const defaultPmId =
    typeof rawDefaultPm === "string" ? rawDefaultPm : rawDefaultPm.id;

  // 1) Set all to false for this user
  {
    const { error } = await supabase
      .from("user_payment_methods")
      .update({ default: false })
      .eq("user_id", internalUserId);

    if (error) {
      console.error(
        "[stripeWebhook] failed to clear default flags:",
        error
      );
      throw error;
    }
  }

  // 2) Check if we already have a row for this payment method
  const { data: existing, error: selectError } = await supabase
    .from("user_payment_methods")
    .select("id")
    .eq("payment_method_id", defaultPmId)
    .maybeSingle();

  if (selectError && (selectError as any).code !== "PGRST116") {
    console.error(
      "[stripeWebhook] failed to lookup default payment method row:",
      selectError
    );
    throw selectError;
  }

  if (existing) {
    // Just flip default=true on the existing row
    const { error: updateError } = await supabase
      .from("user_payment_methods")
      .update({ default: true })
      .eq("id", existing.id);

    if (updateError) {
      console.error(
        "[stripeWebhook] failed to set default=true on existing row:",
        updateError
      );
      throw updateError;
    }

    console.log(
      "[stripeWebhook] Marked existing card as default for user",
      internalUserId,
      "pm=",
      defaultPmId
    );
    return;
  }

  // 3) If we don't yet have the row (e.g. race where customer.updated
  //     arrives before payment_method.attached), fetch PM and upsert it
  const pm = (await stripe.paymentMethods.retrieve(
    defaultPmId
  )) as Stripe.PaymentMethod;

  await upsertUserPaymentMethod(internalUserId, pm, true);
}

/**
 * Handle removing a card from Stripe (e.g. via Billing Portal).
 * This is important once you support multiple cards per user.
 */
async function handlePaymentMethodDetached(pm: Stripe.PaymentMethod) {
  if (!pm.customer) {
    console.log(
      "[stripeWebhook] payment_method.detached with no customer, skipping",
      pm.id
    );
    return;
  }

  const customer = (await stripe.customers.retrieve(
    pm.customer as string
  )) as Stripe.Customer;

  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.log(
      "[stripeWebhook] detached PM with customer missing internalUserId, skipping",
      customer.id
    );
    return;
  }

  const { error } = await supabase
    .from("user_payment_methods")
    .delete()
    .eq("user_id", internalUserId)
    .eq("payment_method_id", pm.id);

  if (error) {
    console.error(
      "[stripeWebhook] handlePaymentMethodDetached delete error:",
      error
    );
    throw error;
  }

  console.log(
    "[stripeWebhook] Deleted card",
    pm.id,
    "for user",
    internalUserId,
    "after payment_method.detached"
  );
}

export async function handleStripeWebhook(event: Stripe.Event) {
  console.log("[stripeWebhook] Handling event:", event.type, event.id);

  try {
    switch (event.type) {
      /**
       * Fires any time a payment method is attached to a customer.
       * We use this to ensure the card exists in user_payment_methods.
       */
      case "payment_method.attached": {
        const pm = event.data.object as Stripe.PaymentMethod;
        await syncFromPaymentMethod(pm);
        break;
      }

      /**
       * Fires when a payment method is detached from a customer
       * (e.g. removed in Billing Portal).
       */
      case "payment_method.detached": {
        const pm = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodDetached(pm);
        break;
      }

      /**
       * Our single source of truth for which card is `default = true`.
       */
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await syncFromCustomer(customer);
        break;
      }

      default:
        console.log("[stripeWebhook] Ignoring Stripe event type:", event.type);
    }
  } catch (err) {
    console.error("[stripeWebhook] Error in handleStripeWebhook:", err);
    throw err; // keep 500s so Stripe will retry & you see issues
  }
}
