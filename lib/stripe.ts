// lib/stripe.ts
import Stripe from "stripe";
import { supabaseAdmin } from "./supabaseAdmin";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Unified Stripe customer helper
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
) {
  // Check metadata table
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

  // Save to Supabase (correct v2 syntax)
  await supabaseAdmin.from("user_metadata").insert(
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
