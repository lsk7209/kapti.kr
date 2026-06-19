import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { argValue, printJson } from "./_env.mjs";

const key = process.env.INDEXNOW_KEY || argValue("key");

if (!key) {
  printJson({ status: "skipped_missing_indexnow_key" });
  process.exit(0);
}

mkdirSync("public", { recursive: true });
const path = join("public", `${key}.txt`);
writeFileSync(path, key, "utf8");
printJson({ status: "written", path });
