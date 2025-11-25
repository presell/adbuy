import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PLASMIC_SECRET = process.env.PLASMIC_SECRET!;

export async function getAuthenticatedUserIdFromRequest(req: any) {
  // 1️⃣ Accept Plasmic Bearer token
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      // Try Plasmic decode
      try {
        const decoded: any = jwt.verify(token, PLASMIC_SECRET);
        if (decoded?.userId) return decoded.userId;
      } catch {}
    }
  } catch {}

  // 2️⃣ Fallback to Plasmic cookie
  try {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(/plasmic_auth=([^;]+)/);
    if (match) {
      const decoded: any = jwt.verify(match[1], PLASMIC_SECRET);
      if (decoded?.userId) return decoded.userId;
    }
  } catch {}

  return null;
}
