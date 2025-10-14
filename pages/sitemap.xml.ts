import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemapRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sitemap`);
  const sitemap = await sitemapRes.text();

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
