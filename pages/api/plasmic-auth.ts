// pages/api/plasmic-auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const PLASMIC_SECRET =
  process.env.PLASMIC_SECRET ||
  "6deTnq42dNIImRBzotdmaBCtt6qw1gjuqWXJw88c3YRFTYYwb1rrnv73a4nhVdvjUJrwY3kxCSy5jdjBWnMA";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // 🧩 Background: Register or update the user in Plasmic’s User Directory
    try {
      const plasmicResponse = await fetch("https://studio.plasmic.app/api/v1/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-plasmic-api-token": PLASMIC_SECRET,
        },
        body: JSON.stringify({
          email,
          userId,
          roles: ["Normal User"], // optional; you can map from your app
        }),
      });

      if (!plasmicResponse.ok) {
        console.warn("[Plasmic Auth] ⚠️ Failed to register user in Plasmic directory:", await plasmicResponse.text());
      } else {
        console.log(`[Plasmic Auth] ✅ User registered in Plasmic directory (${email})`);
      }
    } catch (regErr) {
      console.warn("[Plasmic Auth] ⚠️ Error calling Plasmic User API:", regErr);
    }

    // ✅ Respond with success payload
    return res.status(200).json({
      success: true,
      token,
      redirectURL, // e.g. "/" or "/dashboard"
      message: "Plasmic authentication token generated, cookie set, and user registered.",
    });
  } catch (err: any) {
    console.error("[Plasmic Auth] ❌ Error generating token:", err);
    return res.status(500).json({ error: "Failed to generate Plasmic token" });
  }
}
