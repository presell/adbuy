// pages/api/stripe/add-card.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe, getOrCreateStripeCustomer } from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    // Get the user from Supabase
    const { data: userData, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !userData?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const supaUser = userData.user;

    // Create or get Stripe Customer
    const customerId = await getOrCreateStripeCustomer(
      supaUser.id,
      supaUser.email ?? ""
    );

    // Create Billing Portal session
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://www.adbuy.ai/app/campaigns/cards",
    });

    return res.status(200).json({ url: portal.url });
  } catch (err: any) {
    console.error("Stripe add-card error:", err);
    return res.status(500).json({ error: err.message });
  }
}
