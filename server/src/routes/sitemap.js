const express = require("express");
const router = express.Router();

// ✅ ONLY use your actual model
const { BlogPost } = require("../models/index");

router.get("/", async (req, res) => {
  try {
  const baseUrl =
  process.env.BASE_URL ||
  `${req.headers['x-forwarded-proto'] || req.protocol}://${req.get('host')}` ||
  "https://globallibspace.onrender.com";

    // ✅ Fetch published blogs only
    const blogs = await BlogPost.find({ status: "published" }).lean();

    const urls = [];

    const createUrl = (loc, lastmod = null, priority = "0.7") => `
<url>
  <loc>${loc}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  <priority>${priority}</priority>
</url>`;

    // Static pages
    urls.push(createUrl(`${baseUrl}`, null, "1.0"));
    urls.push(createUrl(`${baseUrl}/blogs`, null, "0.9"));

    // Blogs
    blogs.forEach(blog => {
      if (!blog.slug) return;

      urls.push(
        createUrl(
          `${baseUrl}/blog/${blog.slug}`,
          blog.updatedAt || blog.publishedAt
            ? new Date(blog.updatedAt || blog.publishedAt).toISOString()
            : null
        )
      );
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    // Optional: prevent caching during testing
    res.set("Cache-Control", "no-store");

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (err) {
    console.error("Sitemap Error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;