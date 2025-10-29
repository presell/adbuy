// pages/app/campaigns.tsx
import * as React from "react";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";

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

        // Wait for Supabase initialization
        while (!window.__supabaseReady__ || !window.supabase) {
          await new Promise((r) => setTimeout(r, 150));
        }

        console.log("[Campaigns] ✅ Supabase ready, fetching campaigns...");
        const { data, error } = await window.supabase
          .from("campaigns")
          .select("*");

        if (error) throw error;
        console.log("[Campaigns] 📦 Supabase campaigns:", data);

        // ✅ Works in both Studio + production
        if (window.$state) {
          window.$state.campaigns = data;
          console.log("[Campaigns] ✅ Updated $state.campaigns (Plasmic Studio)");
        } else {
          // ✅ Outside Studio, mimic state manually for production rendering
          window.$state = { campaigns: data };
          console.log("[Campaigns] ✅ Created fallback $state for production");
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
