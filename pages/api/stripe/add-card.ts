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

    // 🔗 Figure out a valid origin for the return_url
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      `${(req.headers["x-forwarded-proto"] as string) || "https"}://${req.headers.host}`;

    // ✅ Create a Stripe Billing Portal session for updating payment methods
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      flow_data: { type: "payment_method_update" },
      return_url: `${origin}/app/cards`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    // Log *and* surface some detail so we can see Stripe’s complaint
    console.error("❌ Billing portal error:", err?.raw ?? err);

    const message =
      err?.raw?.message ||
      err?.message ||
      "Unknown error";

    return res.status(500).json({
      error: "Internal Server Error",
      detail: message,
    });
  }
}
