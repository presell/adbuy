import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = {
  api: {
    bodyParser: false, // Allow raw body for Stripe signatures
  },
};

function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await readRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      webhookSecret!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ⭐ Handle payment_method.attached — store payment method in Supabase
  if (event.type === "payment_method.attached") {
    const pm = event.data.object as any;

    if (pm.customer && pm.card) {
      const { brand, last4, exp_month, exp_year } = pm.card;

      // Lookup user from metadata
      const customer = await stripe.customers.retrieve(pm.customer);

      // @ts-ignore
      const internalUserId = customer.metadata?.internalUserId;

      if (internalUserId) {
        await supabaseAdmin.from("user_payment_methods").insert([
          {
            id: pm.id,
            user_id: internalUserId,
            brand,
            last4,
            exp_month: exp_month.toString(),
            exp_year: exp_year.toString(),
          },
        ]);
      }
    }
  }

  res.status(200).send("OK");
}
