export const PREVIEW_ROUTES = Object.freeze([
  { id: "home", path: "/", label: "Home" },
  { id: "basic", path: "/?ui=basic", label: "In-run upgrade" },
  { id: "special", path: "/?ui=special", label: "Skill selection" },
  { id: "homeUpgrade", path: "/?ui=homeUpgrade", label: "Home status upgrades" },
  { id: "store", path: "/?ui=store", label: "Store" },
  { id: "garage", path: "/?ui=garage", label: "Garage" },
  { id: "gacha", path: "/?ui=gacha", label: "Gacha" },
  { id: "settings", path: "/?ui=settings", label: "Settings" },
  { id: "ranking", path: "/?ui=ranking", label: "Ranking" },
  { id: "pause", path: "/?ui=pause", label: "Pause" },
  { id: "boss", path: "/?ui=boss", label: "Boss" },
  { id: "bossChase", path: "/?ui=bossChase", label: "Boss chase" },
  { id: "hit", path: "/?ui=hit", label: "Hit effect" },
  { id: "reload", path: "/?ui=reload", label: "Reload HUD" },
  { id: "kill", path: "/?ui=kill", label: "Enemy defeat" },
  { id: "collision", path: "/?ui=collision", label: "Collision" },
  { id: "wing-collision", path: "/?ui=wing-collision", label: "Wing collision" },
  { id: "shotgun", path: "/?ui=shotgun", label: "Shotgun" },
  { id: "gatling", path: "/?ui=gatling", label: "Gatling" },
  { id: "crash", path: "/?ui=crash", label: "Crash" },
  { id: "dead", path: "/?ui=dead", label: "Game over" }
]);

export const VISUAL_SNAPSHOT_ROUTES = Object.freeze([
  { name: "home", path: "/" },
  { name: "gameplay-basic", path: "/?ui=basic" },
  { name: "skill-selection", path: "/?ui=special" },
  { name: "garage", path: "/?ui=garage" },
  { name: "gacha", path: "/?ui=gacha" },
  { name: "settings", path: "/?ui=settings" },
  { name: "game-over", path: "/?ui=dead" }
]);

export function previewPath(id) {
  if (!id || id === "home") return "/";
  const route = PREVIEW_ROUTES.find(item => item.id === id);
  if (!route) {
    const valid = PREVIEW_ROUTES.map(item => item.id).join(", ");
    throw new Error(`Unknown preview "${id}". Valid previews: ${valid}`);
  }
  return route.path;
}
