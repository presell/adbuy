import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUserIdFromRequest } from "../../../lib/auth";
import { getOrCreateStripeCustomer, stripe } from "../../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 🔐 Pull user from Supabase session OR Plasmic cookie
  const userId = await getAuthenticatedUserIdFromRequest(req);

  if (!userId) {
    console.warn("❌ No authenticated user found in request");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const customerId = await getOrCreateStripeCustomer(userId);

    // Create Stripe SetupIntent so user can add a new card
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    return res.status(200).json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (err) {
    console.error("❌ SetupIntent error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
