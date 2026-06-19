import { argFlag, argValue, getGoogleAccessToken, getSiteUrl, printJson } from "./_env.mjs";

const dryRun = argFlag("dry-run") || !argFlag("execute");
const siteUrl = argValue("gsc-site-url", process.env.GSC_SITE_URL || getSiteUrl());
const sitemapUrl = argValue("sitemap-url", process.env.SITEMAP_URL || `${getSiteUrl()}/sitemap.xml`);
const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

if (dryRun) {
  printJson({
    status: "dry_run",
    method: "PUT",
    endpoint,
    siteUrl,
    sitemapUrl,
    credential_source: process.env.GSC_SERVICE_ACCOUNT_JSON ? "env:GSC_SERVICE_ACCOUNT_JSON" : "D:\\env\\gsc_credentials.json",
  });
  process.exit(0);
}

const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/webmasters"]);
const response = await fetch(endpoint, {
  method: "PUT",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

printJson({
  status: response.ok ? "submitted" : "failed",
  http_status: response.status,
  body: await response.text(),
});

if (!response.ok) process.exit(1);
