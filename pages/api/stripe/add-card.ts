// pages/api/stripe/add-card.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe, getOrCreateStripeCustomer } from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    // Get the Supabase user
    const { data: userData, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !userData?.user) {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    const supaUser = userData.user;

    // Unified Stripe customer creation
    const customerId = await getOrCreateStripeCustomer(
      supaUser.id,
      supaUser.email ?? ""
    );

    // Create Billing Portal Session
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://www.adbuy.ai/app/campaigns/cards",
    });

    res.status(200).json({ url: portal.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}
