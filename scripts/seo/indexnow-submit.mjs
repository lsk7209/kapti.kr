import { argFlag, argValue, getSiteUrl, getSiteDomain, printJson } from "./_env.mjs";
import { currentContentUrls } from "./_content.mjs";

const dryRun = argFlag("dry-run") || !argFlag("execute");
const key = process.env.INDEXNOW_KEY || argValue("key");
const host = getSiteDomain();
const siteUrl = getSiteUrl();
const urls = (argValue("urls")?.split(",").filter(Boolean)) || [siteUrl, ...currentContentUrls()];

if (!key) {
  printJson({ status: "skipped_missing_indexnow_key", dryRun, urls });
  process.exit(0);
}

const payload = {
  host,
  key,
  keyLocation: `${siteUrl}/${key}.txt`,
  urlList: urls,
};

if (dryRun) {
  printJson({ status: "dry_run", endpoint: "https://api.indexnow.org/indexnow", payload: { ...payload, key: "[redacted]" } });
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

printJson({
  status: response.ok ? "submitted" : "failed",
  http_status: response.status,
  body: await response.text(),
  submitted_count: urls.length,
});

if (!response.ok) process.exit(1);
