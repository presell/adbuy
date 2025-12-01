// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// ---------- Supabase client ----------
// Uses your server env vars from Vercel:
// SUPABASE_URL = https://habwycahldzwxreftesz.supabase.co
// SUPABASE_ANON_KEY = anon key for this project (RLS off on user_payment_methods)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Type guard to make TS happy and ensure we only handle card PMs
function isCardPaymentMethod(
  pm: Stripe.PaymentMethod
): pm is Stripe.PaymentMethod & { type: "card"; card: NonNullable<Stripe.PaymentMethod.Card> } {
  return pm.type === "card" && !!pm.card;
}

// ---------- Core DB sync helpers ----------

async function upsertUserPaymentMethod(
  internalUserId: string,
  pm: Stripe.PaymentMethod
) {
  if (!isCardPaymentMethod(pm)) {
    console.log(
      "[stripeWebhook] PaymentMethod is not a card, skipping",
      pm.id,
      pm.type
    );
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // Ensure only one row per user: delete any existing row, then insert the new one.
  const { error: deleteError } = await supabase
    .from("user_payment_methods")
    .delete()
    .eq("user_id", internalUserId);

  if (deleteError) {
    console.error(
      "[stripeWebhook] Supabase delete failed:",
      deleteError.message || deleteError
    );
    throw deleteError;
  }

  const { error: insertError } = await supabase
    .from("user_payment_methods")
    .insert({
      user_id: internalUserId,
      payment_method: pm.id,
      brand,
      last4: last4 ?? "",
      exp_month,
      exp_year,
    } as any); // cast to avoid TS complaining about inferred types

  if (insertError) {
    console.error(
      "[stripeWebhook] insertUserPaymentMethod error:",
      insertError.message || insertError
    );
    throw insertError;
  }

  console.log(
    "[stripeWebhook] Upserted card for user",
    internalUserId,
    "pm",
    pm.id
  );
}

// Given a Stripe customer, sync whatever its default card is
async function syncFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;

  if (!internalUserId) {
    console.log(
      "[stripeWebhook] customer.updated without internalUserId; skipping",
      customer.id
    );
    return;
  }

  const rawDefaultPm = customer.invoice_settings?.default_payment_method;

  // If there is *no* default card, clear any existing row and exit.
  if (!rawDefaultPm) {
    const { error } = await supabase
      .from("user_payment_methods")
      .delete()
      .eq("user_id", internalUserId);

    if (error) {
      console.error(
        "[stripeWebhook] deleteUserPaymentMethods (no default card) error:",
        error.message || error
      );
      throw error;
    }

    console.log(
      "[stripeWebhook] Customer has no default card; cleared row for user",
      internalUserId
    );
    return;
  }

  // rawDefaultPm can be a string ID or a PaymentMethod object
  const pmId =
    typeof rawDefaultPm === "string" ? rawDefaultPm : rawDefaultPm.id;

  const pm = (await stripe.paymentMethods.retrieve(
    pmId
  )) as Stripe.PaymentMethod;

  await upsertUserPaymentMethod(internalUserId, pm);
}

// Given a PaymentMethod event, look up its customer and delegate to syncFromCustomer
async function syncFromPaymentMethod(pm: Stripe.PaymentMethod) {
  if (!pm.customer) {
    console.log(
      "[stripeWebhook] payment_method.attached without customer; skipping",
      pm.id
    );
    return;
  }

  const customer = (await stripe.customers.retrieve(
    pm.customer as string
  )) as Stripe.Customer;

  await syncFromCustomer(customer);
}

// ---------- Public entrypoint ----------

export async function handleStripeWebhook(event: Stripe.Event) {
  console.log("[stripeWebhook] Handling event:", event.type, event.id);

  try {
    switch (event.type) {
      case "payment_method.attached": {
        const pm = event.data.object as Stripe.PaymentMethod;
        await syncFromPaymentMethod(pm);
        break;
      }

      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await syncFromCustomer(customer);
        break;
      }

      default:
        console.log(
          "[stripeWebhook] Ignoring Stripe event type:",
          event.type
        );
    }
  } catch (err) {
    console.error("[stripeWebhook] Error in handleStripeWebhook:", err);
    // Re-throw so Stripe sees 500 and retries if there’s a real DB problem
    throw err;
  }
}
