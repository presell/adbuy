import type { AppProps } from "next/app";
import { useState, useEffect, useRef } from "react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import "../styles/globals.css";
import { supabase } from "../lib/supabaseClient";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);
  const authenticatedViaCookie = useRef(false);
  const suppressLogoutRef = useRef(false); // 👈 new debounce guard flag

  // ✅ Sync helper
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
        // ✅ Supabase session found
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
        console.log("[App] No existing Supabase session — checking Plasmic Auth cookie...");

        // ✅ Fallback to Plasmic Auth cookie
        const match = document.cookie.match(/plasmic_auth=([^;]+)/);
        if (match) {
          try {
            const token = match[1];
            const decoded = JSON.parse(atob(token.split(".")[1]));

            // 🕒 Check expiry
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              console.warn("[App] ⚠️ Plasmic Auth token expired — clearing cookie");
              document.cookie = "plasmic_auth=; Max-Age=0; Path=/;";
              return;
            }

            const cookieUser = {
              id: decoded.userId,
              email: decoded.email,
              isLoggedIn: true,
              role: decoded.roles?.[0] || "Normal User",
            };

            authenticatedViaCookie.current = true;
            setUser(cookieUser);
            syncPlasmicUser(cookieUser);
            console.log("[App] 🍪 Restored user from Plasmic Auth cookie:", cookieUser.email);

            // 👇 prevent Supabase SIGNED_OUT from overriding right after mount
            suppressLogoutRef.current = true;
            setTimeout(() => {
              suppressLogoutRef.current = false;
            }, 200);

            return;
          } catch (err) {
            console.warn("[App] ⚠️ Failed to decode Plasmic Auth cookie:", err);
          }
        }

        // No valid cookie or Supabase session
        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out (no session or cookie)");
      }
    };

    restoreSession();

    // 🔄 Listen for Supabase auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // 👇 Ignore Supabase sign-out events if we just authenticated via cookie
      if (_event === "SIGNED_OUT" && (authenticatedViaCookie.current || suppressLogoutRef.current)) {
        console.log("[App] ⚠️ Ignoring Supabase sign-out (cookie session still valid)");
        return;
      }

      if (session?.user) {
        const newUser = {
          id: session.user.id,
          email: session.user.email,
          isLoggedIn: true,
          role: "authenticated",
        };
        authenticatedViaCookie.current = false;
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
