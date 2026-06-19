import { existsSync } from "node:fs";
import { argFlag, getSiteDomain, getSiteUrl, printJson } from "./_env.mjs";

const requireProduction = argFlag("require-production");
const siteUrl = getSiteUrl();
const siteDomain = getSiteDomain();
const checks = {
  SITE_URL: Boolean(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL),
  SITE_DOMAIN: Boolean(process.env.SITE_DOMAIN || siteDomain),
  GSC_SERVICE_ACCOUNT_JSON:
    Boolean(process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GSC_SERVICE_ACCOUNT_JSON_FILE) ||
    existsSync("D:\\env\\gsc_credentials.json"),
  INDEXNOW_KEY: Boolean(process.env.INDEXNOW_KEY),
  GSC_SITE_URL: Boolean(process.env.GSC_SITE_URL),
  GSC_OWNER_EMAIL: Boolean(process.env.GSC_OWNER_EMAIL),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  ADSENSE_READY:
    process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true" &&
    Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-3050601904412736"),
};

const usingExample = siteUrl.includes("example.com");
const requiredFailures = [
  ...(checks.SITE_URL && !usingExample ? [] : ["SITE_URL or NEXT_PUBLIC_SITE_URL must be the real production URL"]),
  ...(checks.SITE_DOMAIN ? [] : ["SITE_DOMAIN is missing"]),
];

printJson({
  status: requiredFailures.length ? "needs_configuration" : "ok",
  siteUrl,
  siteDomain,
  usingExample,
  checks,
  requiredFailures,
});

if (requireProduction && requiredFailures.length) process.exit(1);
