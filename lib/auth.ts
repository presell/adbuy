import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const PLASMIC_SECRET = process.env.PLASMIC_SECRET!;

export async function getAuthenticatedUserIdFromRequest(req: any) {
  //
  // 1️⃣ SUPABASE: Validate Bearer <token> using auth.getUser()
  //
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      // Server-side Supabase client using ANON KEY (correct)
      const supa = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      const { data, error } = await supa.auth.getUser();

      if (error) {
        console.warn("[auth] supabase auth.getUser() error:", error);
      }

      if (data?.user?.id) {
        return data.user.id;
      }
    }
  } catch (e) {
    console.warn("[auth] Supabase token decode failed:", e);
  }

  //
  // 2️⃣ PLASMIC SIGNED COOKIE FALLBACK
  //
  try {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(/plasmic_auth=([^;]+)/);

    if (match) {
      const token = match[1];
      const decoded: any = jwt.verify(token, PLASMIC_SECRET);

      if (decoded?.userId) {
        return decoded.userId;
      }
    }
  } catch (e) {
    console.warn("[auth] Plasmic cookie decode failed:", e);
  }

  return null;
}
