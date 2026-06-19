import { execFileSync } from "node:child_process";
import { argValue, printJson } from "./_env.mjs";
import { currentContentUrls } from "./_content.mjs";

function gitChangedFiles(base) {
  try {
    const output = execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

const base = argValue("base", process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main");
const changed = gitChangedFiles(base);
const allContent = changed.length === 0 || changed.some((file) => /^lib\/posts\.ts$|^app\/blog\//.test(file));
const urls = allContent ? currentContentUrls() : [];

printJson({
  mode: "changed-content-urls",
  base,
  changed_files: changed,
  urls,
  note: changed.length === 0 ? "No git diff available; returning current blog URLs for dry-run/development." : undefined,
});
