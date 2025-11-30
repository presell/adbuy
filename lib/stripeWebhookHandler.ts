// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client — uses your real server vars
const supabase = createClient(
  process.env.SUPABASE_URL!,         // <-- FIXED
  process.env.SUPABASE_ANON_KEY!     // <-- FIXED (safe: table is unrestricted)
);

async function syncDefaultPaymentMethodFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn("⚠️ No internalUserId in metadata for customer:", customer.id);
    return;
  }

  const defaultPmId = customer.invoice_settings
    ?.default_payment_method as string | null;

  if (!defaultPmId) {
    console.log("ℹ️ Customer has no default payment method:", customer.id);
    return;
  }

  // Fetch the PaymentMethod details
  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.warn("⚠️ Default PM is not a card:", defaultPmId);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // Exact column match for your `user_payment_methods` table
  const payload = {
    user_id: internalUserId,
    payment_method_id: pm.id,
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
    console.error("❌ Error inserting payment method:", error);
    throw error;
  }

  console.log("✅ Synced card for user:", internalUserId);
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.updated": {
      const customer = event.data.object as Stripe.Customer;
      await syncDefaultPaymentMethodFromCustomer(customer);
      break;
    }

    case "payment_method.attached": {
      // Extra safety: fetch customer and sync default PM
      const pm = event.data.object as Stripe.PaymentMethod;
      if (pm.customer) {
        const customer = await stripe.customers.retrieve(pm.customer as string);
        await syncDefaultPaymentMethodFromCustomer(customer as Stripe.Customer);
      }
      break;
    }

    default:
      console.log("ℹ️ Unhandled Stripe event:", event.type);
  }
}