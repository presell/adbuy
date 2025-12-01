// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// Use your existing server-side env vars (no NEXT_PUBLIC_ duplicates needed)
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars missing (SUPABASE_URL / SUPABASE_ANON_KEY)");
}

// RLS is disabled on user_payment_methods, so anon key is fine here.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function upsertUserPaymentMethod(
  internalUserId: string,
  pm: Stripe.PaymentMethod
) {
  if (pm.type !== "card" || !pm.card) {
    console.warn("⚠️ PaymentMethod is not a card, skipping:", pm.id);
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  // Keep ONE row per user: delete old, then insert new
  const { error: deleteError } = await supabase
    .from("user_payment_methods")
    .delete()
    .eq("user_id", internalUserId);

  if (deleteError) {
    console.error("❌ Supabase delete failed:", deleteError);
    throw deleteError;
  }

  const payload = {
    user_id: internalUserId,
    payment_method: pm.id, // matches your `payment_method` column
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  const { error: insertError } = await supabase
    .from("user_payment_methods")
    .insert(payload as any); // cast to avoid TS type noise

  if (insertError) {
    console.error("❌ Supabase insert failed:", insertError);
    throw insertError;
  }

  console.log("✅ Synced card to user_payment_methods for", internalUserId);
}

// Helper: given a PaymentMethod, find internalUserId via the customer
async function syncFromPaymentMethod(pm: Stripe.PaymentMethod) {
  if (!pm.customer) {
    console.warn("⚠️ PaymentMethod has no customer, skipping:", pm.id);
    return;
  }

  const customer = (await stripe.customers.retrieve(
    pm.customer as string
  )) as Stripe.Customer;

  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn(
      "⚠️ Customer missing metadata.internalUserId; skipping sync",
      customer.id
    );
    return;
  }

  await upsertUserPaymentMethod(internalUserId, pm);
}

// Helper: handle a customer when default card changes or is removed
async function syncFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn(
      "⚠️ customer.updated without internalUserId; skipping",
      customer.id
    );
    return;
  }

  const rawDefaultPm = customer.invoice_settings?.default_payment_method;

  // If no default card, clear their row
  if (!rawDefaultPm) {
    const { error: deleteError } = await supabase
      .from("user_payment_methods")
      .delete()
      .eq("user_id", internalUserId);

    if (deleteError) {
      console.error("❌ Supabase delete (no default card) failed:", deleteError);
      throw deleteError;
    }

    console.log(
      "ℹ️ Customer has no default card; cleared user_payment_methods for",
      internalUserId
    );
    return;
  }

  // rawDefaultPm can be a string ID or a PaymentMethod object
  const defaultPmId =
    typeof rawDefaultPm === "string" ? rawDefaultPm : rawDefaultPm.id;

  const pm = (await stripe.paymentMethods.retrieve(
    defaultPmId
  )) as Stripe.PaymentMethod;

  await upsertUserPaymentMethod(internalUserId, pm);
}

export async function handleStripeWebhook(event: Stripe.Event) {
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
        console.log("ℹ️ Ignoring Stripe event type:", event.type);
    }
  } catch (err) {
    console.error("❌ Error in handleStripeWebhook:", err);
    throw err; // causes 500 back to Stripe so we see problems
  }
}
