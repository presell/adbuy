import type { AppProps } from "next/app";
import { useState, useEffect, useRef } from "react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import "../styles/globals.css";
import { supabase } from "../lib/supabaseClient";
import Script from "next/script";
import localFont from "next/font/local";

// Declare global functions injected by main.js to avoid TypeScript errors
declare global {
  interface Window {
    reinitializeHomepageScripts?: () => void;
    initTilt?: () => void;
    initMarquees?: () => void;
  }
}

// ✅ Corrected Geologica variable font setup
// Keeping the font in /pages/fonts/ is fine — just resolve the path properly.
const geologica = localFont({
  src: [
    {
      path: "./fonts/geologica-var.ttf", // correct since file is in /pages/fonts
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--plasmic-font-geologica",
  display: "swap",
});

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any>(null);
  const authenticatedViaCookie = useRef(false);
  const suppressLogoutRef = useRef(false);

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

            suppressLogoutRef.current = true;
            setTimeout(() => {
              suppressLogoutRef.current = false;
            }, 1000);

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

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
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

  // ✅ Inject highlight-gradient CSS for Plasmic-rendered elements (same as old HTML embed)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existing = document.getElementById("global-highlight-style");
      if (!existing) {
        const styleEl = document.createElement("style");
        styleEl.id = "global-highlight-style";
        styleEl.innerHTML = `
          .highlight-gradient {
            background: linear-gradient(to right, #0D6EFD, #32B7FE);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent !important;
            font-weight: inherit;
          }
        `;
        document.body.appendChild(styleEl);
        console.log("[App] ✅ highlight-gradient style injected inside body scope");
      }
    }
  }, []);

// ✅ Global Script Reinitializer (debounced + safe from recursion)
useEffect(() => {
  let timeout: NodeJS.Timeout | null = null;
  let observer: MutationObserver | null = null;
  let isRunning = false;

  const runAllScripts = () => {
    if (isRunning) return; // prevent overlapping runs
    isRunning = true;

    // Pause observer while scripts modify DOM
    observer?.disconnect();

    console.log("[App] 🔁 Reinitializing global front-end scripts...");

    setTimeout(() => {
      try {
        if (window.reinitializeHomepageScripts) {
          console.log("[App] ▶️ Running reinitializeHomepageScripts()");
          window.reinitializeHomepageScripts();
        }
        if (window.initTilt) {
          console.log("[App] ▶️ Running initTilt()");
          window.initTilt();
        }
        if (window.initMarquees) {
          console.log("[App] ▶️ Running initMarquees()");
          window.initMarquees();
        }

        // 🔧 Add future global initializers here
      } finally {
        // Re-enable observer after scripts settle
        setTimeout(() => {
          const root = document.getElementById("__next") || document.body;
          observer?.observe(root, { childList: true, subtree: true });
          isRunning = false;
        }, 300); // short cooldown before re-observing
      }
    }, 50);
  };

  // Create observer
  observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(runAllScripts, 200);
  });

  const root = document.getElementById("__next") || document.body;
  observer.observe(root, { childList: true, subtree: true });

  console.log("[App] 👀 Global MutationObserver initialized (safe mode)");

  return () => observer?.disconnect();
}, []);

  return (
    <>

// ✅ Redirect unauthenticated users away from /app/* pages
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      // Only protect routes under /app/*
      if (router.pathname.startsWith("/app")) {
        console.log("[AuthGuard] Checking user authentication...");

        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        const plasmicUser = (window as any).__PLASMIC_USER__;

        const isLoggedIn =
          !!session?.user || !!plasmicUser?.isLoggedIn || !!plasmicUser?.email;

        if (!isLoggedIn) {
          console.warn("[AuthGuard] 🚫 Unauthorized — redirecting to /login");
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [router.pathname]);

  return (
    <div className={geologica.variable}>
      <PlasmicRootProvider user={user}>
        <Component {...pageProps} />
      </PlasmicRootProvider>
    </div>
  );
}

    {/* ✅ 1. Google Analytics */}
    <Script
      strategy="afterInteractive"
      src="https://www.googletagmanager.com/gtag/js?id=G-SW67MBB5HR"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-SW67MBB5HR');
      `}
    </Script>

    {/* ✅ 2. Meta Pixel */}
    <Script id="facebook-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1258231451566673');
        fbq('track', 'PageView');
      `}
    </Script>
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src="https://www.facebook.com/tr?id=1258231451566673&ev=PageView&noscript=1"
      />
    </noscript>

    {/* ✅ 3. ReB2B Script */}
    <Script id="reb2b" strategy="afterInteractive">
      {`
        !function () {
          var reb2b = window.reb2b = window.reb2b || [];
          if (reb2b.invoked) return;
          reb2b.invoked = true;
          reb2b.methods = ["identify", "collect"];
          reb2b.factory = function (method) {
            return function () {
              var args = Array.prototype.slice.call(arguments);
              args.unshift(method);
              reb2b.push(args);
              return reb2b;
            };
          };
          for (var i = 0; i < reb2b.methods.length; i++) {
            var key = reb2b.methods[i];
            reb2b[key] = reb2b.factory(key);
          }
          reb2b.load = function (key) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://s3-us-west-2.amazonaws.com/b2bjsstore/b/" + key + "/5NRP9HQX9GO1.js.gz";
            var first = document.getElementsByTagName("script")[0];
            first.parentNode.insertBefore(script, first);
          };
          reb2b.SNIPPET_VERSION = "1.0.1";
          reb2b.load("5NRP9HQX9GO1");
        }();
      `}
    </Script>

      
      {/* ✅ 1. Scroll Timeline Polyfill (load afterInteractive) */}
<Script
  src="https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js"
  strategy="afterInteractive"
/>


      {/* ✅ 2. Global Animation / Tilt / Marquee Logic */}
<Script
  src="/js/main.js"
  strategy="afterInteractive"
  onLoad={() => {
    if (window.reinitializeHomepageScripts) {
      console.log("[App] 🧠 Running reinitializeHomepageScripts()");
      window.reinitializeHomepageScripts();
    }
  }}
/>

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
