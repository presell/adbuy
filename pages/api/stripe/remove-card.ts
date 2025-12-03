// pages/api/stripe/remove-card.ts

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

  const userId = await getAuthenticatedUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { payment_method_id } = req.body;

  if (!payment_method_id) {
    return res.status(400).json({ error: "payment_method_id required" });
  }

  try {
    // retrieve customer to ensure this pm belongs to the user's stripe customer
    const customerId = await getOrCreateStripeCustomer(userId);

    // Optional but recommended: validate the payment method belongs to the customer
    const pm = await stripe.paymentMethods.retrieve(payment_method_id);
    if (pm.customer !== customerId) {
      return res.status(403).json({
        error: "Payment method does not belong to this user",
      });
    }

    // 🔥 Detach the payment method
    await stripe.paymentMethods.detach(payment_method_id);

    // Do not delete DB here — let webhooks do it!
    // (payment_method.detached or customer.updated will trigger syncFromCustomer)

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ remove-card error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
