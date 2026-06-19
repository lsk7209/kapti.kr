import { readFileSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";

export function argFlag(name) {
  return process.argv.includes(`--${name}`);
}

export function argValue(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(prefix));
  if (hit) return hit.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

export function getSiteUrl() {
  return stripSlash(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || argValue("site-url", "https://kapti.kr"));
}

export function getSiteDomain() {
  const direct = process.env.SITE_DOMAIN || argValue("site-domain");
  if (direct) return direct.replace(/^sc-domain:/, "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  return new URL(getSiteUrl()).hostname;
}

export function stripSlash(value) {
  return String(value).replace(/\/$/, "");
}

export function readJsonEnv(name, fileFallback) {
  if (process.env[name]) return JSON.parse(process.env[name]);
  const path = process.env[`${name}_FILE`] || fileFallback;
  if (path && existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  return null;
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

export async function getGoogleAccessToken(scopes) {
  const credentials = readJsonEnv("GSC_SERVICE_ACCOUNT_JSON", "D:\\env\\gsc_credentials.json");
  if (!credentials) throw new Error("Missing GSC_SERVICE_ACCOUNT_JSON or credential file");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.client_email,
    scope: scopes.join(" "),
    aud: credentials.token_uri || "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${base64url(signer.sign(credentials.private_key))}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch(claim.aud, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error(`Google token request failed: ${response.status} ${await response.text()}`);
  const json = await response.json();
  return json.access_token;
}

export function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}
