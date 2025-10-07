// pages/api/plasmic-auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const PLASMIC_SECRET =
  process.env.PLASMIC_SECRET ||
  "6deTnq42dNIImRBzotdmaBCtt6qw1gjuqWXJw88c3YRFTYYwb1rrnv73a4nhVdvjUJrwY3kxCSy5jdjBWnMA";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, userId, redirectURL = "/" } = req.body;

  // 🚨 Validate input
  if (!email || !userId) {
    return res.status(400).json({ error: "Missing email or userId" });
  }

  try {
    // 🧠 Create signed token for Plasmic Auth
    const token = jwt.sign(
      {
        email,
        userId,
        roles: ["Normal User"], // optional; change to ["Admin"] if needed
      },
      PLASMIC_SECRET,
      { expiresIn: "30d" }
    );

    // 🍪 Set secure cookie so user is automatically authenticated in Plasmic
    res.setHeader("Set-Cookie", [
      `plasmic_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
    ]);

    // ✅ Respond with success payload
    return res.status(200).json({
      success: true,
      token,
      redirectURL, // e.g. "/" or "/dashboard"
      message: "Plasmic authentication token generated and cookie set",
    });
  } catch (err: any) {
    console.error("[Plasmic Auth] Error generating token:", err);
    return res.status(500).json({ error: "Failed to generate Plasmic token" });
  }
}
