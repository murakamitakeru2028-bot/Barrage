import * as THREE from './vendor/three.module.js';
import { getRankingRows, upsertScore } from './features/ranking.js';

const canvas = document.getElementById('canvas');
const W = 390;
const H = 700;
const TAU = Math.PI * 2;
const PIPE_RADIUS = 19.4;
const PIPE_ARC = Math.PI;
const PIPE_Z_NEAR = 8.0;
const PIPE_Z_FAR = -282;
const PIPE_RING_SPACING = 9.6;
const PIPE_RING_LOOP = 304;
const PLAYER_Z = -2.15;
const PLAYER_RADIAL = .62;
const PLAYER_Y = -PIPE_RADIUS * PLAYER_RADIAL;
const CAMERA_BASE_Y = 2.65;
const CAMERA_BASE_Z = 11.8;
const CAMERA_LOOK_Y = -PIPE_RADIUS * .77;
const CAMERA_LOOK_Z = -24.5;
const ENEMY_VISIBLE_ARC = 2.25;
const ENEMY_FADE_DISTANCE = 148;
const BOSS_FADE_DISTANCE = 122;
const BOSS_SIGHT_Z = -230;
const CONTROL_TURN_SPEED = 1.78;
const CONTROL_RESPONSE = 5.9;
const CONTROL_POINTER_RANGE = .46;
const PLAYER_BANK_SCALE = .20;
const PLAYER_DRIFT_SCALE = .12;
const LOW_POWER_DEVICE = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const MAX_DPR = LOW_POWER_DEVICE ? 1 : 1.12;
const MAX_ENEMIES = LOW_POWER_DEVICE ? 24 : 30;
const MAX_BULLETS = LOW_POWER_DEVICE ? 34 : 44;
const MAX_PARTICLES = LOW_POWER_DEVICE ? 18 : 30;
const ENEMY_POOL_LIMIT = LOW_POWER_DEVICE ? 24 : 34;
const ENEMY_DETAIL_Z = -92;
const STAGE_Z_SEGMENTS = LOW_POWER_DEVICE ? 28 : 34;
const STAGE_ARC_SEGMENTS = LOW_POWER_DEVICE ? 32 : 38;
const STAGE_RING_COUNT = LOW_POWER_DEVICE ? 22 : 28;
const STAGE_RING_SEGMENTS = LOW_POWER_DEVICE ? 44 : 56;
const STAR_COUNT = LOW_POWER_DEVICE ? 72 : 112;
const SPACE_STAR_COUNT = LOW_POWER_DEVICE ? 170 : 280;
const SPACE_DUST_COUNT = LOW_POWER_DEVICE ? 46 : 82;
const VANISH_STAR_COUNT = LOW_POWER_DEVICE ? 44 : 72;
const SAVE_KEY = 'barrage-3d-save-v1';
const XP_BASE = 80;
const BASIC_POINT_UNIT = 60;
const TOKEN_SCORE_UNIT = 650;
const TOKEN_WAVE_BONUS = 4;
const TOKEN_KILL_BONUS = .45;
const TOKEN_TIME_BONUS = .08;
const START_TOKENS = 1000;

const COLORS = {
  bg: 0x02040a,
  text: '#f4fbff',
  muted: 'rgba(207,225,236,.72)',
  faint: 'rgba(207,225,236,.36)',
  gold: '#d8e2ea',
  cyan: '#1ed6ff',
  jade: '#36f39b',
  rose: '#ff3b62',
  violet: '#b8a7ff',
  orange: '#ff7a3d'
};

const ENEMY_TYPES = [
  { id:'orb', name:'オーブ', sides:0, unlock:1, color:0x1ed6ff, hp:10, damage:14, radius:.42 },
  { id:'tri', name:'トライ', sides:3, unlock:11, color:0xff3b62, hp:17, damage:21, radius:.52 },
  { id:'quad', name:'クアッド', sides:4, unlock:30, color:0xffd36a, hp:32, damage:32, radius:.56 },
  { id:'penta', name:'ペンタ', sides:5, unlock:60, color:0x36f39b, hp:56, damage:48, radius:.60 },
  { id:'hexa', name:'ヘクサ', sides:6, unlock:100, color:0xb8a7ff, hp:90, damage:68, radius:.64 }
];

const BASIC_STAT_DEFS = [
  { id:'fireRate', name:'連射速度', icon:'FR', color:COLORS.cyan, text:'ショット間隔を短縮' },
  { id:'bulletSpeed', name:'弾速', icon:'>>', color:COLORS.violet, text:'弾速と射程を強化' },
  { id:'damage', name:'ダメージ', icon:'DM', color:COLORS.rose, text:'全ショット火力を強化' },
  { id:'hp', name:'耐久', icon:'HP', color:0xff6b93, text:'最大耐久と回復量を強化' },
  { id:'speed', name:'機動力', icon:'MV', color:COLORS.cyan, text:'ロール操作を強化' },
  { id:'xpMult', name:'経験値', icon:'XP', color:COLORS.jade, text:'獲得XPを増加' }
];

const HOME_UPGRADE_CAP = 10;
const HOME_UPGRADE_PATHS = [
  {
    base:{ id:'fireRate', name:'連射性能', icon:'FR', color:COLORS.cyan, text:'ショット間隔を短縮', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'damage', name:'弾丸ダメージ', icon:'DM', color:COLORS.rose, text:'弾丸ダメージを青天井で強化' }
  },
  {
    base:{ id:'critChance', name:'クリティカル率', icon:'CR', color:COLORS.gold, text:'一定確率でクリティカル', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'critDamage', name:'クリティカル倍率', icon:'CD', color:COLORS.orange, text:'クリティカル時の倍率を強化' }
  },
  {
    base:{ id:'speed', name:'機動性', icon:'MV', color:COLORS.cyan, text:'ロール移動の反応を強化', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'evasion', name:'回避力', icon:'EV', color:COLORS.violet, text:'被弾を確率で無効化' }
  },
  {
    base:{ id:'range', name:'射程距離', icon:'RG', color:0x82d7ff, text:'弾の持続時間を延長', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'bulletSpeed', name:'弾速', icon:'>>', color:COLORS.violet, text:'弾速と弾速由来ダメージを強化' }
  },
  {
    base:{ id:'regen', name:'自動回復', icon:'RP', color:COLORS.jade, text:'戦闘中に耐久を自動回復', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'hp', name:'HP', icon:'HP', color:0xff6b93, text:'最大耐久を青天井で強化' }
  },
  {
    base:{ id:'xpMult', name:'XP取得倍率', icon:'XP', color:COLORS.jade, text:'獲得XPを増加', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'tokenMult', name:'トークン取得倍率', icon:'TK', color:COLORS.gold, text:'ラン終了時の獲得トークンを強化' }
  },
  {
    base:{ id:'defense', name:'防御力', icon:'DF', color:0x9cf5ff, text:'被ダメージを軽減', cap:HOME_UPGRADE_CAP },
    advanced:{ id:'collisionDamage', name:'衝突時ダメージ', icon:'CD', color:COLORS.rose, text:'敵との衝突時に反撃ダメージ' }
  }
];
const HOME_UPGRADE_DEFS = Object.fromEntries(
  HOME_UPGRADE_PATHS.flatMap(path => [
    [path.base.id, {...path.base, tier:'base'}],
    [path.advanced.id, {...path.advanced, tier:'advanced', parent:path.base.id}]
  ])
);

const SPECIAL_UPGRADE_DEFS = [
  { id:'barrelMultishot', family:'barrel', name:'マルチショット', icon:'MS', color:COLORS.cyan, text:'弾丸を扇状に拡散して発射', max:1 },
  { id:'barrelDouble', family:'barrel', name:'ダブルバレル', icon:'DB', color:COLORS.gold, text:'銃身を増設。Lv.3でクアッドバレル', max:3 },
  { id:'barrelGatling', family:'barrel', name:'ガトリング', icon:'GT', color:COLORS.orange, text:'連射速度を大幅上昇、単発火力は低下', max:1 },
  { id:'barrelShotgun', family:'barrel', name:'ショットガン', icon:'SG', color:COLORS.rose, text:'短射程の散弾。至近距離火力が非常に高い', max:1 },
  { id:'barrelSniper', family:'barrel', name:'スナイパー', icon:'SR', color:COLORS.violet, text:'低連射の高速高威力弾を撃つ', max:1 }
];
const SPECIAL_UPGRADE_DEFS_BY_ID = Object.fromEntries(SPECIAL_UPGRADE_DEFS.map(def => [def.id, def]));

const SHIP_DEFS = [
  { id:'nu_arc', name:'NU-3D アーク', role:'標準ロールフレーム', cost:0, color:'#8eefff', partPower:1.35, slots:{barrel:1, innerFrame:1, drone:0}, mult:{hp:1, defense:1, damage:1, fireRate:1, speed:1} },
  { id:'vx_razor', name:'VX-03 レイザー', role:'強襲バレル機', cost:650, color:'#ff5d7e', partPower:1.15, slots:{barrel:2, innerFrame:1, drone:0}, mult:{hp:.94, defense:.98, damage:1.05, fireRate:1.08, speed:1.02} },
  { id:'bg_bulwark', name:'BG-12 バルワーク', role:'重装インナーフレーム機', cost:1100, color:'#d8e2ea', partPower:1.12, slots:{barrel:1, innerFrame:3, drone:0}, mult:{hp:1.16, defense:1.10, damage:.96, fireRate:.94, speed:.92} },
  { id:'dr_hive', name:'DR-07 ハイヴ', role:'ドローン管制機', cost:1650, color:'#9dffd9', partPower:1.06, slots:{barrel:1, innerFrame:1, drone:3}, mult:{hp:1.02, defense:1.02, damage:.98, fireRate:1, speed:.98, xp:1.04, token:1.03} },
  { id:'om_ultima', name:'OM-99 アルティマ', role:'全拡張スロット機', cost:4200, color:'#ffd36a', partPower:1.00, slots:{barrel:3, innerFrame:3, drone:3}, mult:{hp:1.08, defense:1.06, damage:1.06, fireRate:1.05, speed:1.02, xp:1.02, token:1.02} }
];
const SHIP_BY_ID = Object.fromEntries(SHIP_DEFS.map(ship => [ship.id, ship]));
const DEFAULT_SHIP_ID = SHIP_DEFS[0].id;
const PART_TYPES = ['barrel', 'innerFrame', 'drone'];
const PART_TYPE_LABELS = {
  barrel: 'バレル',
  innerFrame: 'インナーフレーム',
  drone: 'ドローン'
};
const PART_DEFS = [
  { id:'barrel_pulse', type:'barrel', name:'パルスバレル', rarity:'標準', color:COLORS.cyan, text:'連射性能を少し上げる', buff:{fireRate:.035} },
  { id:'barrel_lance', type:'barrel', name:'ランスバレル', rarity:'火力', color:COLORS.rose, text:'弾丸ダメージを少し上げる', buff:{damage:.030} },
  { id:'barrel_vector', type:'barrel', name:'ベクターバレル', rarity:'制御', color:COLORS.violet, text:'弾速と射程を少し上げる', buff:{bulletSpeed:.025, range:.020} },
  { id:'frame_vital', type:'innerFrame', name:'バイタルフレーム', rarity:'耐久', color:0xff6b93, text:'最大HPを上げる', buff:{hp:.045} },
  { id:'frame_aegis', type:'innerFrame', name:'イージスフレーム', rarity:'防御', color:'#d8e2ea', text:'被ダメージを軽減する', buff:{defense:.030} },
  { id:'frame_gyro', type:'innerFrame', name:'ジャイロフレーム', rarity:'機動', color:COLORS.jade, text:'移動と回避を少し上げる', buff:{speed:.025, evasion:.012} },
  { id:'drone_scout', type:'drone', name:'スカウトドローン', rarity:'探索', color:COLORS.jade, text:'XP取得を少し上げる', buff:{xp:.035} },
  { id:'drone_cargo', type:'drone', name:'カーゴドローン', rarity:'回収', color:COLORS.gold, text:'トークン取得を少し上げる', buff:{token:.030} },
  { id:'drone_strike', type:'drone', name:'ストライクドローン', rarity:'攻撃', color:COLORS.rose, text:'弾丸ダメージを少し上げる', buff:{damage:.025} }
];
const PART_BY_ID = Object.fromEntries(PART_DEFS.map(part => [part.id, part]));

const GACHA_COST = 120;
const COSMETIC_RARITIES = [
  { id:'common', name:'コモン', weight:520, refund:12, buff:.0010, color:'#d8e2ea' },
  { id:'uncommon', name:'アンコモン', weight:280, refund:18, buff:.0016, color:'#9dffd9' },
  { id:'rare', name:'レア', weight:135, refund:28, buff:.0024, color:'#8eefff' },
  { id:'sr', name:'SR', weight:48, refund:45, buff:.0036, color:'#b8a7ff' },
  { id:'ssr', name:'SSR', weight:15, refund:80, buff:.0052, color:'#d8e2ea' },
  { id:'legend', name:'レジェンド', weight:2, refund:150, buff:.0072, color:'#ff7a3d' }
];
const COSMETIC_RARITY_BY_ID = Object.fromEntries(COSMETIC_RARITIES.map(rarity => [rarity.id, rarity]));
const COSMETIC_TYPE_LABELS = {
  bulletSkin: '弾スキン',
  armorSkin: '装甲スキン',
  shipCoat: 'クロマコート'
};
const COSMETIC_BUFF_LABELS = {
  damage: '弾ダメージ',
  bulletSpeed: '弾速',
  hp: 'HP',
  defense: '防御',
  token: 'トークン',
  xp: 'XP',
  crit: 'クリ率',
  fireRate: '連射',
  range: '射程',
  speed: '機動',
  evasion: '回避'
};
const COSMETIC_ITEMS = [
  { id:'bullet_aqua', type:'bulletSkin', rarity:'common', name:'アクアボルト', colors:{ shot:0x9cf5ff, glow:0x1ed6ff }, buff:{ bulletSpeed:.0010 } },
  { id:'bullet_lime', type:'bulletSkin', rarity:'common', name:'ライムトレーサー', colors:{ shot:0xc8ffd4, glow:0x36f39b }, buff:{ xp:.0010 } },
  { id:'bullet_amber', type:'bulletSkin', rarity:'uncommon', name:'アンバーコア', colors:{ shot:0xffe0a3, glow:0xffd36a }, buff:{ damage:.0016 } },
  { id:'bullet_rose', type:'bulletSkin', rarity:'uncommon', name:'ローズニードル', colors:{ shot:0xff9aae, glow:0xff3b62 }, buff:{ crit:.0016 } },
  { id:'bullet_prism', type:'bulletSkin', rarity:'rare', name:'プリズムランス', colors:{ shot:0xf1fbff, glow:0xb8a7ff }, buff:{ damage:.0024 } },
  { id:'bullet_void', type:'bulletSkin', rarity:'sr', name:'ヴォイドパルス', colors:{ shot:0xb8a7ff, glow:0x673dff }, buff:{ bulletSpeed:.0036 } },
  { id:'bullet_solar', type:'bulletSkin', rarity:'ssr', name:'ソーラーフレア', colors:{ shot:0xfff0b8, glow:0xff7a3d }, buff:{ damage:.0052 } },
  { id:'bullet_aurora', type:'bulletSkin', rarity:'legend', name:'オーロラシグナル', colors:{ shot:0xffffff, glow:0x36f39b }, buff:{ damage:.0040, bulletSpeed:.0032 } },
  { id:'armor_slate', type:'armorSkin', rarity:'common', name:'スレート装甲', colors:{ plate:0xd8e2ea, panel:0x263546 }, buff:{ hp:.0010 } },
  { id:'armor_mint', type:'armorSkin', rarity:'common', name:'ミントシールド', colors:{ plate:0xdaf8ef, panel:0x16382f }, buff:{ defense:.0010 } },
  { id:'armor_cobalt', type:'armorSkin', rarity:'uncommon', name:'コバルト装甲', colors:{ plate:0xdcecff, panel:0x142b5c }, buff:{ hp:.0016 } },
  { id:'armor_crimson', type:'armorSkin', rarity:'uncommon', name:'クリムゾンガード', colors:{ plate:0xffdce4, panel:0x4c1726 }, buff:{ defense:.0016 } },
  { id:'armor_quartz', type:'armorSkin', rarity:'rare', name:'クォーツプレート', colors:{ plate:0xf7fbff, panel:0x33435a }, buff:{ hp:.0024 } },
  { id:'armor_nova', type:'armorSkin', rarity:'sr', name:'ノヴァシェル', colors:{ plate:0xffedd2, panel:0x513018 }, buff:{ defense:.0036 } },
  { id:'armor_seraph', type:'armorSkin', rarity:'ssr', name:'セラフアーマー', colors:{ plate:0xf7f3ff, panel:0x352859 }, buff:{ hp:.0052 } },
  { id:'armor_eclipse', type:'armorSkin', rarity:'legend', name:'エクリプス外殻', colors:{ plate:0xe8f0ff, panel:0x111a31 }, buff:{ hp:.0036, defense:.0036 } },
  { id:'coat_origin', type:'shipCoat', rarity:'common', name:'オリジンブルー', colors:{ hull:0x07111d, wing:0x132033, line:0x82d7ff }, buff:{ token:.0010 } },
  { id:'coat_forest', type:'shipCoat', rarity:'common', name:'フォレストライン', colors:{ hull:0x071813, wing:0x15342b, line:0x36f39b }, buff:{ xp:.0010 } },
  { id:'coat_sunset', type:'shipCoat', rarity:'uncommon', name:'サンセットコート', colors:{ hull:0x1e1110, wing:0x3a1d16, line:0xff7a3d }, buff:{ token:.0016 } },
  { id:'coat_glacier', type:'shipCoat', rarity:'uncommon', name:'グレイシャー', colors:{ hull:0x09151d, wing:0x173144, line:0x9cf5ff }, buff:{ bulletSpeed:.0016 } },
  { id:'coat_neon', type:'shipCoat', rarity:'rare', name:'ネオンストライプ', colors:{ hull:0x0a0e17, wing:0x201c42, line:0xb8a7ff }, buff:{ crit:.0024 } },
  { id:'coat_ember', type:'shipCoat', rarity:'sr', name:'エンバーコート', colors:{ hull:0x170d0b, wing:0x412018, line:0xffd36a }, buff:{ damage:.0036 } },
  { id:'coat_astral', type:'shipCoat', rarity:'ssr', name:'アストラルコート', colors:{ hull:0x0b0f1f, wing:0x18264a, line:0xf4fbff }, buff:{ xp:.0052 } },
  { id:'coat_legend', type:'shipCoat', rarity:'legend', name:'レジェンドクロマ', colors:{ hull:0x080a10, wing:0x2a173b, line:0xffd36a }, buff:{ token:.0036, damage:.0036 } }
];
const COSMETIC_BY_ID = Object.fromEntries(COSMETIC_ITEMS.map(item => [item.id, item]));
const DEFAULT_COSMETICS = {
  bulletSkin: 'bullet_aqua',
  armorSkin: 'armor_slate',
  shipCoat: 'coat_origin'
};
const DOUBLE_BARREL_OFFSETS = [
  [-.035, .035],
  [-.065, 0, .065],
  [-.095, -.032, .032, .095]
];
const SHOTGUN_OFFSETS = [-.18, -.09, 0, .09, .18];
const MULTISHOT_OFFSETS = [-.12, 0, .12];
let unlockedEnemyWave = 0;
let unlockedEnemyTypes = ENEMY_TYPES.slice(0, 1);

const state = {
  mode: 'home',
  wave: 1,
  waveTime: 0,
  score: 0,
  hp: 100,
  maxHp: 100,
  energy: 100,
  xp: 0,
  level: 1,
  skillPoints: 0,
  basicPoints: 0,
  basicPointMeter: 0,
  tokens: 0,
  runTokenGain: 0,
  runTime: 0,
  kills: 0,
  statLevels: freshStatMap(),
  homeUpgrades: freshHomeUpgradeMap(),
  specialUpgrades: freshSpecialUpgradeMap(),
  upgradeOptions: [],
  roll: 0,
  rollVel: 0,
  input: 0,
  keyboard: 0,
  pointer: 0,
  firing: 0,
  spawnTimer: 0,
  bossAlive: false,
  shake: 0,
  last: 0,
  highScore: 0,
  bestWave: 1,
  garage: freshGarageState(),
  cosmetics: freshCosmeticState(),
  lastGacha: null,
  nextHudAt: 0
};

const save = loadSave();
state.highScore = save.highScore;
state.bestWave = save.bestWave;
state.tokens = save.tokens;
state.homeUpgrades = {...freshHomeUpgradeMap(), ...save.homeUpgrades};
state.garage = save.garage;
state.cosmetics = save.cosmetics;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: false,
  powerPreference: 'high-performance'
});
renderer.setClearColor(COLORS.bg, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x02040a, 120, 335);

const camera = new THREE.PerspectiveCamera(64, W / H, 0.1, 340);
camera.position.set(0, CAMERA_BASE_Y, CAMERA_BASE_Z);
camera.lookAt(0, CAMERA_LOOK_Y, CAMERA_LOOK_Z);

const world = new THREE.Group();
const pipeRoot = new THREE.Group();
const enemyRoot = new THREE.Group();
const bulletRoot = new THREE.Group();
const particleRoot = new THREE.Group();
world.add(pipeRoot, enemyRoot, bulletRoot, particleRoot);
scene.add(world);

const ambient = new THREE.AmbientLight(0x557799, 1.25);
scene.add(ambient);
const keyLight = new THREE.PointLight(0x1ed6ff, 13, 42, 2);
keyLight.position.set(0, -2, 6);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0xff3b62, 9, 60, 2);
rimLight.position.set(-6, 4, -18);
scene.add(rimLight);

const shared = makeSharedAssets();
const bulletMesh = makeBulletMesh();
bulletRoot.add(bulletMesh);
const particleMesh = makeParticleMesh();
particleRoot.add(particleMesh);
const stage = makeStage();
const player = makePlayer();
scene.add(player.root);
const homeShip = makeHomePreviewShip();
scene.add(homeShip.root);
applyCosmetics();

const enemies = [];
const bullets = [];
const particles = [];
const enemyPools = new Map();
const bulletDummy = new THREE.Object3D();
const particleDummy = new THREE.Object3D();
const particleColor = new THREE.Color();
const enemyFlashColor = new THREE.Color(0xffffff);
const cameraHomeTarget = new THREE.Vector3();
let ringPhase = 0;
let uiDirty = true;
let activePointer = null;
let canvas3dActive = false;
let bulletsDirty = true;
let particlesDirty = true;
let cosmeticBuffCache = null;
const hudCache = {};

const ui = createUi();
resize();
renderUi2();
syncCanvasVisibility();
bindInput();
requestAnimationFrame(loop);

function freshStatMap(){
  return Object.fromEntries(Object.keys(HOME_UPGRADE_DEFS).map(id => [id, 0]));
}

function freshHomeUpgradeMap(){
  return Object.fromEntries(Object.keys(HOME_UPGRADE_DEFS).map(id => [id, 0]));
}

function freshSpecialUpgradeMap(){
  return Object.fromEntries(SPECIAL_UPGRADE_DEFS.map(def => [def.id, 0]));
}

function freshEquippedParts(){
  return Object.fromEntries(PART_TYPES.map(type => [type, Array(3).fill(null)]));
}

function freshGarageState(){
  return {
    ownedShips: {[DEFAULT_SHIP_ID]: 1},
    selectedShipId: DEFAULT_SHIP_ID,
    ownedParts: Object.fromEntries(PART_DEFS.map(part => [part.id, 1])),
    equippedParts: freshEquippedParts()
  };
}

function normalizeGarageState(raw){
  const base = freshGarageState();
  const ownedShips = {...base.ownedShips, ...(raw?.ownedShips || {})};
  let selectedShipId = SHIP_BY_ID[raw?.selectedShipId] && ownedShips[raw.selectedShipId] ? raw.selectedShipId : DEFAULT_SHIP_ID;
  ownedShips[DEFAULT_SHIP_ID] = 1;
  if(!ownedShips[selectedShipId]) selectedShipId = DEFAULT_SHIP_ID;

  const ownedParts = {...base.ownedParts, ...(raw?.ownedParts || {})};
  for(const part of PART_DEFS) ownedParts[part.id] = Math.max(1, Number(ownedParts[part.id]) || 1);

  const equippedParts = freshEquippedParts();
  for(const type of PART_TYPES){
    const source = Array.isArray(raw?.equippedParts?.[type]) ? raw.equippedParts[type] : [];
    const seen = new Set();
    for(let i=0;i<3;i++){
      const id = source[i];
      const part = PART_BY_ID[id];
      if(!part || part.type !== type || !ownedParts[id] || seen.has(id)) continue;
      equippedParts[type][i] = id;
      seen.add(id);
    }
  }
  return {ownedShips, selectedShipId, ownedParts, equippedParts};
}

function freshCosmeticState(){
  return {
    owned: Object.fromEntries(Object.values(DEFAULT_COSMETICS).map(id => [id, 1])),
    equipped: {...DEFAULT_COSMETICS}
  };
}

function normalizeCosmeticState(raw){
  const base = freshCosmeticState();
  const owned = {...base.owned, ...(raw?.owned || {})};
  const equipped = {...base.equipped};
  for(const type of Object.keys(DEFAULT_COSMETICS)){
    const id = raw?.equipped?.[type];
    equipped[type] = COSMETIC_BY_ID[id]?.type === type && owned[id] ? id : DEFAULT_COSMETICS[type];
    owned[equipped[type]] = Math.max(1, Number(owned[equipped[type]]) || 1);
  }
  return {owned, equipped};
}

function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return {highScore:0,bestWave:1,tokens:START_TOKENS,homeUpgrades:freshHomeUpgradeMap(),garage:freshGarageState(),cosmetics:freshCosmeticState()};
    const parsed = JSON.parse(raw);
    return {
      highScore: Math.max(0, Number(parsed.highScore) || 0),
      bestWave: Math.max(1, Number(parsed.bestWave) || 1),
      tokens: Math.max(0, parsed.tokens == null ? START_TOKENS : Number(parsed.tokens) || 0),
      homeUpgrades: {...freshHomeUpgradeMap(), ...(parsed.homeUpgrades || {})},
      garage: normalizeGarageState(parsed.garage),
      cosmetics: normalizeCosmeticState(parsed.cosmetics)
    };
  }catch{
    return {highScore:0,bestWave:1,tokens:START_TOKENS,homeUpgrades:freshHomeUpgradeMap(),garage:freshGarageState(),cosmetics:freshCosmeticState()};
  }
}

function saveProgress(){
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    highScore: state.highScore,
    bestWave: state.bestWave,
    tokens: state.tokens,
    homeUpgrades: state.homeUpgrades,
    garage: state.garage,
    cosmetics: state.cosmetics
  }));
}

function saveRun(){
  state.runTokenGain = calculateTokenReward();
  state.tokens += state.runTokenGain;
  state.highScore = Math.max(state.highScore, state.score);
  state.bestWave = Math.max(state.bestWave, state.wave);
  upsertScore({
    playerId: 'local:guest',
    name: 'GUEST',
    score: state.score,
    wave: state.wave
  });
  saveProgress();
}

function statDef(id){
  return HOME_UPGRADE_DEFS[id] || BASIC_STAT_DEFS.find(d => d.id === id) || BASIC_STAT_DEFS[0];
}

function homeUpgradeDef(id){
  return HOME_UPGRADE_DEFS[id] || HOME_UPGRADE_DEFS.fireRate;
}

function homeUpgradeLevel(id){
  const lv = Math.max(0, Math.floor(Number(state.homeUpgrades?.[id]) || 0));
  return homeUpgradeDef(id).tier === 'base' ? Math.min(HOME_UPGRADE_CAP, lv) : lv;
}

function isHomeUpgradeUnlocked(id){
  const def = homeUpgradeDef(id);
  return !def.parent || homeUpgradeLevel(def.parent) >= HOME_UPGRADE_CAP;
}

function isHomeUpgradeMaxed(id){
  const def = homeUpgradeDef(id);
  return def.tier === 'base' && homeUpgradeLevel(id) >= HOME_UPGRADE_CAP;
}

function runBasicLevel(id){
  const lv = Math.max(0, Math.floor(Number(state.statLevels?.[id]) || 0));
  return homeUpgradeDef(id).tier === 'base' ? Math.min(HOME_UPGRADE_CAP, lv) : lv;
}

function isRunBasicUnlocked(id){
  const def = homeUpgradeDef(id);
  return !def.parent || runBasicLevel(def.parent) >= HOME_UPGRADE_CAP;
}

function isRunBasicMaxed(id){
  const def = homeUpgradeDef(id);
  return def.tier === 'base' && runBasicLevel(id) >= HOME_UPGRADE_CAP;
}

function statLevel(id){
  return Math.max(0, Number(state.statLevels[id]) || 0) + homeUpgradeLevel(id);
}

function specialUpgradeDef(id){
  return SPECIAL_UPGRADE_DEFS_BY_ID[id];
}

function specialUpgradeLevel(id){
  return Math.max(0, Math.floor(Number(state.specialUpgrades?.[id]) || 0));
}

function selectedSpecialInFamily(family){
  return SPECIAL_UPGRADE_DEFS.find(def => def.family === family && specialUpgradeLevel(def.id) > 0)?.id || null;
}

function canOfferSpecialUpgrade(id){
  const def = specialUpgradeDef(id);
  if(!def) return false;
  if(specialUpgradeLevel(id) >= def.max) return false;
  const selected = selectedSpecialInFamily(def.family);
  return !selected || selected === id;
}

function runUpgradeDef(id){
  return specialUpgradeDef(id) || statDef(id);
}

function runUpgradeLevel(id){
  return specialUpgradeDef(id) ? specialUpgradeLevel(id) : Math.max(0, Number(state.statLevels[id]) || 0);
}

function barrelFireBoost(){
  if(specialUpgradeLevel('barrelGatling') > 0) return 3.15;
  if(specialUpgradeLevel('barrelSniper') > 0) return .42;
  if(specialUpgradeLevel('barrelShotgun') > 0) return .74;
  if(specialUpgradeLevel('barrelMultishot') > 0) return .90;
  if(specialUpgradeLevel('barrelDouble') > 0) return .96;
  return 1;
}

function currentShip(){
  return SHIP_BY_ID[state.garage?.selectedShipId] || SHIP_BY_ID[DEFAULT_SHIP_ID];
}

function shipOwned(id){
  return !!state.garage?.ownedShips?.[id];
}

function shipMult(key){
  return Number(currentShip().mult?.[key]) || 1;
}

function shipSlotCount(type, ship = currentShip()){
  return Math.max(0, Math.min(3, Math.floor(Number(ship.slots?.[type]) || 0)));
}

function loadoutBuff(key){
  const ship = currentShip();
  const power = Number(ship.partPower) || 1;
  let total = 0;
  for(const type of PART_TYPES){
    const slots = shipSlotCount(type, ship);
    const equipped = state.garage?.equippedParts?.[type] || [];
    for(let i=0;i<slots;i++){
      const part = PART_BY_ID[equipped[i]];
      if(part?.buff?.[key]) total += part.buff[key] * power;
    }
  }
  return Math.min(.24, total);
}

function loadoutMult(key){
  return shipMult(key) * (1 + loadoutBuff(key));
}

function refreshLoadoutVitals(){
  const before = state.maxHp || 100;
  const next = hpMax();
  state.maxHp = next;
  if(state.mode === 'play'){
    state.hp = Math.min(next, state.hp + Math.max(0, next - before));
  }else{
    state.hp = Math.min(next, state.hp || next);
  }
}

