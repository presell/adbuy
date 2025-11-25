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

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      flow_data: { type: "payment_method_update" },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/cards`, 
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("Billing portal error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
