import * as React from "react";
import { useEffect, useState, createContext } from "react";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";

export const CampaignsContext = createContext<any[]>([]);

function AppCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);

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
        setCampaigns(data || []);

        // ✅ Optional: expose for Plasmic Studio bindings (dev only)
        if (typeof window !== "undefined") {
          (window as any).campaigns = data;
        }
      } catch (err) {
        console.error("[Campaigns] ❌ Supabase query failed:", err);
      }
    })();
  }, []);

  return (
    <CampaignsContext.Provider value={campaigns}>
      <PageParamsProvider__
        route={router?.pathname}
        params={router?.query}
        query={router?.query}
      >
        <PlasmicAppCampaigns />
      </PageParamsProvider__>
    </CampaignsContext.Provider>
  );
}

export default AppCampaigns;
