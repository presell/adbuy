// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// Use your existing server env vars from Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Crash loudly so you see it in logs if env vars are missing
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncDefaultPaymentMethodFromCustomer(
  customer: Stripe.Customer
) {
  const internalUserId = customer.metadata?.internalUserId;

  if (!internalUserId) {
    console.warn(
      "⚠️ No internalUserId in metadata for customer:",
      customer.id
    );
    return;
  }

  const defaultPm = customer.invoice_settings?.default_payment_method;

  if (!defaultPm) {
    console.log("ℹ️ Customer has no default payment method:", customer.id);
    return;
  }

  // Normalize string | PaymentMethod into an ID string
  const defaultPmId =
    typeof defaultPm === "string" ? defaultPm : defaultPm.id;

  // Retrieve PaymentMethod
  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.warn("⚠️ Default PM is not a card:", pm.id);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // Matches your user_payment_methods schema:
  // id (uuid, PK, default gen_random_uuid())
  // user_id (uuid → auth.users.id)
  // payment_method (text)
  // brand (text)
  // last4 (text)
  // exp_month (int4)
  // exp_year (int4)
  // created_at (timestamp, default now())
  const payload = {
    user_id: internalUserId,
    payment_method: pm.id,
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  const { error } = await supabase
    .from("user_payment_methods")
    .upsert(payload, {
      onConflict: "user_id", // one row per user; adjust if you later support multiple cards
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
          // pm.customer is an expandable field; normalize to string ID
          const customerId =
            typeof pm.customer === "string" ? pm.customer : pm.customer.id;

          const customer = await stripe.customers.retrieve(customerId);
          await syncDefaultPaymentMethodFromCustomer(
            customer as Stripe.Customer
          );
        }
        break;
      }

      default: {
        // We still respond 200 for other events so Stripe stays happy
        console.log("ℹ️ Ignoring event type:", event.type);
        break;
      }
    }
  } catch (err) {
    console.error("❌ Error in handleStripeWebhook:", err);
    throw err; // This is what causes the 500 Stripe shows
  }
}
