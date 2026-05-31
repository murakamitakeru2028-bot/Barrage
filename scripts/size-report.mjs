import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const root = resolve(process.argv.slice(2).find(arg => !arg.startsWith("--")) || "dist");
const limit = Number(readArg("--limit", "12"));

const files = (await listFiles(root))
  .map(file => relative(root, file).split(sep).join("/"))
  .sort();

const rows = [];
for (const file of files) {
  const buffer = await readFile(join(root, file));
  rows.push({
    file,
    raw: buffer.length,
    gzip: gzipSync(buffer).length,
    brotli: brotliCompressSync(buffer).length
  });
}

rows.sort((a, b) => b.raw - a.raw);

console.log(`Size report for ${root}`);
console.log("");
console.log(pad("file", 42), pad("raw", 10), pad("gzip", 10), pad("brotli", 10));
console.log("-".repeat(76));
for (const row of rows.slice(0, limit)) {
  console.log(pad(row.file, 42), pad(formatBytes(row.raw), 10), pad(formatBytes(row.gzip), 10), pad(formatBytes(row.brotli), 10));
}

const totals = rows.reduce((sum, row) => ({
  raw: sum.raw + row.raw,
  gzip: sum.gzip + row.gzip,
  brotli: sum.brotli + row.brotli
}), { raw: 0, gzip: 0, brotli: 0 });

console.log("-".repeat(76));
console.log(pad("TOTAL", 42), pad(formatBytes(totals.raw), 10), pad(formatBytes(totals.gzip), 10), pad(formatBytes(totals.brotli), 10));

const precache = await readPrecacheAssets(root);
if (precache.length) {
  const uniquePrecache = [...new Set(precache.filter(asset => asset !== "./"))];
  let raw = 0;
  for (const asset of uniquePrecache) {
    raw += (await stat(join(root, asset))).size;
  }
  console.log("");
  console.log(`Service worker precache: ${precache.length} entries, ${formatBytes(raw)} named assets`);
  console.log(precache.map(asset => `- ${asset}`).join("\n"));
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(path));
    } else {
      files.push(path);
    }
  }
  return files;
}

async function readPrecacheAssets(dir) {
  try {
    const sw = await readFile(join(dir, "sw.js"), "utf8");
    const match = sw.match(/const\s+PRECACHE_ASSETS\s*=\s*(\[[\s\S]*?\]);/u);
    return match ? JSON.parse(match[1]) : [];
  } catch {
    return [];
  }
}

function readArg(name, fallback) {
  const exact = process.argv.find(arg => arg.startsWith(`${name}=`));
  if (exact) return exact.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function pad(value, width) {
  const text = String(value);
  return text.length >= width ? text : `${text}${" ".repeat(width - text.length)}`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
