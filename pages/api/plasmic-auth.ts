// pages/api/plasmic-auth.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const PLASMIC_SECRET = process.env.PLASMIC_SECRET || "6deTnq42dNIImRBzotdmaBCtt6qw1gjuqWXJw88c3YRFTYYwb1rrnv73a4nhVdvjUJrwY3kxCSy5jdjBWnMA";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ error: "Missing email or userId" });
  }

  // 👇 Generate a signed Plasmic token
  const token = jwt.sign(
    {
      email,
      userId,
      roles: ["Normal User"], // optional role assignment
    },
    PLASMIC_SECRET,
    { expiresIn: "30d" }
  );

  return res.status(200).json({ token });
}
