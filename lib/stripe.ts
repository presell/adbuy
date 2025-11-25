// lib/stripe.ts
import Stripe from "stripe";
import { supabaseAdmin } from "./supabaseAdmin";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
) {
  // Check if a Stripe customer already exists
  const { data: existing } = await supabaseAdmin
    .from("user_metadata")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  // Create customer in Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: { internalUserId: userId },
  });

  // Save with UPSERT (works on all Supabase clients)
  await supabaseAdmin
    .from("user_metadata")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customer.id,
      },
      {
        onConflict: "user_id",
      }
    );

  return customer.id;
}