function cosmeticBuff(key){
  if(!cosmeticBuffCache){
    cosmeticBuffCache = {};
    for(const id of Object.keys(state.cosmetics?.owned || {})){
      const item = COSMETIC_BY_ID[id];
      if(!item?.buff) continue;
      for(const [buffKey, value] of Object.entries(item.buff)){
        cosmeticBuffCache[buffKey] = (cosmeticBuffCache[buffKey] || 0) + value;
      }
    }
  }
  const cap = key === 'hp' || key === 'defense' ? .05 : .035;
  return Math.min(cap, cosmeticBuffCache[key] || 0);
}

function statMult(id, step = .08){
  return Math.pow(1 + step, statLevel(id));
}

function hpMax(){
  return Math.round((100 + statLevel('hp') * 18) * (1 + cosmeticBuff('hp')) * loadoutMult('hp'));
}

function regenPerSecond(){
  return statLevel('regen') * .45;
}

function evasionChance(){
  return Math.min(.62, 1 - Math.pow(.96, statLevel('evasion')) + loadoutBuff('evasion'));
}

function defenseMultiplier(){
  return Math.max(.45, (1 - statLevel('defense') * .035 - cosmeticBuff('defense') - loadoutBuff('defense')) / shipMult('defense'));
}

function critChance(){
  return Math.min(.55, statLevel('critChance') * .03);
}

function critDamageMult(){
  return 1.5 + statLevel('critDamage') * .10;
}

function bulletSpeedDamageMult(){
  return 1 + statLevel('bulletSpeed') * .035 + cosmeticBuff('bulletSpeed') + loadoutBuff('bulletSpeed');
}

function tokenRewardMult(){
  return (1 + statLevel('tokenMult') * .08 + cosmeticBuff('token') + loadoutBuff('token')) * shipMult('token');
}

function collisionDamageAmount(enemy){
  const lv = statLevel('collisionDamage');
  if(lv <= 0) return 0;
  const bossScale = enemy?.boss ? .45 : 1;
  return Math.ceil((12 + state.wave * 1.6) * Math.pow(1.12, lv) * bossScale);
}

function xpThreshold(){
  return Math.floor(XP_BASE * Math.pow(1.55, state.level - 1));
}

function homeUpgradeCost(id){
  const def = homeUpgradeDef(id);
  const lv = homeUpgradeLevel(id);
  if(def.tier === 'base'){
    if(lv >= HOME_UPGRADE_CAP) return Infinity;
    return Math.floor(30 * Math.pow(1.34, lv));
  }
  return Math.floor(90 * Math.pow(1.24, lv));
}

function runBasicUpgradeCost(id){
  const def = homeUpgradeDef(id);
  const lv = runBasicLevel(id);
  if(def.tier === 'base'){
    return lv >= HOME_UPGRADE_CAP ? Infinity : 1;
  }
  return 2 + Math.floor(lv / 6);
}

function calculateTokenReward(){
  const scoreBonus = Math.floor(state.score / TOKEN_SCORE_UNIT);
  const waveBonus = Math.max(0, state.wave - 1) * TOKEN_WAVE_BONUS;
  const killBonus = Math.floor(state.kills * TOKEN_KILL_BONUS);
  const timeBonus = Math.floor(state.runTime * TOKEN_TIME_BONUS);
  return Math.max(0, Math.floor((scoreBonus + waveBonus + killBonus + timeBonus) * tokenRewardMult()));
}

function grantXp(amount){
  grantBasicPoints(amount);
  const gain = Math.max(1, Math.ceil(amount * statMult('xpMult', .10) * (1 + cosmeticBuff('xp') + loadoutBuff('xp')) * shipMult('xp')));
  state.xp += gain;
  let leveled = false;
  while(state.xp >= xpThreshold()){
    state.xp -= xpThreshold();
    state.level++;
    state.skillPoints++;
    leveled = true;
  }
  if(leveled && state.mode === 'play') openLevelUp();
}

function grantBasicPoints(amount){
  state.basicPointMeter += Math.max(0, Number(amount) || 0);
  while(state.basicPointMeter >= BASIC_POINT_UNIT){
    state.basicPointMeter -= BASIC_POINT_UNIT;
    state.basicPoints++;
  }
}

function rollUpgradeOptions(){
  const candidates = SPECIAL_UPGRADE_DEFS
    .filter(def => canOfferSpecialUpgrade(def.id))
    .map(def => def.id);
  const options = [];
  while(options.length < 3 && candidates.length){
    const index = Math.floor(Math.random() * candidates.length);
    options.push(candidates[index]);
    candidates[index] = candidates[candidates.length - 1];
    candidates.pop();
  }
  return options;
}

function openLevelUp(){
  if(activePointer !== null) canvas.releasePointerCapture?.(activePointer);
  activePointer = null;
  state.pointer = 0;
  state.rollVel *= .35;
  state.upgradeOptions = rollUpgradeOptions();
  if(!state.upgradeOptions.length) return;
  setMode('levelup');
}

function applyRunUpgrade(id){
  if(state.skillPoints <= 0) return;
  const specialDef = specialUpgradeDef(id);
  if(!specialDef || !canOfferSpecialUpgrade(id)) return;
  state.specialUpgrades[id] = Math.min(specialDef.max, specialUpgradeLevel(id) + 1);
  state.skillPoints--;
  if(state.skillPoints > 0){
    state.upgradeOptions = rollUpgradeOptions();
    if(state.upgradeOptions.length){
      renderUi2();
    }else{
      setMode('play');
    }
  }else{
    state.upgradeOptions = [];
    setMode('play');
  }
}

function buyRunBasicUpgrade(id){
  if(!HOME_UPGRADE_DEFS[id] || !isRunBasicUnlocked(id) || isRunBasicMaxed(id)) return;
  const cost = runBasicUpgradeCost(id);
  if(!Number.isFinite(cost) || state.basicPoints < cost) return;
  const beforeMax = state.maxHp;
  state.basicPoints -= cost;
  state.statLevels[id] = runBasicLevel(id) + 1;
  if(id === 'hp'){
    state.maxHp = hpMax();
    state.hp = Math.min(state.maxHp, state.hp + Math.max(0, state.maxHp - beforeMax) + 18);
  }
  renderUi2();
}

function buyHomeUpgrade(id){
  if(!isHomeUpgradeUnlocked(id) || isHomeUpgradeMaxed(id)) return;
  const cost = homeUpgradeCost(id);
  if(!Number.isFinite(cost) || state.tokens < cost) return;
  state.tokens -= cost;
  state.homeUpgrades[id] = homeUpgradeLevel(id) + 1;
  state.maxHp = hpMax();
  state.hp = Math.min(state.maxHp, state.hp || state.maxHp);
  saveProgress();
  renderUi2();
}

function buyShip(id){
  const ship = SHIP_BY_ID[id];
  if(!ship) return;
  if(shipOwned(id)){
    equipShip(id);
    return;
  }
  if(state.tokens < ship.cost) return;
  state.tokens -= ship.cost;
  state.garage.ownedShips[id] = 1;
  state.garage.selectedShipId = id;
  refreshLoadoutVitals();
  saveProgress();
  renderUi2();
}

function equipShip(id){
  if(!SHIP_BY_ID[id] || !shipOwned(id)) return;
  state.garage.selectedShipId = id;
  refreshLoadoutVitals();
  saveProgress();
  applyCosmetics();
  renderUi2();
}

function equipPart(type, index, id){
  if(!PART_TYPES.includes(type)) return;
  const slot = Math.max(0, Math.floor(Number(index) || 0));
  if(slot >= shipSlotCount(type)) return;
  const equipped = state.garage.equippedParts[type] || Array(3).fill(null);
  state.garage.equippedParts[type] = equipped;
  if(!id || id === 'none'){
    equipped[slot] = null;
  }else{
    const part = PART_BY_ID[id];
    if(!part || part.type !== type || !state.garage.ownedParts[id]) return;
    for(let i=0;i<equipped.length;i++){
      if(equipped[i] === id) equipped[i] = null;
    }
    equipped[slot] = id;
  }
  refreshLoadoutVitals();
  saveProgress();
  renderUi2();
}

function cosmeticItem(id){
  return COSMETIC_BY_ID[id];
}

function equippedCosmetic(type){
  return cosmeticItem(state.cosmetics?.equipped?.[type] || DEFAULT_COSMETICS[type]) || cosmeticItem(DEFAULT_COSMETICS[type]);
}

function rollGachaItem(){
  const total = COSMETIC_RARITIES.reduce((sum, rarity) => sum + rarity.weight, 0);
  let roll = Math.random() * total;
  const rarity = COSMETIC_RARITIES.find(r => (roll -= r.weight) <= 0) || COSMETIC_RARITIES[0];
  const pool = COSMETIC_ITEMS.filter(item => item.rarity === rarity.id);
  return pool[Math.floor(Math.random() * pool.length)] || COSMETIC_ITEMS[0];
}

function rollGacha(){
  if(state.tokens < GACHA_COST) return;
  state.tokens -= GACHA_COST;
  const item = rollGachaItem();
  const ownedCount = Number(state.cosmetics.owned[item.id]) || 0;
  const duplicate = ownedCount > 0;
  state.cosmetics.owned[item.id] = ownedCount + 1;
  if(!state.cosmetics.equipped[item.type]) state.cosmetics.equipped[item.type] = item.id;
  if(duplicate){
    state.tokens += COSMETIC_RARITY_BY_ID[item.rarity].refund;
  }
  cosmeticBuffCache = null;
  state.lastGacha = {id:item.id, duplicate};
  saveProgress();
  applyCosmetics();
  renderUi2();
}

function equipCosmetic(id){
  const item = cosmeticItem(id);
  if(!item || !state.cosmetics.owned[id]) return;
  state.cosmetics.equipped[item.type] = id;
  saveProgress();
  applyCosmetics();
  renderUi2();
}

function applyColor(material, color){
  if(material?.color) material.color.setHex(color);
}

function applyLineColor(material, color){
  if(material?.color) material.color.setHex(color);
}

function applyCosmetics(){
  if(!shared?.materials) return;
  const bullet = equippedCosmetic('bulletSkin');
  const armor = equippedCosmetic('armorSkin');
  const coat = equippedCosmetic('shipCoat');

  applyColor(shared.materials.shot, bullet.colors.shot);
  applyColor(shared.materials.shotGlow, bullet.colors.glow);
  applyColor(shared.materials.playerPlate, armor.colors.plate);
  applyColor(shared.materials.playerPanel, armor.colors.panel);
  applyColor(shared.materials.player, coat.colors.hull);
  applyColor(shared.materials.playerWing, coat.colors.wing);
  applyLineColor(shared.materials.playerEdge, coat.colors.line);
  applyLineColor(shared.materials.railCyan, coat.colors.line);

  if(homeShip?.materials){
    applyColor(homeShip.materials.hull, coat.colors.hull);
    applyColor(homeShip.materials.wing || homeShip.materials.hull, coat.colors.wing);
    applyColor(homeShip.materials.plate, armor.colors.plate);
    applyColor(homeShip.materials.panel, armor.colors.panel);
    applyColor(homeShip.materials.core, bullet.colors.glow);
    applyColor(homeShip.materials.glass, bullet.colors.shot);
    applyLineColor(homeShip.materials.edge, coat.colors.line);
  }
}

function makeSharedAssets(){
  const materials = {
    pipe: new THREE.MeshBasicMaterial({ color:0x07111f, side:THREE.DoubleSide, transparent:true, opacity:.86, depthWrite:false }),
    pipeSide: new THREE.MeshBasicMaterial({ color:0x102533, side:THREE.DoubleSide, transparent:true, opacity:.34, depthWrite:false }),
    railCyan: new THREE.LineBasicMaterial({ color:0x1ed6ff, transparent:true, opacity:.42 }),
    railRose: new THREE.LineBasicMaterial({ color:0xff3b62, transparent:true, opacity:.30 }),
    ring: new THREE.LineBasicMaterial({ color:0x82d7ff, transparent:true, opacity:.28 }),
    ringHot: new THREE.LineBasicMaterial({ color:0xffd36a, transparent:true, opacity:.46 }),
    shot: new THREE.MeshBasicMaterial({ color:0x9cf5ff }),
    shotGlow: new THREE.MeshBasicMaterial({ color:0x1ed6ff, transparent:true, opacity:.32 }),
    particle: new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:.58, depthWrite:false, fog:false, vertexColors:true }),
    player: new THREE.MeshStandardMaterial({ color:0x07111d, metalness:.78, roughness:.24, emissive:0x082f44, emissiveIntensity:.70 }),
    playerPlate: new THREE.MeshStandardMaterial({ color:0xf1f6f8, metalness:.62, roughness:.18, emissive:0x182d3a, emissiveIntensity:.46 }),
    playerPanel: new THREE.MeshStandardMaterial({ color:0x18283a, metalness:.70, roughness:.22, emissive:0x0a4155, emissiveIntensity:.42 }),
    playerGlass: new THREE.MeshStandardMaterial({ color:0x9cf5ff, metalness:.18, roughness:.08, emissive:0x1ed6ff, emissiveIntensity:1.38, transparent:true, opacity:.82 }),
    playerCore: new THREE.MeshBasicMaterial({ color:0x1ed6ff }),
    playerWing: new THREE.MeshStandardMaterial({ color:0x132033, metalness:.64, roughness:.24, emissive:0x0a4960, emissiveIntensity:.52 }),
    playerGold: new THREE.MeshBasicMaterial({ color:0xffd36a, transparent:true, opacity:.92 }),
    playerRose: new THREE.MeshBasicMaterial({ color:0xff3b62, transparent:true, opacity:.82 }),
    playerEdge: new THREE.LineBasicMaterial({ color:0x82d7ff, transparent:true, opacity:.72 }),
    playerGoldLine: new THREE.LineBasicMaterial({ color:0xffd36a, transparent:true, opacity:.70 }),
    playerRoseLine: new THREE.LineBasicMaterial({ color:0xff3b62, transparent:true, opacity:.62 }),
    enemyArmor: new THREE.MeshStandardMaterial({ color:0x08111d, metalness:.76, roughness:.24, emissive:0x071421, emissiveIntensity:.55, fog:false }),
    enemyArmorLight: new THREE.MeshStandardMaterial({ color:0xf4fbff, metalness:.42, roughness:.20, emissive:0x28465c, emissiveIntensity:.36, fog:false }),
    bossSight: new THREE.LineBasicMaterial({ color:0xffd36a, transparent:true, opacity:.72, fog:false, depthTest:false })
  };
  const enemyMaterials = new Map();
  const edgeMaterials = new Map();
  const coreMaterials = new Map();
  const glowMaterials = new Map();
  for(const t of ENEMY_TYPES){
    enemyMaterials.set(t.id, new THREE.MeshStandardMaterial({
      color:t.color,
      metalness:.26,
      roughness:.28,
      emissive:t.color,
      emissiveIntensity:.72,
      transparent:true,
      opacity:.92,
      fog:false
    }));
    edgeMaterials.set(t.id, new THREE.LineBasicMaterial({
      color:t.color,
      transparent:true,
      opacity:.82,
      depthTest:false,
      fog:false
    }));
    coreMaterials.set(t.id, new THREE.MeshBasicMaterial({
      color:t.color,
      fog:false
    }));
    glowMaterials.set(t.id, new THREE.MeshBasicMaterial({
      color:t.color,
      transparent:true,
      opacity:.40,
      depthTest:false,
      depthWrite:false,
      fog:false
    }));
  }
  enemyMaterials.set('boss', new THREE.MeshStandardMaterial({
    color:0xff3b62,
    metalness:.34,
    roughness:.24,
    emissive:0xff1f5c,
    emissiveIntensity:1.28,
    fog:false
  }));
  edgeMaterials.set('boss', new THREE.LineBasicMaterial({ color:0xffd36a, transparent:true, opacity:.95, depthTest:false, fog:false }));
  coreMaterials.set('boss', new THREE.MeshBasicMaterial({ color:0xffd36a, fog:false }));
  glowMaterials.set('boss', new THREE.MeshBasicMaterial({ color:0xff3b62, transparent:true, opacity:.46, depthTest:false, depthWrite:false, fog:false }));

  const geometries = {
    shot: new THREE.SphereGeometry(.095, 8, 5),
    engineFlare: new THREE.SphereGeometry(.20, 10, 6),
    particle: new THREE.SphereGeometry(.050, 5, 4),
    enemyCore: new THREE.SphereGeometry(.24, 9, 6),
    enemyGlow: new THREE.SphereGeometry(.52, 9, 6),
    enemyBlade: new THREE.BoxGeometry(.13, .58, .14),
    enemySpike: new THREE.ConeGeometry(.13, .48, 3, 1),
    enemyRing: makeRingCircleGeometry(1, LOW_POWER_DEVICE ? 28 : 36),
    bossBlade: new THREE.BoxGeometry(.26, 1.18, .18),
    bossCore: new THREE.OctahedronGeometry(.58, 0),
    orb: new THREE.IcosahedronGeometry(.55, 1),
    tri: new THREE.ConeGeometry(.62, .92, 3, 1),
    quad: new THREE.BoxGeometry(.86, .86, .86),
    penta: new THREE.CylinderGeometry(.58, .58, .72, 5, 1),
    hexa: new THREE.CylinderGeometry(.60, .60, .78, 6, 1),
    boss: new THREE.ConeGeometry(1.45, 2.15, 3, 2)
  };
  const edgeGeometries = new Map();
  for(const [id, geometry] of Object.entries(geometries)){
    if(['orb','tri','quad','penta','hexa','boss'].includes(id)){
      edgeGeometries.set(id, new THREE.EdgesGeometry(geometry, 18));
    }
  }
  return {materials, enemyMaterials, edgeMaterials, coreMaterials, glowMaterials, geometries, edgeGeometries};
}

function makeBulletMesh(){
  const mesh = new THREE.InstancedMesh(shared.geometries.shot, shared.materials.shot, MAX_BULLETS);
  mesh.count = 0;
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return mesh;
}

function makeParticleMesh(){
  const mesh = new THREE.InstancedMesh(shared.geometries.particle, shared.materials.particle, MAX_PARTICLES);
  mesh.count = 0;
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return mesh;
}

function makeStage(){
  const vanishingDust = makeVanishingStarLayer(Math.floor(VANISH_STAR_COUNT * .62), 0x9fdcff, .052, .36, 5.2, .045, .8);
  const vanishingPins = makeVanishingStarLayer(Math.floor(VANISH_STAR_COUNT * .38), 0xf4fbff, .086, .58, 7.4, .090, 2.7, true);
  const farDust = makeStarLayer(Math.floor(SPACE_STAR_COUNT * .58), 34, 76, -330, 26, 0x7da8c6, .030, .24, 4.2, .018, .3);
  const farPins = makeStarLayer(Math.floor(SPACE_STAR_COUNT * .45), 24, 66, -315, 20, 0xd8f2ff, .052, .48, 5.8, .028, 1.7);
  const midBlue = makeStarLayer(Math.floor(SPACE_STAR_COUNT * .28), 16, 50, -286, 14, 0x8fefff, .078, .52, 8.4, .045, 3.2);
  const nearWhite = makeStarLayer(Math.floor(SPACE_STAR_COUNT * .18), 9, 36, -230, 8, 0xf4fbff, .138, .64, 12.6, .070, 5.0);
  const glints = makeStarLayer(Math.max(14, Math.floor(SPACE_STAR_COUNT * .065)), 8, 28, -205, 4, 0xffffff, .215, .78, 15.8, .15, 7.4, true);
  const amberDust = makeStarLayer(SPACE_DUST_COUNT, 18, 60, -305, 4, 0xffd36a, .085, .22, 6.9, .05, 9.0);
  const starLayers = [vanishingDust, vanishingPins, farDust, farPins, midBlue, nearWhite, glints, amberDust];
  for(const layer of starLayers) pipeRoot.add(layer);
  return {starLayers};
}

function makeVanishingStarLayer(count, color, size, opacity, scroll, twinkle = 0, phase = 0, additive = false){
  const layer = makeSpacePoints(count, .25, 7.6, -334, -78, color, size, opacity, {
    additive,
    axisY:true,
    radiusPower:1.85,
    yDrift:1.15
  });
  layer.userData.scroll = scroll;
  layer.userData.baseOpacity = opacity;
  layer.userData.twinkle = twinkle;
  layer.userData.phase = phase;
  return layer;
}

function makeStarLayer(count, radiusMin, radiusMax, zMin, zMax, color, size, opacity, scroll, twinkle = 0, phase = 0, additive = false){
  const layer = makeSpacePoints(count, radiusMin, radiusMax, zMin, zMax, color, size, opacity, {
    additive,
    radiusPower: additive ? 1.15 : .72,
    yDrift: additive ? 2.6 : 5.5
  });
  layer.userData.scroll = scroll;
  layer.userData.baseOpacity = opacity;
  layer.userData.twinkle = twinkle;
  layer.userData.phase = phase;
  return layer;
}


function makeSpacePoints(count, radiusMin, radiusMax, zMin, zMax, color, size, opacity, options = {}){
  const pos = new Float32Array(count * 3);
  const span = Math.max(1, zMax - zMin);
  const radiusPower = options.radiusPower ?? .72;
  const yDriftRange = options.yDrift ?? 5.5;
  const cameraSlopeY = (CAMERA_LOOK_Y - CAMERA_BASE_Y) / (CAMERA_LOOK_Z - CAMERA_BASE_Z);
  for(let i=0;i<count;i++){
    const a = Math.random() * TAU;
    const r = radiusMin + Math.pow(Math.random(), radiusPower) * (radiusMax - radiusMin);
    const yDrift = (Math.random() - .5) * yDriftRange;
    const z = zMin + Math.random() * span;
    const axisY = options.axisY ? CAMERA_BASE_Y + cameraSlopeY * (z - CAMERA_BASE_Z) : 0;
    pos[i*3] = Math.cos(a) * r;
    pos[i*3+1] = axisY + Math.sin(a) * r + yDrift;
    pos[i*3+2] = z;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({
    color,
    size,
    transparent:true,
    opacity,
    sizeAttenuation:true,
    depthWrite:false,
    fog:false,
    blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });
  const points = new THREE.Points(g, m);
  points.userData.loop = span;
  return points;
}

function makePlateGeometry(points, thickness = .08){
  const half = thickness / 2;
  const verts = [];
  for(const [x,z] of points) verts.push(x, half, z);
  for(const [x,z] of points) verts.push(x, -half, z);
  const indices = [];
  for(let i=1;i<points.length-1;i++) indices.push(0, i, i + 1);
  const offset = points.length;
  for(let i=1;i<points.length-1;i++) indices.push(offset, offset + i + 1, offset + i);
  for(let i=0;i<points.length;i++){
    const j = (i + 1) % points.length;
    indices.push(i, j, offset + i, j, offset + j, offset + i);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function addShipPlate(root, points, material, thickness = .08, edgeMaterial = shared.materials.playerEdge){
  const mesh = new THREE.Mesh(makePlateGeometry(points, thickness), material);
  root.add(mesh);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 16), edgeMaterial);
  root.add(edges);
  return mesh;
}

function makeShipLine(points, material, y = .07){
  const verts = points.map(([x,z]) => new THREE.Vector3(x, y, z));
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(verts), material);
}

function makePlayer(){
  const root = new THREE.Group();
  root.position.set(0, PLAYER_Y, PLAYER_Z);
  root.rotation.x = -.13;
  root.scale.setScalar(2.06);

  const mirrorPoints = points => points.map(([x, z]) => [-x, z]).reverse();

  const mainBody = addShipPlate(root, [
    [0, -1.34], [.18, -1.06], [.31, -.48], [.28, .34],
    [.15, .82], [0, 1.02], [-.15, .82], [-.28, .34],
    [-.31, -.48], [-.18, -1.06]
  ], shared.materials.player, .14);

  const nose = addShipPlate(root, [
    [0, -1.58], [.105, -1.20], [.075, -.72], [0, -.56], [-.075, -.72], [-.105, -1.20]
  ], shared.materials.playerPlate, .075, shared.materials.playerGoldLine);
  nose.position.y = .06;

  const topArmor = addShipPlate(root, [
    [0, -.94], [.135, -.55], [.18, .28], [.08, .68],
    [0, .78], [-.08, .68], [-.18, .28], [-.135, -.55]
  ], shared.materials.playerPlate, .06, shared.materials.playerEdge);
  topArmor.position.y = .085;

  const canopy = addShipPlate(root, [
    [0, -.50], [.118, -.24], [.088, .06], [0, .20], [-.088, .06], [-.118, -.24]
  ], shared.materials.playerGlass, .045, shared.materials.playerEdge);
  canopy.position.y = .145;

  const canopyGlow = addShipPlate(root, [
    [0, -.44], [.070, -.20], [.052, -.02], [0, .09], [-.052, -.02], [-.070, -.20]
  ], shared.materials.playerCore, .026, shared.materials.playerEdge);
  canopyGlow.position.y = .184;

  const wingPoints = [
    [.19, -.42], [.98, -.05], [.90, .16], [.44, .36], [.25, .74], [.08, .56]
  ];
  const leftWing = addShipPlate(root, wingPoints, shared.materials.playerWing, .10);
  const rightWing = addShipPlate(root, mirrorPoints(wingPoints), shared.materials.playerWing, .10);

  const wingArmor = [
    [.34, -.07], [.78, .08], [.58, .22], [.34, .23]
  ];
  const leftWingArmor = addShipPlate(root, wingArmor, shared.materials.playerPlate, .045, shared.materials.playerGoldLine);
  const rightWingArmor = addShipPlate(root, mirrorPoints(wingArmor), shared.materials.playerPlate, .045, shared.materials.playerGoldLine);
  leftWingArmor.position.y = .08;
  rightWingArmor.position.y = .08;

  const intakePoints = [[.22,-.36],[.42,-.23],[.36,.02],[.18,-.04]];
  const leftIntake = addShipPlate(root, intakePoints, shared.materials.playerPanel, .038, shared.materials.playerEdge);
  const rightIntake = addShipPlate(root, mirrorPoints(intakePoints), shared.materials.playerPanel, .038, shared.materials.playerEdge);
  leftIntake.position.y = .135;
  rightIntake.position.y = .135;

  const shoulderPoints = [[.12,.26],[.31,.35],[.25,.68],[.07,.58]];
  const leftShoulder = addShipPlate(root, shoulderPoints, shared.materials.playerPanel, .050, shared.materials.playerRoseLine);
  const rightShoulder = addShipPlate(root, mirrorPoints(shoulderPoints), shared.materials.playerPanel, .050, shared.materials.playerRoseLine);
  leftShoulder.position.y = .125;
  rightShoulder.position.y = .125;

  const sidePodPoints = [[.30,.20],[.58,.30],[.56,.78],[.36,.90],[.23,.54]];
  addShipPlate(root, sidePodPoints, shared.materials.playerPlate, .08, shared.materials.playerGoldLine);
  addShipPlate(root, mirrorPoints(sidePodPoints), shared.materials.playerPlate, .08, shared.materials.playerGoldLine);

  const finPoints = [[.18,.70],[.34,1.04],[.16,.96],[.05,.76]];
  const leftFin = addShipPlate(root, finPoints, shared.materials.playerWing, .055, shared.materials.playerEdge);
  const rightFin = addShipPlate(root, mirrorPoints(finPoints), shared.materials.playerWing, .055, shared.materials.playerEdge);
  leftFin.position.y = .10;
  rightFin.position.y = .10;

  root.add(makeShipLine([[0,-1.44],[0,-.54],[0,.74]], shared.materials.playerRoseLine, .17));
  root.add(makeShipLine([[.13,-.74],[.24,-.30],[.20,.54]], shared.materials.playerGoldLine, .15));
  root.add(makeShipLine([[-.13,-.74],[-.24,-.30],[-.20,.54]], shared.materials.playerGoldLine, .15));
  root.add(makeShipLine([[.28,-.20],[.72,.06],[.48,.32],[.32,.66]], shared.materials.playerEdge, .13));
  root.add(makeShipLine([[-.28,-.20],[-.72,.06],[-.48,.32],[-.32,.66]], shared.materials.playerEdge, .13));
  root.add(makeShipLine([[.36,.40],[.52,.82]], shared.materials.playerGoldLine, .13));
  root.add(makeShipLine([[-.36,.40],[-.52,.82]], shared.materials.playerGoldLine, .13));
  root.add(makeShipLine([[.08,-1.18],[.17,-.88],[.13,-.58]], shared.materials.playerEdge, .19));
  root.add(makeShipLine([[-.08,-1.18],[-.17,-.88],[-.13,-.58]], shared.materials.playerEdge, .19));
  root.add(makeShipLine([[.48,-.02],[.82,.12]], shared.materials.playerRoseLine, .16));
  root.add(makeShipLine([[-.48,-.02],[-.82,.12]], shared.materials.playerRoseLine, .16));

  const core = new THREE.Mesh(new THREE.SphereGeometry(.155, 16, 10), shared.materials.playerCore);
  core.position.set(0, .22, -.16);
  root.add(core);

  const reactorHalo = new THREE.Line(makeRingCircleGeometry(.33, LOW_POWER_DEVICE ? 32 : 46), shared.materials.playerGoldLine);
  reactorHalo.rotation.x = Math.PI / 2;
  reactorHalo.position.set(0, .225, -.16);
  root.add(reactorHalo);

  const coreRing = new THREE.Line(makeRingCircleGeometry(.245, 40), shared.materials.playerEdge);
  coreRing.rotation.x = Math.PI / 2;
  coreRing.position.set(0, .235, -.16);
  root.add(coreRing);

  const spine = new THREE.Mesh(new THREE.BoxGeometry(.075, .045, 1.58), shared.materials.playerGold);
  spine.position.set(0, .17, -.10);
  root.add(spine);

  const engineGeo = new THREE.CylinderGeometry(.105, .165, .46, 12, 1);
  const engineNozzleGeo = new THREE.CylinderGeometry(.135, .095, .18, 12, 1);
  for(const x of [-.30,.30]){
    const engine = new THREE.Mesh(engineGeo, shared.materials.playerCore);
    engine.rotation.x = Math.PI / 2;
    engine.position.set(x, -.035, .80);
    root.add(engine);
    const nozzle = new THREE.Mesh(engineNozzleGeo, shared.materials.player);
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(x, -.035, 1.04);
    root.add(nozzle);
    const engineCowl = addShipPlate(root, [
      [x - Math.sign(x)*.12, .48], [x + Math.sign(x)*.14, .54],
      [x + Math.sign(x)*.16, .92], [x, 1.08], [x - Math.sign(x)*.13, .88]
    ], shared.materials.player, .07, shared.materials.playerEdge);
    engineCowl.position.y = -.01;
    const flare = new THREE.Mesh(shared.geometries.engineFlare, shared.materials.shotGlow);
    flare.position.set(x, -.035, 1.20);
    flare.scale.set(.78, .78, 1.18);
    root.add(flare);
  }

  const aura = new THREE.Line(makeRingCircleGeometry(.78, 56), shared.materials.railCyan);
  aura.rotation.x = Math.PI / 2;
  aura.position.z = .18;
  root.add(aura);

  return {root, body:mainBody, wings:leftWing, rightWing, core, aura, nose};
}

