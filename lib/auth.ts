import jwt from "jsonwebtoken";

const PLASMIC_SECRET = process.env.PLASMIC_SECRET!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * getAuthenticatedUserIdFromRequest()
 *
 * Attempts auth in this order:
 * 1. Supabase Bearer token (server-side verification using service role key)
 * 2. Plasmic cookie auth (fallback)
 */
export async function getAuthenticatedUserIdFromRequest(req: any) {
  //
  // 1️⃣ SUPABASE AUTH — SERVER VALIDATION
  //
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");

      const url = `${SUPABASE_URL}/auth/v1/user`;

      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: SERVICE_ROLE_KEY,
        },
      });

      if (resp.ok) {
        const user = await resp.json();
        if (user?.id) return user.id;
      }
    }
  } catch (e) {
    console.warn("[auth] Supabase server-side validation failed:", e);
  }

  //
  // 2️⃣ PLASMIC AUTH COOKIE (fallback)
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
  // 3️⃣ No user → Unauthorized
  //
  return null;
}
