import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = "https://www.adbuy.ai";

  // Path to your Next.js "pages" directory
  const pagesDir = path.join(process.cwd(), "pages");

  const getPages = (dir: string): string[] => {
    const files = fs.readdirSync(dir);
    let routes: string[] = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Skip /api and /app
      if (file === "api" || file === "app" || file.startsWith("_")) continue;

      if (stat.isDirectory()) {
        routes = routes.concat(getPages(filePath));
      } else if (/\.(tsx|ts|js|jsx)$/.test(file)) {
        const route = filePath
          .replace(pagesDir, "")
          .replace(/index\.(tsx|ts|js|jsx)$/, "")
          .replace(/\.(tsx|ts|js|jsx)$/, "");
        routes.push(route);
      }
    }

    return routes;
  };

  const pages = getPages(pagesDir);

  const urls = pages.map((route) => {
    const loc = `${baseUrl}${route || "/"}`;
    return `
      <url>
        <loc>${loc}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("\n")}
    </urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();
}
