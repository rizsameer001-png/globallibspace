const express = require("express");
const router = express.Router();

// Models
const Blog = require("../models/Blog");
const Author = require("../models/Author");
const Book = require("../models/Book");

router.get("/sitemap.xml", async (req, res) => {
  try {
    // ✅ Hybrid base URL (env + auto-detect)
    const baseUrl =
      process.env.BASE_URL ||
      `${req.headers["x-forwarded-proto"] || req.protocol}://${req.get("host")}`;

    // Fetch data
    const [blogs, authors, books] = await Promise.all([
      Blog.find({ isPublic: true }).lean(),
      Author.find({}).lean(),
      Book.find({}).lean()
    ]);

    const urls = [];

    // Helper function
    const createUrl = (loc, lastmod = null, priority = "0.7") => `
<url>
  <loc>${loc}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  <priority>${priority}</priority>
</url>`;

    // Static pages
    urls.push(createUrl(`${baseUrl}`, null, "1.0"));
    urls.push(createUrl(`${baseUrl}/blogs`, null, "0.9"));
    urls.push(createUrl(`${baseUrl}/authors`, null, "0.8"));
    urls.push(createUrl(`${baseUrl}/books`, null, "0.8"));

    // Blogs
    blogs.forEach(blog => {
      if (!blog.slug) return;
      urls.push(
        createUrl(
          `${baseUrl}/blog/${blog.slug}`,
          blog.updatedAt ? new Date(blog.updatedAt).toISOString() : null
        )
      );
    });

    // Authors
    authors.forEach(author => {
      if (!author.slug) return;
      urls.push(createUrl(`${baseUrl}/author/${author.slug}`, null, "0.6"));
    });

    // Books
    books.forEach(book => {
      if (!book.slug) return;
      urls.push(createUrl(`${baseUrl}/book/${book.slug}`, null, "0.6"));
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (err) {
    console.error("Sitemap Error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;