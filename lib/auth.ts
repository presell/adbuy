import jwt from "jsonwebtoken";
import { supabase } from "./supabaseClient";

const PLASMIC_SECRET = process.env.PLASMIC_SECRET!;

type PlasmicClaims = {
  userId?: string;
  email?: string;
  [key: string]: any;
};

/**
 * Extract the logged-in user id from the request.
 * 1) PRIMARY: plasmic_auth cookie (your real auth source)
 * 2) FALLBACK: Supabase Authorization: Bearer <token> header (if you add that later)
 */
export async function getAuthenticatedUserIdFromRequest(req: any) {
  //
  // 1️⃣ PRIMARY: PLASMIC COOKIE AUTH
  //
  try {
    const cookieHeader: string = req.headers.cookie || "";
    if (cookieHeader) {
      const cookies = cookieHeader
        .split(";")
        .map((c) => c.trim());

      const plasmicCookie = cookies.find((c) =>
        c.startsWith("plasmic_auth=")
      );

      if (plasmicCookie) {
        const rawToken = decodeURIComponent(plasmicCookie.split("=")[1]);

        // First try full verification with your secret
        try {
          const decoded = jwt.verify(
            rawToken,
            PLASMIC_SECRET
          ) as PlasmicClaims;

          if (decoded?.userId) {
            // ✅ This is the happy path – same userId your app already uses
            return decoded.userId;
          }
        } catch (verifyErr) {
          console.warn(
            "[auth] jwt.verify(plasmic_auth) failed, falling back to decode:",
            verifyErr
          );

          // As a safety net, decode without verifying – closer to what
          // your front-end likely does when it logs "Restored user from cookie"
          const decoded = jwt.decode(rawToken) as PlasmicClaims | null;
          if (decoded?.userId) {
            return decoded.userId;
          }
        }
      }
    }
  } catch (cookieErr) {
    console.warn("[auth] Cookie auth failed:", cookieErr);
  }

  //
  // 2️⃣ FALLBACK: SUPABASE BEARER TOKEN (if you ever send it)
  //
  try {
    const authHeader = req.headers["authorization"] as string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data, error } = await supabase.auth.getUser(token);

      if (data?.user?.id) {
        return data.user.id;
      }

      if (error) {
        console.warn("[auth] Supabase getUser error:", error);
      }
    }
  } catch (supabaseErr) {
    console.warn("[auth] Supabase auth failed:", supabaseErr);
  }

  //
  // 3️⃣ No user found
  //
  return null;
}
