// pages/api/stripe/remove-card.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../lib/stripe";
import { getAuthenticatedUserIdFromRequest } from "../../../lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Simple CORS headers (fine to keep)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ----- Auth (Supabase bearer token) -----
  const userId = await getAuthenticatedUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { payment_method_id } = req.body as { payment_method_id?: string };

  if (!payment_method_id || typeof payment_method_id !== "string") {
    return res.status(400).json({ error: "Missing payment_method_id" });
  }

  try {
    // 1) Look up the row in user_payment_methods
    const { data: row, error: selectError } = await supabase
      .from("user_payment_methods")
      .select("*")
      .eq("payment_method_id", payment_method_id)
      .single();

    if (selectError) {
      console.error("[remove-card] select error:", selectError);
      // PGRST116 = no rows found
      if ((selectError as any).code === "PGRST116") {
        return res
          .status(403)
          .json({ error: "Payment method does not belong to this user" });
      }
      return res.status(500).json({ error: "Database error" });
    }

    if (!row || row.user_id !== userId) {
      console.warn(
        "[remove-card] Card row does not belong to user",
        "row.user_id=",
        row?.user_id,
        "userId=",
        userId
      );
      return res
        .status(403)
        .json({ error: "Payment method does not belong to this user" });
    }

    // 2) Detach from Stripe (HARD requirement)
    try {
      await stripe.paymentMethods.detach(payment_method_id);
    } catch (err: any) {
      console.error("[remove-card] Stripe detach failed:", err?.message || err);
      return res.status(400).json({
        error: "Failed to detach payment method from Stripe",
        detail: err?.message,
      });
    }

    // 3) Delete from our table only AFTER a successful detach
    const { error: deleteError } = await supabase
      .from("user_payment_methods")
      .delete()
      .eq("id", row.id);

    if (deleteError) {
      console.error("[remove-card] delete error:", deleteError);
      return res.status(500).json({ error: "Failed to delete local record" });
    }

    console.log(
      "[remove-card] Successfully detached and deleted card",
      payment_method_id,
      "for user",
      userId
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[remove-card] unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
