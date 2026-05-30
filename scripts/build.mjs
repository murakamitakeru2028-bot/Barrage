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

  // Delta wing vertices in normalized [0,1] space, tip pointing up
  const tipX = 0.50, tipY = 0.08;
  const lwX  = 0.10, lwY  = 0.76;
  const rwX  = 0.90, rwY  = 0.76;

  function distSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 < 1e-12 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function ptInTri(px, py) {
    const d1 = (px - lwX) * (tipY - lwY) - (tipX - lwX) * (py - lwY);
    const d2 = (px - rwX) * (lwY  - rwY) - (lwX  - rwX) * (py - rwY);
    const d3 = (px - tipX) * (rwY - tipY) - (rwX - tipX) * (py - tipY);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }

  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    const fy = y / size;
    const cyo = fy - 0.5;

    for (let x = 0; x < size; x++) {
      const i = row + 1 + x * 4;
      const fx = x / size;
      const cxo = fx - 0.5;
      const radial = Math.hypot(cxo, cyo) * 2;

      // Deep space background
      const bgG = Math.max(0, 1 - radial * 0.95) ** 2;
      let R = 6  + bgG * 20;
      let G = 6  + bgG *  6;
      let B = 14 + bgG * 48;

      // Outer targeting ring
      const ringDist = Math.abs(radial - 0.87);
      const ringG = Math.max(0, 1 - ringDist * 90) * 0.5;
      R += ringG * 8;
      G += ringG * 150;
      B += ringG * 200;

      // Ship shape
      const inShip = ptInTri(fx, fy);
      const edgeDist = Math.min(
        distSeg(fx, fy, tipX, tipY, lwX, lwY),
        distSeg(fx, fy, tipX, tipY, rwX, rwY),
        distSeg(fx, fy, lwX, lwY, rwX, rwY)
      );
      const edgeG = Math.max(0, 1 - edgeDist / 0.030) ** 0.7;

      if (inShip) {
        R = Math.max(R, 10);
        G = Math.max(G, 14);
        B = Math.max(B, 42);
      }

      // Wing edges: electric cyan glow
      R += edgeG * 25;
      G += edgeG * 225;
      B += edgeG * 255;

      // Fuselage: bright vertical stripe, lighter toward nose
      const fuseW = 0.050 + Math.max(0, fy - 0.46) * 0.055;
      if (Math.abs(cxo) < fuseW && fy > tipY - 0.01 && fy < lwY + 0.02) {
        const fBright = (1 - Math.max(0, fy - tipY) / (lwY - tipY)) * 0.55 + 0.2;
        R = Math.max(R, 18 + fBright * 20);
        G = Math.max(G, 50 + fBright * 90);
        B = Math.max(B, 100 + fBright * 110);
      }

      // Cockpit: dark teardrop recess
      if (inShip) {
        const cDist = Math.hypot(cxo * 3, fy - 0.30);
        if (cDist < 0.10) {
          const d = Math.max(0, 1 - cDist / 0.10) ** 0.5;
          R = R * (1 - d * 0.8) + 4 * d;
          G = G * (1 - d * 0.8) + 5 * d;
          B = B * (1 - d * 0.5) + 15 * d;
        }
      }

      // Wing panel lines: subtle horizontal structure
      if (inShip) {
        for (const lineY of [0.43, 0.58]) {
          const pG = Math.max(0, 1 - Math.abs(fy - lineY) / 0.009);
          R += pG * 5;
          G += pG * 50;
          B += pG * 90;
        }
      }

      // Engine exhaust: hot cyan-white glow below ship
      const exDist = Math.hypot(cxo * 3.2, fy - 0.875);
      const exG = Math.max(0, 1 - exDist * 3.8) ** 1.5;
      R += exG * 120;
      G += exG * 240;
      B += exG * 255;
      const exDist2 = Math.hypot(cxo * 1.5, fy - 0.90);
      const exG2 = Math.max(0, 1 - exDist2 * 2.5) ** 2.5;
      R += exG2 * 18;
      G += exG2 * 70;
      B += exG2 * 110;

      // Wing tip glow: cyan accent at wing corners
      const ltG = Math.max(0, 1 - Math.hypot(fx - lwX, fy - lwY) * 8) ** 2;
      const rtG = Math.max(0, 1 - Math.hypot(fx - rwX, fy - rwY) * 8) ** 2;
      const wtG = ltG + rtG;
      R += wtG * 40;
      G += wtG * 200;
      B += wtG * 240;

      // Energy core: violet halo → magenta bloom → white-hot center
      const coreDist = Math.hypot(cxo * 1.3, fy - 0.46);
      const haloG = Math.max(0, 1 - coreDist * 4.5) ** 2.5;
      R += haloG * 80;
      G += haloG * 10;
      B += haloG * 160;
      const bloomG = Math.max(0, 1 - coreDist * 8) ** 1.8;
      R += bloomG * 220;
      G += bloomG * 30;
      B += bloomG * 160;
      const centerG = Math.max(0, 1 - coreDist * 18) ** 1.2;
      R += centerG * 255;
      G += centerG * 180;
      B += centerG * 255;

      raw[i]     = Math.min(255, Math.max(0, Math.round(R)));
      raw[i + 1] = Math.min(255, Math.max(0, Math.round(G)));
      raw[i + 2] = Math.min(255, Math.max(0, Math.round(B)));
      raw[i + 3] = 255;
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

const icon192Path = join(projectRoot, "public", "icon-192.png");
const icon512Path = join(projectRoot, "public", "icon-512.png");
const iconFiles = await Promise.allSettled([
  readFile(icon192Path),
  readFile(icon512Path)
]);

if (iconFiles.every(result => result.status === "fulfilled")) {
  await writeFile(join(distDir, "icon-192.png"), iconFiles[0].value);
  await writeFile(join(distDir, "icon-512.png"), iconFiles[1].value);
} else {
  await writeFile(join(distDir, "icon-192.png"), makeIcon(192));
  await writeFile(join(distDir, "icon-512.png"), makeIcon(512));
}

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
