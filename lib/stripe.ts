import Stripe from "stripe";
import { getUserById, updateStripeCustomerId } from "./users";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function getOrCreateStripeCustomer(userId: string) {
  const user = await getUserById(userId);

  // If already set, return it
  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  // Otherwise create one in Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { internalUserId: userId },
  });

  // Save in DB
  await updateStripeCustomerId(userId, customer.id);

  return customer.id;
}
