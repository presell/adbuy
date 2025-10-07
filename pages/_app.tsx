import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import "../styles/globals.css";
import { supabase } from "../lib/supabaseClient";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);

  // ✅ Sync helper (unchanged)
  const syncPlasmicUser = (u: any) => {
    if (typeof window === "undefined") return;
    (window as any).__PLASMIC_USER__ = u;
    (window as any).plasmicUser = u;
    window.dispatchEvent(new StorageEvent("storage", { key: "plasmicUser" }));
  };

  useEffect(() => {
    console.log("[App] Initializing Supabase session...");

    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        // ✅ Standard Supabase session restore
        const restoredUser = {
          id: session.user.id,
          email: session.user.email,
          isLoggedIn: true,
          role: "authenticated",
        };
        setUser(restoredUser);
        syncPlasmicUser(restoredUser);
        console.log("[App] ✅ Restored Supabase session for:", restoredUser.email);
      } else {
        console.log("[App] No existing Supabase session found — checking Plasmic Auth cookie...");

        // ✅ NEW: Fallback to Plasmic Auth cookie
        const match = document.cookie.match(/plasmic_auth=([^;]+)/);
        if (match) {
          try {
            const token = match[1];
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const cookieUser = {
              id: decoded.userId,
              email: decoded.email,
              isLoggedIn: true,
              role: decoded.roles?.[0] || "Normal User",
            };
            setUser(cookieUser);
            syncPlasmicUser(cookieUser);
            console.log("[App] 🍪 Restored user from Plasmic Auth cookie:", cookieUser.email);
            return;
          } catch (err) {
            console.warn("[App] ⚠️ Failed to decode Plasmic Auth cookie:", err);
          }
        }

        // No valid cookie or session
        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out");
      }
    };

    // Run immediately on load
    restoreSession();

    // 🔄 Keep Supabase and Plasmic in sync for OTP/magic-link logins
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const newUser = {
          id: session.user.id,
          email: session.user.email,
          isLoggedIn: true,
          role: "authenticated",
        };
        setUser(newUser);
        syncPlasmicUser(newUser);
        console.log("[App] 🔄 Updated user:", newUser.email);
      } else {
        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out (auth state change)");
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <PlasmicRootProvider user={user}>
      <Component {...pageProps} />
    </PlasmicRootProvider>
  );
}

export default MyApp;
