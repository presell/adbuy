// lib/stripe.ts
import Stripe from "stripe";
import { getUserById, updateStripeCustomerId } from "./users";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

/**
 * Ensure the app user has a Stripe customer and return its ID.
 * - Reads your Supabase user via getUserById(userId)
 * - Reuses existing stripe_customer_id if present
 * - Otherwise creates one in Stripe and stores the ID in Supabase
 */
export async function getOrCreateStripeCustomer(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error(`User not found for id=${userId}`);
  }

  // If already linked, just return the existing Stripe customer id
  if (user.stripe_customer_id) {
    return user.stripe_customer_id as string;
  }

  // Otherwise create a new Stripe Customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    metadata: {
      internalUserId: userId, // critical for mapping webhooks back to Supabase
    },
  });

  // Persist stripe_customer_id in your user_metadata table
  await updateStripeCustomerId(userId, customer.id);

  return customer.id;
}