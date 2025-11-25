import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUserIdFromRequest } from "../../../lib/auth";
import { getOrCreateStripeCustomer, stripe } from "../../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 🔐 Authenticate user
  const userId = await getAuthenticatedUserIdFromRequest(req);

  if (!userId) {
    console.warn("❌ No authenticated user found in request");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // 1️⃣ Ensure Stripe customer exists
    const customerId = await getOrCreateStripeCustomer(userId);

    // 2️⃣ Create Billing Portal Session with RETURN URL
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://www.adbuy.ai/app/campaigns/cards",
    });

    return res.status(200).json({
      url: portalSession.url,
    });
  } catch (err) {
    console.error("❌ Stripe Billing Portal error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
