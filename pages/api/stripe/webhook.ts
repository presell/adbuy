// pages/api/stripe/webhook.ts
import { stripe } from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(req: any) {
  return new Promise((resolve) => {
    let data: Uint8Array[] = [];
    req.on("data", (chunk: Uint8Array) => data.push(chunk));
    req.on("end", () => resolve(Buffer.concat(data)));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const buf = (await buffer(req)) as Buffer;
  const sig = req.headers["stripe-signature"]!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_method.attached") {
    const pm = event.data.object;

    const userId = pm.metadata?.internalUserId;
    if (!userId) return res.status(200).send("No internal user id");

    await supabaseAdmin.from("user_payment_methods").upsert({
      id: pm.id,
      user_id: userId,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      exp_month: pm.card?.exp_month,
      exp_year: pm.card?.exp_year,
      is_default: false,
    });
  }

  res.status(200).send("ok");
}
