import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const PLASMIC_SECRET = "6deTnq42dNIImRBzotdmaBCtt6qw1gjuqWXJw88c3YRFTYYwb1rrnv73a4nhVdvjUJrwY3kxCSy5jdjBWnMA";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const token = jwt.sign({ email }, PLASMIC_SECRET, { expiresIn: "30d" });

  res.status(200).json({ token });
}
