// lib/stripeWebhookHandler.ts
import type Stripe from "stripe";
import { stripe } from "./stripe";
import { createClient } from "@supabase/supabase-js";

// ----- Supabase (server-side, service role) -----

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase env vars missing. Expected SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
  );
}

// Use service role – safe here because this file is *only* used server-side
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

type UserPaymentRow = {
  user_id: string;
  payment_method: string;
  brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
};

// ----- Helpers -----

async function deleteUserPaymentMethods(userId: string) {
  const { error } = await supabase
    .from("user_payment_methods")
    .delete()
    .eq("user_id", userId);

  if (error) {
    // We *log* but do NOT throw – deleting is nice-to-have, not critical
    console.error(
      "[stripeWebhook] deleteUserPaymentMethods error:",
      JSON.stringify(error)
    );
  } else {
    console.log(
      "[stripeWebhook] deleteUserPaymentMethods success for user:",
      userId
    );
  }
}

async function insertUserPaymentMethod(
  userId: string,
  pm: Stripe.PaymentMethod
) {
  if (pm.type !== "card" || !pm.card) {
    console.warn(
      "[stripeWebhook] payment method is not a card – skipping:",
      pm.id,
      pm.type
    );
    return;
  }

  const { brand, last4, exp_month, exp_year } = pm.card;

  const payload: UserPaymentRow = {
    user_id: userId,
    payment_method: pm.id,
    brand: brand ?? null,
    last4: last4 ?? null,
    exp_month: exp_month ?? null,
    exp_year: exp_year ?? null,
  };

  const { error } = await supabase
    .from("user_payment_methods")
    .insert(payload as any);

  if (error) {
    console.error(
      "[stripeWebhook] insertUserPaymentMethod error:",
      JSON.stringify(error)
    );
    // This *is* critical – if this fails, we want Stripe to retry
    throw error;
  }

  console.log(
    "[stripeWebhook] insertUserPaymentMethod success for user:",
    userId,
    "pm:",
    pm.id
  );
}

// Given a PaymentMethod, look up the Stripe customer → internalUserId → insert row
async function syncFromPaymentMethod(pm: Stripe.PaymentMethod) {
  if (!pm.customer) {
    console.warn(
      "[stripeWebhook] PaymentMethod has no customer – skipping:",
      pm.id
    );
    return;
  }

  const customer = (await stripe.customers.retrieve(
    pm.customer as string
  )) as Stripe.Customer;

  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn(
      "[stripeWebhook] Customer missing metadata.internalUserId – skipping:",
      customer.id
    );
    return;
  }

  await insertUserPaymentMethod(internalUserId, pm);
}

// Handle customer.default_payment_method changes (or removal)
async function syncFromCustomer(customer: Stripe.Customer) {
  const internalUserId = customer.metadata?.internalUserId;
  if (!internalUserId) {
    console.warn(
      "[stripeWebhook] customer.updated without internalUserId – skipping:",
      customer.id
    );
    return;
  }

  const rawDefaultPm = customer.invoice_settings?.default_payment_method;

  // If no default card, we *try* to clear their rows but don't fail the webhook
  if (!rawDefaultPm) {
    console.log(
      "[stripeWebhook] customer has no default payment method – attempting cleanup for user:",
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

  await insertUserPaymentMethod(internalUserId, pm);
}

// ----- Main entrypoint -----

export async function handleStripeWebhook(event: Stripe.Event) {
  console.log("[stripeWebhook] Handling event:", event.type, event.id);

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
        event.type,
        event.id
      );
  }
}
