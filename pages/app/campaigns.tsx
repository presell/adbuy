import * as React from "react";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";

// ✅ Declare the extra globals so TypeScript stops complaining
declare global {
  interface Window {
    __supabaseReady__?: boolean;
    supabase?: typeof supabase;
    $state?: any;
    $plasmic?: any;
  }
}

function AppCampaigns() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log("[Campaigns] ⏳ Waiting for Supabase...");
        while (!window.__supabaseReady__ || !window.supabase) {
          await new Promise((r) => setTimeout(r, 150));
        }

        console.log("[Campaigns] ✅ Supabase ready, fetching campaigns...");

        const { data, error } = await window.supabase
          .from("campaigns")
          .select("*");

        if (error) throw error;
        console.log("[Campaigns] 📦 Supabase campaigns:", data);

        // ✅ Try to update Plasmic global state (Studio/runtime)
        if (window.$state) {
          window.$state.campaigns = data;
          console.log("[Campaigns] ✅ Updated $state.campaigns for Plasmic bindings");
        } else {
          // ✅ Fallback: attach to window for debugging / external scripts
          window.$plasmic = { ...(window.$plasmic || {}), campaigns: data };
          console.warn("[Campaigns] ⚠️ No $state found, attached to window.$plasmic");
        }
      } catch (err) {
        console.error("[Campaigns] ❌ Supabase query failed:", err);
      }
    })();
  }, []);

  return (
    <PageParamsProvider__
      route={router?.pathname}
      params={router?.query}
      query={router?.query}
    >
      <PlasmicAppCampaigns />
    </PageParamsProvider__>
  );
}

export default AppCampaigns;
