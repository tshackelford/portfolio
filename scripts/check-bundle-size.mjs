import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const CHUNK_DIR = join(".next", "static", "chunks");
const TOTAL_BUDGET_KB = 300;

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.endsWith(".js")) yield p;
  }
}

let total = 0;
for (const f of walk(CHUNK_DIR)) {
  total += gzipSync(readFileSync(f)).length;
}

const totalKB = total / 1024;
console.log(`Total static JS chunks (gzipped): ${totalKB.toFixed(1)} KB / budget ${TOTAL_BUDGET_KB} KB`);

if (totalKB > TOTAL_BUDGET_KB) {
  console.error(`✖ Over aggregate JS budget by ${(totalKB - TOTAL_BUDGET_KB).toFixed(1)} KB`);
  process.exit(1);
}
console.log("✓ Within aggregate budget");
