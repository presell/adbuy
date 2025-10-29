// pages/app/campaigns.tsx
import * as React from "react";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";

// ✅ Declare globals for Supabase + Plasmic runtime variables
declare global {
  interface Window {
    __supabaseReady__?: boolean;
    supabase?: typeof supabase;
    $state?: any;
  }
}

function AppCampaigns() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log("[Campaigns] ⏳ Waiting for Supabase...");

        // Wait for Supabase to be ready
        while (!window.__supabaseReady__ || !window.supabase) {
          await new Promise((r) => setTimeout(r, 150));
        }

        console.log("[Campaigns] ✅ Supabase ready, fetching campaigns...");
        const { data, error } = await window.supabase.from("campaigns").select("*");

        if (error) throw error;

        console.log("[Campaigns] 📦 Supabase campaigns:", data);

        // ✅ Bind data back to Plasmic $state (exactly like the original side effect)
        if (window.$state) {
          window.$state.campaigns = data;
          console.log("[Campaigns] ✅ Bound data to $state.campaigns");
        } else {
          console.warn("[Campaigns] ⚠️ No $state found — likely running outside Studio context");
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
