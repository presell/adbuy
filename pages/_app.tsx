import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import "../styles/globals.css";
import { supabase } from "../lib/supabaseClient";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);

  // ✅ Sync user into Plasmic context
  function syncPlasmicUser(u: any) {
    (window as any).__PLASMIC_USER__ = u;
    (window as any).plasmicUser = u;
    window.dispatchEvent(new StorageEvent("storage", { key: "plasmicUser" }));
  }

  useEffect(() => {
    console.log("[App] Initializing Supabase session...");

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
        console.log("[App] ✅ Restored user:", restoredUser);
      }
    });

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
        console.log("[App] 🔄 Synced user:", newUser);
      } else {
        setUser(null);
        syncPlasmicUser(null);
        console.log("[App] 🚪 Logged out");
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
