import type { AppProps } from "next/app";
import { useState, useEffect, useRef } from "react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import "../styles/globals.css";
import { supabase } from "../lib/supabaseClient";
import Script from "next/script"; // ✅ Added for external scripts
import localFont from "next/font/local"; // ✅ Added for local font

// ✅ Define Geologica variable font (placed under /pages/fonts/)
const geologica = localFont({
  src: [
    {
      path: "./fonts/geologica-var.ttf", // relative to /pages/_app.tsx
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--plasmic-font-geologica", // will populate the CSS var
  display: "swap",
  preload: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);
  const authenticatedViaCookie = useRef(false);
  const suppressLogoutRef = useRef(false);

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
        // ✅ Standard Supabase session
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
        console.log("[App] No Supabase session — checking Plasmic cookie...");

        const match = document.cookie.match(/plasmic_auth=([^;]+)/);
        if (match) {
          try {
            const token = match[1];
            const decoded = JSON.parse(atob(token.split(".")[1]));

            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              console.warn("[App] ⚠️ Token expired — clearing cookie");
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
            console.log("[App] 🍪 Restored user from cookie:", cookieUser.email);

            // 👇 prevent Supabase logout from firing immediately
            suppressLogoutRef.current = true;
            setTimeout(() => {
              suppressLogoutRef.current = false;
            }, 1000); // slightly longer window (1s)

            return;
          } catch (err) {
            console.warn("[App] ⚠️ Failed to decode cookie:", err);
          }
        }

        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out (no cookie/session)");
      }
    };

    restoreSession();

    // 🔄 Listen for Supabase auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // ✅ Ignore Supabase events if user came from Plasmic cookie
      if (authenticatedViaCookie.current) {
        console.log(`[App] ⚠️ Ignoring Supabase event (${event}) — cookie auth active`);
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        const newUser = {
          id: session.user.id,
          email: session.user.email,
          isLoggedIn: true,
          role: "authenticated",
        };
        setUser(newUser);
        syncPlasmicUser(newUser);
        console.log("[App] 🔄 Supabase signed in:", newUser.email);
      } else if (event === "SIGNED_OUT" && !suppressLogoutRef.current) {
        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out (auth state change)");
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* ✅ 1. Scroll Timeline Polyfill (must load first) */}
      <Script
        src="https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js"
        strategy="beforeInteractive"
      />

      {/* ✅ 2. Global Animation / Tilt / Marquee Logic */}
      <Script src="/js/main.js" strategy="afterInteractive" />

      {/* ✅ 3. Attach the Geologica font variable */}
      <div className={geologica.variable}>
        <PlasmicRootProvider user={user}>
          <Component {...pageProps} />
        </PlasmicRootProvider>
      </div>
    </>
  );
}

export default MyApp;
