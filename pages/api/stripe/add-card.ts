// pages/api/stripe/add-card.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrCreateStripeCustomer, stripe } from "../../../lib/stripe";
import { getUserFromAuthHeader } from "../../../lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const user = await getUserFromAuthHeader(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure we have a Stripe customer for this Supabase user
    const customerId = await getOrCreateStripeCustomer(user.id);

    // Create a Billing Portal session so the user can manage payment methods
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://www.adbuy.ai/app/campaigns/cards",
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Error in /api/stripe/add-card:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}