import { cp, mkdir, copyFile, readFile, writeFile, readdir, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { deflateSync } from "node:zlib";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(projectRoot, "dist");

async function resetDist() {
  if (relative(projectRoot, distDir) !== "dist") {
    throw new Error(`Refusing to clean unexpected dist path: ${distDir}`);
  }

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

await resetDist();
await copyFile(join(projectRoot, "index.html"), join(distDir, "index.html"));
await cp(join(projectRoot, "public"), distDir, { recursive: true });
await cp(join(projectRoot, "src"), join(distDir, "src"), { recursive: true });

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([len, name, data, crc]);
}

function makeIcon(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.48;

  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const i = row + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy) / maxR;
      const beam = Math.abs(dx) < size * 0.055 && y > size * 0.19 && y < size * 0.78;
      const wing = y > size * 0.35 && y < size * 0.68 && Math.abs(dx) < (y - size * 0.24) * 0.72;
      const core = r < 0.22;
      const ring = r > 0.66 && r < 0.77;
      const glow = Math.max(0, 1 - r);
      raw[i] = Math.round(6 + 22 * glow + (core ? 235 : 0) + (ring ? 0 : 0));
      raw[i + 1] = Math.round(8 + 190 * glow + (beam ? 55 : 0));
      raw[i + 2] = Math.round(18 + 220 * glow + (wing ? 40 : 0));
      raw[i + 3] = Math.round(255);
      if (beam || wing || core) {
        raw[i] = core ? 255 : 0;
        raw[i + 1] = beam ? 240 : 210;
        raw[i + 2] = wing ? 255 : 255;
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

await writeFile(join(distDir, "icon-192.png"), makeIcon(192));
await writeFile(join(distDir, "icon-512.png"), makeIcon(512));

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(file));
    } else {
      files.push(file);
    }
  }
  return files;
}

const distFiles = (await listFiles(distDir))
  .filter(file => !file.endsWith(`${sep}sw.js`))
  .map(file => relative(distDir, file).split(sep).join("/"))
  .sort();
const precacheAssets = ["./", ...distFiles];
const sw = await readFile(join(distDir, "sw.js"), "utf8");
const cacheInputs = await Promise.all(distFiles.map(file => readFile(join(distDir, file))));
cacheInputs.push(Buffer.from(sw));
const cacheVersion = createHash("sha256").update(Buffer.concat(cacheInputs)).digest("hex").slice(0, 12);
await writeFile(
  join(distDir, "sw.js"),
  sw
    .replace("__CACHE_VERSION__", cacheVersion)
    .replace("__PRECACHE_ASSETS__", JSON.stringify(precacheAssets, null, 2)),
  "utf8"
);
