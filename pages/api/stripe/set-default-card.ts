// pages/api/stripe/set-default-card.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { getAuthenticatedUserIdFromRequest } from "../../../lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getAuthenticatedUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { payment_method_id } = req.body;

  if (!payment_method_id) {
    return res.status(400).json({ error: "Missing payment_method_id" });
  }

  // 1) Get Stripe customer ID from public.user_metadata
  const { data: meta, error: metaError } = await supabase
    .from("user_metadata")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (metaError || !meta?.stripe_customer_id) {
    console.error("[set-default-card] No stripe_customer_id for user", userId);
    return res.status(400).json({ error: "Missing stripe_customer_id" });
  }

  const customerId = meta.stripe_customer_id;

  try {
    // 2) Update Stripe default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: payment_method_id,
      },
    });

    console.log(
      "[set-default-card] Default updated in Stripe →",
      payment_method_id
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[set-default-card] Stripe error:", err);
    return res.status(500).json({ error: "Stripe update failed" });
  }
}
