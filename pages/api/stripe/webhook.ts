// /pages/api/stripe/webhook.ts
import { stripe } from "../../../lib/stripe";
import { buffer } from "micro";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature failure:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_method.attached": {
      const pm = event.data.object;
      const customer = await stripe.customers.retrieve(pm.customer);

      const userId = customer.metadata?.internalUserId;
      if (!userId) break;

      await supabaseAdmin
        .from("user_payment_methods")
        .upsert({
          id: pm.id,
          user_id: userId,
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
        });

      break;
    }

    case "customer.updated": {
      // Update default payment method if needed
      break;
    }
  }

  res.json({ received: true });
}
