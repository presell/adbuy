/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import GlobalContextsProvider from "../components/plasmic/adbuy/PlasmicGlobalContextsProvider";
import "../styles/globals.css";
import { supabase } from "../lib/supabaseClient";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);

  // ✅ Syncs user context to Plasmic and browser
  function syncPlasmicUser(u: any) {
    (window as any).__PLASMIC_USER__ = u;
    (window as any).plasmicUser = u;
    window.dispatchEvent(new StorageEvent("storage", { key: "plasmicUser" }));
  }

  useEffect(() => {
    console.log("[App] 🧭 Initializing Supabase session...");

    // ✅ Restore existing session on app load
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      if (session?.user) {
        const restoredUser = {
          id: session.user.id,
          email: session.user.email,
          isLoggedIn: true,
          role: "authenticated",
        };
        setUser(restoredUser);
        syncPlasmicUser(restoredUser);
        console.log("[App] ✅ Restored user via getSession:", restoredUser);
      } else {
        console.log("[App] No existing session found.");
      }
    });

    // ✅ Keep Supabase + Plasmic synced on auth state change
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
        console.log("[App] 🔄 Synced Supabase + Plasmic user context:", newUser);
      } else {
        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out and cleared context.");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <PlasmicRootProvider user={user}>
      <GlobalContextsProvider>
        <Component {...pageProps} />
      </GlobalContextsProvider>
    </PlasmicRootProvider>
  );
}

export default MyApp;
