import { readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const entries = await readdir(root, { withFileTypes: true });
const targets = entries
  .filter(entry => entry.name.startsWith(".tmp-"))
  .map(entry => entry.name)
  .sort();

if (!targets.length) {
  console.log("No .tmp-* files or folders found.");
  process.exit(0);
}

if (!process.argv.includes("--yes")) {
  console.log("Dry run. Add --yes to delete:");
  for (const target of targets) console.log(`- ${target}`);
  process.exit(0);
}

for (const target of targets) {
  const path = resolve(root, target);
  if (!path.startsWith(`${root}\\`) && !path.startsWith(`${root}/`)) {
    throw new Error(`Refusing to delete outside project root: ${path}`);
  }
  await rm(path, { recursive: true, force: true });
  console.log(`Deleted ${target}`);
}
