import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.adbuy.ai";
  const pagesDir = path.join(process.cwd(), "pages");

  // Recursively get all static pages (excluding app/api/fonts)
  function getPages(dir: string): string[] {
    const files = fs.readdirSync(dir);
    let urls: string[] = [];

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (["api", "app", "fonts"].includes(file)) continue;
        urls = urls.concat(getPages(fullPath));
      } else if (file.endsWith(".tsx") && !file.startsWith("_")) {
        const relativePath = path.relative(pagesDir, fullPath);
        let route = relativePath
          .replace(/\.tsx$/, "")
          .replace(/index$/, "")
          .replace(/\\/g, "/");

        urls.push(`${baseUrl}/${route}`.replace(/\/$/, ""));
      }
    }
    return urls;
  }

  const allPages = getPages(pagesDir);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPages
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${url === baseUrl ? "1.0" : "0.8"}</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}
