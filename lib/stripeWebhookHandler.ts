// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function syncDefaultPaymentMethodFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn(
      "Stripe customer missing metadata.internalUserId; skipping sync",
      customer.id
    );
    return;
  }

  const defaultPmId = customer.invoice_settings
    ?.default_payment_method as string | null;

  if (!defaultPmId) {
    console.log("Customer has no default payment method:", customer.id);
    return;
  }

  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.warn(
      "Default payment method is not a card; skipping",
      defaultPmId,
      pm.type
    );
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // MATCHES YOUR SCHEMA EXACTLY
  const payload = {
    user_id: internalUserId,
    payment_method_id: pm.id,  // <-- FIXED
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  const { error } = await supabase
    .from("user_payment_methods")
    .upsert(payload, {
      onConflict: "user_id",
    });

  if (error) {
    console.error("Error upserting user_payment_methods:", error);
    throw error;
  }

  console.log("✅ Synced card for", internalUserId);
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.updated": {
      const customer = event.data.object as Stripe.Customer;
      await syncDefaultPaymentMethodFromCustomer(customer);
      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }
}