function makeHomePreviewShip(){
  const root = new THREE.Group();
  root.visible = false;
  const mirrorPoints = points => points.map(([x, z]) => [-x, z]).reverse();

  const materials = {
    hull: new THREE.MeshStandardMaterial({ color:0x0b1016, metalness:.72, roughness:.24, emissive:0x123040, emissiveIntensity:.86, side:THREE.DoubleSide, fog:false }),
    plate: new THREE.MeshBasicMaterial({ color:0xf2f6f7, side:THREE.DoubleSide, fog:false }),
    wing: new THREE.MeshStandardMaterial({ color:0x132033, metalness:.64, roughness:.22, emissive:0x0a4960, emissiveIntensity:.52, side:THREE.DoubleSide, fog:false }),
    panel: new THREE.MeshStandardMaterial({ color:0x18283a, metalness:.68, roughness:.22, emissive:0x0a4155, emissiveIntensity:.42, side:THREE.DoubleSide, fog:false }),
    core: new THREE.MeshBasicMaterial({ color:0x8eefff, fog:false }),
    glass: new THREE.MeshStandardMaterial({ color:0x9cf5ff, metalness:.18, roughness:.08, emissive:0x1ed6ff, emissiveIntensity:1.5, transparent:true, opacity:.82, fog:false }),
    edge: new THREE.LineBasicMaterial({ color:0x9ef5ff, transparent:true, opacity:.72, fog:false }),
    goldLine: new THREE.LineBasicMaterial({ color:0xd8e2ea, transparent:true, opacity:.70, fog:false }),
    roseLine: new THREE.LineBasicMaterial({ color:0x8eefff, transparent:true, opacity:.58, fog:false }),
    shadow: new THREE.MeshBasicMaterial({ color:0x071017, transparent:true, opacity:.28, depthWrite:false, fog:false })
  };

  const addPreviewPlate = (points, material, thickness = .10) => {
    const mesh = new THREE.Mesh(makePlateGeometry(points, thickness), material);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 16), materials.edge);
    root.add(mesh, edges);
    return mesh;
  };
  const addPreviewLine = (points, material = materials.edge, y = .16) => {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(([x, z]) => new THREE.Vector3(x, y, z))), material);
    root.add(line);
    return line;
  };

  addPreviewPlate([
    [0, -1.34], [.18, -1.06], [.31, -.48], [.28, .34],
    [.15, .82], [0, 1.02], [-.15, .82], [-.28, .34],
    [-.31, -.48], [-.18, -1.06]
  ], materials.hull, .17);
  addPreviewPlate([
    [0, -1.58], [.105, -1.20], [.075, -.72], [0, -.56], [-.075, -.72], [-.105, -1.20]
  ], materials.plate, .085);
  addPreviewPlate([
    [0, -.94], [.135, -.55], [.18, .28], [.08, .68],
    [0, .78], [-.08, .68], [-.18, .28], [-.135, -.55]
  ], materials.plate, .07);

  const wingPoints = [
    [.19, -.42], [.98, -.05], [.90, .16], [.44, .36], [.25, .74], [.08, .56]
  ];
  addPreviewPlate(wingPoints, materials.wing, .11);
  addPreviewPlate(mirrorPoints(wingPoints), materials.wing, .11);
  addPreviewPlate([[.22,-.36],[.42,-.23],[.36,.02],[.18,-.04]], materials.panel, .044).position.y = .13;
  addPreviewPlate(mirrorPoints([[.22,-.36],[.42,-.23],[.36,.02],[.18,-.04]]), materials.panel, .044).position.y = .13;
  addPreviewPlate([[.12,.26],[.31,.35],[.25,.68],[.07,.58]], materials.panel, .052).position.y = .12;
  addPreviewPlate(mirrorPoints([[.12,.26],[.31,.35],[.25,.68],[.07,.58]]), materials.panel, .052).position.y = .12;

  const canopy = addPreviewPlate([
    [0, -.50], [.118, -.24], [.088, .06], [0, .20], [-.088, .06], [-.118, -.24]
  ], materials.glass, .052);
  canopy.position.y = .15;
  addPreviewPlate([
    [0, -.44], [.070, -.20], [.052, -.02], [0, .09], [-.052, -.02], [-.070, -.20]
  ], materials.core, .030).position.y = .19;

  addPreviewLine([[0,-1.44],[0,-.54],[0,.74]], materials.roseLine, .18);
  addPreviewLine([[.13,-.74],[.24,-.30],[.20,.54]], materials.goldLine, .16);
  addPreviewLine([[-.13,-.74],[-.24,-.30],[-.20,.54]], materials.goldLine, .16);
  addPreviewLine([[.28,-.20],[.72,.06],[.48,.32],[.32,.66]], materials.edge, .14);
  addPreviewLine([[-.28,-.20],[-.72,.06],[-.48,.32],[-.32,.66]], materials.edge, .14);

  const core = new THREE.Mesh(new THREE.SphereGeometry(.17, 18, 10), materials.core);
  core.position.set(0, .24, -.16);
  root.add(core);
  const coreRing = new THREE.Line(makeRingCircleGeometry(.32, LOW_POWER_DEVICE ? 32 : 46), materials.goldLine);
  coreRing.rotation.x = Math.PI / 2;
  coreRing.position.set(0, .24, -.16);
  root.add(coreRing);

  const engineGeo = new THREE.CylinderGeometry(.12, .18, .44, 14, 1);
  for(const x of [-.32, .32]){
    const engine = new THREE.Mesh(engineGeo, materials.hull);
    engine.rotation.x = Math.PI / 2;
    engine.position.set(x, -.04, .92);
    root.add(engine);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(.13, 12, 8), materials.core);
    glow.position.set(x, -.04, 1.15);
    glow.scale.set(.9, .7, 1.1);
    root.add(glow);
  }

  const underGlow = new THREE.Mesh(new THREE.CircleGeometry(1.12, 36), materials.shadow);
  underGlow.rotation.x = -Math.PI / 2;
  underGlow.position.set(0, -.18, .10);
  underGlow.scale.set(1.25, .58, 1);
  root.add(underGlow);

  return {root, core, materials};
}

