/**
 * Ranking persistence helpers.
 *
 * Public API:
 * - loadRanking(): read ranking entries from localStorage.
 * - saveRanking(entries): sort, limit, and save entries.
 * - upsertScore(params, forceName): add or update one player's score.
 * - getRankingRows(limit): return sorted rows with rank numbers.
 * - removeEntryById(id): remove one entry by id.
 */

/** localStorage key for ranking data. */
export const RANKING_KEY = 'barrage-ranking-v1';

/** Maximum number of entries to keep. */
export const RANKING_LIMIT = 50;

const DEFAULT_PLAYER_ID = 'local:guest';

/**
 * Normalize player names for display.
 * Removes control characters, collapses whitespace, and caps length at 14 chars.
 * @param {string} name
 * @returns {string}
 */
function sanitizeName(name) {
  const cleaned = String(name || '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const chars = Array.from(cleaned);
  return chars.length ? chars.slice(0, 14).join('') : 'PLAYER';
}

/**
 * Use a stable guest id when no usable player id is supplied.
 * @param {*} playerId
 * @returns {string}
 */
function normalizePlayerId(playerId) {
  if (playerId == null) return DEFAULT_PLAYER_ID;

  const id = String(playerId);
  const trimmed = id.trim();
  const marker = trimmed.toLowerCase();
  if (!trimmed || marker === 'undefined' || marker === 'null') {
    return DEFAULT_PLAYER_ID;
  }
  return id;
}

/**
 * Sort entries by score, then wave, then update time.
 * @param {Array} entries
 * @returns {Array}
 */
function sortEntries(entries) {
  return entries.sort(
    (a, b) =>
      (b.score - a.score) ||
      (b.wave - a.wave) ||
      (b.updatedAt - a.updatedAt)
  );
}

/**
 * Normalize stored data into a ranking entry.
 * @param {object} r
 * @returns {object}
 */
function normalizeEntry(r) {
  return {
    id:        String(r.id),
    name:      sanitizeName(r.name || 'PLAYER'),
    score:     Math.max(0, Math.floor(Number(r.score) || 0)),
    wave:      Math.max(1, Math.floor(Number(r.wave) || 1)),
    ship:      String(r.ship || ''),
    core:      String(r.core || ''),
    linked:    !!r.linked,
    updatedAt: Number(r.updatedAt) || 0,
  };
}

/**
 * Read ranking entries from localStorage.
 * Returns an empty array if storage is unavailable or data is invalid.
 * @returns {Array<object>}
 */
export function loadRanking() {
  try {
    const raw = localStorage.getItem(RANKING_KEY);
    const rows = JSON.parse(raw || '[]');
    if (!Array.isArray(rows)) return [];

    return rows
      .filter(r => r && r.id && Number.isFinite(Number(r.score)))
      .map(normalizeEntry);
  } catch (e) {
    return [];
  }
}

/**
 * Sort and save ranking entries to localStorage.
 * @param {Array<object>} entries
 */
export function saveRanking(entries) {
  try {
    const sorted = sortEntries([...entries]).slice(0, RANKING_LIMIT);
    localStorage.setItem(RANKING_KEY, JSON.stringify(sorted));
  } catch (e) {
    // Keep ranking writes best-effort when localStorage is unavailable.
  }
}

/**
 * Add or update one player's ranking entry.
 * Only better scores replace existing scores unless forceName is true.
 *
 * @param {object} params
 * @param {string}  params.playerId
 * @param {string}  params.name
 * @param {number}  params.score
 * @param {number}  params.wave
 * @param {string}  [params.ship]
 * @param {string}  [params.core]
 * @param {boolean} [params.linked]
 * @param {boolean} [forceName=false]
 * @returns {Array<object>}
 */
export function upsertScore(
  { playerId, name, score, wave, ship = '', core = '', linked = false },
  forceName = false
) {
  const entry = {
    id:        normalizePlayerId(playerId),
    name:      sanitizeName(name),
    score:     Math.max(0, Math.floor(Number(score) || 0)),
    wave:      Math.max(1, Math.floor(Number(wave) || 1)),
    ship:      String(ship || ''),
    core:      String(core || ''),
    linked:    !!linked,
    updatedAt: Date.now(),
  };

  if (entry.score <= 0 && entry.wave <= 1) {
    return loadRanking();
  }

  const entries = loadRanking();
  const idx = entries.findIndex(r => r.id === entry.id);

  if (idx >= 0) {
    const old = entries[idx];
    const isBetter =
      entry.score > old.score ||
      (entry.score === old.score && entry.wave > old.wave);

    if (forceName || isBetter) {
      entries[idx] = isBetter
        ? entry
        : {
            ...old,
            name: entry.name,
            linked: entry.linked,
            ship: entry.ship,
            core: entry.core,
            updatedAt: Date.now(),
          };
    }
  } else {
    entries.push(entry);
  }

  saveRanking(entries);
  return loadRanking();
}

/**
 * Return sorted ranking rows with rank numbers.
 * @param {number} [limit=50]
 * @returns {Array<{rank: number, id: string, name: string, score: number, wave: number, ship: string, core: string, linked: boolean, updatedAt: number}>}
 */
export function getRankingRows(limit = RANKING_LIMIT) {
  const entries = loadRanking();
  return sortEntries([...entries])
    .slice(0, limit)
    .map((entry, i) => ({ rank: i + 1, ...entry }));
}

/**
 * Remove one ranking entry by id.
 * @param {string} id
 */
export function removeEntryById(id) {
  if (!id) return;
  const entries = loadRanking().filter(r => r.id !== id);
  saveRanking(entries);
}
