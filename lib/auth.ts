import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PLASMIC_SECRET = process.env.PLASMIC_SECRET!;

export async function getAuthenticatedUserIdFromRequest(req: any) {
  //
  // 1️⃣ SUPABASE Authorization: Bearer <token>
  //
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      // Create a SUPABASE SERVER CLIENT using the token
      const supaServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });

      const { data, error } = await supaServer.auth.getUser();

      if (data?.user?.id) return data.user.id;
      if (error) console.warn("[auth] Supabase getUser error:", error);
    }
  } catch (e) {
    console.warn("[auth] Supabase auth failed:", e);
  }

  //
  // 2️⃣ PLASMIC SIGNED COOKIE
  //
  try {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(/plasmic_auth=([^;]+)/);
    if (match) {
      const token = match[1];
      const decoded: any = jwt.verify(token, PLASMIC_SECRET);
      if (decoded?.userId) return decoded.userId;
    }
  } catch (e) {
    console.warn("[auth] Plasmic cookie decode failed:", e);
  }

  return null;
}
