// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 * Uses your existing server env vars (no new ones needed).
 *
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY  (preferred, if present)
 * - SUPABASE_ANON_KEY          (fallback)
 */
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[stripeWebhook] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sync the customer’s *default* card into your user_payment_methods table.
 * Table schema (matches your screenshot):
 *
 *  - id            uuid (PK, generated)
 *  - user_id       uuid (FK -> auth.users.id)
 *  - payment_method text
 *  - brand         text
 *  - last4         text
 *  - exp_month     int4
 *  - exp_year      int4
 *  - created_at    timestamp (default now())
 */
async function syncDefaultPaymentMethodFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;

  if (!internalUserId) {
    console.log(
      "[stripeWebhook] customer.updated without internalUserId; skipping",
      customer.id
    );
    return;
  }

  const rawDefaultPm =
    customer.invoice_settings?.default_payment_method as
      | string
      | Stripe.PaymentMethod
      | null
      | undefined;

  if (!rawDefaultPm) {
    console.log(
      "[stripeWebhook] customer has no default_payment_method; skipping",
      customer.id
    );
    return;
  }

  const defaultPmId =
    typeof rawDefaultPm === "string" ? rawDefaultPm : rawDefaultPm.id;

  const pm = await stripe.paymentMethods.retrieve(defaultPmId);

  if (pm.type !== "card" || !pm.card) {
    console.log(
      "[stripeWebhook] default payment method is not a card; skipping",
      pm.id,
      pm.type
    );
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  const payload = {
    user_id: internalUserId,
    payment_method: pm.id,
    brand,
    last4: last4 ?? "",
    exp_month,
    exp_year,
  };

  // ---- NO onConflict: we manually upsert to avoid needing a unique constraint ----
  const { data: rows, error: selectError } = await supabase
    .from("user_payment_methods")
    .select("id")
    .eq("user_id", internalUserId)
    .limit(1);

  if (selectError) {
    console.error(
      "[stripeWebhook] error selecting user_payment_methods row:",
      selectError
    );
    return;
  }

  if (rows && rows.length > 0) {
    const rowId = rows[0].id;

    const { error: updateError } = await supabase
      .from("user_payment_methods")
      .update(payload)
      .eq("id", rowId);

    if (updateError) {
      console.error(
        "[stripeWebhook] error updating user_payment_methods row:",
        updateError
      );
      return;
    }

    console.log(
      "[stripeWebhook] ✅ updated user_payment_methods for user",
      internalUserId
    );
  } else {
    const { error: insertError } = await supabase
      .from("user_payment_methods")
      .insert(payload);

    if (insertError) {
      console.error(
        "[stripeWebhook] error inserting user_payment_methods row:",
        insertError
      );
      return;
    }

    console.log(
      "[stripeWebhook] ✅ inserted user_payment_methods for user",
      internalUserId
    );
  }
}

export async function handleStripeWebhook(event: Stripe.Event) {
  console.log(
    "[stripeWebhook] received event",
    event.id,
    "type:",
    event.type
  );

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
          const customerId =
            typeof pm.customer === "string"
              ? pm.customer
              : pm.customer.id;

          const customer = (await stripe.customers.retrieve(
            customerId
          )) as Stripe.Customer;

          await syncDefaultPaymentMethodFromCustomer(customer);
        }
        break;
      }

      default: {
        // We don't need to do anything for other events,
        // but we still return 200 to Stripe.
        console.log("[stripeWebhook] ignoring event type", event.type);
      }
    }
  } catch (err) {
    // DO NOT rethrow — we just log so /api/stripe/webhook can respond 200
    console.error("[stripeWebhook] unhandled error in handler:", err);
  }
}
