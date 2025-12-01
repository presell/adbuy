// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// ---- Supabase client (server-side) ----
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ SUPABASE_URL or SUPABASE_ANON_KEY is missing in environment variables."
  );
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// ---- Helpers ----

// Stripe types allow default_payment_method to be a string or an object.
// Normalize that to a string id.
function getDefaultPaymentMethodId(customer: Stripe.Customer): string | null {
  const pm = customer.invoice_settings?.default_payment_method;
  if (!pm) return null;
  if (typeof pm === "string") return pm;
  return pm.id;
}

async function syncDefaultPaymentMethodFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;

  if (!internalUserId) {
    console.warn(
      "⚠️ No metadata.internalUserId for customer; skipping sync. customer.id =",
      customer.id
    );
    return;
  }

  const defaultPmId = getDefaultPaymentMethodId(customer);
  if (!defaultPmId) {
    console.log(
      "ℹ️ Customer has no default_payment_method; nothing to sync. customer.id =",
      customer.id
    );
    return;
  }

  console.log(
    "🔎 Syncing default card for internalUserId",
    internalUserId,
    "pm id =",
    defaultPmId
  );

  // Always retrieve to ensure we have full card details
  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.warn(
      "⚠️ Default payment method is not a card; skipping. pm.id =",
      pm.id,
      "type =",
      pm.type
    );
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // IMPORTANT: column names match your Supabase table:
  // id (uuid, PK, default gen_random_uuid())
  // user_id (uuid, FK to auth.users)
  // payment_method (text)
  // brand (text)
  // last4 (text)
  // exp_month (int4)
  // exp_year (int4)
  // created_at (timestamp, default now())
  const payload = {
    user_id: internalUserId,
    payment_method: pm.id, // <-- matches `payment_method` column
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  const { error } = await supabase
    .from("user_payment_methods")
    .upsert(payload, {
      onConflict: "user_id", // one row per user; last default card wins
    });

  if (error) {
    console.error("❌ Supabase upsert failed:", error);
    throw error;
  }

  console.log("✅ Synced card to user_payment_methods for", internalUserId);
}

// ---- Main webhook dispatcher ----

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        await syncDefaultPaymentMethodFromCustomer(customer);
        break;
      }

      case "payment_method.attached": {
        // Extra safety: when a card is attached, also sync using the customer
        const pm = event.data.object as Stripe.PaymentMethod;

        if (pm.customer) {
          const customer = (await stripe.customers.retrieve(
            pm.customer as string
          )) as Stripe.Customer;
          await syncDefaultPaymentMethodFromCustomer(customer);
        } else {
          console.log(
            "ℹ️ payment_method.attached without customer; skipping. pm.id =",
            pm.id
          );
        }
        break;
      }

      default: {
        console.log("ℹ️ Ignoring Stripe event type:", event.type);
        break;
      }
    }
  } catch (err) {
    console.error("❌ Error in handleStripeWebhook:", err);
    // Re-throw so the API route returns 500 and Stripe can retry
    throw err;
  }
}