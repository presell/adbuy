// pages/sitemap.xml.ts
import { GetServerSideProps } from "next";

const SITE_URL = "https://www.adbuy.ai";

function generateSiteMap(routes: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map(
        (route) => `
      <url>
        <loc>${SITE_URL}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route === "/" ? "1.0" : "0.8"}</priority>
      </url>`
      )
      .join("")}
  </urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // manually list your key static routes for now
  const routes = [
    "/",
    "/about",
    "/campaigns",
    "/ecommerce",
    "/home-services",
    "/insurance",
    "/integrations",
    "/legal",
    "/medical",
    "/mortgage",
    "/signup",
    "/login",
    "/workflows",
  ];

  const sitemap = generateSiteMap(routes);

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
