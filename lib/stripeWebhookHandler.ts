// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars SUPABASE_URL / SUPABASE_ANON_KEY");
}

// RLS is off on user_payment_methods, so anon key is fine here
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

async function deleteUserPaymentMethods(userId: string) {
  const { error } = await supabase
    .from("user_payment_methods")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("[stripeWebhook] deleteUserPaymentMethods error:", error);
    throw error;
  }
}

async function insertUserPaymentMethod(
  userId: string,
  pm: Stripe.PaymentMethod
) {
  if (pm.type !== "card" || !pm.card) {
    console.log("[stripeWebhook] payment method is not a card, skipping", pm.id);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  const payload = {
    user_id: userId,
    // 👇 MUST MATCH YOUR SCHEMA EXACTLY
    payment_method_id: pm.id,
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  const { error } = await supabase
    .from("user_payment_methods")
    .insert(payload as any);

  if (error) {
    console.error("[stripeWebhook] insertUserPaymentMethod error:", error);
    throw error;
  }

  console.log("[stripeWebhook] Synced card to user_payment_methods for", userId);
}

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

  await deleteUserPaymentMethods(internalUserId);
  await insertUserPaymentMethod(internalUserId, pm);
}

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

  // No default -> clear any stored card for this user
  if (!rawDefaultPm) {
    console.log(
      "[stripeWebhook] customer has no default payment method; cleared row for user",
      internalUserId
    );
    await deleteUserPaymentMethods(internalUserId);
    return;
  }

  const defaultPmId =
    typeof rawDefaultPm === "string" ? rawDefaultPm : rawDefaultPm.id;

  const pm = (await stripe.paymentMethods.retrieve(
    defaultPmId
  )) as Stripe.PaymentMethod;

  await deleteUserPaymentMethods(internalUserId);
  await insertUserPaymentMethod(internalUserId, pm);
}

export async function handleStripeWebhook(event: Stripe.Event) {
  console.log("[stripeWebhook] Handling event:", event.type, event.id);

  try {
    switch (event.type) {
      // ✅ NEW: ignore payment_method.attached so only customer.updated does the sync
      case "payment_method.attached": {
        console.log(
          "[stripeWebhook] Skipping payment_method.attached; customer.updated will perform the sync"
        );
        break;
      }

      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await syncFromCustomer(customer);
        break;
      }

      default: {
        console.log("[stripeWebhook] Ignoring Stripe event type:", event.type);
        break;
      }
    }
  } catch (err) {
    console.error("[stripeWebhook] Error in handleStripeWebhook:", err);
    throw err; // keep 500s so Stripe will retry & you see issues
  }
}
