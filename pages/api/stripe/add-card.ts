import { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUserIdFromRequest } from "../../../lib/auth";
import { getOrCreateStripeCustomer, stripe } from "../../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getAuthenticatedUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const customerId = await getOrCreateStripeCustomer(userId);

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    const url = `https://billing.stripe.com/setup/${setupIntent.client_secret}`;

    return res.status(200).json({ url });
  } catch (e) {
    console.error("SetupIntent error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
