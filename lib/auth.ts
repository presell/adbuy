import jwt from "jsonwebtoken";
import { supabase } from "./supabaseClient";

const PLASMIC_SECRET = process.env.PLASMIC_SECRET!;

// 🚀 Try to resolve the authenticated user from ANY source
export async function getAuthenticatedUserIdFromRequest(req: any) {
  //
  // 1. Try SUPABASE Auth (Authorization: Bearer <token>)
  //
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      if (data?.user?.id) return data.user.id;
    }
  } catch (e) {
    console.warn("[auth] Supabase token decode failed:", e);
  }

  //
  // 2. Try PLASMIC AUTH COOKIE (plasmic_auth=...)
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

  //
  // 3. No user
  //
  return null;
}
