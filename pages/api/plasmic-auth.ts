// pages/api/plasmic-auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const PLASMIC_SECRET =
  process.env.PLASMIC_SECRET ||
  "6deTnq42dNIImRBzotdmaBCtt6qw1gjuqWXJw88c3YRFTYYwb1rrnv73a4nhVdvjUJrwY3kxCSy5jdjBWnMA";

// ✅ Using your provided Personal Access Token (PAT)
const PLASMIC_PAT =
  process.env.PLASMIC_PAT ||
  "AjmM7tUbIvlPVFjKl0cCrIjZ2lGLvYXvyqQQYOBKIfWc6rigi2bfhALzQhMUN5fWZQvOSSxNJddrWowN5mBHw";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, userId, redirectURL = "/" } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ error: "Missing email or userId" });
  }

  try {
    // 🧠 Generate signed token for Plasmic Auth
    const token = jwt.sign(
      {
        email,
        userId,
        roles: ["Normal User"],
      },
      PLASMIC_SECRET,
      { expiresIn: "30d" }
    );

    // 🍪 Set Plasmic auth cookie
    res.setHeader("Set-Cookie", [
      `plasmic_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
    ]);

    // 🧩 Step 1: Check if user already exists in Plasmic directory
    let userExists = false;

    try {
      const checkResp = await fetch("https://studio.plasmic.app/api/v1/teams/self/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PLASMIC_PAT}`,
        },
      });

      if (checkResp.ok) {
        const users = await checkResp.json();
        if (Array.isArray(users)) {
          userExists = users.some((u: any) => u.email?.toLowerCase() === email.toLowerCase());
        }
      } else {
        console.warn("[Plasmic Auth] ⚠️ Could not verify user existence:", await checkResp.text());
      }
    } catch (checkErr) {
      console.warn("[Plasmic Auth] ⚠️ Error checking existing users:", checkErr);
    }

    // 🧩 Step 2: Register user if not already in directory
    if (!userExists) {
      const plasmicResp = await fetch("https://studio.plasmic.app/api/v1/teams/self/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PLASMIC_PAT}`,
        },
        body: JSON.stringify({
          email,
          displayName: email.split("@")[0],
          roles: ["Normal User"],
        }),
      });

      if (plasmicResp.ok) {
        console.log(`[Plasmic Auth] ✅ Added new user to directory: ${email}`);
      } else {
        console.warn("[Plasmic Auth] ⚠️ Failed to register user:", await plasmicResp.text());
      }
    } else {
      console.log(`[Plasmic Auth] ℹ️ User already exists in Plasmic directory: ${email}`);
    }

    // ✅ Respond with success payload
    return res.status(200).json({
      success: true,
      token,
      redirectURL,
      message: userExists
        ? "Plasmic auth token generated (existing user)."
        : "Plasmic auth token generated and new user added to directory.",
    });
  } catch (err: any) {
    console.error("[Plasmic Auth] ❌ Error generating token:", err);
    return res.status(500).json({ error: "Failed to generate Plasmic token" });
  }
}
