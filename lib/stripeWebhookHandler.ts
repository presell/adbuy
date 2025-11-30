import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// Use service role key for secure server-side writes
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncDefaultPaymentMethodFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn("Customer missing metadata.internalUserId, skipping", customer.id);
    return;
  }

  let defaultPmId = customer.invoice_settings?.default_payment_method;

  // 👇 FIX: ensure it's a string ID
  if (!defaultPmId || typeof defaultPmId !== "string") {
    console.warn("Customer default payment method is not a string ID:", defaultPmId);
    return;
  }

  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.warn("Default payment method is not card — skipping", defaultPmId);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

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
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("Supabase upsert error:", error);
    throw error;
  }

  console.log("✅ Synced Stripe card →", internalUserId);
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.updated":
      await syncDefaultPaymentMethodFromCustomer(
        event.data.object as Stripe.Customer
      );
      break;

    default:
      console.log("Ignoring event:", event.type);
  }
}
