// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import type StripeType from "stripe";
import { stripe } from "../../../lib/stripe";
import { handleStripeWebhook } from "../../../lib/stripeWebhookHandler";

export const config = {
  api: {
    bodyParser: false, // Raw body required for Stripe signature verification
  },
};

function bufferFromRequest(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", (err) => reject(err));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event: StripeType.Event;

  try {
    const buf = await bufferFromRequest(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleStripeWebhook(event);
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Error in handleStripeWebhook:", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
}