function makeRingCircleGeometry(radius, steps){
  const pts = [];
  for(let i=0;i<=steps;i++){
    const a = TAU * i / steps;
    pts.push(new THREE.Vector3(Math.cos(a)*radius, Math.sin(a)*radius, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function createUi(){
  const style = document.createElement('style');
  style.textContent = `
    #barrage-ui{position:fixed;z-index:5;pointer-events:none;color:${COLORS.text};font-family:"Zen Kaku Gothic New","Oxanium","Yu Gothic UI",Meiryo,sans-serif;text-shadow:0 1px 0 rgba(0,0,0,.8)}
    #barrage-ui *{box-sizing:border-box}
    #barrage-ui button{pointer-events:auto;position:relative;overflow:hidden;border:1px solid rgba(244,251,255,.22);background:rgba(244,251,255,.075);color:${COLORS.text};font:900 14px inherit;letter-spacing:0;border-radius:0;padding:0 16px;height:42px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 12px 26px rgba(0,0,0,.22);cursor:pointer;clip-path:polygon(13px 0,100% 0,100% calc(100% - 13px),calc(100% - 13px) 100%,0 100%,0 13px)}
    #barrage-ui button:hover{border-color:rgba(244,251,255,.36);background:rgba(244,251,255,.11)}
    #barrage-ui button:active{transform:translateY(1px);filter:brightness(.94)}
    #barrage-ui .screen{position:absolute;inset:0;display:none;overflow:hidden;background:
      radial-gradient(circle at 74% 16%,rgba(238,247,255,.10),transparent 28%),
      radial-gradient(circle at 20% 72%,rgba(30,214,255,.075),transparent 36%),
      linear-gradient(180deg,#07080a 0%,#101216 45%,#060607 100%)}
    #barrage-ui .screen::before{content:"";position:absolute;inset:0;background:
      linear-gradient(rgba(238,247,255,.055) 1px,transparent 1px),
      linear-gradient(90deg,rgba(238,247,255,.045) 1px,transparent 1px);
      background-size:56px 56px;opacity:.22;transform:perspective(360px) rotateX(54deg) translateY(48px) scale(1.4);transform-origin:center bottom}
    #barrage-ui .screen::after{content:"";position:absolute;left:-10%;right:-10%;top:52%;height:1px;background:linear-gradient(90deg,transparent,rgba(238,247,255,.32),rgba(30,214,255,.42),transparent);box-shadow:0 0 18px rgba(30,214,255,.16)}
    #barrage-ui .screen.on{display:block}
    #barrage-ui .cut{clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
    #barrage-ui .panel{position:relative;border:1px solid rgba(238,247,255,.16);background:linear-gradient(180deg,rgba(8,10,10,.92),rgba(5,8,13,.78));box-shadow:0 0 0 1px rgba(184,167,255,.07),0 18px 46px rgba(0,0,0,.34);border-radius:0;padding:13px}
    #barrage-ui .panel::before{content:"";position:absolute;left:14px;right:14px;top:12px;height:1px;background:rgba(238,247,255,.14)}
    #barrage-ui .top{position:absolute;z-index:1;left:12px;right:12px;top:10px;display:flex;align-items:flex-start;justify-content:flex-start;gap:9px}
    #barrage-ui .brand-card{position:relative;width:205px;min-height:62px;padding:10px 12px 9px 18px;border-left:5px solid ${COLORS.violet}}
    #barrage-ui .brand{font-size:26px;line-height:1;font-weight:900;color:${COLORS.text};text-shadow:0 0 16px rgba(30,214,255,.62)}
    #barrage-ui .sub{margin-top:4px;font-size:10px;font-weight:900;color:${COLORS.muted}}
    #barrage-ui .top-stack{display:grid;grid-template-columns:1fr;gap:6px;width:76px;min-width:76px}
    #barrage-ui .chip{position:relative;min-width:66px;border:1px solid rgba(238,247,255,.14);background:rgba(5,8,13,.74);padding:7px 8px 6px;text-align:right;font-size:10px;font-weight:900;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}
    #barrage-ui .chip b{display:block;color:${COLORS.faint};font-size:9px;line-height:1.05}
    #barrage-ui .chip span{display:block;color:${COLORS.text};font-size:14px;line-height:1.15}
    #barrage-ui .home-main{position:absolute;z-index:1;left:18px;right:18px;bottom:22px;display:grid;grid-template-columns:1fr;gap:9px}
    #barrage-ui .title{font-size:43px;line-height:.92;font-weight:900;color:${COLORS.text};text-shadow:0 0 24px rgba(255,59,98,.55)}
    #barrage-ui .mode-line{display:flex;align-items:center;gap:8px;color:${COLORS.violet};font-size:11px;font-weight:900}
    #barrage-ui .mode-line::before{content:"";width:34px;height:3px;background:${COLORS.violet};box-shadow:0 0 12px rgba(184,167,255,.7)}
    #barrage-ui .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
    #barrage-ui .stat{border:1px solid rgba(238,247,255,.12);border-left:4px solid ${COLORS.cyan};background:rgba(238,247,255,.045);padding:7px 8px 8px;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
    #barrage-ui .stat b{display:block;font-size:9px;line-height:1.05;color:${COLORS.faint};white-space:nowrap}
    #barrage-ui .stat span{display:block;margin-top:4px;font-size:15px;line-height:1;font-weight:900;color:${COLORS.text}}
    #barrage-ui .dock{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
    #barrage-ui .dock .tab{height:34px;border:1px solid rgba(238,247,255,.13);background:rgba(5,8,13,.68);padding:6px 7px;color:${COLORS.muted};font-size:9px;font-weight:900;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
    #barrage-ui .dock .tab.active{border-color:rgba(30,214,255,.58);color:${COLORS.cyan};box-shadow:0 0 16px rgba(30,214,255,.12)}
    #barrage-ui .launch{width:100%;height:46px;margin-top:1px;color:${COLORS.gold};border-color:rgba(216,226,234,.58);background:linear-gradient(135deg,rgba(216,226,234,.20),rgba(8,10,10,.92) 48%,rgba(30,214,255,.18));font-size:16px}
    #barrage-ui .hud{position:absolute;inset:0;display:none;overflow:hidden}
    #barrage-ui .hud.on{display:block}
    #barrage-ui .hud::before{content:"";position:absolute;left:0;right:0;top:0;height:62px;background:linear-gradient(180deg,rgba(5,6,7,.78),rgba(5,6,7,.30),transparent);pointer-events:none}
    #barrage-ui .hud::after{content:"";position:absolute;left:0;right:0;bottom:0;height:148px;background:linear-gradient(180deg,transparent,rgba(5,6,7,.52) 18%,rgba(5,6,7,.94));pointer-events:none}
    #barrage-ui .hud-top{position:absolute;z-index:1;left:10px;right:10px;top:8px;display:grid;grid-template-columns:74px 1fr 112px;gap:8px;align-items:start}
    #barrage-ui .hud-pause{height:34px;width:74px;padding:0 8px;display:flex;align-items:center;justify-content:center;gap:7px;color:#f4fbff;font-size:11px;border-color:rgba(244,251,255,.34);background:rgba(244,251,255,.08)}
    #barrage-ui .hud-pause::before{content:"";width:12px;height:13px;border-left:3px solid ${COLORS.gold};border-right:3px solid ${COLORS.gold};filter:drop-shadow(0 0 5px rgba(216,226,234,.55))}
    #barrage-ui .wave-panel{height:45px;border:1px solid rgba(255,59,98,.36);background:linear-gradient(180deg,rgba(8,10,10,.76),rgba(8,10,10,.42));clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);padding:5px 9px 6px;text-align:center;box-shadow:0 0 18px rgba(255,59,98,.10)}
    #barrage-ui .wave-panel b{display:block;font-size:9px;line-height:1;color:${COLORS.faint}}
    #barrage-ui .wave-panel span{display:block;margin-top:1px;font-size:18px;line-height:1;font-weight:900;color:${COLORS.text}}
    #barrage-ui .wave-timer{height:4px;margin-top:5px;background:rgba(238,247,255,.10);overflow:hidden;clip-path:polygon(3px 0,100% 0,100% 100%,0 100%,0 3px)}
    #barrage-ui .wave-timer i{display:block;height:100%;width:0;background:${COLORS.rose};box-shadow:0 0 10px rgba(255,59,98,.82)}
    #barrage-ui .score-panel{height:45px;border:1px solid rgba(30,214,255,.28);background:linear-gradient(180deg,rgba(5,8,13,.72),rgba(5,8,13,.44));clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);padding:6px 9px;text-align:right}
    #barrage-ui .score-panel b{display:block;font-size:9px;color:${COLORS.faint};line-height:1}
    #barrage-ui .score-panel span{display:block;margin-top:4px;font-size:16px;line-height:1;font-weight:900;color:${COLORS.text}}
    #barrage-ui .hud-bottom{position:absolute;z-index:1;left:0;right:0;bottom:0;padding:14px 12px 10px;border-top:1px solid rgba(238,247,255,.16);display:grid;gap:7px}
    #barrage-ui .status-panel{display:grid;gap:8px;padding:0 0 2px}
    #barrage-ui .meter-row{display:grid;grid-template-columns:58px 1fr 66px;align-items:center;gap:8px;font-size:10px;font-weight:900;color:${COLORS.muted}}
    #barrage-ui .meter-row.hp{grid-template-columns:58px 1fr 70px}
    #barrage-ui .meter-label{display:flex;align-items:center;gap:5px;color:${COLORS.text};white-space:nowrap}
    #barrage-ui .meter-label::before{content:"";display:block;width:4px;height:14px;background:var(--meter-color);box-shadow:0 0 9px var(--meter-color)}
    #barrage-ui .bar{height:13px;background:rgba(238,247,255,.075);overflow:hidden;border:1px solid rgba(238,247,255,.16);clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);box-shadow:inset 0 0 12px rgba(0,0,0,.36)}
    #barrage-ui .meter-row.hp .bar{height:17px}
    #barrage-ui .bar i{display:block;height:100%;width:50%;background:linear-gradient(90deg,var(--meter-color),var(--meter-end));box-shadow:0 0 14px var(--meter-color),inset 0 1px 0 rgba(255,255,255,.28)}
    #barrage-ui .hud-chips{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
    #barrage-ui .hud-chip{height:25px;border:1px solid rgba(238,247,255,.13);background:linear-gradient(180deg,rgba(238,247,255,.055),rgba(5,8,13,.56));clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);display:grid;grid-template-columns:1fr auto;align-items:center;padding:0 9px;font-weight:900}
    #barrage-ui .hud-chip b{font-size:9px;color:${COLORS.faint}}
    #barrage-ui .hud-chip span{font-size:14px;color:${COLORS.text}}
    #barrage-ui .hud-top{grid-template-columns:1fr 1fr 1fr 44px}
    #barrage-ui .hud-top .chip{min-width:0;height:42px;padding:7px 9px 6px;background:linear-gradient(180deg,rgba(8,10,10,.76),rgba(5,8,13,.42));border-color:rgba(238,247,255,.12)}
    #barrage-ui .hud-top .chip:nth-child(1){border-color:rgba(255,59,98,.36);text-align:center}
    #barrage-ui .hud-top .chip:nth-child(2){border-color:rgba(30,214,255,.28)}
    #barrage-ui .hud-top .chip:nth-child(3){border-color:rgba(184,167,255,.28)}
    #barrage-ui .hud-top .chip b{font-size:0}
    #barrage-ui .hud-top .chip b::after{display:block;font-size:9px;line-height:1.05;color:${COLORS.faint}}
    #barrage-ui .hud-top .chip:nth-child(1) b::after{content:"ウェーブ"}
    #barrage-ui .hud-top .chip:nth-child(2) b::after{content:"スコア"}
    #barrage-ui .hud-top .chip:nth-child(3) b::after{content:"残り"}
    #barrage-ui .hud-top .chip span{font-size:16px;line-height:1.15;margin-top:4px}
    #barrage-ui .hud-top .chip:nth-child(1) span::before{content:"WAVE ";font-size:10px;color:${COLORS.rose};vertical-align:1px}
    #barrage-ui .hud-top .pause{width:44px;height:42px;padding:0;font-size:0;color:#f4fbff;border-color:rgba(244,251,255,.34);background:rgba(244,251,255,.08)}
    #barrage-ui .hud-top .pause::before{content:"";display:block;width:13px;height:15px;margin:auto;border-left:4px solid #f4fbff;border-right:4px solid #f4fbff;filter:drop-shadow(0 0 6px rgba(132,241,255,.30))}
    #barrage-ui .hud-bottom .meter-row:nth-child(1){--meter-color:#ff3b62;--meter-end:#ffb3a5;grid-template-columns:50px 1fr 72px}
    #barrage-ui .hud-bottom .meter-row:nth-child(2){--meter-color:#1ed6ff;--meter-end:#9cf5ff}
    #barrage-ui .hud-bottom .meter-row:nth-child(3){--meter-color:#36f39b;--meter-end:#d6ff69}
    #barrage-ui .hud-bottom .meter-row>span:first-child{font-size:0;color:${COLORS.text}}
    #barrage-ui .hud-bottom .meter-row>span:first-child::after{display:block;font-size:10px;white-space:nowrap}
    #barrage-ui .hud-bottom .meter-row:nth-child(1)>span:first-child::after{content:"HP"}
    #barrage-ui .hud-bottom .meter-row:nth-child(2)>span:first-child::after{content:"エネルギー"}
    #barrage-ui .hud-bottom .meter-row:nth-child(3)>span:first-child::after{content:"XP"}
    #barrage-ui .result,#barrage-ui .menu{position:absolute;z-index:1;left:26px;right:26px;top:168px;display:grid;gap:10px}
    #barrage-ui .menu-title{font-size:28px;font-weight:900;color:${COLORS.text};text-shadow:0 0 16px rgba(30,214,255,.5)}
    #barrage-ui .upgrade-page{position:absolute;z-index:1;left:16px;right:16px;top:96px;display:grid;gap:10px}
    #barrage-ui .upgrade-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    #barrage-ui .upgrade-card{pointer-events:auto;position:relative;min-height:76px;border:1px solid rgba(238,247,255,.14);border-left:4px solid var(--accent);background:linear-gradient(180deg,rgba(8,10,10,.88),rgba(5,8,13,.72));padding:10px 10px 9px;clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px)}
    #barrage-ui .upgrade-card b{display:block;color:var(--accent);font-size:11px}
    #barrage-ui .upgrade-card span{display:block;margin-top:5px;color:${COLORS.text};font-size:15px;font-weight:900}
    #barrage-ui .upgrade-card small{display:block;margin-top:6px;color:${COLORS.muted};font-size:10px;font-weight:800;line-height:1.25}
    #barrage-ui .upgrade-card button{position:absolute;right:8px;bottom:8px;height:26px;padding:0 10px;font-size:10px;background:rgba(244,251,255,.08);border-color:rgba(244,251,255,.24);color:#f4fbff}
    #barrage-ui .levelup{position:absolute;z-index:2;left:16px;right:16px;top:118px;display:grid;gap:10px}
    #barrage-ui .levelup .upgrade-grid{grid-template-columns:1fr}
    #barrage-ui .upgrade-overlay{position:absolute;inset:0;z-index:3;display:none;pointer-events:none;background:linear-gradient(180deg,rgba(5,6,7,.20),rgba(5,6,7,.58) 42%,rgba(5,6,7,.86));overflow:hidden}
    #barrage-ui .upgrade-overlay.on{display:block}
    #barrage-ui .upgrade-overlay::before{content:"";position:absolute;left:-10%;right:-10%;top:96px;height:1px;background:linear-gradient(90deg,transparent,rgba(30,214,255,.58),rgba(216,226,234,.38),transparent);box-shadow:0 0 20px rgba(30,214,255,.26)}
    #barrage-ui .upgrade-overlay .levelup{pointer-events:auto;left:14px;right:14px;top:108px;padding:13px 13px 14px;border-color:rgba(216,226,234,.26);background:linear-gradient(180deg,rgba(8,10,10,.92),rgba(5,8,13,.86));box-shadow:0 0 0 1px rgba(238,247,255,.06),0 20px 44px rgba(0,0,0,.45)}
    #barrage-ui .upgrade-overlay .level-head{display:grid;grid-template-columns:1fr auto;align-items:end;gap:10px}
    #barrage-ui .upgrade-overlay .level-title{font-size:25px;line-height:1;font-weight:900;color:${COLORS.text};text-shadow:0 0 16px rgba(216,226,234,.34)}
    #barrage-ui .upgrade-overlay .level-sp{height:26px;min-width:72px;display:grid;place-items:center;border:1px solid rgba(244,251,255,.30);background:rgba(244,251,255,.08);color:#f4fbff;font-size:12px;font-weight:900;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px)}
    #barrage-ui .upgrade-overlay .level-note{font-size:10px;font-weight:900;color:${COLORS.muted};line-height:1.25}
    #barrage-ui .upgrade-overlay .upgrade-grid{grid-template-columns:1fr;gap:8px;margin-top:2px}
    #barrage-ui .upgrade-overlay .upgrade-card{min-height:82px;padding:10px 92px 10px 12px;background:linear-gradient(180deg,rgba(238,247,255,.055),rgba(5,8,13,.72));border-left-width:5px}
    #barrage-ui .upgrade-overlay .upgrade-card b{font-size:10px;color:var(--accent)}
    #barrage-ui .upgrade-overlay .upgrade-card span{font-size:18px;color:${COLORS.text}}
    #barrage-ui .upgrade-overlay .upgrade-card small{font-size:10px;line-height:1.3;max-width:190px}
    #barrage-ui .upgrade-overlay .upgrade-card button{right:10px;top:50%;bottom:auto;transform:translateY(-50%);height:36px;min-width:70px;border-color:rgba(244,251,255,.34);color:#f4fbff;font-size:11px;background:rgba(244,251,255,.08)}
    #barrage-ui .upgrade-overlay .upgrade-card button:active{transform:translateY(calc(-50% + 1px))}

    #barrage-ui{
      --ui-bg:#050607;
      --ui-panel:rgba(12,14,16,.78);
      --ui-panel-strong:rgba(18,21,24,.92);
      --ui-line:rgba(244,251,255,.18);
      --ui-line-strong:rgba(244,251,255,.34);
      --ui-text:#f6f8fa;
      --ui-muted:rgba(214,226,234,.66);
      --ui-faint:rgba(214,226,234,.38);
      --ui-cyan:#8eefff;
      --ui-red:#ff5d7e;
      --ui-green:#9dffd9;
      --ui-silver:#d8e2ea;
      --ui-shadow:0 18px 40px rgba(0,0,0,.30);
      color:var(--ui-text);
      text-shadow:none;
    }
    #barrage-ui button{
      min-width:0;
      border:1px solid var(--ui-line);
      background:linear-gradient(180deg,rgba(250,252,255,.11),rgba(250,252,255,.045));
      color:var(--ui-text);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 12px 24px rgba(0,0,0,.20);
      clip-path:polygon(13px 0,100% 0,100% calc(100% - 13px),calc(100% - 13px) 100%,0 100%,0 13px);
      transition:background .15s ease,border-color .15s ease,box-shadow .15s ease,filter .15s ease,transform .08s ease;
    }
    #barrage-ui button:focus-visible{
      outline:2px solid var(--ui-cyan);
      outline-offset:2px;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 0 0 4px rgba(142,239,255,.14),0 12px 24px rgba(0,0,0,.22);
    }
    #barrage-ui button:disabled{
      opacity:.42;
      cursor:not-allowed;
      filter:grayscale(.35);
    }
    #barrage-ui .screen{
      background:
        radial-gradient(circle at 76% 18%,rgba(142,239,255,.13),transparent 28%),
        radial-gradient(circle at 20% 76%,rgba(255,93,126,.10),transparent 34%),
        linear-gradient(180deg,#060709 0%,#101215 48%,#050607 100%);
    }
    #barrage-ui .screen::before{
      opacity:.18;
      background:
        linear-gradient(rgba(244,251,255,.050) 1px,transparent 1px),
        linear-gradient(90deg,rgba(244,251,255,.040) 1px,transparent 1px);
      background-size:44px 44px;
    }
    #barrage-ui .screen::after{
      top:auto;
      bottom:92px;
      height:1px;
      background:linear-gradient(90deg,transparent,rgba(142,239,255,.42),rgba(246,248,250,.26),transparent);
      box-shadow:0 0 18px rgba(142,239,255,.16);
    }
    #barrage-ui .ui-stage{
      position:absolute;
      left:50%;
      top:50%;
      width:390px;
      height:700px;
      transform:translate(-50%,-50%) scale(var(--ui-scale,1));
      transform-origin:center center;
      overflow:hidden;
    }
    #barrage-ui .glass-panel{
      position:relative;
      border:1px solid var(--ui-line);
      background:linear-gradient(180deg,rgba(247,250,252,.075),rgba(7,9,11,.78));
      box-shadow:var(--ui-shadow),inset 0 1px 0 rgba(255,255,255,.07);
      clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px);
    }
    #barrage-ui .glass-panel::before{
      content:"";
      position:absolute;
      left:13px;
      right:13px;
      top:10px;
      height:1px;
      background:linear-gradient(90deg,rgba(246,248,250,.34),transparent);
      pointer-events:none;
    }
    #barrage-ui .micro-label{
      display:block;
      font-size:9px;
      line-height:1;
      font-weight:900;
      color:var(--ui-faint);
      white-space:nowrap;
    }
    #barrage-ui .big-value{
      display:block;
      margin-top:5px;
      font-size:18px;
      line-height:1;
      font-weight:900;
      color:var(--ui-text);
      white-space:nowrap;
    }
    #barrage-ui .home-top{
      position:absolute;
      left:14px;
      right:14px;
      top:14px;
      height:64px;
      display:grid;
      grid-template-columns:1fr 128px;
      gap:10px;
    }
    #barrage-ui .brand-mark{
      padding:11px 16px 10px 18px;
      background:#070809;
      border-color:rgba(246,248,250,.28);
    }
    #barrage-ui .brand-mark::after{
      content:"";
      position:absolute;
      left:16px;
      bottom:9px;
      width:126px;
      height:3px;
      background:linear-gradient(90deg,var(--ui-cyan),transparent);
    }
    #barrage-ui .brand-mark span{
      display:block;
      font-size:34px;
      line-height:.86;
      font-weight:900;
      color:#fff;
      transform:skewX(-8deg);
      text-shadow:-2px -1px 0 rgba(142,239,255,.58),2px 2px 0 rgba(85,90,96,.58);
    }
    #barrage-ui .brand-mark small{
      position:absolute;
      right:15px;
      bottom:12px;
      font-size:9px;
      font-weight:900;
      color:var(--ui-muted);
    }
    #barrage-ui .token-box{
      padding:10px 12px 8px;
      text-align:right;
    }
    #barrage-ui .token-box .big-value{font-size:17px}
    #barrage-ui .hero-card{
      position:absolute;
      left:14px;
      right:14px;
      top:88px;
      height:286px;
      padding:18px;
      overflow:hidden;
    }
    #barrage-ui .hero-card::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        repeating-linear-gradient(18deg,rgba(246,248,250,.045) 0 1px,transparent 1px 31px),
        linear-gradient(90deg,rgba(142,239,255,.08),transparent 34%,rgba(255,255,255,.025));
      pointer-events:none;
    }
    #barrage-ui .hero-tag{
      position:absolute;
      left:18px;
      top:16px;
      height:30px;
      min-width:104px;
      padding:0 16px;
      display:grid;
      place-items:center;
      background:#f6f8fa;
      color:#060709;
      font-size:12px;
      font-weight:900;
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .record-box{
      position:absolute;
      right:20px;
      top:16px;
      width:118px;
      height:70px;
      padding:12px;
      background:rgba(5,6,7,.82);
      border:1px solid rgba(246,248,250,.12);
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
    }
    #barrage-ui .ship-title{
      position:absolute;
      left:32px;
      top:68px;
      z-index:1;
      width:226px;
    }
    #barrage-ui .ship-title h1{
      margin:0;
      font-size:30px;
      line-height:1;
      color:var(--ui-text);
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui .ship-title p{
      margin:8px 0 0;
      font-size:10px;
      font-weight:900;
      color:var(--ui-cyan);
      white-space:nowrap;
    }
    #barrage-ui .core-card{
      position:absolute;
      z-index:1;
      left:32px;
      top:124px;
      width:150px;
      height:52px;
      padding:10px 12px;
      background:rgba(5,6,7,.72);
      border:1px solid rgba(246,248,250,.12);
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .ship-emblem{
      position:absolute;
      z-index:1;
      right:28px;
      top:118px;
      width:150px;
      height:150px;
      filter:drop-shadow(0 0 22px rgba(142,239,255,.20));
    }
    #barrage-ui .ship-emblem::before{
      content:"";
      position:absolute;
      left:64px;
      top:0;
      width:22px;
      height:114px;
      background:linear-gradient(180deg,#fff,var(--ui-cyan) 46%,#101820);
      clip-path:polygon(50% 0,84% 30%,64% 100%,36% 100%,16% 30%);
    }
    #barrage-ui .ship-emblem::after{
      content:"";
      position:absolute;
      left:6px;
      top:56px;
      width:138px;
      height:60px;
      background:linear-gradient(90deg,rgba(246,248,250,.10),rgba(246,248,250,.90),rgba(142,239,255,.16));
      clip-path:polygon(0 42%,38% 0,50% 30%,62% 0,100% 42%,72% 84%,54% 68%,46% 68%,28% 84%);
    }
    #barrage-ui .loadout-strip{
      position:absolute;
      z-index:2;
      left:32px;
      right:32px;
      bottom:30px;
      height:58px;
      padding:11px 13px;
      background:rgba(5,6,7,.62);
      border:1px solid rgba(246,248,250,.12);
      clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
    }
    #barrage-ui .loadout-strip .big-value{
      font-size:13px;
      color:var(--ui-cyan);
    }
    #barrage-ui .checkpoint-pill{
      position:absolute;
      left:34px;
      top:360px;
      width:322px;
      height:26px;
      display:grid;
      place-items:center;
      color:var(--ui-muted);
      font-size:10px;
      font-weight:900;
      background:rgba(246,248,250,.045);
      border:1px solid rgba(246,248,250,.12);
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .primary-start{
      position:absolute;
      left:82px;
      top:404px;
      width:226px;
      height:56px;
      color:#050607;
      background:linear-gradient(180deg,#fff,#dfe5e9);
      border-color:rgba(255,255,255,.92);
      box-shadow:0 18px 30px rgba(0,0,0,.28),inset 0 0 0 2px rgba(5,6,7,.10);
      clip-path:polygon(18px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 18px);
    }
    #barrage-ui .primary-start span{
      display:block;
      font-size:31px;
      line-height:.92;
      font-weight:900;
    }
    #barrage-ui .primary-start small{
      display:block;
      margin-top:5px;
      color:rgba(5,6,7,.64);
      font-size:9px;
      font-weight:900;
    }
    #barrage-ui .nav-grid{
      position:absolute;
      left:24px;
      top:484px;
      width:342px;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px 16px;
    }
    #barrage-ui .nav-tile{
      pointer-events:auto;
      position:relative;
      height:54px;
      padding:10px 30px 10px 15px;
      background:linear-gradient(180deg,rgba(246,248,250,.085),rgba(246,248,250,.038));
      border:1px solid rgba(246,248,250,.16);
      clip-path:polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
    }
    #barrage-ui .nav-tile::before{
      content:"";
      position:absolute;
      left:0;
      top:7px;
      bottom:7px;
      width:4px;
      background:var(--accent);
    }
    #barrage-ui .nav-tile::after{
      content:">";
      position:absolute;
      right:12px;
      top:17px;
      color:var(--ui-text);
      font-size:15px;
      font-weight:900;
      opacity:.82;
    }
    #barrage-ui .nav-tile b{
      display:block;
      color:var(--accent);
      font-size:13px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui .nav-tile span{
      display:block;
      margin-top:8px;
      color:var(--ui-muted);
      font-size:10px;
      line-height:1;
      font-weight:800;
      white-space:nowrap;
    }
    #barrage-ui .page-stage{padding:16px}
    #barrage-ui .page-header{
      height:72px;
      display:grid;
      grid-template-columns:minmax(0,1fr) 92px;
      gap:10px;
      align-items:stretch;
    }
    #barrage-ui .page-title{
      position:relative;
      padding:14px 16px;
      overflow:hidden;
    }
    #barrage-ui .page-title::after{
      content:"";
      position:absolute;
      left:16px;
      right:16px;
      bottom:10px;
      height:2px;
      background:linear-gradient(90deg,var(--ui-cyan),rgba(246,248,250,.62),transparent);
      opacity:.78;
    }
    #barrage-ui .page-title h1{
      margin:0;
      font-size:28px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .page-title p{
      margin:7px 0 0;
      font-size:10px;
      font-weight:900;
      color:var(--ui-muted);
    }
    #barrage-ui .page-back{
      height:72px;
      color:var(--ui-text);
      background:linear-gradient(180deg,rgba(246,248,250,.10),rgba(246,248,250,.045));
    }
    #barrage-ui .ranking-list{
      position:absolute;
      left:16px;
      right:16px;
      top:102px;
      bottom:16px;
      display:grid;
      grid-auto-rows:50px;
      gap:8px;
      overflow:hidden;
    }
    #barrage-ui .ranking-row{
      display:grid;
      grid-template-columns:42px 1fr 82px 58px;
      align-items:center;
      gap:8px;
      padding:0 12px;
      border:1px solid rgba(246,248,250,.14);
      border-left:4px solid var(--ui-cyan);
      background:linear-gradient(180deg,rgba(246,248,250,.085),rgba(7,9,11,.74));
      clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
      font-weight:900;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05);
    }
    #barrage-ui .ranking-row b{
      color:var(--ui-cyan);
      font-size:13px;
      line-height:1;
    }
    #barrage-ui .ranking-row span{
      min-width:0;
      color:var(--ui-text);
      font-size:13px;
      line-height:1;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .ranking-row strong{
      color:var(--ui-text);
      font-size:14px;
      line-height:1;
      text-align:right;
    }
    #barrage-ui .ranking-row small{
      color:var(--ui-muted);
      font-size:10px;
      line-height:1;
      text-align:right;
    }
    #barrage-ui .ranking-empty{
      height:96px;
      display:grid;
      place-items:center;
      color:var(--ui-muted);
      border:1px solid rgba(246,248,250,.12);
      background:rgba(246,248,250,.045);
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
      font-size:16px;
      font-weight:900;
    }
    #barrage-ui .catalog-grid{
      position:absolute;
      left:16px;
      right:16px;
      top:102px;
      bottom:16px;
      display:grid;
      grid-template-columns:1fr;
      grid-auto-rows:auto;
      align-content:start;
      gap:8px;
      overflow-y:auto;
      padding-right:4px;
      pointer-events:auto;
    }
    #barrage-ui .catalog-grid::-webkit-scrollbar{width:6px}
    #barrage-ui .catalog-grid::-webkit-scrollbar-thumb{background:rgba(246,248,250,.22)}
    #barrage-ui .ship-card{
      position:relative;
      min-height:132px;
      padding:13px 94px 12px 13px;
      border:1px solid rgba(246,248,250,.14);
      border-left:4px solid var(--accent);
      background:linear-gradient(180deg,rgba(246,248,250,.075),rgba(7,9,11,.78));
      clip-path:polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.045);
    }
    #barrage-ui .ship-card.selected{
      border-color:rgba(142,239,255,.48);
      background:linear-gradient(180deg,rgba(142,239,255,.10),rgba(7,9,11,.80));
    }
    #barrage-ui .ship-card.locked{
      opacity:.78;
    }
    #barrage-ui .ship-card-head b,
    #barrage-ui .garage-summary b,
    #barrage-ui .part-slot b{
      display:block;
      color:var(--accent);
      font-size:10px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .ship-card-head strong,
    #barrage-ui .garage-summary strong{
      display:block;
      margin-top:6px;
      color:var(--ui-text);
      font-size:18px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .ship-card-head small,
    #barrage-ui .garage-summary span,
    #barrage-ui .garage-summary small,
    #barrage-ui .garage-summary em,
    #barrage-ui .ship-card-body span,
    #barrage-ui .ship-card-body em,
    #barrage-ui .ship-card-body i{
      display:block;
      margin-top:6px;
      color:var(--ui-muted);
      font-size:10px;
      line-height:1.2;
      font-weight:900;
      font-style:normal;
    }
    #barrage-ui .ship-card-body span{
      color:var(--ui-text);
    }
    #barrage-ui .ship-card button{
      position:absolute;
      right:9px;
      top:50%;
      transform:translateY(-50%);
      width:74px;
      height:54px;
      padding:0 8px;
      font-size:11px;
    }
    #barrage-ui .ship-card button:active{transform:translateY(calc(-50% + 1px))}
    #barrage-ui .garage-panel{
      position:absolute;
      left:16px;
      right:16px;
      top:102px;
      bottom:16px;
      display:grid;
      grid-template-columns:1fr;
      grid-auto-rows:auto;
      align-content:start;
      gap:8px;
      overflow-y:auto;
      padding-right:4px;
      pointer-events:auto;
    }
    #barrage-ui .garage-panel::-webkit-scrollbar{width:6px}
    #barrage-ui .garage-panel::-webkit-scrollbar-thumb{background:rgba(246,248,250,.22)}
    #barrage-ui .garage-summary,
    #barrage-ui .part-section,
    #barrage-ui .garage-skin-section{
      border:1px solid rgba(246,248,250,.14);
      border-left:4px solid var(--accent,var(--ui-line));
      background:linear-gradient(180deg,rgba(246,248,250,.070),rgba(7,9,11,.78));
      clip-path:polygon(11px 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%,0 11px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.045);
    }
    #barrage-ui .garage-summary{
      padding:13px;
    }
    #barrage-ui .garage-summary em{
      color:var(--accent);
    }
    #barrage-ui .garage-ship-strip{
      display:grid;
      grid-auto-flow:column;
      grid-auto-columns:132px;
      gap:7px;
      overflow-x:auto;
      padding-bottom:2px;
    }
    #barrage-ui .garage-ship{
      height:48px;
      padding:7px 9px;
      text-align:left;
      border-left:4px solid var(--accent);
      background:linear-gradient(180deg,rgba(246,248,250,.070),rgba(7,9,11,.78));
      box-shadow:none;
    }
    #barrage-ui .garage-ship.selected{
      border-color:rgba(142,239,255,.52);
      color:var(--ui-text);
    }
    #barrage-ui .garage-ship.locked{
      opacity:.42;
    }
    #barrage-ui .garage-ship b,
    #barrage-ui .garage-ship span{
      display:block;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .garage-ship b{
      color:var(--accent);
      font-size:10px;
      line-height:1;
    }
    #barrage-ui .garage-ship span{
      margin-top:6px;
      color:var(--ui-muted);
      font-size:9px;
      line-height:1;
    }
    #barrage-ui .part-section,
    #barrage-ui .garage-skin-section{
      padding:11px;
    }
    #barrage-ui .garage-section-head{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      margin-bottom:8px;
    }
    #barrage-ui .garage-section-head b{
      color:var(--ui-text);
      font-size:13px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .garage-section-head span{
      color:var(--ui-muted);
      font-size:10px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .part-slot-grid{
      display:grid;
      gap:7px;
    }
    #barrage-ui .part-slot-grid.empty{
      min-height:42px;
    }
    #barrage-ui .part-empty{
      display:grid;
      place-items:center;
      height:42px;
      color:var(--ui-muted);
      border:1px solid rgba(246,248,250,.10);
      background:rgba(246,248,250,.035);
      font-size:11px;
      font-weight:900;
    }
    #barrage-ui .part-slot{
      padding:10px;
      border:1px solid rgba(246,248,250,.12);
      border-left:4px solid var(--accent);
      background:rgba(5,7,10,.54);
    }
    #barrage-ui .part-slot span{
      display:block;
      margin-top:6px;
      color:var(--ui-text);
      font-size:14px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .part-slot small{
      display:block;
      margin-top:6px;
      color:var(--ui-muted);
      font-size:9px;
      line-height:1.25;
      font-weight:900;
    }
    #barrage-ui .part-picker{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:6px;
      margin-top:8px;
    }
    #barrage-ui .part-picker button{
      height:30px;
      min-width:0;
      padding:0 7px;
      font-size:9px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      box-shadow:none;
    }
    #barrage-ui .part-picker button.selected{
      border-color:rgba(142,239,255,.48);
      color:var(--ui-text);
      background:rgba(142,239,255,.13);
    }
    #barrage-ui .garage-skin-section{
      --accent:var(--ui-cyan);
    }
    #barrage-ui .garage-skin-section .equipped-grid{
      margin-bottom:8px;
    }
    #barrage-ui .garage-skin-section .cosmetic-list{
      overflow:visible;
    }
    #barrage-ui .gacha-panel{
      position:absolute;
      left:16px;
      right:16px;
      top:102px;
      bottom:16px;
      display:grid;
      grid-template-rows:52px 76px 80px 1fr;
      gap:8px;
      pointer-events:auto;
    }
    #barrage-ui .gacha-roll{
      height:52px;
      color:#050607;
      background:linear-gradient(180deg,#f6f8fa,#cfd7de);
      border-color:rgba(246,248,250,.62);
      font-size:18px;
      box-shadow:6px 6px 0 #08090a,0 16px 30px rgba(0,0,0,.28);
    }
    #barrage-ui .gacha-result,
    #barrage-ui .equipped-card,
    #barrage-ui .cosmetic-row{
      border:1px solid rgba(246,248,250,.14);
      border-left:4px solid var(--accent);
      background:linear-gradient(180deg,rgba(246,248,250,.075),rgba(7,9,11,.76));
      clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
    }
    #barrage-ui .gacha-result{
      padding:10px 12px;
    }
    #barrage-ui .gacha-result.empty{--accent:var(--ui-line);color:var(--ui-muted);display:grid;place-items:center;font-weight:900}
    #barrage-ui .gacha-result b,
    #barrage-ui .equipped-card b,
    #barrage-ui .cosmetic-row b{display:block;color:var(--accent);font-size:10px;font-weight:900}
    #barrage-ui .gacha-result span,
    #barrage-ui .equipped-card span,
    #barrage-ui .cosmetic-row span{display:block;margin-top:5px;color:var(--ui-text);font-size:14px;font-weight:900;line-height:1}
    #barrage-ui .gacha-result small,
    #barrage-ui .equipped-card small,
    #barrage-ui .cosmetic-row small{display:block;margin-top:5px;color:var(--ui-muted);font-size:9px;font-weight:900;line-height:1}
    #barrage-ui .equipped-grid{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:7px;
    }
    #barrage-ui .equipped-card{
      min-width:0;
      padding:9px 8px;
    }
    #barrage-ui .cosmetic-list{
      min-height:0;
      display:grid;
      grid-auto-rows:68px;
      align-content:start;
      gap:7px;
      overflow-y:auto;
      padding-right:4px;
    }
    #barrage-ui .cosmetic-row{
      position:relative;
      padding:10px 84px 9px 11px;
    }
    #barrage-ui .cosmetic-row.locked{
      opacity:.48;
      filter:grayscale(.55);
    }
    #barrage-ui .cosmetic-row.equipped{
      border-color:rgba(142,239,255,.42);
    }
    #barrage-ui .cosmetic-row button{
      position:absolute;
      right:8px;
      top:50%;
      transform:translateY(-50%);
      height:48px;
      min-width:68px;
      padding:0 9px;
      font-size:10px;
    }
    #barrage-ui .cosmetic-row button:active{transform:translateY(calc(-50% + 1px))}
    #barrage-ui .upgrade-path{
      display:grid;
      grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr);
      gap:6px;
      align-items:stretch;
      min-height:128px;
    }
    #barrage-ui .upgrade-link{
      display:grid;
      place-items:center;
      color:var(--ui-faint);
      font-size:18px;
      font-weight:900;
    }
    #barrage-ui .upgrade-link.open{
      color:var(--ui-cyan);
      text-shadow:0 0 12px rgba(142,239,255,.60);
    }
    #barrage-ui .upgrade-card{
      min-height:0;
      padding:13px 82px 12px 12px;
      background:linear-gradient(180deg,rgba(246,248,250,.08),rgba(7,9,11,.80));
      border:1px solid rgba(246,248,250,.14);
      border-left:4px solid var(--accent);
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.045);
    }
    #barrage-ui .upgrade-card.locked{
      opacity:.56;
      filter:grayscale(.55);
    }
    #barrage-ui .upgrade-card.maxed{
      border-color:rgba(142,239,255,.42);
      background:linear-gradient(180deg,rgba(142,239,255,.08),rgba(7,9,11,.80));
    }
    #barrage-ui .upgrade-card b{
      color:var(--accent);
      font-size:10px;
      line-height:1;
    }
    #barrage-ui .upgrade-card span{
      display:block;
      margin-top:6px;
      font-size:15px;
      color:var(--ui-text);
    }
    #barrage-ui .upgrade-card small{
      margin-top:6px;
      color:var(--ui-muted);
      font-size:10px;
      line-height:1.25;
    }
    #barrage-ui .upgrade-card em{
      display:block;
      margin-top:5px;
      color:var(--ui-faint);
      font-size:9px;
      font-style:normal;
      font-weight:900;
      line-height:1.15;
    }
    #barrage-ui .upgrade-card button{
      right:8px;
      top:50%;
      bottom:auto;
      transform:translateY(-50%);
      height:44px;
      min-width:58px;
      padding:0 10px;
      font-size:10px;
    }
    #barrage-ui .upgrade-card button:active{transform:translateY(calc(-50% + 1px))}
    #barrage-ui .hud{
      pointer-events:none;
    }
    #barrage-ui .hud::before{
      height:86px;
      background:linear-gradient(180deg,rgba(5,6,7,.84),rgba(5,6,7,.34) 68%,transparent);
    }
    #barrage-ui .hud::after{
      height:134px;
      background:linear-gradient(180deg,transparent,rgba(5,6,7,.24) 24%,rgba(5,6,7,.80));
    }
    #barrage-ui .hud-topbar{
      position:absolute;
      z-index:2;
      left:10px;
      right:10px;
      top:8px;
      display:grid;
      grid-template-columns:82px minmax(0,1fr) 128px;
      gap:7px;
      align-items:stretch;
    }
    #barrage-ui .hud-stat{
      position:relative;
      min-width:0;
      height:52px;
      padding:7px 10px 6px;
      border:1px solid rgba(246,248,250,.16);
      background:linear-gradient(180deg,rgba(246,248,250,.075),rgba(5,6,7,.70));
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
      text-align:right;
      overflow:hidden;
    }
    #barrage-ui .hud-stat::before{
      content:"";
      position:absolute;
      inset:4px auto 4px 5px;
      width:3px;
      background:var(--accent,var(--ui-line));
      opacity:.82;
    }
    #barrage-ui .hud-stat::after{
      content:"";
      position:absolute;
      inset:0;
      background:linear-gradient(110deg,transparent 0 56%,rgba(246,248,250,.075) 57%,transparent 72%);
      opacity:.45;
      pointer-events:none;
    }
    #barrage-ui .hud-stat b{
      position:relative;
      z-index:1;
      display:block;
      font-size:9px;
      line-height:1;
      color:var(--ui-faint);
      letter-spacing:0;
    }
    #barrage-ui .hud-stat > span{
      position:relative;
      z-index:1;
      display:block;
      margin-top:3px;
      font-size:15px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .hud-wave{
      --accent:var(--ui-cyan);
      text-align:center;
      padding-bottom:5px;
    }
    #barrage-ui .hud-wave b{
      display:inline-block;
      vertical-align:middle;
    }
    #barrage-ui .hud-wave > span{
      display:inline-block;
      margin:0 0 0 6px;
      vertical-align:middle;
      font-size:16px;
    }
    #barrage-ui .hud-wave small{
      position:relative;
      z-index:1;
      display:block;
      margin-top:3px;
      color:var(--ui-muted);
      font-size:9px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui .hud-wave small span{
      color:var(--ui-text);
      font-size:9px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .hud-score{
      --accent:var(--ui-silver);
      border-color:rgba(246,248,250,.20);
    }
    #barrage-ui .hud-time{
      --accent:rgba(246,248,250,.46);
      padding-inline:8px;
      text-align:center;
    }
    #barrage-ui .wave-timer{
      position:relative;
      z-index:1;
      height:4px;
      margin-top:3px;
      border:1px solid rgba(246,248,250,.13);
      background:rgba(246,248,250,.055);
      overflow:hidden;
      clip-path:polygon(4px 0,100% 0,100% 100%,0 100%,0 4px);
    }
    #barrage-ui .wave-timer i{
      display:block;
      height:100%;
      width:0;
      background:linear-gradient(90deg,rgba(142,239,255,.28),rgba(216,226,234,.86));
      box-shadow:0 0 12px rgba(142,239,255,.36);
    }
    #barrage-ui .pause-control{
      width:82px;
      height:52px;
      padding:0 10px;
      display:grid;
      grid-template-columns:18px 1fr;
      gap:7px;
      align-items:center;
      justify-items:center;
      font-size:11px;
      font-weight:900;
      pointer-events:auto;
      border-color:rgba(246,248,250,.20);
      background:linear-gradient(180deg,rgba(246,248,250,.12),rgba(5,6,7,.72));
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
    }
    #barrage-ui .pause-control::before{
      content:"";
      display:block;
      width:13px;
      height:15px;
      margin:auto;
      border-left:4px solid var(--ui-text);
      border-right:4px solid var(--ui-text);
    }
    #barrage-ui .pause-control span{
      color:var(--ui-text);
      line-height:1;
      white-space:nowrap;
    }
    #barrage-ui .hud-counter{
      position:relative;
      min-width:0;
      height:52px;
      padding:7px 9px;
      border:1px solid rgba(246,248,250,.16);
      border-left:4px solid var(--ui-silver);
      background:linear-gradient(180deg,rgba(246,248,250,.075),rgba(5,6,7,.70));
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
      overflow:hidden;
    }
    #barrage-ui .hud-counter::after{
      content:"";
      position:absolute;
      inset:0;
      background:linear-gradient(110deg,transparent 0 55%,rgba(246,248,250,.075) 56%,transparent 72%);
      pointer-events:none;
    }
    #barrage-ui .counter-line{
      position:relative;
      z-index:1;
      display:grid;
      grid-template-columns:42px minmax(0,1fr);
      align-items:center;
      gap:7px;
      height:18px;
      font-weight:900;
    }
    #barrage-ui .counter-line + .counter-line{
      margin-top:2px;
      padding-top:4px;
      border-top:1px solid rgba(246,248,250,.10);
    }
    #barrage-ui .counter-line b{
      color:var(--ui-faint);
      font-size:9px;
      line-height:1;
    }
    #barrage-ui .counter-line span{
      min-width:0;
      color:var(--ui-text);
      font-size:14px;
      line-height:1;
      text-align:right;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .hud-dock{
      position:absolute;
      z-index:2;
      left:12px;
      right:12px;
      bottom:10px;
      padding:8px 9px;
      border:1px solid rgba(246,248,250,.14);
      border-bottom-color:rgba(246,248,250,.22);
      background:linear-gradient(180deg,rgba(246,248,250,.052),rgba(5,6,7,.78));
      clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px);
      display:grid;
      grid-template-columns:minmax(0,1fr) 72px;
      gap:7px;
      align-items:end;
      box-shadow:0 16px 30px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.05);
    }
    #barrage-ui .hud-dock::before{
      content:"";
      position:absolute;
      left:10px;
      right:10px;
      top:5px;
      height:1px;
      background:linear-gradient(90deg,transparent,rgba(142,239,255,.42),rgba(246,248,250,.26),transparent);
      opacity:.76;
    }
    #barrage-ui .hud-meters{
      min-width:0;
      display:grid;
      gap:4px;
    }
    #barrage-ui .meter-row{
      display:grid;
      grid-template-columns:48px minmax(0,1fr) 56px;
      align-items:center;
      gap:7px;
      height:16px;
      font-size:10px;
      font-weight:900;
      color:var(--ui-muted);
    }
    #barrage-ui .meter-row span{
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .meter-row strong{
      text-align:right;
      color:var(--ui-text);
      font-size:10px;
      line-height:1;
      white-space:nowrap;
    }
    #barrage-ui .meter-track{
      height:10px;
      border:1px solid rgba(246,248,250,.16);
      background:rgba(246,248,250,.052);
      overflow:hidden;
      clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
    }
    #barrage-ui .meter-track i{
      display:block;
      height:100%;
      width:50%;
      background:linear-gradient(90deg,var(--meter-a),var(--meter-b));
      box-shadow:0 0 12px var(--meter-a);
      transition:width .14s linear;
    }
    #barrage-ui .meter-row.is-primary{
      grid-template-columns:48px minmax(0,1fr) 62px;
      height:20px;
      color:var(--ui-text);
    }
    #barrage-ui .meter-row.is-primary .meter-track{
      height:14px;
      border-color:rgba(255,93,126,.26);
    }
    #barrage-ui .meter-row.is-primary span,
    #barrage-ui .meter-row.is-primary strong{
      font-size:11px;
    }
    #barrage-ui .run-chips{
      display:grid;
      grid-template-columns:1fr;
      gap:4px;
    }
    #barrage-ui .run-chip{
      min-width:0;
      height:20px;
      padding:0 7px;
      display:grid;
      grid-template-columns:1fr auto;
      align-items:center;
      border:1px solid rgba(246,248,250,.12);
      background:linear-gradient(180deg,rgba(246,248,250,.070),rgba(5,6,7,.48));
      clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);
      font-weight:900;
    }
    #barrage-ui .run-chip b{
      font-size:8px;
      color:var(--ui-faint);
    }
    #barrage-ui .run-chip span{
      font-size:12px;
      color:var(--ui-text);
      line-height:1;
      white-space:nowrap;
    }
    @keyframes hudCriticalPulse{
      0%,100%{filter:brightness(1);box-shadow:0 0 10px rgba(255,93,126,.34)}
      50%{filter:brightness(1.35);box-shadow:0 0 20px rgba(255,93,126,.72)}
    }
    #barrage-ui .hud.critical .meter-row.is-primary .meter-track{
      border-color:rgba(255,93,126,.72);
      box-shadow:0 0 14px rgba(255,93,126,.30),inset 0 0 12px rgba(255,93,126,.12);
    }
    #barrage-ui .hud.critical .meter-row.is-primary .meter-track i{
      animation:hudCriticalPulse 1s ease-in-out infinite;
    }
    #barrage-ui .upgrade-overlay{
      background:
        radial-gradient(circle at 72% 22%,rgba(142,239,255,.11),transparent 30%),
        linear-gradient(180deg,rgba(5,6,7,.22),rgba(5,6,7,.66) 44%,rgba(5,6,7,.90));
    }
    #barrage-ui .level-dialog{
      pointer-events:auto;
      position:absolute;
      left:16px;
      right:16px;
      top:92px;
      padding:16px;
      border:1px solid rgba(246,248,250,.18);
      background:linear-gradient(180deg,rgba(246,248,250,.09),rgba(8,9,12,.88));
      clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);
      box-shadow:0 24px 54px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07);
    }
    #barrage-ui .level-head{
      display:grid;
      grid-template-columns:1fr 74px;
      gap:10px;
      align-items:start;
      margin-bottom:10px;
    }
    #barrage-ui .level-title{
      font-size:31px;
      line-height:1;
      font-weight:900;
      text-shadow:2px 2px 0 rgba(142,239,255,.18);
    }
    #barrage-ui .level-note{
      margin-top:6px;
      color:var(--ui-muted);
      font-size:10px;
      font-weight:900;
    }
    #barrage-ui .level-sp{
      height:34px;
      display:grid;
      place-items:center;
      color:var(--ui-text);
      border:1px solid rgba(246,248,250,.18);
      background:rgba(246,248,250,.06);
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
      font-size:12px;
      font-weight:900;
    }
    #barrage-ui .level-dialog .upgrade-grid{
      display:grid;
      grid-template-columns:1fr;
      gap:9px;
    }
    #barrage-ui .level-dialog .upgrade-card{
      min-height:92px;
      padding:12px 98px 12px 13px;
      background:linear-gradient(180deg,rgba(246,248,250,.085),rgba(7,9,11,.78));
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05);
    }
    #barrage-ui .level-dialog .upgrade-card::after{
      content:"";
      position:absolute;
      right:88px;
      top:12px;
      bottom:12px;
      width:1px;
      background:linear-gradient(180deg,transparent,rgba(246,248,250,.18),transparent);
    }
    #barrage-ui .level-dialog .upgrade-card button{
      top:50%;
      bottom:auto;
      transform:translateY(-50%);
      height:48px;
      min-width:76px;
      border-color:rgba(246,248,250,.28);
      background:linear-gradient(180deg,rgba(246,248,250,.13),rgba(246,248,250,.055));
    }
    #barrage-ui .level-dialog .upgrade-card button:hover{
      border-color:var(--accent);
      box-shadow:0 0 16px color-mix(in srgb,var(--accent),transparent 70%);
    }
    #barrage-ui .dialog-card{
      position:absolute;
      z-index:2;
      left:24px;
      right:24px;
      top:154px;
      padding:18px;
      display:grid;
      gap:14px;
      border:1px solid rgba(246,248,250,.18);
      background:linear-gradient(180deg,rgba(246,248,250,.095),rgba(8,9,12,.88));
      clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);
      box-shadow:0 24px 54px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07);
    }
    #barrage-ui .dialog-title{
      font-size:32px;
      line-height:1;
      font-weight:900;
      color:var(--ui-text);
      text-shadow:2px 2px 0 rgba(142,239,255,.20);
    }
    #barrage-ui .dialog-actions{
      display:grid;
      gap:8px;
    }
    #barrage-ui .dialog-actions button{
      height:48px;
      font-size:15px;
      border-color:rgba(246,248,250,.22);
      background:linear-gradient(180deg,rgba(246,248,250,.12),rgba(246,248,250,.045));
    }
    #barrage-ui .result-grid{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
    }
    #barrage-ui .result-stat{
      min-height:58px;
      padding:10px;
      border:1px solid rgba(246,248,250,.12);
      background:linear-gradient(180deg,rgba(246,248,250,.070),rgba(5,6,7,.52));
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .result-stat b{
      display:block;
      font-size:9px;
      color:var(--ui-faint);
      line-height:1;
    }
    #barrage-ui .result-stat span{
      display:block;
      margin-top:8px;
      font-size:14px;
      font-weight:900;
      color:var(--ui-text);
      line-height:1;
    }
    #barrage-ui .modal-screen{
      background:
        radial-gradient(circle at 72% 20%,rgba(142,239,255,.10),transparent 30%),
        linear-gradient(180deg,rgba(5,6,7,.38),rgba(5,6,7,.80));
    }
    #barrage-ui .modal-screen::before{display:none}
    #barrage-ui .modal-screen::after{display:none}
    #barrage-ui .home-screen{
      background:
        linear-gradient(180deg,#05070b 0%,#10131a 45%,#050609 100%),
        repeating-linear-gradient(90deg,rgba(244,251,255,.032) 0 1px,transparent 1px 46px);
    }
    #barrage-ui .home-screen::before{
      opacity:.26;
      background:
        linear-gradient(rgba(244,251,255,.040) 1px,transparent 1px),
        linear-gradient(90deg,rgba(244,251,255,.032) 1px,transparent 1px);
      background-size:38px 38px;
      transform:perspective(340px) rotateX(58deg) translateY(48px) scale(1.45);
    }
    #barrage-ui .home-screen::after{
      bottom:128px;
      background:linear-gradient(90deg,transparent,rgba(142,239,255,.44),rgba(255,93,126,.28),transparent);
    }
    #barrage-ui .home-hub{
      padding:14px;
    }
    #barrage-ui .home-hub::before{
      content:"";
      position:absolute;
      left:14px;
      right:14px;
      top:86px;
      height:282px;
      border:1px solid rgba(246,248,250,.11);
      background:
        linear-gradient(115deg,transparent 0 46%,rgba(142,239,255,.10) 46% 47%,transparent 47%),
        linear-gradient(180deg,rgba(246,248,250,.055),rgba(5,7,10,.62));
      clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 20px 46px rgba(0,0,0,.26);
    }
    #barrage-ui .home-header{
      position:absolute;
      z-index:2;
      left:14px;
      right:14px;
      top:14px;
      display:grid;
      grid-template-columns:1fr 112px;
      gap:10px;
    }
    #barrage-ui .brand-lockup{
      position:relative;
      height:60px;
      padding:10px 16px 9px 18px;
      border:1px solid rgba(246,248,250,.30);
      background:#07090d;
      clip-path:polygon(18px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 18px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 16px 28px rgba(0,0,0,.25);
    }
    #barrage-ui .brand-lockup::before{
      content:"";
      position:absolute;
      left:0;
      top:0;
      bottom:0;
      width:5px;
      background:#f6f8fa;
    }
    #barrage-ui .brand-lockup::after{
      content:"";
      position:absolute;
      left:18px;
      bottom:9px;
      width:132px;
      height:3px;
      background:linear-gradient(90deg,var(--ui-cyan),rgba(255,93,126,.75),transparent);
      box-shadow:0 0 14px rgba(142,239,255,.26);
    }
    #barrage-ui .brand-lockup span{
      display:block;
      font-size:34px;
      line-height:.84;
      font-weight:900;
      color:#fff;
      transform:skewX(-8deg);
      text-shadow:-2px -1px 0 rgba(142,239,255,.58),2px 2px 0 rgba(80,84,92,.62);
      white-space:nowrap;
    }
    #barrage-ui .brand-lockup small{
      position:absolute;
      right:16px;
      bottom:11px;
      color:var(--ui-muted);
      font-size:9px;
      font-weight:900;
      line-height:1;
    }
    #barrage-ui .wallet-chip{
      height:60px;
      padding:10px 12px 8px;
      text-align:right;
      border:1px solid rgba(246,248,250,.18);
      background:linear-gradient(180deg,rgba(246,248,250,.075),rgba(5,7,10,.70));
      clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px);
    }
    #barrage-ui .wallet-chip b{
      display:block;
      color:var(--ui-faint);
      font-size:9px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .wallet-chip span{
      display:block;
      margin-top:8px;
      color:#fff;
      font-size:18px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .hangar-visual{
      position:absolute;
      z-index:2;
      left:14px;
      right:14px;
      top:86px;
      height:282px;
      overflow:hidden;
      pointer-events:none;
    }
    #barrage-ui .hangar-visual::before{
      content:"";
      position:absolute;
      left:32px;
      right:32px;
      bottom:38px;
      height:48px;
      background:repeating-linear-gradient(90deg,rgba(246,248,250,.10) 0 2px,transparent 2px 18px);
      transform:perspective(190px) rotateX(60deg);
      opacity:.38;
    }
    #barrage-ui .hangar-rails{
      position:absolute;
      left:24px;
      right:24px;
      top:60px;
      bottom:28px;
      border-top:1px solid rgba(142,239,255,.24);
      border-bottom:1px solid rgba(246,248,250,.10);
    }
    #barrage-ui .hangar-rails::before,
    #barrage-ui .hangar-rails::after{
      content:"";
      position:absolute;
      top:-1px;
      bottom:-1px;
      width:1px;
      background:linear-gradient(180deg,rgba(142,239,255,.30),transparent);
    }
    #barrage-ui .hangar-rails::before{left:28px;transform:skewX(-18deg)}
    #barrage-ui .hangar-rails::after{right:28px;transform:skewX(18deg)}
    #barrage-ui .ship-showcase{
      position:absolute;
      left:144px;
      top:64px;
      width:176px;
      height:176px;
      filter:drop-shadow(0 0 24px rgba(142,239,255,.22));
    }
    #barrage-ui .ship-showcase::before{
      content:"";
      position:absolute;
      left:20px;
      top:20px;
      width:136px;
      height:136px;
      border:1px solid rgba(142,239,255,.24);
      transform:rotate(45deg);
      box-shadow:0 0 22px rgba(142,239,255,.08);
    }
    #barrage-ui .ship-showcase::after{
      content:"";
      position:absolute;
      left:21px;
      top:80px;
      width:134px;
      height:52px;
      background:
        linear-gradient(90deg,rgba(142,239,255,.14),rgba(246,248,250,.88) 18% 28%,rgba(22,30,42,.92) 42% 58%,rgba(246,248,250,.88) 72% 82%,rgba(142,239,255,.14));
      clip-path:polygon(0 50%,32% 10%,43% 38%,50% 28%,57% 38%,68% 10%,100% 50%,75% 90%,57% 70%,50% 82%,43% 70%,25% 90%);
      box-shadow:0 0 18px rgba(142,239,255,.16);
    }
    #barrage-ui .ship-nose{
      position:absolute;
      left:76px;
      top:13px;
      width:22px;
      height:142px;
      background:linear-gradient(180deg,#ffffff 0%,#e9faff 22%,var(--ui-cyan) 45%,#101820 100%);
      clip-path:polygon(50% 0,82% 25%,68% 86%,50% 100%,32% 86%,18% 25%);
      box-shadow:0 0 16px rgba(142,239,255,.30);
    }
    #barrage-ui .ship-core{
      position:absolute;
      left:65px;
      top:72px;
      width:44px;
      height:64px;
      background:linear-gradient(180deg,rgba(142,239,255,.68),rgba(7,12,18,.96));
      clip-path:polygon(50% 0,78% 24%,64% 100%,36% 100%,22% 24%);
      box-shadow:inset 0 0 18px rgba(255,255,255,.14),0 0 14px rgba(142,239,255,.18);
    }
    #barrage-ui .ship-core::before,
    #barrage-ui .ship-core::after{
      content:"";
      position:absolute;
      bottom:-26px;
      width:16px;
      height:32px;
      background:linear-gradient(180deg,#101820 0%,var(--ui-cyan) 58%,rgba(142,239,255,.08) 100%);
      clip-path:polygon(24% 0,76% 0,100% 72%,50% 100%,0 72%);
      box-shadow:0 0 12px rgba(142,239,255,.26);
    }
    #barrage-ui .ship-core::before{left:-15px}
    #barrage-ui .ship-core::after{right:-15px}
    #barrage-ui .mission-tag{
      position:absolute;
      z-index:3;
      left:32px;
      top:108px;
      min-width:104px;
      height:30px;
      display:grid;
      place-items:center;
      padding:0 14px;
      color:#05070b;
      background:#f6f8fa;
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
      font-size:12px;
      font-weight:900;
    }
    #barrage-ui .record-stack{
      position:absolute;
      z-index:3;
      left:32px;
      top:150px;
      display:grid;
      gap:8px;
      width:126px;
    }
    #barrage-ui .record-pill{
      min-height:54px;
      padding:10px 11px;
      border:1px solid rgba(246,248,250,.14);
      background:rgba(5,7,10,.70);
      clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
    }
    #barrage-ui .record-pill b{
      display:block;
      color:var(--ui-faint);
      font-size:9px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .record-pill span{
      display:block;
      margin-top:7px;
      color:#fff;
      font-size:17px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .loadout-panel{
      position:absolute;
      z-index:3;
      left:24px;
      right:24px;
      top:386px;
      height:86px;
      display:grid;
      grid-template-columns:1fr 92px;
      gap:12px;
      padding:13px 14px;
      border:1px solid rgba(246,248,250,.15);
      background:linear-gradient(180deg,rgba(246,248,250,.072),rgba(5,7,10,.76));
      clip-path:polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px);
      box-shadow:0 16px 34px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.06);
    }
    #barrage-ui .loadout-copy b{
      display:block;
      color:var(--ui-cyan);
      font-size:10px;
      line-height:1;
      font-weight:900;
    }
    #barrage-ui .loadout-copy h1{
      margin:7px 0 0;
      color:#fff;
      font-size:24px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui .loadout-copy p{
      margin:7px 0 0;
      color:var(--ui-muted);
      font-size:10px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui .base-sync{
      align-self:center;
      display:grid;
      gap:7px;
      text-align:right;
      color:var(--ui-muted);
      font-size:9px;
      font-weight:900;
      line-height:1;
    }
    #barrage-ui .sync-track{
      height:8px;
      border:1px solid rgba(246,248,250,.14);
      background:rgba(246,248,250,.052);
      overflow:hidden;
      clip-path:polygon(4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%,0 4px);
    }
    #barrage-ui .sync-track i{
      display:block;
      height:100%;
      background:linear-gradient(90deg,var(--ui-cyan),#ff5d7e);
      box-shadow:0 0 10px rgba(142,239,255,.40);
    }
    #barrage-ui .primary-start{
      left:64px;
      top:492px;
      width:262px;
      height:64px;
      border-color:rgba(255,255,255,.94);
      background:linear-gradient(180deg,#fff,#dfe5e9);
      color:#05070b;
      box-shadow:0 20px 34px rgba(0,0,0,.34),0 0 26px rgba(142,239,255,.14),inset 0 0 0 2px rgba(5,7,10,.11);
      clip-path:polygon(20px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 20px);
    }
    #barrage-ui .primary-start::before{
      content:"";
      position:absolute;
      left:12px;
      top:10px;
      bottom:10px;
      width:5px;
      background:rgba(5,7,10,.18);
    }
    #barrage-ui .primary-start::after{
      content:"";
      position:absolute;
      right:0;
      top:0;
      width:40px;
      height:100%;
      background:linear-gradient(135deg,transparent 0 42%,rgba(5,7,10,.16) 42% 58%,transparent 58%);
    }
    #barrage-ui .primary-start span{
      font-size:34px;
      line-height:.92;
    }
    #barrage-ui .primary-start small{
      margin-top:5px;
      color:rgba(5,7,10,.62);
      font-size:10px;
    }
    #barrage-ui .home-actions{
      position:absolute;
      z-index:3;
      left:20px;
      right:20px;
      top:574px;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:9px;
    }
    #barrage-ui .action-tile{
      position:relative;
      min-height:48px;
      padding:10px 30px 9px 14px;
      border:1px solid rgba(246,248,250,.14);
      background:linear-gradient(180deg,rgba(246,248,250,.072),rgba(5,7,10,.66));
      color:var(--ui-text);
      text-align:left;
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
    }
    #barrage-ui .action-tile::before{
      content:"";
      position:absolute;
      left:0;
      top:7px;
      bottom:7px;
      width:4px;
      background:var(--accent);
    }
    #barrage-ui .action-tile::after{
      content:">";
      position:absolute;
      right:12px;
      top:17px;
      color:var(--accent);
      font-size:14px;
      font-weight:900;
    }
    #barrage-ui .action-tile b{
      display:block;
      color:var(--accent);
      font-size:12px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui .action-tile span{
      display:block;
      margin-top:7px;
      color:var(--ui-muted);
      font-size:9px;
      line-height:1;
      font-weight:900;
      white-space:nowrap;
    }
    #barrage-ui button.action-tile{
      height:auto;
      min-height:48px;
    }
    #barrage-ui .action-tile.is-quiet{
      pointer-events:none;
      color:var(--ui-muted);
      opacity:.70;
    }
    #barrage-ui .action-tile.is-quiet::after{
      content:"";
      width:8px;
      height:8px;
      top:20px;
      right:14px;
      border:1px solid rgba(246,248,250,.36);
      background:rgba(246,248,250,.08);
    }
    #barrage-ui .home-screen{
      background:
        radial-gradient(circle at 78% 18%,rgba(142,239,255,.08),transparent 28%),
        radial-gradient(circle at 16% 72%,rgba(246,248,250,.055),transparent 30%),
        linear-gradient(180deg,rgba(5,5,6,.78) 0%,rgba(17,18,22,.66) 48%,rgba(5,5,6,.92) 100%);
    }
    #barrage-ui .home-screen::before{
      opacity:.18;
      background:
        linear-gradient(rgba(246,248,250,.055) 1px,transparent 1px),
        linear-gradient(90deg,rgba(246,248,250,.040) 1px,transparent 1px);
      background-size:34px 34px;
    }
    #barrage-ui .home-screen::after{
      background:linear-gradient(90deg,transparent,rgba(142,239,255,.24),rgba(246,248,250,.18),transparent);
      box-shadow:0 0 18px rgba(142,239,255,.10);
    }
    #barrage-ui .home-hub::before{
      left:12px;
      right:12px;
      top:84px;
      height:302px;
      border-color:rgba(142,239,255,.18);
      background:
        radial-gradient(ellipse at 76% 58%,rgba(142,239,255,.18),transparent 34%),
        linear-gradient(116deg,transparent 0 43%,rgba(142,239,255,.16) 43% 44%,transparent 44%),
        linear-gradient(180deg,rgba(246,248,250,.055),rgba(8,9,12,.34));
      box-shadow:0 20px 52px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.09),inset 0 -1px 0 rgba(142,239,255,.12);
    }
    #barrage-ui .brand-lockup{
      height:62px;
      background:#f5f3ea;
      border-color:#f5f3ea;
      box-shadow:6px 6px 0 #09090a,0 16px 30px rgba(0,0,0,.32);
    }
    #barrage-ui .brand-lockup::before{
      background:#09090a;
      width:6px;
    }
    #barrage-ui .brand-lockup::after{
      bottom:8px;
      width:142px;
      background:linear-gradient(90deg,#101114 0 42%,#8eefff 42% 70%,#f6f8fa 70% 100%);
      box-shadow:none;
    }
    #barrage-ui .brand-lockup span{
      color:#08090a;
      font-size:35px;
      text-shadow:2px 2px 0 #8eefff,-1px -1px 0 #fff;
    }
    #barrage-ui .brand-lockup small{
      right:13px;
      bottom:13px;
      padding:3px 6px;
      color:#f6f8fa;
      background:#08090a;
      clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
    }
    #barrage-ui .wallet-chip{
      height:62px;
      background:#09090a;
      border-color:#8eefff;
      box-shadow:inset 0 0 0 1px rgba(142,239,255,.18);
    }
    #barrage-ui .wallet-chip b{color:#8eefff}
    #barrage-ui .wallet-chip span{font-size:19px;color:#f6f8fa}
    #barrage-ui .home-decal{
      position:absolute;
      z-index:3;
      height:22px;
      display:grid;
      place-items:center;
      padding:0 10px;
      color:#070809;
      background:#f5f3ea;
      font-size:9px;
      line-height:1;
      font-weight:900;
      letter-spacing:0;
      transform:rotate(-2deg);
      box-shadow:4px 4px 0 rgba(0,0,0,.52);
      clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);
    }
    #barrage-ui .home-decal-a{right:34px;top:93px}
    #barrage-ui .home-decal-b{
      left:30px;
      top:343px;
      color:#f6f8fa;
      background:#30343a;
      transform:rotate(1.5deg);
    }
    #barrage-ui .home-dots{
      position:absolute;
      right:28px;
      top:28px;
      width:96px;
      height:76px;
      opacity:.20;
      background:radial-gradient(circle,#f6f8fa 0 1.5px,transparent 1.8px);
      background-size:10px 10px;
    }
    #barrage-ui .hollow-tape{
      position:absolute;
      left:-12px;
      right:-12px;
      bottom:11px;
      height:8px;
      background:repeating-linear-gradient(135deg,#f5f3ea 0 10px,#08090a 10px 20px);
      opacity:.22;
      transform:rotate(-1.2deg);
    }
    #barrage-ui .hangar-visual{
      top:84px;
      height:302px;
    }
    #barrage-ui .hangar-visual::after{
      content:"";
      position:absolute;
      left:150px;
      right:14px;
      bottom:18px;
      height:128px;
      background:
        radial-gradient(ellipse at 54% 62%,rgba(142,239,255,.24),transparent 54%),
        linear-gradient(180deg,transparent,rgba(246,248,250,.06));
      opacity:.72;
      filter:blur(.2px);
      pointer-events:none;
    }
    #barrage-ui .hangar-rails{
      left:20px;
      right:20px;
      top:56px;
      bottom:36px;
      border-top-color:rgba(142,239,255,.30);
      border-bottom-color:rgba(246,248,250,.16);
    }
    #barrage-ui .hangar-status{
      position:absolute;
      right:22px;
      top:18px;
      width:118px;
      height:46px;
      padding:9px 10px;
      color:#08090a;
      background:#f5f3ea;
      font-size:10px;
      font-weight:900;
      line-height:1;
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
      box-shadow:4px 4px 0 rgba(0,0,0,.46);
    }
    #barrage-ui .hangar-status b{
      display:block;
      color:#52616b;
      font-size:10px;
    }
    #barrage-ui .hangar-status span{
      display:block;
      margin-top:8px;
      color:#08090a;
      font-size:13px;
    }
    #barrage-ui .mission-tag{
      top:105px;
      background:#f5f3ea;
      color:#08090a;
      box-shadow:5px 5px 0 rgba(0,0,0,.54);
      transform:rotate(-1.5deg);
      height:34px;
      min-width:126px;
      padding:0 34px 0 14px;
      font-size:13px;
    }
    #barrage-ui .mission-tag::after{
      content:"";
      position:absolute;
      right:10px;
      top:7px;
      width:16px;
      height:16px;
      border:3px solid #08090a;
      border-left:0;
      border-bottom:0;
      transform:rotate(45deg);
      opacity:.85;
    }
    #barrage-ui .record-stack{
      left:30px;
      top:158px;
      width:136px;
      gap:8px;
    }
    #barrage-ui .record-pill{
      min-height:58px;
      padding:10px 12px;
      background:linear-gradient(180deg,rgba(8,9,10,.92),rgba(8,9,10,.72));
      border-color:rgba(246,248,250,.18);
      box-shadow:4px 4px 0 rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.05);
    }
    #barrage-ui .record-pill b{
      color:#cbd3da;
      font-size:10px;
    }
    #barrage-ui .record-pill span{
      font-size:22px;
      margin-top:8px;
    }
    #barrage-ui .ship-showcase{
      left:156px;
      top:70px;
      filter:drop-shadow(0 0 22px rgba(142,239,255,.18));
      display:none;
    }
    #barrage-ui .ship-showcase::before{
      border-color:rgba(246,248,250,.22);
      box-shadow:8px 8px 0 rgba(142,239,255,.08);
    }
    #barrage-ui .loadout-panel{
      top:390px;
      height:82px;
      grid-template-columns:1fr 88px;
      background:#f5f3ea;
      border:0;
      color:#08090a;
      box-shadow:6px 6px 0 #08090a,0 18px 36px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.78);
    }
    #barrage-ui .loadout-copy b{
      color:#52616b;
      font-size:11px;
    }
    #barrage-ui .loadout-copy h1{
      color:#08090a;
      font-size:27px;
    }
    #barrage-ui .loadout-copy p{
      color:#3b4147;
      font-size:11px;
      line-height:1.2;
    }
    #barrage-ui .base-sync{
      color:#31363c;
      font-size:10px;
    }
    #barrage-ui .sync-track{
      height:9px;
      border-color:#08090a;
      background:#08090a;
    }
    #barrage-ui .sync-track i{
      background:linear-gradient(90deg,#f6f8fa,#8eefff);
      box-shadow:none;
    }
    #barrage-ui .primary-start{
      left:48px;
      top:492px;
      width:294px;
      height:70px;
      color:#08090a;
      border:0;
      background:#f5f3ea;
      box-shadow:7px 7px 0 #08090a,0 18px 34px rgba(0,0,0,.38),0 0 24px rgba(142,239,255,.18);
      transform:rotate(-1deg);
    }
    #barrage-ui .primary-start:hover{
      background:#ffffff;
      filter:none;
    }
    #barrage-ui .primary-start span{
      font-size:42px;
      line-height:.9;
      text-shadow:2px 2px 0 #f6f8fa;
    }
    #barrage-ui .primary-start span::before{
      content:">> ";
      font-size:21px;
      vertical-align:5px;
    }
    #barrage-ui .primary-start small{
      color:#08090a;
      font-size:11px;
    }
    #barrage-ui .home-actions{
      left:18px;
      right:18px;
      top:574px;
      gap:10px;
    }
    #barrage-ui .action-tile{
      min-height:52px;
      padding:11px 30px 10px 14px;
      background:#101114;
      border-color:rgba(246,248,250,.16);
      box-shadow:3px 3px 0 rgba(0,0,0,.42);
    }
    #barrage-ui button.action-tile:hover{
      border-color:rgba(142,239,255,.42);
      box-shadow:3px 3px 0 rgba(0,0,0,.42),0 0 18px rgba(142,239,255,.10);
    }
    #barrage-ui .action-tile:nth-child(2){
      background:#f5f3ea;
      border-color:#f5f3ea;
    }
    #barrage-ui .action-tile:nth-child(2) b,
    #barrage-ui .action-tile:nth-child(2)::after{
      color:#08090a;
    }
    #barrage-ui .action-tile:nth-child(2) span{
      color:#4a5158;
    }
    #barrage-ui .action-tile b{
      font-size:13px;
    }
    #barrage-ui .action-tile span{
      margin-top:7px;
      font-size:10px;
    }
    @keyframes zzzHomePanelIn{
      from{opacity:1;transform:translateY(14px) skewY(-1deg)}
      to{opacity:1;transform:translateY(0) skewY(0)}
    }
    @keyframes zzzShipFloat{
      0%,100%{transform:translateY(0) rotate(-1deg)}
      50%{transform:translateY(-8px) rotate(1deg)}
    }
    @keyframes zzzTapeFlow{
      from{background-position:0 0}
      to{background-position:40px 0}
    }
    @keyframes zzzButtonPulse{
      0%,100%{box-shadow:7px 7px 0 #08090a,0 18px 34px rgba(0,0,0,.38),0 0 18px rgba(142,239,255,.14)}
      50%{box-shadow:7px 7px 0 #08090a,0 18px 34px rgba(0,0,0,.38),0 0 34px rgba(142,239,255,.26)}
    }
    @keyframes zzzStartIn{
      from{opacity:1;transform:translateY(16px) rotate(-3deg) skewY(-1deg)}
      to{opacity:1;transform:translateY(0) rotate(-1deg) skewY(0)}
    }
    @keyframes zzzDecalPop{
      from{opacity:1;transform:translateY(-8px) rotate(-4deg) scale(.96)}
      to{opacity:1;transform:translateY(0) rotate(-2deg) scale(1)}
    }
    @keyframes zzzDataBlink{
      0%,92%,100%{opacity:.22}
      94%{opacity:.46}
      96%{opacity:.12}
    }
    #barrage-ui .home-hub::before{animation:zzzHomePanelIn .42s cubic-bezier(.2,.9,.2,1) both}
    #barrage-ui .brand-lockup{animation:zzzHomePanelIn .34s cubic-bezier(.2,.9,.2,1) both}
    #barrage-ui .wallet-chip{animation:zzzHomePanelIn .40s cubic-bezier(.2,.9,.2,1) .04s both}
    #barrage-ui .mission-tag{animation:zzzDecalPop .34s cubic-bezier(.2,.9,.2,1) .08s both}
    #barrage-ui .home-decal-a{animation:zzzDecalPop .34s cubic-bezier(.2,.9,.2,1) .13s both}
    #barrage-ui .home-decal-b{animation:zzzHomePanelIn .34s cubic-bezier(.2,.9,.2,1) .18s both}
    #barrage-ui .record-pill{animation:zzzHomePanelIn .34s cubic-bezier(.2,.9,.2,1) .10s both}
    #barrage-ui .record-pill:nth-child(2){animation-delay:.15s}
    #barrage-ui .loadout-panel{animation:zzzHomePanelIn .38s cubic-bezier(.2,.9,.2,1) .18s both}
    #barrage-ui .action-tile{animation:zzzHomePanelIn .32s cubic-bezier(.2,.9,.2,1) .24s both}
    #barrage-ui .action-tile:nth-child(2){animation-delay:.28s}
    #barrage-ui .action-tile:nth-child(3){animation-delay:.32s}
    #barrage-ui .action-tile:nth-child(4){animation-delay:.36s}
    #barrage-ui .ship-showcase{animation:zzzShipFloat 4.2s ease-in-out infinite}
    #barrage-ui .hollow-tape{animation:zzzTapeFlow 1.2s linear infinite}
    #barrage-ui .home-dots{animation:zzzDataBlink 2.4s steps(1,end) infinite}
    #barrage-ui .primary-start{animation:zzzStartIn .36s cubic-bezier(.2,.9,.2,1) .20s both,zzzButtonPulse 2.6s ease-in-out 1.0s infinite}

    /* Rebuild from the old canvas UI: same silhouettes, monochrome finish. */
    #barrage-ui .home-screen{
      background:
        linear-gradient(180deg,rgba(9,11,16,.70),rgba(4,5,8,.86)),
        repeating-linear-gradient(0deg,rgba(246,248,250,.030) 0 1px,transparent 1px 18px);
    }
    #barrage-ui .home-screen::before{
      opacity:.18;
      background:
        linear-gradient(rgba(142,239,255,.075) 1px,transparent 1px),
        linear-gradient(90deg,rgba(246,248,250,.055) 1px,transparent 1px);
      background-size:36px 36px;
      transform:perspective(330px) rotateX(59deg) translateY(48px) scale(1.48);
    }
    #barrage-ui .home-screen::after{
      bottom:344px;
      height:1px;
      background:linear-gradient(90deg,transparent,rgba(142,239,255,.62),rgba(246,248,250,.24),transparent);
      box-shadow:0 0 24px rgba(142,239,255,.16);
    }
    #barrage-ui .home-hub{
      padding:0;
    }
    #barrage-ui .home-hub::before{
      left:14px;
      right:14px;
      top:78px;
      height:276px;
      border-color:rgba(142,239,255,.64);
      background:
        linear-gradient(90deg,rgba(142,239,255,.56) 0 3px,transparent 3px),
        linear-gradient(180deg,rgba(142,239,255,.075),rgba(9,17,22,.42));
      box-shadow:inset 0 0 0 1px rgba(246,248,250,.08),inset 0 -74px 0 rgba(0,0,0,.24),0 20px 44px rgba(0,0,0,.28);
      clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px);
      animation:zzzHomePanelIn .34s cubic-bezier(.2,.9,.2,1) both;
    }
    #barrage-ui .home-hub::after{
      content:"";
      position:absolute;
      z-index:1;
      left:0;
      right:0;
      top:354px;
      bottom:0;
      background:
        linear-gradient(180deg,rgba(4,5,8,.92),rgba(4,5,8,.98)),
        repeating-linear-gradient(0deg,rgba(246,248,250,.026) 0 1px,transparent 1px 18px);
      pointer-events:none;
    }
    #barrage-ui .home-header{
      left:0;
      right:0;
      top:0;
      height:70px;
      display:block;
      pointer-events:none;
    }
    #barrage-ui .brand-lockup{
      position:absolute;
      left:0;
      top:0;
      width:282px;
      height:70px;
      padding:19px 58px 0 18px;
      border-color:rgba(246,248,250,.22);
      border-left:4px solid rgba(184,167,255,.78);
      background:linear-gradient(180deg,#090a0f,#06070b);
      box-shadow:6px 6px 0 rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.07);
      clip-path:polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px);
    }
    #barrage-ui .brand-lockup::before{
      left:18px;
      top:5px;
      bottom:auto;
      width:118px;
      height:3px;
      background:linear-gradient(90deg,#d8e2ea,#8eefff,transparent);
    }
    #barrage-ui .brand-lockup::after{
      content:">>>";
      right:13px;
      left:auto;
      bottom:22px;
      width:auto;
      height:auto;
      color:rgba(216,226,234,.78);
      background:none;
      box-shadow:none;
      font-size:24px;
      line-height:1;
      letter-spacing:0;
      font-weight:900;
      transform:none;
    }
    #barrage-ui .brand-lockup span{
      color:#f6f8fa;
      font-size:37px;
      line-height:.82;
      text-shadow:-2px -1px 0 rgba(142,239,255,.72),2px 2px 0 rgba(255,93,126,.58),0 0 18px rgba(142,239,255,.18);
      transform:skewX(-7deg);
    }
    #barrage-ui .brand-lockup small{
      display:none;
    }
    #barrage-ui .wallet-chip{
      position:absolute;
      right:0;
      top:10px;
      width:108px;
      height:50px;
      padding:9px 34px 0 10px;
      text-align:left;
      border-color:rgba(246,248,250,.20);
      border-left:4px solid rgba(184,167,255,.78);
      background:linear-gradient(180deg,#101318,#07080b);
      box-shadow:4px 4px 0 rgba(0,0,0,.50),inset 0 1px 0 rgba(255,255,255,.06);
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
    }
    #barrage-ui .wallet-chip::after{
      content:"";
      position:absolute;
      right:10px;
      top:15px;
      width:18px;
      height:18px;
      border:2px solid rgba(142,239,255,.75);
      background:linear-gradient(135deg,rgba(142,239,255,.28),rgba(216,226,234,.05));
      transform:rotate(45deg);
      box-shadow:0 0 14px rgba(142,239,255,.28);
    }
    #barrage-ui .wallet-chip b{
      color:#d8e2ea;
      font-size:8px;
    }
    #barrage-ui .wallet-chip span{
      margin-top:6px;
      color:#f6f8fa;
      font-size:17px;
    }
    #barrage-ui .hangar-visual{
      left:14px;
      right:14px;
      top:78px;
      height:276px;
      pointer-events:none;
    }
    #barrage-ui .hangar-visual::after{
      left:184px;
      right:16px;
      bottom:58px;
      height:98px;
      opacity:.82;
      background:
        radial-gradient(ellipse at 50% 50%,rgba(142,239,255,.30),transparent 58%),
        repeating-radial-gradient(circle at 50% 50%,rgba(142,239,255,.72) 0 2px,transparent 2px 20px);
      filter:none;
      mask-image:radial-gradient(circle at 50% 50%,#000 0 63%,transparent 64%);
    }
    #barrage-ui .hangar-rails{
      left:34px;
      right:26px;
      top:38px;
      bottom:84px;
      border-top-color:rgba(142,239,255,.24);
      border-bottom-color:rgba(246,248,250,.12);
    }
    #barrage-ui .home-dots,
    #barrage-ui .hollow-tape{
      display:none;
    }
    #barrage-ui .hangar-status{
      right:30px;
      left:30px;
      top:248px;
      width:auto;
      height:24px;
      padding:0;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:7px;
      color:rgba(216,226,234,.62);
      background:linear-gradient(180deg,rgba(5,6,7,.90),rgba(5,6,7,.70));
      border:1px solid rgba(246,248,250,.12);
      box-shadow:3px 3px 0 rgba(0,0,0,.52);
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .hangar-status b,
    #barrage-ui .hangar-status span{
      margin:0;
      color:rgba(216,226,234,.64);
      font-size:10px;
      line-height:1;
    }
    #barrage-ui .mission-tag{
      left:70px;
      top:92px;
      height:30px;
      min-width:104px;
      padding:0 18px;
      color:#070808;
      background:linear-gradient(180deg,#f6f8fa,#cfd7dd);
      box-shadow:4px 4px 0 rgba(0,0,0,.48);
      transform:none;
      font-size:13px;
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .mission-tag::after{
      display:none;
    }
    #barrage-ui .record-stack{
      left:auto;
      right:30px;
      top:96px;
      width:108px;
      gap:0;
    }
    #barrage-ui .record-pill{
      min-height:58px;
      padding:9px 10px;
      background:linear-gradient(180deg,rgba(9,11,17,.96),rgba(5,6,7,.88));
      border-color:rgba(216,226,234,.22);
      border-left:4px solid rgba(184,167,255,.72);
      box-shadow:4px 4px 0 rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.05);
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .record-pill b{
      color:#cfd7dd;
      font-size:9px;
    }
    #barrage-ui .record-pill span{
      margin-top:6px;
      color:#f6f8fa;
      font-size:16px;
      line-height:1;
    }
    #barrage-ui .record-pill small{
      display:block;
      margin-top:6px;
      color:#8eefff;
      font-size:10px;
      font-weight:900;
      line-height:1;
    }
    #barrage-ui .loadout-panel{
      left:32px;
      right:32px;
      top:268px;
      height:54px;
      padding:9px 14px;
      grid-template-columns:1fr 86px;
      border:1px solid rgba(246,248,250,.16);
      background:linear-gradient(180deg,rgba(5,7,10,.96),rgba(8,13,17,.90));
      color:#f6f8fa;
      box-shadow:4px 4px 0 rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.05);
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
    }
    #barrage-ui .loadout-copy b{
      color:#cfd7dd;
      font-size:9px;
    }
    #barrage-ui .loadout-copy h1{
      margin-top:4px;
      color:#f6f8fa;
      font-size:21px;
      line-height:.96;
      max-width:186px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .loadout-copy p{
      margin-top:4px;
      color:#8eefff;
      font-size:10px;
      line-height:1;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .base-sync{
      align-self:center;
      color:#cfd7dd;
      font-size:9px;
    }
    #barrage-ui .sync-track{
      height:7px;
      border-color:rgba(216,226,234,.34);
      background:rgba(5,6,7,.84);
    }
    #barrage-ui .sync-track i{
      background:linear-gradient(90deg,#d8e2ea,#8eefff);
      box-shadow:0 0 12px rgba(142,239,255,.28);
    }
    #barrage-ui .primary-start{
      z-index:3;
      left:95px;
      top:366px;
      width:200px;
      height:50px;
      color:#060708;
      border:1px solid rgba(246,248,250,.82);
      background:linear-gradient(180deg,#f7f9fb,#cdd5dc);
      box-shadow:5px 5px 0 rgba(184,167,255,.62),0 16px 32px rgba(0,0,0,.38),0 0 28px rgba(142,239,255,.16);
      transform:none;
      clip-path:polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px);
      animation:zzzStartIn .30s cubic-bezier(.2,.9,.2,1) .16s both,zzzButtonPulse 2.8s ease-in-out 1s infinite;
    }
    #barrage-ui .primary-start:hover{
      background:#fff;
      box-shadow:5px 5px 0 rgba(184,167,255,.70),0 16px 32px rgba(0,0,0,.40),0 0 30px rgba(142,239,255,.22);
    }
    #barrage-ui .primary-start span{
      font-size:31px;
      line-height:.92;
      text-shadow:none;
    }
    #barrage-ui .primary-start span::before{
      content:"";
    }
    #barrage-ui .primary-start small{
      margin-top:4px;
      color:rgba(6,7,8,.68);
      font-size:10px;
    }
    #barrage-ui .home-actions{
      z-index:3;
      left:24px;
      right:auto;
      top:432px;
      width:342px;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px 18px;
    }
    #barrage-ui .action-tile{
      min-height:54px;
      height:54px;
      padding:10px 28px 9px 15px;
      border-color:rgba(246,248,250,.16);
      border-left:4px solid var(--accent);
      background:linear-gradient(180deg,rgba(246,248,250,.070),rgba(5,7,10,.78));
      box-shadow:4px 4px 0 rgba(0,0,0,.44);
      clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
    }
    #barrage-ui .action-tile:nth-child(2){
      background:linear-gradient(180deg,rgba(246,248,250,.070),rgba(5,7,10,.78));
      border-color:rgba(246,248,250,.16);
      border-left-color:var(--accent);
    }
    #barrage-ui .action-tile:nth-child(2) b,
    #barrage-ui .action-tile:nth-child(2)::after{
      color:#f6f8fa;
    }
    #barrage-ui .action-tile:nth-child(2) span{
      color:rgba(216,226,234,.66);
    }
    #barrage-ui .action-tile b{
      color:var(--accent);
      font-size:13px;
      line-height:1;
    }
    #barrage-ui .action-tile span{
      margin-top:8px;
      color:rgba(216,226,234,.66);
      font-size:10px;
      line-height:1;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .action-tile::after{
      top:18px;
      color:var(--accent);
    }
    #barrage-ui button.action-tile:hover{
      border-color:rgba(142,239,255,.45);
      box-shadow:4px 4px 0 rgba(0,0,0,.44),0 0 18px rgba(142,239,255,.14);
    }
    /* Clean home rebuild: left info, right circular 3D frame viewer. */
    #barrage-ui .home-screen{
      background:transparent;
    }
    #barrage-ui .home-screen::before{
      opacity:1;
      inset:0;
      background:
        linear-gradient(180deg,rgba(5,7,11,.98),rgba(4,5,8,.99)),
        repeating-linear-gradient(0deg,rgba(246,248,250,.026) 0 1px,transparent 1px 18px);
      transform:none;
      mask-image:radial-gradient(circle 92px at 78% 30%,transparent 0 88px,#000 90px);
      -webkit-mask-image:radial-gradient(circle 92px at 78% 30%,transparent 0 88px,#000 90px);
    }
    #barrage-ui .home-hub::before{
      left:14px;
      right:14px;
      top:78px;
      height:258px;
      border-color:rgba(142,239,255,.48);
      background:
        linear-gradient(90deg,rgba(142,239,255,.58) 0 3px,transparent 3px),
        linear-gradient(180deg,rgba(10,17,22,.72),rgba(6,8,12,.88));
      box-shadow:inset 0 0 0 1px rgba(246,248,250,.06),0 18px 40px rgba(0,0,0,.30);
      mask-image:radial-gradient(circle 92px at calc(100% - 86px) 130px,transparent 0 88px,#000 90px);
      -webkit-mask-image:radial-gradient(circle 92px at calc(100% - 86px) 130px,transparent 0 88px,#000 90px);
    }
    #barrage-ui .home-hub::after{
      top:336px;
      background:
        linear-gradient(180deg,rgba(4,5,8,.95),rgba(4,5,8,.99)),
        repeating-linear-gradient(0deg,rgba(246,248,250,.024) 0 1px,transparent 1px 18px);
    }
    #barrage-ui .hangar-visual{
      left:14px;
      right:14px;
      top:78px;
      height:258px;
    }
    #barrage-ui .hangar-visual::before{
      content:"";
      position:absolute;
      z-index:2;
      right:-8px;
      top:50px;
      width:160px;
      height:160px;
      border-radius:50%;
      background:
        radial-gradient(circle at 50% 50%,rgba(142,239,255,.18) 0 4px,transparent 5px 30px,rgba(142,239,255,.10) 31px 32px,transparent 33px 56px,rgba(142,239,255,.20) 57px 59px,transparent 60px),
        radial-gradient(circle at 50% 50%,rgba(142,239,255,.08),transparent 68%);
      border:2px solid rgba(142,239,255,.68);
      box-shadow:0 0 28px rgba(142,239,255,.18),inset 0 0 32px rgba(142,239,255,.12);
      opacity:.96;
    }
    #barrage-ui .hangar-visual::after{
      z-index:3;
      left:auto;
      right:8px;
      top:66px;
      bottom:auto;
      width:128px;
      height:128px;
      opacity:.90;
      border-radius:50%;
      background:
        linear-gradient(rgba(142,239,255,.45),rgba(142,239,255,.45)) center/1px 100% no-repeat,
        linear-gradient(90deg,rgba(142,239,255,.45),rgba(142,239,255,.45)) center/100% 1px no-repeat;
      border:1px solid rgba(142,239,255,.24);
      mask-image:none;
      filter:none;
      pointer-events:none;
    }
    #barrage-ui .hangar-rails{
      left:30px;
      right:205px;
      top:58px;
      bottom:54px;
      border-top-color:rgba(216,226,234,.16);
      border-bottom-color:rgba(216,226,234,.08);
    }
    #barrage-ui .mission-tag{
      left:30px;
      top:96px;
      min-width:96px;
      height:28px;
      padding:0 15px;
      box-shadow:3px 3px 0 rgba(0,0,0,.46);
      font-size:12px;
    }
    #barrage-ui .record-stack{
      left:30px;
      right:auto;
      top:134px;
      width:156px;
    }
    #barrage-ui .record-pill{
      min-height:52px;
      padding:9px 11px;
      border-left-color:rgba(142,239,255,.68);
      box-shadow:3px 3px 0 rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.05);
    }
    #barrage-ui .record-pill span{
      font-size:18px;
    }
    #barrage-ui .loadout-panel{
      left:30px;
      right:auto;
      top:196px;
      width:166px;
      height:82px;
      padding:10px 12px;
      display:block;
      background:linear-gradient(180deg,rgba(8,12,16,.96),rgba(5,7,10,.92));
      box-shadow:3px 3px 0 rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.05);
    }
    #barrage-ui .loadout-copy h1{
      max-width:138px;
      font-size:19px;
    }
    #barrage-ui .loadout-copy p{
      max-width:138px;
      line-height:1.25;
      white-space:normal;
    }
    #barrage-ui .base-sync{
      display:none;
    }
    #barrage-ui .hangar-status{
      left:30px;
      right:30px;
      top:302px;
      height:23px;
      justify-content:flex-start;
      padding:0 12px;
      box-shadow:2px 2px 0 rgba(0,0,0,.42);
    }
    #barrage-ui .primary-start{
      top:356px;
    }
    #barrage-ui .home-actions{
      top:426px;
    }
    #barrage-ui .hud::before{
      height:52px;
      background:rgba(5,6,7,.90);
    }
    #barrage-ui .hud::after{
      content:"";
      position:absolute;
      left:0;
      right:0;
      top:548px;
      bottom:0;
      background:rgba(5,6,7,.92);
      border-top:1px solid rgba(216,226,234,.18);
      pointer-events:none;
    }
    #barrage-ui .hud-topbar{
      left:8px;
      right:8px;
      top:6px;
      height:46px;
      grid-template-columns:88px minmax(0,1fr) 124px;
      gap:0;
      align-items:start;
    }
    #barrage-ui .pause-control{
      width:88px;
      height:30px;
      padding:0 10px 0 12px;
      grid-template-columns:16px 1fr;
      gap:6px;
      font-size:12px;
      border-color:rgba(216,226,234,.20);
      background:linear-gradient(180deg,rgba(216,226,234,.075),rgba(5,6,7,.82));
      box-shadow:none;
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .pause-control::before{
      width:13px;
      height:12px;
      border-left-width:3px;
      border-right-width:3px;
    }
    #barrage-ui .hud-wave{
      justify-self:center;
      width:124px;
      height:42px;
      padding:7px 0 0;
      border:0;
      background:none;
      box-shadow:none;
      clip-path:none;
      overflow:visible;
      text-align:center;
    }
    #barrage-ui .hud-wave::before{
      content:"";
      position:absolute;
      left:14px;
      top:1px;
      width:96px;
      height:24px;
      background:linear-gradient(180deg,rgba(216,226,234,.09),rgba(5,6,7,.82));
      border:1px solid rgba(216,226,234,.18);
      border-left:3px solid rgba(255,93,126,.72);
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .hud-wave::after{
      content:"";
      position:absolute;
      left:0;
      top:28px;
      width:124px;
      height:14px;
      background:linear-gradient(180deg,rgba(216,226,234,.055),rgba(5,6,7,.76));
      border:1px solid rgba(216,226,234,.13);
      clip-path:polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px);
    }
    #barrage-ui .hud-wave b,
    #barrage-ui .hud-wave > span{
      position:relative;
      z-index:2;
      display:inline-block;
      margin:0;
      color:#f6f8fa;
      font-size:14px;
      line-height:1;
      vertical-align:middle;
    }
    #barrage-ui .hud-wave > span{
      margin-left:6px;
      font-size:16px;
    }
    #barrage-ui .wave-timer{
      position:absolute;
      z-index:2;
      left:4px;
      right:4px;
      top:31px;
      height:8px;
      margin:0;
      border:0;
      background:transparent;
      clip-path:polygon(4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%,0 4px);
    }
    #barrage-ui .wave-timer i{
      background:rgba(142,239,255,.34);
      box-shadow:none;
    }
    #barrage-ui .hud-wave small{
      position:absolute;
      z-index:3;
      left:0;
      right:0;
      top:30px;
      margin:0;
      color:rgba(216,226,234,.74);
      font-size:9px;
      line-height:14px;
    }
    #barrage-ui .hud-wave small span{
      color:rgba(216,226,234,.88);
      font-size:9px;
    }
    #barrage-ui .hud-counter{
      width:124px;
      height:42px;
      padding:7px 10px 6px 13px;
      border-color:rgba(216,226,234,.18);
      border-left:3px solid rgba(142,239,255,.72);
      background:linear-gradient(180deg,rgba(216,226,234,.070),rgba(5,6,7,.82));
      box-shadow:none;
      clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
    }
    #barrage-ui .hud-counter::after{
      opacity:.34;
    }
    #barrage-ui .counter-line{
      grid-template-columns:46px minmax(0,1fr);
      height:14px;
      gap:5px;
    }
    #barrage-ui .counter-line + .counter-line{
      margin-top:3px;
      padding-top:4px;
    }
    #barrage-ui .counter-line b{
      color:rgba(216,226,234,.60);
      font-size:9px;
    }
    #barrage-ui .counter-line span{
      font-size:14px;
    }
    #barrage-ui .hud-dock{
      left:0;
      right:0;
      bottom:0;
      height:152px;
      padding:0;
      border:0;
      background:rgba(5,6,7,.92);
      clip-path:none;
      display:block;
      box-shadow:none;
    }
    #barrage-ui .hud-dock::before{
      left:0;
      right:0;
      top:0;
      height:1px;
      background:rgba(216,226,234,.20);
      opacity:1;
    }
    #barrage-ui .hud-meters{
      position:absolute;
      left:12px;
      right:12px;
      top:29px;
      display:grid;
      gap:6px;
    }
    #barrage-ui .meter-row{
      height:14px;
      grid-template-columns:46px minmax(0,1fr) 76px;
      gap:8px;
      font-size:10px;
    }
    #barrage-ui .meter-row strong{
      font-size:10px;
    }
    #barrage-ui .meter-track{
      height:10px;
      background:rgba(216,226,234,.050);
      border-color:rgba(216,226,234,.14);
      box-shadow:none;
    }
    #barrage-ui .meter-track i{
      box-shadow:none;
    }
    #barrage-ui .meter-row.is-primary{
      height:17px;
      grid-template-columns:46px minmax(0,1fr) 76px;
    }
    #barrage-ui .meter-row.is-primary .meter-track{
      height:12px;
    }
    #barrage-ui .run-chips{
      position:absolute;
      left:12px;
      right:12px;
      top:95px;
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:7px;
    }
    #barrage-ui .run-chip{
      height:24px;
      padding:0 10px;
      border-color:rgba(216,226,234,.14);
      background:linear-gradient(180deg,rgba(216,226,234,.060),rgba(5,6,7,.78));
      clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);
    }
    #barrage-ui .run-chip b{
      color:rgba(216,226,234,.62);
      font-size:9px;
    }
    #barrage-ui .run-chip span{
      font-size:15px;
    }
    #barrage-ui .skill-control{
      position:absolute;
      z-index:3;
      left:136px;
      top:122px;
      width:118px;
      height:22px;
      padding:0 8px;
      display:grid;
      place-items:center;
      color:rgba(216,226,234,.78);
      border-color:rgba(142,239,255,.24);
      background:linear-gradient(180deg,rgba(142,239,255,.075),rgba(5,6,7,.82));
      box-shadow:none;
      font-size:12px;
      line-height:1;
      clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);
    }
    #barrage-ui .upgrade-overlay{
      background:
        linear-gradient(180deg,rgba(4,6,12,.97),rgba(3,4,7,.98)),
        repeating-linear-gradient(0deg,rgba(246,248,250,.025) 0 1px,transparent 1px 18px);
    }
    #barrage-ui .level-dialog{
      left:0;
      right:0;
      top:0;
      bottom:0;
      padding:0;
      border:0;
      background:linear-gradient(180deg,rgba(4,6,12,.98),rgba(4,6,12,.94));
      clip-path:none;
      box-shadow:none;
    }
    #barrage-ui .level-dialog::before{
      content:"";
      position:absolute;
      left:0;
      right:0;
      top:0;
      height:110px;
      background:linear-gradient(180deg,rgba(216,226,234,.085),rgba(216,226,234,.025));
      border-bottom:1px solid rgba(216,226,234,.16);
      pointer-events:none;
    }
    #barrage-ui .level-dialog::after{
      content:"";
      position:absolute;
      left:0;
      right:0;
      top:198px;
      bottom:0;
      background:rgba(4,6,12,.56);
      pointer-events:none;
    }
    #barrage-ui .level-head{
      position:absolute;
      z-index:2;
      left:0;
      right:0;
      top:0;
      height:128px;
      display:block;
      margin:0;
      padding:22px 14px 0;
      text-align:center;
    }
    #barrage-ui .level-title{
      font-size:25px;
      line-height:1;
      color:#f6f8fa;
      text-shadow:0 0 14px rgba(142,239,255,.22),2px 2px 0 rgba(0,0,0,.50);
    }
    #barrage-ui .level-note{
      margin-top:10px;
      color:rgba(216,226,234,.68);
      font-size:12px;
      line-height:1;
    }
    #barrage-ui .level-sp{
      position:absolute;
      left:auto;
      right:20px;
      top:18px;
      min-width:74px;
      height:28px;
      transform:none;
      color:#d8e2ea;
      border-color:rgba(216,226,234,.22);
      background:rgba(246,248,250,.055);
      box-shadow:0 0 18px rgba(142,239,255,.08);
      font-size:11px;
    }
    #barrage-ui .level-dialog .upgrade-grid{
      position:absolute;
      z-index:2;
      left:20px;
      right:20px;
      top:226px;
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:7px;
    }
    #barrage-ui .level-dialog .upgrade-card{
      position:relative;
      height:250px;
      min-height:250px;
      padding:82px 9px 52px;
      text-align:center;
      border:1px solid rgba(216,226,234,.18);
      border-left:1px solid rgba(216,226,234,.18);
      background:linear-gradient(180deg,rgba(246,248,250,.080),rgba(7,9,12,.82));
      box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 16px 34px rgba(0,0,0,.24);
      clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
    }
    #barrage-ui .level-dialog .upgrade-card::before{
      content:"";
      position:absolute;
      left:0;
      right:0;
      top:0;
      height:68px;
      background:
        radial-gradient(circle at 50% 34%,color-mix(in srgb,var(--accent),transparent 72%),transparent 48%),
        linear-gradient(180deg,color-mix(in srgb,var(--accent),transparent 90%),rgba(246,248,250,.030));
      border-bottom:1px solid rgba(216,226,234,.12);
    }
    #barrage-ui .level-dialog .upgrade-card::after{
      content:"";
      position:absolute;
      left:8px;
      right:8px;
      top:97px;
      bottom:auto;
      width:auto;
      height:1px;
      background:linear-gradient(90deg,transparent,rgba(216,226,234,.22),transparent);
    }
    #barrage-ui .level-dialog .upgrade-card b{
      position:absolute;
      left:10px;
      right:10px;
      top:15px;
      min-height:38px;
      display:grid;
      place-items:center;
      color:var(--accent);
      font-size:10px;
      line-height:1.1;
      background:rgba(5,6,7,.40);
      border:1px solid color-mix(in srgb,var(--accent),transparent 62%);
      clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);
    }
    #barrage-ui .level-dialog .upgrade-card span{
      margin:0;
      min-height:32px;
      display:grid;
      place-items:center;
      color:#f6f8fa;
      font-size:13px;
      line-height:1.15;
    }
    #barrage-ui .level-dialog .upgrade-card small{
      display:block;
      margin-top:12px;
      max-height:78px;
      overflow:hidden;
      color:rgba(216,226,234,.66);
      font-size:10px;
      line-height:1.35;
    }
    #barrage-ui .level-dialog .upgrade-card button{
      left:10px;
      right:10px;
      top:auto;
      bottom:13px;
      width:auto;
      height:38px;
      min-width:0;
      transform:none;
      color:#f6f8fa;
      border-color:rgba(216,226,234,.26);
      background:rgba(246,248,250,.070);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
    }
    #barrage-ui .level-dialog .upgrade-card button:active{
      transform:translateY(1px);
    }
    #barrage-ui .basic-dialog{
      pointer-events:auto;
      position:absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      padding:0;
      border:0;
      background:linear-gradient(180deg,rgba(4,6,12,.98),rgba(4,6,12,.94));
      clip-path:none;
      box-shadow:none;
    }
    #barrage-ui .basic-dialog::before{
      content:"";
      position:absolute;
      left:0;
      right:0;
      top:0;
      height:112px;
      background:linear-gradient(180deg,rgba(216,226,234,.085),rgba(216,226,234,.025));
      border-bottom:1px solid rgba(216,226,234,.16);
      pointer-events:none;
    }
    #barrage-ui .basic-head{
      position:absolute;
      z-index:2;
      left:0;
      right:0;
      top:0;
      height:112px;
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      gap:10px;
      align-items:start;
      padding:22px 14px 0;
    }
    #barrage-ui .basic-actions{
      display:grid;
      grid-template-columns:72px 72px;
      gap:7px;
      align-items:start;
    }
    #barrage-ui .basic-actions button{
      height:28px;
      padding:0 10px;
      font-size:11px;
      box-shadow:none;
    }
    #barrage-ui .basic-upgrade-list{
      position:absolute;
      z-index:2;
      left:14px;
      right:14px;
      top:124px;
      bottom:14px;
      display:grid;
      grid-template-columns:1fr;
      align-content:start;
      gap:8px;
      overflow-y:auto;
      padding-right:4px;
      pointer-events:auto;
    }
    #barrage-ui .basic-upgrade-list::-webkit-scrollbar{width:6px}
    #barrage-ui .basic-upgrade-list::-webkit-scrollbar-thumb{background:rgba(246,248,250,.22)}
    #barrage-ui .run-basic-path{
      min-height:136px;
    }
    #barrage-ui .run-basic-path .upgrade-link{
      font-size:9px;
      writing-mode:vertical-rl;
      letter-spacing:0;
    }
    #barrage-ui .run-basic-card{
      min-height:132px;
      padding:12px 58px 10px 10px;
    }
    #barrage-ui .run-basic-card span{
      font-size:14px;
      line-height:1.12;
    }
    #barrage-ui .run-basic-card small{
      font-size:9px;
      line-height:1.25;
    }
    #barrage-ui .run-basic-card button{
      right:6px;
      min-width:48px;
      padding:0 6px;
    }
    #barrage-ui .run-basic-card.cap-open{
      border-color:rgba(142,239,255,.58);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 0 18px rgba(142,239,255,.10);
    }
    #barrage-ui .run-basic-card.cap-open::before{
      content:"上位解放";
      position:absolute;
      right:9px;
      top:8px;
      height:18px;
      display:grid;
      place-items:center;
      padding:0 7px;
      color:#08090a;
      background:#8eefff;
      font-size:9px;
      line-height:1;
      font-weight:900;
      clip-path:polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px);
    }
    /* Final mobile pass: full ship preview, thumb-zone HUD, no center vignette. */
    #barrage-ui .home-screen{
      background:
        linear-gradient(180deg,rgba(4,6,10,.38),rgba(4,5,8,.10) 36%,rgba(4,5,8,.90) 58%,rgba(4,5,8,.98));
    }
    #barrage-ui .home-screen::before{
      opacity:.34;
      background:
        linear-gradient(180deg,rgba(246,248,250,.04),transparent 42%),
        repeating-linear-gradient(0deg,rgba(246,248,250,.030) 0 1px,transparent 1px 18px);
      transform:none;
      mask-image:none;
      -webkit-mask-image:none;
      pointer-events:none;
    }
    #barrage-ui .home-screen::after{
      bottom:314px;
      opacity:.34;
    }
    #barrage-ui .home-hub::before{
      left:14px;
      right:14px;
      top:76px;
      height:312px;
      border-color:rgba(142,239,255,.28);
      background:
        linear-gradient(90deg,rgba(142,239,255,.36) 0 3px,transparent 3px),
        linear-gradient(180deg,rgba(142,239,255,.10),rgba(8,10,14,.10));
      box-shadow:inset 0 0 0 1px rgba(246,248,250,.07),0 18px 36px rgba(0,0,0,.20);
      clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px);
      mask-image:none;
      -webkit-mask-image:none;
      pointer-events:none;
    }
    #barrage-ui .home-hub::after{
      top:388px;
      background:
        linear-gradient(180deg,rgba(4,5,8,.72),rgba(4,5,8,.99)),
        repeating-linear-gradient(0deg,rgba(246,248,250,.024) 0 1px,transparent 1px 18px);
    }
    #barrage-ui .hangar-visual{
      top:76px;
      height:312px;
      overflow:hidden;
    }
    #barrage-ui .hangar-visual::before{
      display:none;
    }
    #barrage-ui .hangar-visual::after{
      content:"";
      left:32px;
      right:32px;
      top:auto;
      bottom:24px;
      width:auto;
      height:82px;
      border:0;
      border-radius:0;
      background:
        radial-gradient(ellipse at 50% 50%,rgba(142,239,255,.20),transparent 58%),
        linear-gradient(90deg,transparent,rgba(246,248,250,.16),transparent);
      opacity:.55;
      mask-image:none;
      -webkit-mask-image:none;
      filter:none;
      pointer-events:none;
    }
    #barrage-ui .hangar-rails{
      left:28px;
      right:28px;
      top:50px;
      bottom:76px;
      opacity:.78;
    }
    #barrage-ui .mission-tag{
      left:28px;
      top:96px;
      transform:none;
    }
    #barrage-ui .record-stack{
      left:auto;
      right:28px;
      top:96px;
      width:122px;
    }
    #barrage-ui .loadout-panel{
      left:24px;
      right:24px;
      top:396px;
      height:74px;
      grid-template-columns:minmax(0,1fr) 84px;
    }
    #barrage-ui .loadout-copy h1{
      max-width:214px;
      font-size:23px;
    }
    #barrage-ui .primary-start{
      left:28px;
      top:478px;
      width:334px;
      height:60px;
      transform:none;
    }
    #barrage-ui .primary-start span{
      font-size:36px;
    }
    #barrage-ui .home-actions{
      left:18px;
      right:18px;
      top:548px;
      width:auto;
      grid-template-columns:1fr 1fr;
      gap:6px 9px;
    }
    #barrage-ui .action-tile{
      min-height:40px;
      height:40px;
      padding:8px 24px 8px 12px;
    }
    #barrage-ui .action-tile span{
      margin-top:5px;
      font-size:9px;
    }
    #barrage-ui .page-stage{
      padding:14px 14px 76px;
    }
    #barrage-ui .page-back{
      position:absolute;
      z-index:5;
      right:18px;
      bottom:16px;
      width:118px;
      height:46px;
      box-shadow:0 14px 28px rgba(0,0,0,.32);
    }
    #barrage-ui .catalog-grid,
    #barrage-ui .garage-panel,
    #barrage-ui .gacha-panel,
    #barrage-ui .ranking-list{
      bottom:76px;
    }
    #barrage-ui .hud::before{
      height:64px;
      background:linear-gradient(180deg,rgba(5,6,7,.46),rgba(5,6,7,.16) 58%,transparent);
    }
    #barrage-ui .hud::after{
      top:auto;
      bottom:0;
      height:176px;
      background:linear-gradient(180deg,transparent,rgba(5,6,7,.58) 22%,rgba(5,6,7,.91));
      border-top:1px solid rgba(216,226,234,.12);
    }
    #barrage-ui .hud-topbar{
      left:10px;
      right:10px;
      top:8px;
      height:46px;
      grid-template-columns:132px minmax(0,1fr);
      gap:8px;
      pointer-events:none;
    }
    #barrage-ui .hud-wave{
      justify-self:start;
      width:132px;
      height:44px;
    }
    #barrage-ui .hud-counter{
      justify-self:end;
      width:132px;
      height:44px;
      padding:7px 10px 6px 12px;
    }
    #barrage-ui .hud-dock{
      left:10px;
      right:10px;
      bottom:8px;
      height:166px;
      padding:10px;
      display:grid;
      grid-template-columns:1fr;
      grid-template-rows:auto auto 44px;
      gap:8px;
      align-items:stretch;
      background:linear-gradient(180deg,rgba(10,13,17,.66),rgba(5,6,7,.92));
      border-color:rgba(216,226,234,.16);
      pointer-events:auto;
    }
    #barrage-ui .hud-meters,
    #barrage-ui .run-chips{
      position:relative;
      left:auto;
      right:auto;
      top:auto;
    }
    #barrage-ui .hud-meters{
      display:grid;
      gap:6px;
    }
    #barrage-ui .meter-row{
      grid-template-columns:50px minmax(0,1fr) 74px;
      height:16px;
    }
    #barrage-ui .meter-row.is-primary{
      grid-template-columns:50px minmax(0,1fr) 74px;
      height:19px;
    }
    #barrage-ui .run-chips{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:6px;
    }
    #barrage-ui .run-chip{
      height:26px;
      padding:0 8px;
    }
    #barrage-ui .run-chip b{
      font-size:8px;
    }
    #barrage-ui .run-chip span{
      font-size:13px;
    }
    #barrage-ui .hud-actions{
      display:grid;
      grid-template-columns:112px minmax(0,1fr);
      gap:8px;
      min-width:0;
    }
    #barrage-ui .hud-actions .pause-control,
    #barrage-ui .hud-actions .skill-control{
      position:relative;
      left:auto;
      right:auto;
      top:auto;
      bottom:auto;
      width:auto;
      height:44px;
      min-width:0;
      padding:0 12px;
      display:grid;
      place-items:center;
      font-size:13px;
      line-height:1;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.07);
    }
    #barrage-ui .hud-actions .pause-control{
      grid-template-columns:18px 1fr;
      gap:7px;
    }
    #barrage-ui .hud-actions .skill-control{
      color:#f6f8fa;
      border-color:rgba(142,239,255,.32);
      background:linear-gradient(180deg,rgba(142,239,255,.11),rgba(5,6,7,.82));
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    #barrage-ui .hud.has-bp .run-chip:nth-child(3),
    #barrage-ui .hud.has-bp .skill-control{
      border-color:rgba(142,239,255,.58);
      box-shadow:0 0 16px rgba(142,239,255,.14);
    }
    #barrage-ui .hud.has-bp .run-chip:nth-child(3) span{
      color:var(--ui-cyan);
      text-shadow:0 0 10px rgba(142,239,255,.38);
    }
    #barrage-ui .basic-actions{
      position:absolute;
      left:14px;
      right:14px;
      bottom:14px;
      display:grid;
      grid-template-columns:1fr 132px;
      gap:9px;
      z-index:4;
    }
    #barrage-ui .basic-actions .level-sp{
      position:static;
      min-width:0;
      width:auto;
      height:42px;
      transform:none;
    }
    #barrage-ui .basic-actions button{
      height:42px;
      font-size:13px;
    }
    #barrage-ui .basic-upgrade-list{
      bottom:72px;
    }
    @keyframes zzzButtonPulse{
      0%,100%{box-shadow:5px 5px 0 rgba(184,167,255,.62),0 16px 32px rgba(0,0,0,.38),0 0 20px rgba(142,239,255,.14)}
      50%{box-shadow:5px 5px 0 rgba(184,167,255,.76),0 16px 32px rgba(0,0,0,.38),0 0 34px rgba(142,239,255,.24)}
    }
    @keyframes zzzStartIn{
      from{opacity:1;transform:translateY(16px) skewY(-1deg)}
      to{opacity:1;transform:translateY(0) skewY(0)}
    }
    @media (prefers-reduced-motion: reduce){
      #barrage-ui .home-hub::before,
      #barrage-ui .brand-lockup,
      #barrage-ui .wallet-chip,
      #barrage-ui .mission-tag,
      #barrage-ui .home-decal,
      #barrage-ui .record-pill,
      #barrage-ui .loadout-panel,
      #barrage-ui .action-tile,
      #barrage-ui .ship-showcase,
      #barrage-ui .hollow-tape,
      #barrage-ui .home-dots,
      #barrage-ui .primary-start{animation:none}
    }
  `;
  document.head.appendChild(style);
  const root = document.createElement('div');
  root.id = 'barrage-ui';
  document.body.appendChild(root);
  return {root, refs:{}};
}

function renderUi2(){
  const rankingRows = state.mode === 'ranking' ? getRankingRows(10) : [];
  const homeUpgradeTotal = Object.keys(HOME_UPGRADE_DEFS).reduce((sum, id) => sum + homeUpgradeLevel(id), 0);
  const ship = currentShip();
  const gachaActive = state.mode === 'gacha';
  const garageActive = state.mode === 'garage';
  const equippedSummary = (gachaActive || garageActive) ? renderEquippedCosmetics() : '';
  const gachaResult = gachaActive ? renderGachaResult() : '';
  const tokenReward = calculateTokenReward();
  ui.root.innerHTML = `
    <div class="screen home-screen ${state.mode==='home'?'on':''}" data-screen="home">
      <div class="ui-stage home-hub">
        <div class="home-header">
          <div class="brand-lockup"><span>BARRAGE</span><small>PIPE ASSAULT</small></div>
          <div class="wallet-chip"><b>TOKEN</b><span>${formatNumber(state.tokens)}</span></div>
        </div>
        <div class="hangar-visual">
          <div class="home-dots"></div>
          <div class="hollow-tape"></div>
          <div class="hangar-status"><b>CHECKPOINT</b><span>BEST WAVE ${Math.max(1, state.bestWave + 10)}+</span></div>
          <div class="hangar-rails"></div>
        </div>
        <div class="mission-tag">SELECTED</div>
        <div class="record-stack">
          <div class="record-pill"><b>HIGH SCORE</b><span>WAVE ${state.bestWave}</span><small>${formatNumber(state.highScore)}</small></div>
        </div>
        <div class="loadout-panel">
          <div class="loadout-copy">
            <b>選択中フレーム</b>
            <h1>${ship.name}</h1>
            <p>${ship.role} / ${equippedPartCount()} PARTS</p>
          </div>
          <div class="base-sync">
            <span>BASE Lv.</span>
            <div class="sync-track"><i style="width:${Math.min(100, 12 + homeUpgradeTotal * 8)}%"></i></div>
            <strong>Lv.${homeUpgradeTotal}</strong>
          </div>
        </div>
        <button class="primary-start" data-action="start"><span>スタート</span><small>READY</small></button>
        <div class="home-actions">
          <button class="action-tile" data-action="store" style="--accent:#d8e2ea"><b>ストア</b><span>機体を購入</span></button>
          <button class="action-tile" data-action="garage" style="--accent:#8eefff"><b>ガレージ</b><span>機体と装備を変更</span></button>
          <button class="action-tile" data-action="homeUpgrade" style="--accent:#f6f8fa"><b>アップグレード</b><span>ベース強化を開く</span></button>
          <button class="action-tile" data-action="gacha" style="--accent:#d8e2ea"><b>サプライ抽選</b><span>スキンとクロマコート</span></button>
          <button class="action-tile" data-action="ranking" style="--accent:#8eefff"><b>ランキング</b><span>ハイスコア記録</span></button>
          <div class="action-tile is-quiet" style="--accent:#f6f8fa"><b>オプション</b><span>操作とサウンド</span></div>
        </div>
      </div>
    </div>
    <div class="screen ${state.mode==='ranking'?'on':''}">
      <div class="ui-stage page-stage">
        <div class="page-header">
          <div class="page-title glass-panel">
            <h1>ランキング</h1>
            <p>LOCAL TOP 10 / GUEST</p>
          </div>
          <button class="page-back" data-action="home">戻る</button>
        </div>
        <div class="ranking-list">
          ${renderRankingRows(rankingRows)}
        </div>
      </div>
    </div>
    <div class="screen ${state.mode==='store'?'on':''}">
      <div class="ui-stage page-stage">
        <div class="page-header">
          <div class="page-title glass-panel">
            <h1>ストア</h1>
            <p>トークン ${formatNumber(state.tokens)} / 機体購入</p>
          </div>
          <button class="page-back" data-action="home">戻る</button>
        </div>
        <div class="catalog-grid ship-store-list">
          ${state.mode === 'store' ? renderStoreShips() : ''}
        </div>
      </div>
    </div>
    <div class="screen ${state.mode==='garage'?'on':''}">
      <div class="ui-stage page-stage">
        <div class="page-header">
          <div class="page-title glass-panel">
            <h1>ガレージ</h1>
            <p>${ship.name} / ${equippedPartCount()} PARTS</p>
          </div>
          <button class="page-back" data-action="home">戻る</button>
        </div>
        <div class="garage-panel">
          ${garageActive ? renderGaragePanel(equippedSummary) : ''}
        </div>
      </div>
    </div>
    <div class="screen ${state.mode==='gacha'?'on':''}">
      <div class="ui-stage page-stage">
        <div class="page-header">
          <div class="page-title glass-panel">
            <h1>サプライ抽選</h1>
            <p>${GACHA_COST}T / 所持 ${gachaActive ? Object.keys(state.cosmetics.owned).length : 0}/${COSMETIC_ITEMS.length}</p>
          </div>
          <button class="page-back" data-action="home">戻る</button>
        </div>
        <div class="gacha-panel">
          <button class="gacha-roll" ${state.tokens < GACHA_COST ? 'disabled' : ''} data-action="rollGacha">抽選する</button>
          ${gachaResult}
          <div class="equipped-grid">${equippedSummary}</div>
          <div class="cosmetic-list">
            ${gachaActive ? renderCosmeticInventory() : ''}
          </div>
        </div>
      </div>
    </div>
    <div class="screen ${state.mode==='homeUpgrade'?'on':''}">
      <div class="ui-stage page-stage">
        <div class="page-header">
          <div class="page-title glass-panel">
            <h1>強化</h1>
            <p>トークン ${formatNumber(state.tokens)} / 下位10で上位解放</p>
          </div>
          <button class="page-back" data-action="home">戻る</button>
        </div>
        <div class="catalog-grid upgrade-path-list">
          ${state.mode === 'homeUpgrade' ? renderHomeUpgradePaths() : ''}
        </div>
      </div>
    </div>
    <div class="hud ${state.mode==='play'||state.mode==='levelup'||state.mode==='basicUpgrade'?'on':''} ${state.mode==='levelup'||state.mode==='basicUpgrade'?'leveling':''} ${state.hp / Math.max(1, state.maxHp) < .30 ? 'critical' : ''} ${state.basicPoints > 0 ? 'has-bp' : ''}" data-ref="hud">
      <div class="hud-topbar">
        <div class="hud-stat hud-wave">
          <b>WAVE</b>
          <span data-ref="wave">${state.wave}</span>
          <div class="wave-timer"><i data-ref="waveProgress" style="width:${Math.min(100, state.waveTime / waveDuration() * 100)}%"></i></div>
          <small>次WAVEまで <span data-ref="time">${waveSeconds()}秒</span></small>
        </div>
        <div class="hud-counter">
          <div class="counter-line"><b>スコア</b><span data-ref="score">${formatNumber(state.score)}</span></div>
          <div class="counter-line"><b>トークン</b><span data-ref="tokenTop">+${formatNumber(tokenReward)}</span></div>
        </div>
      </div>
      <div class="hud-dock">
        <div class="hud-meters">
          <div class="meter-row is-primary" style="--meter-a:#ff5d7e;--meter-b:#ffc3ce">
            <span>HP</span>
            <div class="meter-track"><i data-ref="hp" style="width:${Math.max(0, state.hp / state.maxHp * 100)}%"></i></div>
            <strong data-ref="hpText">${Math.ceil(state.hp)}/${state.maxHp}</strong>
          </div>
          <div class="meter-row" style="--meter-a:#8eefff;--meter-b:#d8fbff">
            <span>ENERGY</span>
            <div class="meter-track"><i data-ref="energy" style="width:${Math.max(0, state.energy)}%"></i></div>
            <strong data-ref="energyText">${Math.floor(state.energy)}%</strong>
          </div>
          <div class="meter-row" style="--meter-a:#9dffd9;--meter-b:#d8e2ea">
            <span data-ref="xpLabel">XP Lv.${state.level}</span>
            <div class="meter-track"><i data-ref="xp" style="width:${Math.min(100, state.xp / xpThreshold() * 100)}%"></i></div>
            <strong data-ref="xpText">${state.skillPoints}SP</strong>
          </div>
        </div>
        <div class="run-chips">
          <div class="run-chip"><b>LV</b><span data-ref="levelChip">${state.level}</span></div>
          <div class="run-chip"><b>SP</b><span data-ref="specialPointChip">${state.skillPoints}</span></div>
          <div class="run-chip"><b>BP</b><span data-ref="bpChip">${state.basicPoints}</span></div>
          <div class="run-chip"><b>TOKEN</b><span data-ref="tokenPreview">+${formatNumber(tokenReward)}</span></div>
        </div>
        <div class="hud-actions">
          <button class="pause-control" data-action="pause"><span>ポーズ</span></button>
          <button class="skill-control" data-ref="skillControl" data-action="openUpgrade">基礎強化 ${state.basicPoints}BP</button>
        </div>
      </div>
    </div>
    <div class="upgrade-overlay ${state.mode==='levelup'?'on':''}">
      <div class="level-dialog glass-panel">
        <div class="level-head">
          <div>
            <div class="level-title">特殊強化</div>
            <div class="level-note">XPレベルアップで1つ取得。3択は特殊強化だけ</div>
          </div>
          <div class="level-sp">SP ${state.skillPoints}</div>
        </div>
        <div class="upgrade-grid">
          ${state.upgradeOptions.map(id => {
            const d = runUpgradeDef(id);
            const lv = runUpgradeLevel(id);
            const max = specialUpgradeDef(id)?.max;
            return `
              <div class="upgrade-card" style="--accent:${colorCss(d.color)}">
                <b>${d.icon} / Lv.${lv}${max ? `/${max}` : ''}</b>
                <span>${d.name}</span>
                <small>${d.text}</small>
                <button data-action="pickUpgrade:${id}">取得</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
    <div class="upgrade-overlay ${state.mode==='basicUpgrade'?'on':''}">
      <div class="basic-dialog glass-panel">
        <div class="basic-head">
          <div>
            <div class="level-title">基礎強化</div>
            <div class="level-note">BPを消費して好きな項目を強化。天井到達で右側の上位強化が解放</div>
          </div>
        </div>
        <div class="basic-actions">
          <div class="level-sp">BP ${state.basicPoints}</div>
          <button data-action="resume">戻る</button>
        </div>
        <div class="basic-upgrade-list">
          ${state.mode === 'basicUpgrade' ? renderRunBasicUpgradePaths() : ''}
        </div>
      </div>
    </div>
    <div class="screen modal-screen ${state.mode==='pause'?'on':''}">
      <div class="ui-stage">
        <div class="dialog-card glass-panel">
          <div class="dialog-title">ポーズ</div>
          <div class="dialog-actions">
            <button data-action="resume">再開</button>
            <button data-action="home">ホーム</button>
          </div>
        </div>
      </div>
    </div>
    <div class="screen modal-screen ${state.mode==='dead'?'on':''}">
      <div class="ui-stage">
        <div class="dialog-card glass-panel">
          <div class="dialog-title">ゲームオーバー</div>
          <div class="result-grid">
            <div class="result-stat"><b>スコア</b><span>${formatNumber(state.score)}</span></div>
            <div class="result-stat"><b>ウェーブ</b><span>${state.wave}</span></div>
            <div class="result-stat"><b>獲得</b><span>+${formatNumber(state.runTokenGain)}</span></div>
          </div>
          <div class="dialog-actions">
            <button data-action="start">リトライ</button>
            <button data-action="home">ホーム</button>
          </div>
        </div>
      </div>
    </div>
  `;
  ui.refs = Object.fromEntries([...ui.root.querySelectorAll('[data-ref]')].map(el => [el.dataset.ref, el]));
  for(const key of Object.keys(hudCache)) delete hudCache[key];
  for(const button of ui.root.querySelectorAll('[data-action]:not(:disabled)')){
    button.addEventListener('click', e => {
      e.preventDefault();
      handleAction(button.dataset.action);
    });
  }
  syncUiBounds();
  uiDirty = false;
}

function renderRankingRows(rows){
  if(!rows.length) return '<div class="ranking-empty">NO RECORD</div>';
  return rows.map(row => `
    <div class="ranking-row">
      <b>#${row.rank}</b>
      <span>${escapeHtml(row.name || 'PLAYER')}</span>
      <strong>${formatNumber(row.score)}</strong>
      <small>WAVE ${Math.max(1, Math.floor(Number(row.wave) || 1))}</small>
    </div>
  `).join('');
}

function equippedPartCount(){
  const ship = currentShip();
  let count = 0;
  for(const type of PART_TYPES){
    const slots = shipSlotCount(type, ship);
    const equipped = state.garage?.equippedParts?.[type] || [];
    for(let i=0;i<slots;i++){
      if(equipped[i]) count++;
    }
  }
  return count;
}

function shipSlotsText(ship){
  return PART_TYPES
    .map(type => `${PART_TYPE_LABELS[type]}${shipSlotCount(type, ship)}`)
    .join(' / ');
}

function shipMultText(ship){
  const rows = [
    ['HP', ship.mult.hp],
    ['火力', ship.mult.damage],
    ['連射', ship.mult.fireRate],
    ['機動', ship.mult.speed],
    ['防御', ship.mult.defense]
  ];
  return rows
    .filter(([, value]) => value && Math.abs(value - 1) > .001)
    .map(([label, value]) => `${label}${value > 1 ? '+' : ''}${Math.round((value - 1) * 100)}%`)
    .join(' / ') || '標準性能';
}

function renderStoreShips(){
  return SHIP_DEFS.map(ship => {
    const owned = shipOwned(ship.id);
    const selected = currentShip().id === ship.id;
    const canBuy = !owned && state.tokens >= ship.cost;
    const buttonLabel = selected ? '使用中' : owned ? '選択' : `${formatNumber(ship.cost)}T`;
    const action = owned ? `equipShip:${ship.id}` : `buyShip:${ship.id}`;
    return `
      <div class="ship-card ${owned ? 'owned' : 'locked'} ${selected ? 'selected' : ''}" style="--accent:${ship.color}">
        <div class="ship-card-head">
          <b>${owned ? 'OWNED' : 'STORE'}</b>
          <strong>${ship.name}</strong>
          <small>${ship.role}</small>
        </div>
        <div class="ship-card-body">
          <span>${shipSlotsText(ship)}</span>
          <em>${shipMultText(ship)}</em>
          <i>パーツ効果 x${Number(ship.partPower || 1).toFixed(2)}</i>
        </div>
        <button ${selected || (!owned && !canBuy) ? 'disabled' : ''} data-action="${action}">${buttonLabel}</button>
      </div>
    `;
  }).join('');
}

function renderGaragePanel(equippedSummary){
  const ship = currentShip();
  return `
    <div class="garage-summary" style="--accent:${ship.color}">
      <b>ACTIVE FRAME</b>
      <strong>${ship.name}</strong>
      <span>${ship.role}</span>
      <small>${shipSlotsText(ship)} / パーツ補正 x${Number(ship.partPower || 1).toFixed(2)}</small>
      <em>${shipMultText(ship)}</em>
    </div>
    <div class="garage-ship-strip">
      ${renderGarageShipPicker()}
    </div>
    ${PART_TYPES.map(type => renderPartSection(type)).join('')}
    <div class="garage-skin-section">
      <div class="garage-section-head"><b>スキン</b><span>全機体共通</span></div>
      <div class="equipped-grid">${equippedSummary}</div>
      <div class="cosmetic-list garage-cosmetics">${renderCosmeticInventory()}</div>
    </div>
  `;
}

function renderGarageShipPicker(){
  return SHIP_DEFS.map(ship => {
    const owned = shipOwned(ship.id);
    const selected = currentShip().id === ship.id;
    return `
      <button class="garage-ship ${selected ? 'selected' : ''} ${owned ? '' : 'locked'}" ${owned && !selected ? '' : 'disabled'} data-action="equipShip:${ship.id}" style="--accent:${ship.color}">
        <b>${ship.name}</b>
        <span>${owned ? selected ? '使用中' : '選択' : `${formatNumber(ship.cost)}T`}</span>
      </button>
    `;
  }).join('');
}

function renderPartSection(type){
  const slots = shipSlotCount(type);
  return `
    <div class="part-section">
      <div class="garage-section-head">
        <b>${PART_TYPE_LABELS[type]}</b>
        <span>${slots ? `${slots} SLOT` : 'SLOTなし'}</span>
      </div>
      <div class="part-slot-grid ${slots ? '' : 'empty'}">
        ${slots ? Array.from({length:slots}, (_, i) => renderPartSlot(type, i)).join('') : '<div class="part-empty">この機体には搭載できない</div>'}
      </div>
    </div>
  `;
}

function renderPartSlot(type, index){
  const equipped = state.garage?.equippedParts?.[type]?.[index] || null;
  const current = PART_BY_ID[equipped];
  const options = PART_DEFS.filter(part => part.type === type && state.garage.ownedParts[part.id]);
  return `
    <div class="part-slot" style="--accent:${colorCss(current?.color || COLORS.cyan)}">
      <b>${PART_TYPE_LABELS[type]} ${index + 1}</b>
      <span>${current?.name || '未装備'}</span>
      <small>${current ? `${current.text} / ${partBuffText(current)}` : '効果なし'}</small>
      <div class="part-picker">
        <button class="${!current ? 'selected' : ''}" ${!current ? 'disabled' : ''} data-action="equipPart:${type}:${index}:none">なし</button>
        ${options.map(part => {
          const selected = part.id === equipped;
          return `<button class="${selected ? 'selected' : ''}" ${selected ? 'disabled' : ''} data-action="equipPart:${type}:${index}:${part.id}">${part.name}</button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderHomeUpgradePaths(){
  return HOME_UPGRADE_PATHS.map(path => `
    <div class="upgrade-path">
      ${renderHomeUpgradeCard(path.base)}
      <div class="upgrade-link ${homeUpgradeLevel(path.base.id) >= HOME_UPGRADE_CAP ? 'open' : ''}">></div>
      ${renderHomeUpgradeCard(path.advanced)}
    </div>
  `).join('');
}

function renderHomeUpgradeCard(def){
  const fullDef = homeUpgradeDef(def.id);
  const lv = homeUpgradeLevel(def.id);
  const unlocked = isHomeUpgradeUnlocked(def.id);
  const maxed = isHomeUpgradeMaxed(def.id);
  const cost = homeUpgradeCost(def.id);
  const canBuy = unlocked && !maxed && Number.isFinite(cost) && state.tokens >= cost;
  const tierLabel = fullDef.tier === 'base' ? `${lv}/${HOME_UPGRADE_CAP}` : `Lv.${lv}`;
  const buttonLabel = !unlocked ? 'LOCK' : maxed ? 'MAX' : `${formatNumber(cost)}T`;
  const note = fullDef.tier === 'base' ? '上限あり' : `${homeUpgradeDef(fullDef.parent).name} 10/10で解放`;
  return `
    <div class="upgrade-card ${!unlocked ? 'locked' : ''} ${maxed ? 'maxed' : ''}" style="--accent:${colorCss(fullDef.color)}">
      <b>${fullDef.icon} / ${tierLabel}</b>
      <span>${fullDef.name}</span>
      <small>${fullDef.text}</small>
      <em>${note}</em>
      <button ${canBuy ? '' : 'disabled'} data-action="buyHome:${fullDef.id}">${buttonLabel}</button>
    </div>
  `;
}

function renderRunBasicUpgradePaths(){
  return HOME_UPGRADE_PATHS.map(path => {
    const open = runBasicLevel(path.base.id) >= HOME_UPGRADE_CAP;
    return `
      <div class="upgrade-path run-basic-path ${open ? 'unlocked' : ''}">
        ${renderRunBasicUpgradeCard(path.base)}
        <div class="upgrade-link ${open ? 'open' : ''}">${open ? 'OPEN' : 'LOCK'}</div>
        ${renderRunBasicUpgradeCard(path.advanced)}
      </div>
    `;
  }).join('');
}

function renderRunBasicUpgradeCard(def){
  const fullDef = homeUpgradeDef(def.id);
  const lv = runBasicLevel(def.id);
  const unlocked = isRunBasicUnlocked(def.id);
  const maxed = isRunBasicMaxed(def.id);
  const cost = runBasicUpgradeCost(def.id);
  const canBuy = unlocked && !maxed && Number.isFinite(cost) && state.basicPoints >= cost;
  const tierLabel = fullDef.tier === 'base' ? `${lv}/${HOME_UPGRADE_CAP}` : `Lv.${lv}`;
  const buttonLabel = !unlocked ? 'LOCK' : maxed ? '天井' : `${cost}BP`;
  const note = fullDef.tier === 'base'
    ? maxed ? '天井到達 / 上位解放' : '天井あり / まずここを強化'
    : `${homeUpgradeDef(fullDef.parent).name}が天井で解放`;
  return `
    <div class="upgrade-card run-basic-card ${!unlocked ? 'locked' : ''} ${maxed ? 'maxed cap-open' : ''}" style="--accent:${colorCss(fullDef.color)}">
      <b>${fullDef.icon} / ${tierLabel}</b>
      <span>${fullDef.name}</span>
      <small>${fullDef.text}</small>
      <em>${note}</em>
      <button ${canBuy ? '' : 'disabled'} data-action="buyRunBasic:${fullDef.id}">${buttonLabel}</button>
    </div>
  `;
}

function renderEquippedCosmetics(){
  return Object.keys(DEFAULT_COSMETICS).map(type => {
    const item = equippedCosmetic(type);
    const rarity = COSMETIC_RARITY_BY_ID[item.rarity];
    return `
      <div class="equipped-card" style="--accent:${rarity.color}">
        <b>${COSMETIC_TYPE_LABELS[type]}</b>
        <span>${item.name}</span>
        <small>${rarity.name}</small>
      </div>
    `;
  }).join('');
}

function renderGachaResult(){
  if(!state.lastGacha) return '<div class="gacha-result empty">未抽選</div>';
  const item = cosmeticItem(state.lastGacha.id);
  const rarity = COSMETIC_RARITY_BY_ID[item.rarity];
  const duplicateText = state.lastGacha.duplicate ? ` / 重複 +${rarity.refund}T` : '';
  return `
    <div class="gacha-result" style="--accent:${rarity.color}">
      <b>${rarity.name}${duplicateText}</b>
      <span>${item.name}</span>
      <small>${COSMETIC_TYPE_LABELS[item.type]}</small>
    </div>
  `;
}

function renderCosmeticInventory(){
  return COSMETIC_ITEMS.map(item => {
    const owned = Number(state.cosmetics.owned[item.id]) || 0;
    const rarity = COSMETIC_RARITY_BY_ID[item.rarity];
    const equipped = state.cosmetics.equipped[item.type] === item.id;
    return `
      <div class="cosmetic-row ${owned ? '' : 'locked'} ${equipped ? 'equipped' : ''}" style="--accent:${rarity.color}">
        <b>${rarity.name}</b>
        <span>${item.name}</span>
        <small>${COSMETIC_TYPE_LABELS[item.type]} / ${cosmeticBuffText(item)}${owned > 1 ? ` x${owned}` : ''}</small>
        <button ${owned && !equipped ? '' : 'disabled'} data-action="equipCosmetic:${item.id}">${equipped ? '装備中' : owned ? '装備' : '未所持'}</button>
      </div>
    `;
  }).join('');
}

function cosmeticBuffText(item){
  return Object.entries(item.buff || {})
    .map(([key, value]) => `${COSMETIC_BUFF_LABELS[key] || key}+${(value * 100).toFixed(1)}%`)
    .join(' / ');
}

function partBuffText(part){
  return Object.entries(part.buff || {})
    .map(([key, value]) => `${COSMETIC_BUFF_LABELS[key] || key}+${(value * 100).toFixed(1)}%`)
    .join(' / ');
}

function escapeHtml(value){
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function updateHud(){
  if(state.mode !== 'play' || uiDirty) return;
  const now = performance.now();
  if(now < state.nextHudAt) return;
  state.nextHudAt = now + 100;
  const tokenReward = calculateTokenReward();
  const threshold = xpThreshold();
  const hudClass = `hud on${state.hp / Math.max(1, state.maxHp) < .30 ? ' critical' : ''}${state.basicPoints > 0 ? ' has-bp' : ''}`;
  if(ui.refs.hud && hudCache.hudClass !== hudClass){
    hudCache.hudClass = hudClass;
    ui.refs.hud.className = hudClass;
  }
  setHudText('wave', state.wave);
  setHudText('score', formatNumber(state.score));
  setHudText('time', `${waveSeconds()}秒`);
  setHudText('tokenTop', `+${formatNumber(tokenReward)}`);
  setHudWidth('waveProgress', Math.min(100, state.waveTime / waveDuration() * 100));
  setHudWidth('hp', Math.max(0, state.hp / state.maxHp * 100));
  setHudWidth('energy', Math.max(0, state.energy));
  setHudText('hpText', `${Math.max(0, Math.ceil(state.hp))}/${state.maxHp}`);
  setHudText('energyText', `${Math.max(0, Math.floor(state.energy))}%`);
  setHudWidth('xp', Math.min(100, state.xp / threshold * 100));
  setHudText('xpLabel', `XP Lv.${state.level}`);
  setHudText('xpText', `${state.skillPoints}SP`);
  setHudText('levelChip', state.level);
  setHudText('specialPointChip', state.skillPoints);
  setHudText('bpChip', state.basicPoints);
  setHudText('tokenPreview', `+${formatNumber(tokenReward)}`);
  setHudText('skillControl', `基礎強化 ${state.basicPoints}BP`);
}

function setHudText(ref, value){
  if(!ui.refs[ref]) return;
  const next = String(value);
  if(hudCache[ref] === next) return;
  hudCache[ref] = next;
  ui.refs[ref].textContent = next;
}

function setHudWidth(ref, value){
  if(!ui.refs[ref]) return;
  const next = `${Math.round(value)}%`;
  if(hudCache[`${ref}Width`] === next) return;
  hudCache[`${ref}Width`] = next;
  ui.refs[ref].style.width = next;
}

function handleAction(action){
  if(action === 'start') startRun();
  else if(action === 'store') setMode('store');
  else if(action === 'garage') setMode('garage');
  else if(action === 'homeUpgrade') setMode('homeUpgrade');
  else if(action === 'ranking') setMode('ranking');
  else if(action === 'gacha') setMode('gacha');
  else if(action === 'rollGacha') rollGacha();
  else if(action.startsWith('buyShip:')) buyShip(action.slice(8));
  else if(action.startsWith('equipShip:')) equipShip(action.slice(10));
  else if(action.startsWith('equipPart:')) {
    const [, type, index, id] = action.split(':');
    equipPart(type, index, id);
  }
  else if(action.startsWith('equipCosmetic:')) equipCosmetic(action.slice(14));
  else if(action.startsWith('buyHome:')) buyHomeUpgrade(action.slice(8));
  else if(action.startsWith('buyRunBasic:')) buyRunBasicUpgrade(action.slice(12));
  else if(action.startsWith('pickUpgrade:')) applyRunUpgrade(action.slice(12));
  else if(action === 'openUpgrade' && state.mode === 'play') setMode('basicUpgrade');
  else if(action === 'pause' && state.mode === 'play') setMode('pause');
  else if(action === 'resume' && (state.mode === 'pause' || state.mode === 'basicUpgrade')) setMode('play');
  else if(action === 'home') {
    clearRunObjects();
    setMode('home');
  }
}

function setMode(mode){
  state.mode = mode;
  uiDirty = true;
  renderUi2();
  syncCanvasVisibility();
}

function startRun(){
  clearRunObjects();
  homeShip.root.visible = false;
  player.root.visible = true;
  state.mode = 'play';
  state.wave = 1;
  state.waveTime = 0;
  state.score = 0;
  state.xp = 0;
  state.level = 1;
  state.skillPoints = 0;
  state.basicPoints = 0;
  state.basicPointMeter = 0;
  state.statLevels = freshStatMap();
  state.specialUpgrades = freshSpecialUpgradeMap();
  state.upgradeOptions = [];
  state.runTokenGain = 0;
  state.runTime = 0;
  state.kills = 0;
  state.maxHp = hpMax();
  state.hp = state.maxHp;
  state.energy = 100;
  state.roll = 0;
  state.rollVel = 0;
  player.root.position.x = 0;
  camera.position.set(0, CAMERA_BASE_Y, CAMERA_BASE_Z);
  camera.lookAt(0, CAMERA_LOOK_Y, CAMERA_LOOK_Z);
  state.spawnTimer = .45;
  state.bossAlive = false;
  state.nextHudAt = 0;
  uiDirty = true;
  renderUi2();
  syncCanvasVisibility();
}

function clearRunObjects(){
  for(const e of enemies) releaseEnemyObject(e);
  enemies.length = 0;
  bullets.length = 0;
  particles.length = 0;
  bulletsDirty = true;
  particlesDirty = true;
  bulletMesh.count = 0;
  particleMesh.count = 0;
  syncBulletInstances();
  syncParticleInstances();
  state.bossAlive = false;
}

function bindInput(){
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.keyboard = -1;
    if(e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.keyboard = 1;
    if(e.key === 'Enter' && (state.mode === 'home' || state.mode === 'dead')) startRun();
    if(e.key === 'Escape') state.mode === 'play' ? setMode('pause') : state.mode === 'pause' ? setMode('play') : null;
  });
  window.addEventListener('keyup', e => {
    if(['ArrowLeft','a','A','ArrowRight','d','D'].includes(e.key)) state.keyboard = 0;
  });
  canvas.addEventListener('pointerdown', e => {
    if(state.mode !== 'play') return;
    activePointer = e.pointerId;
    canvas.setPointerCapture?.(e.pointerId);
    updatePointerControl(e);
    e.preventDefault();
  });
  canvas.addEventListener('pointermove', e => {
    if(activePointer !== e.pointerId) return;
    updatePointerControl(e);
    e.preventDefault();
  });
  const end = e => {
    if(activePointer === e.pointerId){
      activePointer = null;
      state.pointer = 0;
      canvas.releasePointerCapture?.(e.pointerId);
    }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('contextmenu', e => e.preventDefault());
}

function updatePointerControl(e){
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / Math.max(1, rect.width);
  state.pointer = clamp((x - .5) / CONTROL_POINTER_RANGE, -1, 1);
}

function resize(){
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, rect.width || W);
  const h = Math.max(1, rect.height || H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  syncUiBounds();
}

function syncUiBounds(){
  if(!ui?.root) return;
  const rect = canvas.getBoundingClientRect();
  ui.root.style.left = `${rect.left}px`;
  ui.root.style.top = `${rect.top}px`;
  ui.root.style.width = `${rect.width}px`;
  ui.root.style.height = `${rect.height}px`;
  ui.root.style.setProperty('--ui-scale', `${Math.min(rect.width / W, rect.height / H)}`);
}

function syncCanvasVisibility(){
  const shouldShow = ['home', 'play', 'levelup', 'pause', 'dead'].includes(state.mode);
  canvas.style.visibility = shouldShow ? 'visible' : 'hidden';
  canvas.style.clipPath = '';
  canvas.style.webkitClipPath = '';
  if(shouldShow){
    canvas3dActive = true;
  }else if(canvas3dActive){
    renderer.clear();
    canvas3dActive = false;
  }
}

function loop(now){
  if(state.mode === 'play' || state.mode === 'home') requestAnimationFrame(loop);
  else setTimeout(() => requestAnimationFrame(loop), 120);
  const dt = Math.min(.033, Math.max(.001, (now - (state.last || now)) / 1000));
  state.last = now;
  update(dt, now * .001);
  render(now * .001);
}

function update(dt, t){
  state.input = clamp(state.keyboard + state.pointer, -1, 1);
  if(state.mode === 'home'){
    updateHomePreview(dt, t);
  }else if(state.mode === 'play'){
    updatePlay(dt, t);
    updateStage(dt, t);
    updateParticles(dt);
  }
  updateHud();
}

function updatePlay(dt, t){
  const speedLevel = statLevel('speed');
  const moveMult = loadoutMult('speed');
  const targetVel = state.input * CONTROL_TURN_SPEED * (1 + speedLevel * .035) * moveMult;
  state.rollVel += (targetVel - state.rollVel) * Math.min(1, dt * CONTROL_RESPONSE * (1 + speedLevel * .02 + loadoutBuff('speed') * .55));
  state.roll += state.rollVel * dt;
  state.waveTime += dt;
  state.runTime += dt;
  state.score += Math.floor((24 + state.wave * 1.8) * dt);
  state.energy = Math.min(100, state.energy + dt * 12);
  state.shake = Math.max(0, state.shake - dt * 6);
  const regen = regenPerSecond();
  if(regen > 0 && state.hp < state.maxHp){
    state.hp = Math.min(state.maxHp, state.hp + regen * dt);
  }

  if(state.waveTime >= waveDuration()){
    state.wave++;
    state.waveTime = 0;
    state.spawnTimer = Math.min(state.spawnTimer, .35);
    if(state.wave % 10 === 0) spawnBoss();
  }

  state.firing -= dt;
  if(state.firing <= 0 && bullets.length < MAX_BULLETS){
    const fireBoost = (1 + statLevel('fireRate') * .085) * barrelFireBoost() * loadoutMult('fireRate');
    state.firing = Math.max(.055, (.18 - Math.min(.08, state.wave * .0014)) / fireBoost);
    fireShot();
  }

  state.spawnTimer -= dt;
  if(state.spawnTimer <= 0 && enemies.length < MAX_ENEMIES && !state.bossAlive){
    spawnEnemyPack();
    state.spawnTimer = spawnInterval();
  }

  updateBullets(dt);
  updateEnemies(dt, t);
  syncBulletInstances();
  if(state.hp <= 0){
    saveRun();
    setMode('dead');
  }
}

function updateHomePreview(dt, t){
  ringPhase = (ringPhase + 6.5 * dt) % PIPE_RING_LOOP;
  for(let i=0;i<stage.starLayers.length;i++){
    const layer = stage.starLayers[i];
    const loop = layer.userData.loop || PIPE_RING_LOOP;
    const scroll = layer.userData.scroll || 8;
    layer.position.z = (ringPhase * scroll / 22) % loop;
    layer.rotation.z = Math.sin(t * (.12 + i * .035)) * .025;
    if(layer.userData.twinkle && layer.material){
      const wave = .5 + .5 * Math.sin(t * (.45 + i * .13) + layer.userData.phase);
      layer.material.opacity = layer.userData.baseOpacity * (1 - layer.userData.twinkle + layer.userData.twinkle * wave);
    }
  }

  world.rotation.z = Math.sin(t * .18) * .025;
  pipeRoot.rotation.z = Math.sin(t * .28) * .018;

  player.root.visible = false;
  homeShip.root.visible = true;
  homeShip.root.position.set(
    Math.sin(t * .65) * .10,
    -1.06 + Math.sin(t * 1.15) * .10,
    -8.35
  );
  homeShip.root.rotation.x = -.11 + Math.sin(t * .55) * .018;
  homeShip.root.rotation.y = .04 + Math.sin(t * .42) * .018;
  homeShip.root.rotation.z = -.24 + Math.sin(t * .80) * .026;
  homeShip.root.scale.setScalar(2.65 + Math.sin(t * 1.2) * .030);
  homeShip.core.scale.setScalar(1.08 + Math.sin(t * 9) * .12);
  homeShip.materials.edge.opacity = .92;
  homeShip.materials.goldLine.opacity = .82;
  homeShip.materials.roseLine.opacity = .78;
  homeShip.materials.shadow.opacity = .07;
  if(homeShip.materials.hull.emissive){
    homeShip.materials.hull.emissiveIntensity = 1.55;
  }
  if(homeShip.materials.wing.emissive){
    homeShip.materials.wing.emissiveIntensity = 1.05;
  }
  if(homeShip.materials.panel.emissive){
    homeShip.materials.panel.emissiveIntensity = .90;
  }
  if(homeShip.materials.glass.emissiveIntensity !== undefined) homeShip.materials.glass.emissiveIntensity = 1.85;

  ambient.intensity += (1.7 - ambient.intensity) * Math.min(1, dt * 4.8);
  keyLight.intensity += (22 - keyLight.intensity) * Math.min(1, dt * 4.8);
  rimLight.intensity += (9.5 - rimLight.intensity) * Math.min(1, dt * 4.8);
  keyLight.position.set(2.4, -3.6, 7.5);
  rimLight.position.set(5.6, 1.2, -8);
  camera.position.x += (0 - camera.position.x) * Math.min(1, dt * 5.2);
  camera.position.y += (CAMERA_BASE_Y + .45 - camera.position.y) * Math.min(1, dt * 5.2);
  camera.position.z += (10.8 - camera.position.z) * Math.min(1, dt * 5.2);
  cameraHomeTarget.set(0, -1.22, -8.65);
  camera.lookAt(cameraHomeTarget);
}

function updateStage(dt, t){
  homeShip.root.visible = false;
  player.root.visible = true;
  ambient.intensity += (1.25 - ambient.intensity) * Math.min(1, dt * 6);
  keyLight.intensity += (13 - keyLight.intensity) * Math.min(1, dt * 6);
  rimLight.intensity += (9 - rimLight.intensity) * Math.min(1, dt * 6);
  keyLight.position.set(0, -2, 6);
  rimLight.position.set(-6, 4, -18);
  shared.materials.player.emissiveIntensity = .72;
  shared.materials.playerPlate.emissiveIntensity = .42;
  shared.materials.playerWing.emissiveIntensity = .52;

  const speed = state.mode === 'play' ? (14 + Math.min(18, state.wave * .35)) : 8;
  ringPhase = (ringPhase + speed * dt) % PIPE_RING_LOOP;
  for(let i=0;i<stage.starLayers.length;i++){
    const layer = stage.starLayers[i];
    const loop = layer.userData.loop || PIPE_RING_LOOP;
    const scroll = layer.userData.scroll || 8;
    layer.position.z = (ringPhase * scroll / 18) % loop;
    layer.rotation.z = -state.roll * (.05 + i * .035) + Math.sin(t * (.10 + i * .03)) * .015;
    if(layer.userData.twinkle && layer.material){
      const wave = .5 + .5 * Math.sin(t * (.45 + i * .13) + layer.userData.phase);
      layer.material.opacity = layer.userData.baseOpacity * (1 - layer.userData.twinkle + layer.userData.twinkle * wave);
    }
  }
  world.rotation.z = -state.roll;
  pipeRoot.rotation.z = Math.sin(t * .4) * .018;

  player.root.position.y = PLAYER_Y;
  player.root.position.z = PLAYER_Z;
  player.root.scale.setScalar(2.12);
  player.root.rotation.x = -.13;
  player.root.rotation.y = 0;

  const bank = -state.input * PLAYER_BANK_SCALE - state.rollVel * .06;
  player.root.rotation.z += (bank - player.root.rotation.z) * Math.min(1, dt * 5.8);
  player.root.position.x += ((state.input * PLAYER_DRIFT_SCALE) - player.root.position.x) * Math.min(1, dt * 5.6);
  player.core.scale.setScalar(1 + Math.sin(t * 12) * .10);

  if(state.shake > 0){
    camera.position.x = (Math.random() - .5) * state.shake * .08;
    camera.position.y = CAMERA_BASE_Y + (Math.random() - .5) * state.shake * .05;
  }else{
    camera.position.x += (0 - camera.position.x) * Math.min(1, dt * 8);
    camera.position.y += (CAMERA_BASE_Y - camera.position.y) * Math.min(1, dt * 8);
  }
  camera.position.z += (CAMERA_BASE_Z - camera.position.z) * Math.min(1, dt * 8);
  camera.lookAt(0, CAMERA_LOOK_Y, CAMERA_LOOK_Z);
}

function updateBullets(dt){
  if(!bullets.length) return;
  for(let i=bullets.length-1;i>=0;i--){
    const b = bullets[i];
    b.z -= b.speed * dt;
    b.life -= dt;
    if(b.life <= 0 || b.z < PIPE_Z_FAR){
      bullets.splice(i, 1);
    }
  }
  bulletsDirty = true;
}

function updateEnemies(dt, t){
  for(let i=enemies.length-1;i>=0;i--){
    const e = enemies[i];
    if(e.boss){
      e.z += (e.targetZ - e.z) * Math.min(1, dt * .55);
      e.angle += Math.sin(t * .7 + e.phase) * dt * .22;
      e.fire -= dt;
      if(e.fire <= 0){
        e.fire = Math.max(.55, 1.25 - state.wave * .006);
        spawnBossShard(e);
      }
    }else{
      e.z += e.speed * dt;
      e.angle += Math.sin(t * e.wobble + e.phase) * dt * e.drift;
    }
    const rollDistance = angleDistance(e.angle, state.roll);
    const visible = rollDistance < ENEMY_VISIBLE_ARC || (e.boss && e.z <= BOSS_SIGHT_Z);
    e.root.visible = visible;
    e.hitFlash = Math.max(0, (e.hitFlash || 0) - dt * 5.8);
  if(visible){
      setPipePosition(e.root, e.angle, e.z, e.boss ? .68 : .88);
      const presence = enemyDepthPresence(e);
      e.root.scale.setScalar(enemyVisualScale(e, t, presence) * (1 + (e.hitFlash || 0) * .20));
      setEnemyOpacity(e.root, enemyVisualOpacity(e, presence));
      setEnemyFlash(e.root, e.hitFlash || 0);
      syncEnemyDetail(e);
      animateEnemyObject(e, dt, t);
      e.root.rotation.x += dt * e.spinX;
      e.root.rotation.y += dt * e.spinY;
      e.root.rotation.z += dt * e.spinZ;
    }

    if(bullets.length && hitEnemyWithBullets(e, i)) continue;

    const nearPlayer = e.z > PLAYER_Z - .40;
    const danger = rollDistance < (e.boss ? .40 : .22 + e.radius * .09);
    if(nearPlayer){
      if(danger){
        const counterDamage = collisionDamageAmount(e);
        if(counterDamage > 0){
          e.hp -= counterDamage;
          e.hitFlash = 1;
          burst(e.angle, e.z, 0xffd36a, e.boss ? 3 : 2);
          if(e.hp <= 0){
            defeatEnemy(e, i);
            continue;
          }
        }
        damagePlayer(e.damage);
      }
      removeEnemy(i, false);
      continue;
    }
    if(e.z > PIPE_Z_NEAR + 4) removeEnemy(i, false);
  }
}

function hitEnemyWithBullets(enemy, enemyIndex){
  for(let i=bullets.length-1;i>=0;i--){
    const b = bullets[i];
    const dz = Math.abs(enemy.z - b.z);
    if(dz > (enemy.boss ? 1.7 : .72 + enemy.radius)) continue;
    const da = angleDistance(enemy.angle, b.angle);
    if(da > (enemy.boss ? .38 : .16 + enemy.radius * .08)) continue;
    enemy.hp -= b.damage;
    enemy.hitFlash = 1;
    burst(enemy.angle, enemy.z, b.crit ? 0xffd36a : enemy.type.color, enemy.boss ? 3 : 1);
    bullets.splice(i, 1);
    bulletsDirty = true;
    if(enemy.hp <= 0){
      defeatEnemy(enemy, enemyIndex);
      return true;
    }
  }
  return false;
}

function defeatEnemy(enemy, enemyIndex){
  state.score += enemy.boss ? 5200 + state.wave * 140 : 90 + state.wave * 12;
  state.kills++;
  grantXp(enemy.boss ? 95 + state.wave * 8 : 18 + state.wave * 2);
  if(enemy.boss){
    state.bossAlive = false;
    state.energy = Math.min(100, state.energy + 28);
  }
  removeEnemy(enemyIndex, true);
}

function damagePlayer(amount){
  if(amount <= 0) return;
  const evade = evasionChance();
  if(evade > 0 && Math.random() < evade){
    state.shake = Math.max(state.shake, .38);
    burst(state.roll, PLAYER_Z - .3, 0x1ed6ff, 2);
    return;
  }
  const taken = Math.max(1, Math.ceil(amount * defenseMultiplier()));
  state.hp -= taken;
  state.shake = 1;
  burst(state.roll, PLAYER_Z - .3, 0xff3b62, 2);
}

function fireShot(){
  const baseDamage = (7 + state.wave * .45) * statMult('damage', .10) * bulletSpeedDamageMult() * (1 + cosmeticBuff('damage') + loadoutBuff('damage')) * shipMult('damage');
  const speed = 45 * (1 + statLevel('bulletSpeed') * .045 + cosmeticBuff('bulletSpeed') + loadoutBuff('bulletSpeed'));
  const life = (3 + statLevel('range') * .13 + statLevel('bulletSpeed') * .035) * (1 + loadoutBuff('range'));

  if(specialUpgradeLevel('barrelShotgun') > 0){
    for(const offset of SHOTGUN_OFFSETS) pushBullet(offset, baseDamage, speed, life, .86, .82, .42);
  }else if(specialUpgradeLevel('barrelSniper') > 0){
    pushBullet(0, baseDamage, speed, life, 3.25, 1.72, 1.55);
  }else if(specialUpgradeLevel('barrelMultishot') > 0){
    for(const offset of MULTISHOT_OFFSETS) pushBullet(offset, baseDamage, speed, life, .74, 1, .96);
  }else if(specialUpgradeLevel('barrelDouble') > 0){
    const offsets = DOUBLE_BARREL_OFFSETS[Math.min(2, specialUpgradeLevel('barrelDouble') - 1)] || DOUBLE_BARREL_OFFSETS[0];
    for(const offset of offsets) pushBullet(offset, baseDamage, speed, life, .82, 1.03, 1);
  }else if(specialUpgradeLevel('barrelGatling') > 0){
    pushBullet(0, baseDamage, speed, life, .66, 1.10, .92);
  }else{
    pushBullet(0, baseDamage, speed, life);
  }
  bulletsDirty = true;
}

function pushBullet(angleOffset, baseDamage, speed, life, damageMult = 1, speedMult = 1, lifeMult = 1, radial = PLAYER_RADIAL){
  if(bullets.length >= MAX_BULLETS) return;
  const angle = normalizeAngle(state.roll + angleOffset);
  const crit = Math.random() < (critChance() + cosmeticBuff('crit'));
  bullets.push({
    angle,
    sin: Math.sin(angle),
    cos: Math.cos(angle),
    z: PLAYER_Z - .72,
    radial,
    speed: speed * speedMult,
    damage: Math.ceil(baseDamage * damageMult * (crit ? critDamageMult() : 1)),
    crit,
    life: life * lifeMult
  });
}

function spawnEnemyPack(){
  const count = Math.min(5, 1 + Math.floor(state.wave / 9) + (Math.random() < .38 ? 1 : 0));
  for(let i=0;i<count && enemies.length<MAX_ENEMIES;i++){
    spawnEnemy(Math.random() * .85 + i * .08);
  }
}

function spawnEnemy(offset = 0){
  const type = pickEnemyType();
  const root = acquireEnemyObject(type, false);
  const wavePower = Math.pow(1.035, state.wave - 1);
  const enemy = {
    root,
    type,
    boss:false,
    angle: randomPipeAngle() + offset,
    z: PIPE_Z_FAR + 24 - Math.random() * 18,
    hp: Math.ceil(type.hp * wavePower * (1 + state.wave * .022)),
    damage: Math.ceil(type.damage * (1 + state.wave * .018)),
    speed: 12.5 + Math.min(8.5, state.wave * .11) + Math.random() * 2.2,
    radius: type.radius,
    baseScale: 1,
    phase: Math.random() * TAU,
    drift: .09 + Math.random() * .08,
    wobble: .8 + Math.random() * .6,
    spinX: (Math.random() - .5) * 1.8,
    spinY: (Math.random() - .5) * 1.8,
    spinZ: (Math.random() - .5) * 2.4
  };
  enemy.spawnZ = enemy.z;
  enemies.push(enemy);
  enemyRoot.add(root);
  setPipePosition(root, enemy.angle, enemy.z, .88);
  applyEnemyVisual(enemy, 0);
}

function spawnBoss(){
  if(state.bossAlive) return;
  state.bossAlive = true;
  const type = { id:'boss', name:'トライ・レイド', color:0xff3b62, radius:1.4 };
  const root = acquireEnemyObject(type, true);
  const enemy = {
    root,
    type,
    boss:true,
    angle: state.roll + (Math.random() - .5) * .8,
    z: BOSS_SIGHT_Z,
    targetZ: -18,
    hp: Math.ceil((220 + state.wave * 38) * Math.pow(1.035, state.wave - 10)),
    damage: 42 + Math.floor(state.wave * 1.2),
    radius:1.4,
    baseScale:1.55,
    speed:0,
    phase:Math.random() * TAU,
    fire:1.4,
    spinX:.45,
    spinY:.72,
    spinZ:.34
  };
  enemy.spawnZ = enemy.z;
  enemies.push(enemy);
  enemyRoot.add(root);
  setPipePosition(root, enemy.angle, enemy.z, .68);
  applyEnemyVisual(enemy, 0);
}

function spawnBossShard(boss){
  for(let i=-1;i<=1;i++){
    if(enemies.length >= MAX_ENEMIES) return;
    const type = ENEMY_TYPES[1];
    const root = acquireEnemyObject(type, false);
    const shard = {
      root,
      type,
      boss:false,
      angle: boss.angle + i * .28 + (Math.random() - .5) * .16,
      z: boss.z + 1.5,
      hp: Math.ceil(8 + state.wave * .6),
      damage: Math.ceil(18 + state.wave * .4),
      speed: 24 + Math.min(8, state.wave * .08),
      radius:.42,
      baseScale:.72,
      phase:Math.random() * TAU,
      drift:.035,
      wobble:1,
      spinX:1.5,
      spinY:.7,
      spinZ:2.1
    };
    shard.spawnZ = shard.z;
    enemies.push(shard);
    enemyRoot.add(root);
    setPipePosition(root, shard.angle, shard.z, .88);
    applyEnemyVisual(shard, 0);
  }
}

function acquireEnemyObject(type, boss = false){
  const key = boss ? 'boss' : type.id;
  const pool = enemyPools.get(key);
  const root = pool?.pop() || makeEnemyObject(type, boss);
  root.visible = true;
  root.position.set(0, 0, 0);
  root.rotation.set(0, 0, 0);
  root.scale.setScalar(1);
  if(root.userData){
    root.userData.detailVisible = null;
    root.userData.opacity = null;
    if(root.userData.core) root.userData.core.visible = true;
    if(root.userData.glow) root.userData.glow.visible = true;
  }
  return root;
}

function releaseEnemyObject(enemy){
  enemyRoot.remove(enemy.root);
  const key = enemy.boss ? 'boss' : enemy.type.id;
  const pool = enemyPools.get(key) || [];
  enemy.root.visible = false;
  setEnemyFlash(enemy.root, 0);
  if(pool.length < ENEMY_POOL_LIMIT){
    pool.push(enemy.root);
    enemyPools.set(key, pool);
  }
}

function makeEnemyObject(type, boss = false){
  const root = new THREE.Group();
  const key = boss ? 'boss' : type.id;
  const geo = boss ? shared.geometries.boss : shared.geometries[type.id];
  const mesh = new THREE.Mesh(geo, shared.enemyMaterials.get(key));
  const edges = new THREE.LineSegments(
    shared.edgeGeometries.get(key),
    shared.edgeMaterials.get(key)
  );
  root.userData.rings = [];
  root.userData.detailParts = [];
  mesh.scale.setScalar(boss ? .92 : .88);
  root.add(mesh, edges);
  decorateEnemyObject(root, type, boss, key);
  if(boss){
    const halo = addEnemyRing(root, 1.62, shared.edgeMaterials.get('boss'), Math.PI / 2, 0, 0, .42);
    halo.rotation.x = Math.PI / 2;
    const outerHalo = addEnemyRing(root, 2.28, shared.edgeMaterials.get('boss'), Math.PI / 2, 0, Math.PI / 3, -.34);
    outerHalo.rotation.x = Math.PI / 2;
    outerHalo.rotation.z = Math.PI / 3;
    const sightRing = new THREE.Line(makeRingCircleGeometry(3.05, LOW_POWER_DEVICE ? 44 : 52), shared.materials.bossSight);
    sightRing.rotation.x = Math.PI / 2;
    sightRing.position.z = -.08;
    root.add(sightRing);
  }
  prepareEnemyVisualMaterials(root);
  return root;
}

function decorateEnemyObject(root, type, boss, key){
  const coreGeometry = boss ? shared.geometries.bossCore : shared.geometries.enemyCore;
  const core = new THREE.Mesh(coreGeometry, shared.coreMaterials.get(key));
  const glow = new THREE.Mesh(shared.geometries.enemyGlow, shared.glowMaterials.get(key));
  const coreScale = boss ? 1.05 : type.id === 'orb' ? .78 : .62;
  const glowScale = boss ? 1.85 : type.id === 'orb' ? 1.05 : .92;
  core.scale.setScalar(coreScale);
  glow.scale.setScalar(glowScale);
  root.userData.core = core;
  root.userData.glow = glow;
  root.userData.coreBase = coreScale;
  root.userData.glowBase = glowScale;
  root.add(glow, core);

  if(boss){
    addEnemyRing(root, 1.06, shared.edgeMaterials.get(key), 0, Math.PI / 2, 0, .95);
    addEnemyRing(root, 1.22, shared.edgeMaterials.get(key), Math.PI / 2, 0, Math.PI / 6, -.78);
    addEnemyRing(root, 1.00, shared.materials.bossSight, .72, .38, 0, .56);
    for(let i=0;i<3;i++){
      const a = TAU * i / 3 - Math.PI / 2;
      addEnemyBlade(root, a, 1.10, shared.geometries.bossBlade, shared.materials.enemyArmorLight, 1, 1.05, 1.0);
      addEnemyBlade(root, a + .10, .78, shared.geometries.enemyBlade, shared.glowMaterials.get(key), .72, 1.1, .85);
    }
    return;
  }

  const sides = type.id === 'orb' ? 4 : Math.max(3, type.sides || 4);
  const ringMat = shared.edgeMaterials.get(key);
  addEnemyRing(root, .72, ringMat, 0, 0, 0, type.id === 'orb' ? .58 : .36);
  addEnemyRing(root, .62, ringMat, Math.PI / 2, 0, 0, type.id === 'tri' ? -.55 : -.42);
  if(type.id !== 'orb'){
    addEnemyRing(root, .52, ringMat, 0, Math.PI / 2, .25, .48);
  }

  for(let i=0;i<sides;i++){
    const a = TAU * i / sides - Math.PI / 2;
    const useSpike = type.id === 'tri';
    addEnemyBlade(
      root,
      a,
      useSpike ? .70 : .62,
      useSpike ? shared.geometries.enemySpike : shared.geometries.enemyBlade,
      i % 2 === 0 ? shared.materials.enemyArmorLight : shared.materials.enemyArmor,
      useSpike ? .95 : .78,
      type.id === 'orb' ? .72 : .92,
      .86
    );
  }
}

function prepareEnemyVisualMaterials(root){
  root.userData.opacityMaterials = [];
  root.traverse(child => {
    if(!child.material) return;
    const materials = Array.isArray(child.material)
      ? child.material.map(material => material.clone())
      : [child.material.clone()];
    child.material = Array.isArray(child.material) ? materials : materials[0];
    for(const material of materials){
      material.userData.baseOpacity = typeof material.opacity === 'number' ? material.opacity : 1;
      if(material.color) material.userData.baseColor = material.color.clone();
      if(material.emissive) material.userData.baseEmissive = material.emissive.clone();
      if(typeof material.emissiveIntensity === 'number') material.userData.baseEmissiveIntensity = material.emissiveIntensity;
      material.transparent = true;
      material.depthWrite = false;
      root.userData.opacityMaterials.push(material);
    }
  });
}

function addEnemyRing(root, radius, material, rx = 0, ry = 0, rz = 0, spin = .35){
  const ring = new THREE.Line(shared.geometries.enemyRing, material);
  ring.scale.setScalar(radius);
  ring.rotation.set(rx, ry, rz);
  ring.userData.spin = spin;
  root.userData.rings.push(ring);
  root.userData.detailParts.push(ring);
  root.add(ring);
  return ring;
}

function addEnemyBlade(root, angle, radius, geometry, material, sx = 1, sy = 1, sz = 1){
  const blade = new THREE.Mesh(geometry, material);
  blade.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  blade.rotation.z = angle - Math.PI / 2;
  blade.scale.set(sx, sy, sz);
  root.userData.detailParts.push(blade);
  root.add(blade);
  return blade;
}

function removeEnemy(index, killed){
  const e = enemies[index];
  if(!e) return;
  if(killed) burst(e.angle, e.z, e.type.color, e.boss ? 8 : 3);
  releaseEnemyObject(e);
  enemies.splice(index, 1);
}

function burst(angle, z, color, amount = 1){
  const count = Math.min(MAX_PARTICLES - particles.length, amount * 3);
  for(let i=0;i<count;i++){
    const p = {
      color,
      angle: angle + (Math.random() - .5) * .42,
      z: z + (Math.random() - .5) * 1.2,
      radial: .65 + Math.random() * .18,
      va: (Math.random() - .5) * 1.2,
      vz: (Math.random() - .5) * 10,
      life: .55 + Math.random() * .35,
      maxLife: .9
    };
    particles.push(p);
  }
  particlesDirty = true;
}

function updateParticles(dt){
  let changed = particles.length > 0;
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.life -= dt;
    p.angle += p.va * dt;
    p.z += p.vz * dt;
    if(p.life <= 0){
      particles.splice(i, 1);
    }
  }
  if(changed){
    particlesDirty = true;
    syncParticleInstances();
  }
}

function pickEnemyType(){
  if(state.wave !== unlockedEnemyWave){
    unlockedEnemyWave = state.wave;
    unlockedEnemyTypes = ENEMY_TYPES.filter(t => state.wave >= t.unlock);
  }
  if(state.wave >= 100) return unlockedEnemyTypes[Math.floor(Math.random() * unlockedEnemyTypes.length)];
  const top = unlockedEnemyTypes[unlockedEnemyTypes.length - 1];
  return Math.random() < .55 ? top : unlockedEnemyTypes[Math.floor(Math.random() * unlockedEnemyTypes.length)];
}

function randomPipeAngle(){
  return (Math.random() - .5) * TAU;
}

function spawnInterval(){
  return Math.max(.34, .95 - state.wave * .009) * (.82 + Math.random() * .38);
}

function waveDuration(){
  return 10;
}

function waveSeconds(){
  return Math.max(0, Math.ceil(waveDuration() - state.waveTime));
}

function setPipePosition(object, angle, z, radial = .78){
  object.position.set(
    Math.sin(angle) * PIPE_RADIUS * radial,
    -Math.cos(angle) * PIPE_RADIUS * radial,
    z
  );
}

function syncBulletInstances(){
  if(!bulletsDirty) return;
  const count = Math.min(bullets.length, MAX_BULLETS);
  bulletMesh.count = count;
  if(count === 0){
    bulletsDirty = false;
    return;
  }
  for(let i=0;i<count;i++){
    const b = bullets[i];
    bulletDummy.position.set(
      b.sin * PIPE_RADIUS * b.radial,
      -b.cos * PIPE_RADIUS * b.radial,
      b.z
    );
    bulletDummy.rotation.set(0, 0, 0);
    bulletDummy.scale.setScalar(1);
    bulletDummy.updateMatrix();
    bulletMesh.setMatrixAt(i, bulletDummy.matrix);
  }
  bulletMesh.instanceMatrix.needsUpdate = true;
  bulletsDirty = false;
}

function syncParticleInstances(){
  if(!particlesDirty) return;
  const count = Math.min(particles.length, MAX_PARTICLES);
  particleMesh.count = count;
  if(count === 0){
    particlesDirty = false;
    return;
  }
  for(let i=0;i<count;i++){
    const p = particles[i];
    particleDummy.position.set(
      Math.sin(p.angle) * PIPE_RADIUS * p.radial,
      -Math.cos(p.angle) * PIPE_RADIUS * p.radial,
      p.z
    );
    particleDummy.rotation.set(0, 0, 0);
    particleDummy.scale.setScalar(Math.max(.05, p.life / p.maxLife));
    particleDummy.updateMatrix();
    particleMesh.setMatrixAt(i, particleDummy.matrix);
    particleColor.set(p.color);
    particleMesh.setColorAt(i, particleColor);
  }
  particleMesh.instanceMatrix.needsUpdate = true;
  if(particleMesh.instanceColor) particleMesh.instanceColor.needsUpdate = true;
  particlesDirty = false;
}

function applyEnemyVisual(enemy, t){
  const presence = enemyDepthPresence(enemy);
  enemy.root.scale.setScalar(enemyVisualScale(enemy, t, presence));
  setEnemyOpacity(enemy.root, enemyVisualOpacity(enemy, presence));
}

function enemyDepthPresence(enemy){
  const fadeDistance = enemy.boss ? BOSS_FADE_DISTANCE : ENEMY_FADE_DISTANCE;
  const spawnZ = enemy.spawnZ ?? (enemy.boss ? BOSS_SIGHT_Z : PIPE_Z_FAR + 24);
  const raw = clamp((enemy.z - spawnZ) / fadeDistance, 0, 1);
  return smoothstep(raw);
}

function enemyVisualScale(enemy, t, presence = enemyDepthPresence(enemy)){
  const base = enemy.baseScale || 1;
  const closeStart = enemy.boss ? -82 : -92;
  const close = clamp((enemy.z - closeStart) / Math.max(1, PIPE_Z_NEAR - closeStart), 0, 1);
  const farScale = enemy.boss ? .34 : .16;
  const fullScale = enemy.boss ? 1.02 : .88;
  const nearScale = enemy.boss ? 1.18 : 1.06;
  const depthScale = farScale + (fullScale - farScale) * presence + (nearScale - fullScale) * close;
  const pulse = enemy.boss ? 1 + Math.sin(t * 3.4 + enemy.phase) * .055 : 1;
  return base * depthScale * pulse;
}

function enemyVisualOpacity(enemy, presence){
  const minOpacity = enemy.boss ? .18 : .06;
  return minOpacity + (1 - minOpacity) * presence;
}

function setEnemyOpacity(root, opacity){
  const data = root.userData;
  if(!data?.opacityMaterials) return;
  if(Math.abs((data.opacity ?? -1) - opacity) < .015) return;
  data.opacity = opacity;
  for(const material of data.opacityMaterials){
    material.opacity = material.userData.baseOpacity * opacity;
  }
}

function setEnemyFlash(root, amount){
  const data = root.userData;
  if(!data?.opacityMaterials) return;
  const flash = clamp(amount || 0, 0, 1);
  if(Math.abs((data.flash ?? -1) - flash) < .025) return;
  data.flash = flash;
  for(const material of data.opacityMaterials){
    if(material.color && material.userData.baseColor){
      material.color.copy(material.userData.baseColor).lerp(enemyFlashColor, flash);
    }
    if(material.emissive && material.userData.baseEmissive){
      material.emissive.copy(material.userData.baseEmissive).lerp(enemyFlashColor, flash * .72);
      material.emissiveIntensity = (material.userData.baseEmissiveIntensity ?? material.emissiveIntensity ?? 1) + flash * 1.1;
    }
  }
}

function smoothstep(t){
  return t * t * (3 - 2 * t);
}

function syncEnemyDetail(enemy){
  const data = enemy.root.userData;
  if(!data?.detailParts) return;
  const detailVisible = enemy.boss ? enemy.z > BOSS_SIGHT_Z + 18 : enemy.z > ENEMY_DETAIL_Z;
  if(data.detailVisible === detailVisible) return;
  data.detailVisible = detailVisible;
  for(const part of data.detailParts) part.visible = detailVisible;
}

function animateEnemyObject(enemy, dt, t){
  const data = enemy.root.userData;
  if(!data) return;
  if(!enemy.boss && !data.detailVisible) return;
  if(data.core){
    const pulse = 1 + Math.sin(t * (enemy.boss ? 7.5 : 9.0) + enemy.phase) * (enemy.boss ? .12 : .08);
    data.core.scale.setScalar(data.coreBase * pulse);
  }
  if(data.glow){
    const pulse = 1 + Math.sin(t * (enemy.boss ? 4.2 : 5.8) + enemy.phase) * .16;
    data.glow.scale.setScalar(data.glowBase * pulse);
  }
  if(data.detailVisible && data.rings){
    for(let i=0;i<data.rings.length;i++){
      const ring = data.rings[i];
      ring.rotation.z += dt * (ring.userData.spin || .3) * (i % 2 ? -1 : 1);
    }
  }
}

function angleDistance(a, b){
  let d = normalizeAngle(a - b);
  if(d > Math.PI) d -= TAU;
  return Math.abs(d);
}

function normalizeAngle(a){
  a %= TAU;
  return a < 0 ? a + TAU : a;
}

function clamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

function formatNumber(n){
  const v = Math.floor(Number(n) || 0);
  if(v >= 1000000) return `${(v/1000000).toFixed(1)}M`;
  if(v >= 10000) return `${Math.floor(v/1000)}K`;
  return v.toLocaleString('ja-JP');
}

function colorCss(color){
  if(typeof color === 'string') return color;
  return `#${Number(color).toString(16).padStart(6, '0')}`;
}

function render(t){
  if(state.mode !== 'play' && state.mode !== 'home'){
    return;
  }
  renderer.render(scene, camera);
}
