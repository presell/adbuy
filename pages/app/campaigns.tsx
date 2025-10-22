// pages/app/campaigns.tsx
import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicAppCampaigns } from "../../components/plasmic/ad_buy/PlasmicAppCampaigns";
import { useRouter } from "next/router";

function AppCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);

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

        setCampaigns(data || []);
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
      <AppCampaignsWrapper campaigns={campaigns} />
    </PageParamsProvider__>
  );
}

// ✅ Wrapper bypasses Plasmic’s strict prop typing
function AppCampaignsWrapper(props: { campaigns: any[] }) {
  return <PlasmicAppCampaigns {...(props as any)} />;
}

export default AppCampaigns;
