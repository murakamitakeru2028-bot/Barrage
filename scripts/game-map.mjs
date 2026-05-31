import { readFile } from "node:fs/promises";

const file = process.argv[2] || "src/game.js";
const source = await readFile(file, "utf8");
const lines = source.split(/\r?\n/u);

const sections = [
  ["Imports", /^import\s/u],
  ["Tuning constants", /^const\s+[A-Z0-9_]+\s*=/u],
  ["Save and setup helpers", /^function\s+(loadSave|saveProgress|resetSaveData|applyUiPreviewMode|initState|startRun)\b/u],
  ["Weapon runtime", /^function\s+(weaponRuntimeStats|magazineSize|reloadDuration|ammoHudLabel|ammoHudText|updateWeaponFire|fireShot|pushBullet)\b/u],
  ["UI shell", /^function\s+(createUi|renderUi2|renderPlayHud|renderSpecialSlotsHud|renderHudBasicUpgradeStrip|updateHud)\b/u],
  ["Actions and routing", /^function\s+(handleAction|setMode|openUpgrade|chooseUpgrade|buyRunBasic)\b/u],
  ["Player scene", /^function\s+(makePlayer|makeHomePreviewShip|updatePlayer|beginDeathCrash|updateDeathCrash)\b/u],
  ["Enemies and bosses", /^function\s+(spawnEnemy|spawnBoss|spawnBossShard|updateEnemies|bulletEnemyImpact|enemyPlayerImpact|spawnEnemyDefeatBurst)\b/u],
  ["Main loop", /^function\s+(loop|render|update|updatePlay|updateBullets|updateStage)\b/u]
];

console.log(`Game map for ${file}`);
console.log(`Lines: ${lines.length.toLocaleString()}`);
console.log(`Bytes: ${source.length.toLocaleString()}`);
console.log("");

for (const [label, pattern] of sections) {
  const matches = [];
  lines.forEach((line, index) => {
    if (pattern.test(line)) matches.push(`${index + 1}:${line.trim()}`);
  });
  if (!matches.length) continue;
  console.log(label);
  for (const match of matches.slice(0, 24)) console.log(`  ${match}`);
  if (matches.length > 24) console.log(`  ... ${matches.length - 24} more`);
  console.log("");
}

const cssStart = source.indexOf("style.textContent = `");
if (cssStart >= 0) {
  const beforeCss = source.slice(0, cssStart).split(/\r?\n/u).length;
  const cssEnd = findTemplateEnd(source, cssStart + "style.textContent = `".length);
  const cssLines = source.slice(cssStart, cssEnd).split(/\r?\n/u).length;
  console.log(`Embedded CSS starts near line ${beforeCss} and spans about ${cssLines.toLocaleString()} lines.`);
}

function findTemplateEnd(text, start) {
  for (let i = start; i < text.length; i++) {
    if (text[i] === "`" && text[i - 1] !== "\\") return i;
  }
  return text.length;
}
