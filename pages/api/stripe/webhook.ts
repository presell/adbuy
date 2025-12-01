// pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import type StripeType from "stripe";
import { stripe } from "../../../lib/stripe";
import { handleStripeWebhook } from "../../../lib/stripeWebhookHandler";

export const config = {
  api: {
    // Raw body required for Stripe signature verification
    bodyParser: false,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Never return 405 to Stripe – just ignore non-POST methods gracefully
  if (req.method !== "POST") {
    console.log(
      "[stripe/webhook] Non-POST request received, ignoring. method =",
      req.method
    );
    return res.status(200).end("OK");
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    console.error("[stripe/webhook] Missing stripe-signature header");
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
    console.error(
      "❌ Stripe webhook signature verification failed:",
      err?.message ?? err
    );
    return res
      .status(400)
      .send(`Webhook Error: ${err?.message ?? "Signature verification failed"}`);
  }

  try {
    console.log("[stripe/webhook] Handling event:", event.type, event.id);
    await handleStripeWebhook(event);
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Error in handleStripeWebhook:", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }
}