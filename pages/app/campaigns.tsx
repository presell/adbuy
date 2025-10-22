import * as React from "react";
import { useEffect } from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";

function AppCampaigns() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log("[Campaigns] 🔄 Waiting for Supabase...");

        while (!window.__supabaseReady__ || !window.supabase) {
          await new Promise((r) => setTimeout(r, 150));
        }

        console.log("[Campaigns] ✅ Supabase ready, fetching campaigns...");

        const { data, error } = await window.supabase
          .from("campaigns")
          .select("*");

        if (error) throw error;
        console.log("[Campaigns] 📦 Supabase campaigns:", data);

        // ✅ Sync with both Plasmic Studio ($state) and runtime ($plasmic)
        const win = window as any;

        if (win.$state) {
          win.$state.campaigns = data;
          console.log("[Campaigns] ✅ Updated $state.campaigns for Plasmic bindings");
        }

        if (win.$plasmic?.updateGlobalContext) {
          win.$plasmic.updateGlobalContext({
            campaigns: data,
          });
          console.log("[Campaigns] ✅ Updated $plasmic global context");
        } else {
          console.log("[Campaigns] ℹ️ No $plasmic found — running outside Studio");
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
