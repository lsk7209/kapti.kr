import { argFlag, argValue, getGoogleAccessToken, getSiteDomain, printJson } from "./_env.mjs";

const dryRun = argFlag("dry-run") || !argFlag("execute");
const domain = getSiteDomain();
const siteUrl = argValue("gsc-site-url", process.env.GSC_SITE_URL || `sc-domain:${domain}`);
const ownerEmail = process.env.GSC_OWNER_EMAIL || argValue("owner-email");

if (!ownerEmail) {
  printJson({
    status: dryRun ? "dry_run_missing_owner_email" : "skipped_missing_owner_email",
    siteUrl,
    note: "Set GSC_OWNER_EMAIL after the Domain Property and verification method are confirmed.",
  });
  process.exit(dryRun ? 0 : 1);
}

if (dryRun) {
  printJson({
    status: "dry_run",
    siteUrl,
    ownerEmail,
    planned_steps: [
      "Confirm service account has permission for the Domain Property.",
      "Call Search Console Sites API to add/read the property for the authenticated principal.",
      "Use Google Site Verification ownership flow only after DNS token placement is confirmed.",
    ],
  });
  process.exit(0);
}

const token = await getGoogleAccessToken([
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/siteverification",
]);
const addSiteEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`;
const response = await fetch(addSiteEndpoint, {
  method: "PUT",
  headers: {
    authorization: `Bearer ${token}`,
  },
});

printJson({
  status: response.ok ? "site_added_or_confirmed" : "failed",
  http_status: response.status,
  siteUrl,
  ownerEmail,
  note: "Owner email addition still requires a verified Site Verification ownership flow; this command confirms the property for the authenticated credential.",
  body: await response.text(),
});

if (!response.ok) process.exit(1);
