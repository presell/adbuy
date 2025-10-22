// pages/app/campaigns.tsx
import * as React from "react";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";
import { usePlasmicRootContext } from "@plasmicapp/react-web";

function AppCampaigns() {
  const router = useRouter();
  const plasmicCtx = usePlasmicRootContext();

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

        // ✅ Option 1: Update Plasmic’s global context (if project uses it)
        if (plasmicCtx?.updateGlobalContext) {
          plasmicCtx.updateGlobalContext({ campaigns: data });
          console.log("[Campaigns] ✅ Updated global context");
        }

        // ✅ Option 2: Patch Plasmic’s root state (works always, even if no schema)
        else if (plasmicCtx?.setGlobalVariants) {
          plasmicCtx.setGlobalVariants((prev: any) => ({
            ...prev,
            campaigns: data,
          }));
          console.log("[Campaigns] ✅ Set campaigns via global variants");
        }

        // ✅ Option 3: Last resort, mirror into window for debug or Studio
        else {
          (window as any).$plasmic = { ...(window as any).$plasmic, campaigns: data };
          console.warn("[Campaigns] ⚠️ Fallback: set campaigns on window.$plasmic");
        }
      } catch (err) {
        console.error("[Campaigns] ❌ Supabase query failed:", err);
      }
    })();
  }, [plasmicCtx]);

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
