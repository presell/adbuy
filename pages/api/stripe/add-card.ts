// pages/api/stripe/add-card.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUserIdFromRequest } from "../../../lib/auth";
import { getOrCreateStripeCustomer, stripe } from "../../../lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Use the working auth function from your codebase
  const userId = await getAuthenticatedUserIdFromRequest(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const customerId = await getOrCreateStripeCustomer(userId);

    // 🔥 Create Billing Portal session (recommended method)
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://www.adbuy.ai/app/campaigns/cards",
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (err) {
    console.error("❌ Stripe BillingPortal error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}