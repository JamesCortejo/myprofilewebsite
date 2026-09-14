const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

const cacheStaticAssets = (res, filePath) => {
  if (filePath.endsWith(".html")) {
    res.setHeader("Cache-Control", "no-cache");
    return;
  }

  res.setHeader("Cache-Control", "public, max-age=604800");
};

const sendPage = (res, fileName, statusCode = 200) => {
  res.status(statusCode);
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(publicDir, fileName));
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.static(publicDir, { setHeaders: cacheStaticAssets }));

app.get("/", (_req, res) => {
  sendPage(res, "index.html");
});

app.get("/projects", (_req, res) => {
  sendPage(res, "projects.html");
});

app.get("/about", (_req, res) => {
  sendPage(res, "about.html");
});

app.get("/contact", (_req, res) => {
  sendPage(res, "contact.html");
});

app.use((_req, res) => {
  sendPage(res, "404.html", 404);
});

app.listen(port, () => {
  console.log(`Profile site running at http://localhost:${port}`);
});