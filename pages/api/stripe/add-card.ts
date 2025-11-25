// pages/api/stripe/add-card.ts
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

    // ✅ Create a Stripe Billing Portal session JUST for updating payment methods
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      flow_data: { type: "payment_method_update" },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/cards`,
    });

    // Return hosted portal URL
    return res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error("❌ Billing portal error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
