// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    console.log("ℹ️ Customer has no default payment method");
    return;
  }

  // Retrieve PaymentMethod
  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.warn("⚠️ Default PM is not a card:", pm.id);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // FIXED TO MATCH YOUR SCHEMA
  const payload = {
    user_id: internalUserId,
    payment_method: pm.id,   // <–– FIXED HERE
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
    console.error("❌ Supabase upsert failed:", error);
    throw error;
  }

  console.log("✅ Synced card to user_payment_methods for", internalUserId);
}

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await syncDefaultPaymentMethodFromCustomer(customer);
        break;
      }

      case "payment_method.attached": {
        const pm = event.data.object as Stripe.PaymentMethod;
        if (pm.customer) {
          const customer = await stripe.customers.retrieve(pm.customer as string);
          await syncDefaultPaymentMethodFromCustomer(customer as Stripe.Customer);
        }
        break;
      }

      default:
        console.log("ℹ️ Ignoring event type:", event.type);
    }
  } catch (err) {
    console.error("❌ Error in handleStripeWebhook:", err);
    throw err; // triggers Stripe 500
  }
}
