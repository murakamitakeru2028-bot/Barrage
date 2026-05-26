// ─────────────────────────────────────
//  定数
// ─────────────────────────────────────
const W = 390, H = 700;
const XP_BASE       = 80;
const BASIC_STAT_GROWTH = 1.05;
const CRIT_STEP     = 0.05;
const CRIT_BASE_DAMAGE = 2;
const REGEN_STEP    = 0.5;
const SHIELD_DELAY  = 300;
const MAX_SPECIAL_TYPES = 5;
const REROLL_COST  = 20;
const TOKEN_SCORE_UNIT = 30;
const DEMO_START_TOKENS = 1000;
const DEMO_GRANT_KEY = 'demo-start-tokens-1000-v1';
const SAVE_RESET_VERSION = 'global-reset-2026-05-26-v1';
const RUN_TOKEN_COIN_MULT = 2;
const RUN_TOKEN_WAVE_BONUS = 25;
const RUN_TOKEN_TIME_BONUS = 1;
const RUN_TOKEN_PAYOUT_DIVISOR = 100;
const BODY_STAT_GROWTH = 1.05;
const DPR_LIMIT = 1.6;
const BG_GRID_STEP = 56;
const BG_STAR_COUNT = 58;
const BG_BEAM_COUNT = 4;
const MAX_PARTICLES = 72;
const MAX_EP_ORBS   = 28;
const MAX_ARROWS    = 110;
const MAX_FLOAT_TEXTS = 22;
const GRACE_FRAMES  = 120;
const FPS           = 60;
const WAVE_DURATION_FRAMES = FPS * 10;
const ENEMY_HP_BASE = 58;
const ENEMY_HP_LINEAR = 32;
const ENEMY_HP_QUAD = 2.8;
const ENEMY_HP_EXP = 1.052;
const ENEMY_HP_LATE_START = 18;
const ENEMY_HP_LATE_EXP = 1.045;
const ENEMY_HP_BRUTAL_START = 55;
const ENEMY_HP_BRUTAL_EXP = 1.075;
const ENEMY_CONTACT_EXP = 1.012;
const BOSS_WAVE_INTERVAL = 10;
const BOSS_HP_MULT = 18;
const BOSS_CONTACT_MULT = 4;
const BOSS_BULLET_BASE_DAMAGE = 34;
const BOSS_BULLET_DAMAGE_STEP = 9;
const MAX_ENEMY_BULLETS = 82;
const DAMAGE_XP_RATE = 0.032;
const MULTISHOT_DAMAGE_EXP = 0.34;
const MULTISHOT_FIRE_DELAY_STEP = 0.07;
const GATLING_FIRE_STEP = 0.14;
const GATLING_DAMAGE_STEP = 0.06;
const GATLING_SIZE_STEP = 0.035;
const SPLIT_DAMAGE_BASE = 0.62;
const SPLIT_PARENT_RETENTION = 0.68;
const UPGRADE_ZONE={w:110,h:96,vy:.92,missY:H+44};
const BASE_ARROW_RANGE = 255;
const MIN_RENDERED_FIRE_INTERVAL = 4;
const MIN_RAW_FIRE_INTERVAL = 0.25;
const MAX_FIRE_COMPRESSION_DAMAGE = 16;
const DISTANCE_DAMAGE_FULL = 95;
const DISTANCE_DAMAGE_MIN = 0.35;
const ARROW_DESPAWN_MARGIN = 58;
const HUD_T         = 32;   // 上部HUD高さ
const HUD_B         = 132;  // 下部HUD高さ
const PLAYER_Y      = H - HUD_B - 48;
const RESET_CONFIRM_FRAMES = FPS * 3;
const DEFAULT_SETTINGS = {
  touchControl:'buttons',
  sound:true,
  music:true,
  sfx:true,
  musicVolume:.52,
  sfxVolume:.55
};
const AUDIO_ASSETS = {
  bgm:['audio/bgm-1.mp3','audio/bgm-2.mp3']
};
const UI_FONT = '"Zen Kaku Gothic New","Oxanium","Yu Gothic UI",Meiryo,sans-serif';
const DISPLAY_FONT = '"Zen Kaku Gothic New","Teko","Yu Gothic UI",Meiryo,sans-serif';
const HOYO_UI = {
  text:'#eef7ff',
  muted:'rgba(238,247,255,.67)',
  faint:'rgba(238,247,255,.27)',
  gold:'#b8a7ff',
  goldSoft:'rgba(184,167,255,.34)',
  blue:'#1ed6ff',
  jade:'#36f39b',
  rose:'#ff3b62',
  ink:'#070808',
  panelA:'rgba(28,28,25,.94)',
  panelB:'rgba(8,10,10,.97)',
  line:'rgba(238,247,255,.18)',
  dark:'rgba(5,6,7,.76)'
};
const UI_COPY = {
  nav:{
    store:['ストア','マシン・コア・ドローン'],
    warehouse:['倉庫','ロードアウト変更'],
    upgrade:['アップグレード','ベースステータス'],
    codex:['アーカイブ','アビリティデータ'],
    settings:['オプション','操作とサウンド']
  },
  ship:{coreOnly:'NU-00 ネイキッド',standard:'AF-01 アーク',striker:'VX-03 レイザー',guardian:'BG-12 バルワーク',carrier:'DR-07 ハイヴ'},
  core:{basic:'C-0 シード',assault:'C-A ブレイズ',reactor:'C-R パルス'},
  part:{
    cannon:'ランス砲台',barrel:'クイック砲身',plate:'ミラー装甲',frame:'バイタル骨格',
    droneBay:'ドローンベイ',bitLink:'ビットリンク',coreLink:'コアリンク',overclock:'オーバークロック'
  },
  partType:{turret:'砲台',armor:'装甲',drone:'ドローン',coreBoost:'コア'},
  stat:{
    fireRate:'連射速度',bulletSpeed:'弾速',damage:'ダメージ',range:'距離補正',hp:'耐久',
    xpMult:'経験値',speed:'機動力',critChance:'会心率',critDamage:'会心倍率',regen:'修復'
  },
  special:{
    multiShot:'マルチショット',homing:'ホーミング',piercing:'貫通',powerShot:'強化弾',
    gatling:'ガトリング',supportDrone:'支援ドローン',explosive:'炸裂弾',ricochet:'跳弾',
    chainLightning:'電撃チェーン',adrenaline:'背水陣',statSynergy:'ステータス同期',
    stasisAura:'停滞フィールド',energyShield:'自動防壁',splitter:'スプリット弾',interceptor:'迎撃ビット'
  }
};
const SFX_PRESETS = {
  start:{f:220,to:520,d:.14,type:'triangle',gain:.075},
  select:{f:440,to:620,d:.08,type:'triangle',gain:.045},
  denied:{f:170,to:110,d:.10,type:'sawtooth',gain:.035},
  shot:{f:760,to:520,d:.045,type:'square',gain:.025},
  hit:{f:190,to:120,d:.055,type:'triangle',gain:.028},
  kill:{f:260,to:720,d:.12,type:'triangle',gain:.06},
  upgrade:{f:360,to:880,d:.16,type:'sine',gain:.07},
  special:{f:520,to:1040,d:.2,type:'sine',gain:.075},
  dead:{f:220,to:70,d:.32,type:'sawtooth',gain:.055}
};

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let renderScaleX = 1, renderScaleY = 1;
let bgBaseGradient=null, bgNebulaA=null, bgNebulaB=null, bgScanGradient=null;
let hudTopGradient=null, hudBottomGradient=null, pauseButtonGradient=null;

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, rect.width || W);
  const cssH = Math.max(1, rect.height || H);
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
  const nextW = Math.round(cssW * dpr);
  const nextH = Math.round(cssH * dpr);

  if(canvas.width !== nextW || canvas.height !== nextH){
    canvas.width = nextW;
    canvas.height = nextH;
  }

  renderScaleX = nextW / W;
  renderScaleY = nextH / H;
  ctx.setTransform(renderScaleX, 0, 0, renderScaleY, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'low';
}

window.addEventListener('resize', resizeCanvas);
if(window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas);

// ─────────────────────────────────────
//  定義テーブル
// ─────────────────────────────────────
const BASIC_STAT_DEFS = [
  { id:'fireRate',    name:'連射速度', icon:'FR', color:'#1ed6ff' },
  { id:'bulletSpeed', name:'弾速',     icon:'>>', color:'#b8a7ff' },
  { id:'damage',      name:'ダメージ', icon:'DM', color:'#ff3b62' },
  { id:'range',       name:'距離補正', icon:'RG', color:'#82d7ff' },
  { id:'hp',          name:'耐久',     icon:'HP', color:'#ff6b93' },
  { id:'xpMult',      name:'経験値',   icon:'XP', color:'#36f39b' },
  { id:'speed',       name:'機動力',   icon:'MV', color:'#1ed6ff' },
  { id:'critChance',  name:'会心率',   icon:'CR', color:'#b8a7ff' },
  { id:'critDamage',  name:'会心倍率', icon:'CD', color:'#ff7a3d' },
  { id:'regen',       name:'修復',     icon:'RP', color:'#ff6b93' },
];
const BASIC_SKILL_TREE = [
  { id:'fireRate',    x:18,  y:112, requires:null },
  { id:'damage',      x:206, y:112, requires:'fireRate' },
  { id:'bulletSpeed', x:18,  y:184, requires:'fireRate' },
  { id:'range',       x:206, y:184, requires:'bulletSpeed' },
  { id:'hp',          x:18,  y:256, requires:'damage' },
  { id:'speed',       x:206, y:256, requires:'bulletSpeed' },
  { id:'critChance',  x:18,  y:328, requires:'damage' },
  { id:'critDamage',  x:206, y:328, requires:'critChance' },
  { id:'regen',       x:18,  y:400, requires:'hp' },
  { id:'xpMult',      x:206, y:400, requires:'speed' },
];
const SKILL_NODE_W = 166;
const SKILL_NODE_H = 58;
const BODY_UPGRADE_DEFS = [
  { id:'hp',       name:'耐久',     icon:'HP', color:'#ff6b93', label:'最大耐久' },
  { id:'defense',  name:'装甲',     icon:'AR', color:'#82d7ff', label:'被ダメ軽減' },
  { id:'attack',   name:'攻撃力',   icon:'AT', color:'#ff3b62', label:'攻撃倍率' },
  { id:'fireRate', name:'連射速度', icon:'FR', color:'#1ed6ff', label:'連射倍率' },
];
const SHIP_DEFS = [
  { id:'coreOnly', name:'NU-00 ネイキッド', icon:'C0', role:'裸核フレーム', cost:0, color:'#1ed6ff', slots:{turret:0,armor:0,drone:0,coreBoost:0}, mult:{hp:.85,defense:.9,attack:1,fireRate:1.05} },
  { id:'standard', name:'AF-01 アーク', icon:'AF', role:'汎用フレーム', cost:160, color:'#1ed6ff', slots:{turret:1,armor:1,drone:1,coreBoost:1}, mult:{hp:2.0,defense:1.55,attack:2.2,fireRate:1.45} },
  { id:'striker',  name:'VX-03 レイザー', icon:'VX', role:'強襲砲撃型', cost:950, color:'#ff3b62', slots:{turret:2,armor:0,drone:1,coreBoost:1}, mult:{hp:2.7,defense:1.85,attack:12.0,fireRate:2.4} },
  { id:'sniper',   name:'SR-05 ロングレイ', icon:'SR', role:'長射程狙撃型', cost:1600, color:'#eef7ff', slots:{turret:2,armor:1,drone:0,coreBoost:1}, mult:{hp:3.4,defense:2.0,attack:28.0,fireRate:1.25} },
  { id:'guardian', name:'BG-12 バルワーク', icon:'BG', role:'重装防壁型', cost:2400, color:'#82d7ff', slots:{turret:1,armor:2,drone:0,coreBoost:1}, mult:{hp:9.0,defense:8.0,attack:8.0,fireRate:1.7} },
  { id:'mirage',   name:'EX-09 ミラージュ', icon:'EX', role:'高速回避型', cost:3800, color:'#36f39b', slots:{turret:1,armor:0,drone:2,coreBoost:2}, mult:{hp:5.0,defense:3.5,attack:30.0,fireRate:4.2} },
  { id:'carrier',  name:'DR-07 ハイヴ', icon:'DR', role:'ドローン母機', cost:7000, color:'#b8a7ff', slots:{turret:0,armor:1,drone:2,coreBoost:1}, mult:{hp:14.0,defense:8.0,attack:100.0,fireRate:3.2} },
  { id:'vanguard', name:'VG-11 ヴァンガード', icon:'VG', role:'上位汎用型', cost:12000, color:'#1ed6ff', slots:{turret:2,armor:1,drone:1,coreBoost:1}, mult:{hp:24,defense:14,attack:180,fireRate:4.6} },
  { id:'oracle',   name:'OR-18 オラクル', icon:'OR', role:'制御予測型', cost:45000, color:'#36f39b', slots:{turret:1,armor:1,drone:2,coreBoost:2}, mult:{hp:42,defense:26,attack:620,fireRate:7.8} },
  { id:'eclipse',  name:'EC-24 エクリプス', icon:'EC', role:'暗黒強襲型', cost:120000, color:'#b96cff', slots:{turret:2,armor:1,drone:1,coreBoost:2}, mult:{hp:85,defense:52,attack:2100,fireRate:12} },
  { id:'titan',    name:'TN-32 タイタン', icon:'TN', role:'超重装殲滅型', cost:350000, color:'#82d7ff', slots:{turret:2,armor:2,drone:0,coreBoost:2}, mult:{hp:260,defense:210,attack:6500,fireRate:7.4} },
  { id:'dominion', name:'DM-44 ドミニオン', icon:'DM', role:'支配火力型', cost:1200000, color:'#ff3b62', slots:{turret:3,armor:1,drone:1,coreBoost:2}, mult:{hp:520,defense:340,attack:26000,fireRate:18} },
  { id:'astral',   name:'AS-57 アストラル', icon:'AS', role:'星間機動型', cost:4500000, color:'#eef7ff', slots:{turret:2,armor:1,drone:2,coreBoost:3}, mult:{hp:1200,defense:820,attack:98000,fireRate:32} },
  { id:'singularity', name:'SG-70 シンギュラリティ', icon:'SG', role:'重力炉搭載型', cost:15000000, color:'#b8a7ff', slots:{turret:3,armor:2,drone:1,coreBoost:3}, mult:{hp:4200,defense:3000,attack:420000,fireRate:44} },
  { id:'aphelion', name:'AP-83 アフェリオン', icon:'AP', role:'遠日点砲撃型', cost:60000000, color:'#ff7a3d', slots:{turret:3,armor:1,drone:2,coreBoost:3}, mult:{hp:15000,defense:9000,attack:1800000,fireRate:70} },
  { id:'omega',    name:'OM-99 オメガ', icon:'OM', role:'終端戦術型', cost:250000000, color:'#36f39b', slots:{turret:3,armor:2,drone:2,coreBoost:3}, mult:{hp:70000,defense:46000,attack:9500000,fireRate:120} },
  { id:'ultima',   name:'UT-00 アルティマ', icon:'UT', role:'最終世代機', cost:1000000000, color:'#eef7ff', slots:{turret:4,armor:2,drone:2,coreBoost:4}, mult:{hp:420000,defense:300000,attack:62000000,fireRate:220} },
];
const CORE_DEFS = [
  { id:'basic',   name:'C-0 シード', icon:'C0', role:'標準コア', cost:0,  color:'#1ed6ff', mult:{hp:1,defense:1,attack:1,fireRate:1} },
  { id:'assault', name:'C-A ブレイズ', icon:'CA', role:'火力コア', cost:350,  color:'#ff3b62', mult:{hp:1.05,defense:1.0,attack:4.0,fireRate:1.35} },
  { id:'reactor', name:'C-R パルス', icon:'CR', role:'高速反応コア', cost:750, color:'#b8a7ff', mult:{hp:1.15,defense:1.1,attack:1.8,fireRate:4.0} },
  { id:'sentinel', name:'C-S センチネル', icon:'CS', role:'防衛コア', cost:1200, color:'#82d7ff', mult:{hp:2.8,defense:4.2,attack:1.4,fireRate:1.25} },
  { id:'nova',     name:'C-N ノヴァ', icon:'CN', role:'爆発火力コア', cost:2200, color:'#ff7a3d', mult:{hp:1.4,defense:1.2,attack:8.0,fireRate:1.7} },
  { id:'quantum',  name:'C-Q クオンタム', icon:'CQ', role:'高機動コア', cost:3200, color:'#36f39b', mult:{hp:1.8,defense:1.5,attack:4.5,fireRate:5.5} },
];
const SHIP_EFFECTS = {
  coreOnly:'開始SP +1 / 当たり判定小',
  standard:'WAVE更新時に耐久を10%回復',
  striker:'4射ごとに高威力ランス弾',
  sniper:'距離減衰軽減 +40% / 6射ごとにレール弾',
  guardian:'シールド +3 / 重装甲',
  mirage:'会心率 +10% / 当たり判定小',
  carrier:'支援ドローン +3 / 最終火力特化',
  vanguard:'基礎性能を大幅底上げ',
  oracle:'ドローンとコア拡張を両立',
  eclipse:'高火力と高連射の上位強襲機',
  titan:'圧倒的な耐久と装甲',
  dominion:'砲台3枠の制圧火力',
  astral:'高速連射と拡張性の星間機',
  singularity:'重力炉で全性能を爆発強化',
  aphelion:'遠距離戦向けの超火力機',
  omega:'終盤用の総合最上位機',
  ultima:'10億級の最終世代フレーム'
};
const PART_DEFS = [
  { id:'cannon',   name:'T-ランス砲台', icon:'AT', type:'turret',    cost:210, color:'#ff3b62', mult:{attack:3.2} },
  { id:'barrel',   name:'T-クイック砲身', icon:'FR', type:'turret',    cost:240, color:'#1ed6ff', mult:{fireRate:2.6} },
  { id:'railgun',  name:'T-レールガン', icon:'RG', type:'turret',    cost:980, color:'#eef7ff', mult:{attack:6.0,fireRate:.85} },
  { id:'plate',    name:'A-ミラー装甲', icon:'AR', type:'armor',     cost:290, color:'#82d7ff', mult:{defense:2.8} },
  { id:'frame',    name:'A-バイタル骨格', icon:'HP', type:'armor',     cost:340, color:'#ff6b93', mult:{hp:2.5} },
  { id:'aegis',    name:'A-イージス装甲', icon:'AG', type:'armor',     cost:1100, color:'#82d7ff', mult:{hp:1.8,defense:4.5} },
  { id:'droneBay', name:'D-ドローンベイ', icon:'DR', type:'drone',   cost:560, color:'#9cff5e', mult:{attack:1.8,fireRate:1.8} },
  { id:'bitLink',  name:'D-ビットリンク', icon:'BT', type:'drone',     cost:700, color:'#eef7ff', mult:{fireRate:2.2} },
  { id:'swarmLink', name:'D-スウォームリンク', icon:'SW', type:'drone', cost:1300, color:'#36f39b', mult:{attack:2.4,fireRate:2.4} },
  { id:'coreLink', name:'C-コアリンク', icon:'LK', type:'coreBoost', cost:1200, color:'#b96cff', mult:{hp:1.65,defense:1.65,attack:1.65,fireRate:1.65} },
  { id:'overclock', name:'C-オーバークロック', icon:'OC', type:'coreBoost', cost:1600, color:'#b8a7ff', mult:{attack:2.4,fireRate:2.4} },
  { id:'rangeExt', name:'C-レンジエクステンダ', icon:'RE', type:'coreBoost', cost:1900, color:'#1ed6ff', mult:{attack:1.4,fireRate:1.4} },
  { id:'plasmaArray', name:'T-プラズマアレイ', icon:'PA', type:'turret', cost:8000, color:'#ff3b62', mult:{attack:18,fireRate:1.4} },
  { id:'phaseCannon', name:'T-フェイズカノン', icon:'PH', type:'turret', cost:26000, color:'#b96cff', mult:{attack:60,fireRate:.95} },
  { id:'singularityRail', name:'T-シンギュラレール', icon:'SG', type:'turret', cost:120000, color:'#eef7ff', mult:{attack:220,fireRate:.82} },
  { id:'neutronHull', name:'A-ニュートロン外殻', icon:'NH', type:'armor', cost:15000, color:'#82d7ff', mult:{hp:22,defense:18} },
  { id:'chronosPlate', name:'A-クロノス装甲', icon:'CH', type:'armor', cost:85000, color:'#36f39b', mult:{hp:80,defense:65} },
  { id:'celestialAegis', name:'A-セレスティアル防壁', icon:'CE', type:'armor', cost:600000, color:'#b8a7ff', mult:{hp:350,defense:280} },
  { id:'nanoSwarm', name:'D-ナノスウォーム', icon:'NS', type:'drone', cost:45000, color:'#9cff5e', mult:{attack:25,fireRate:18} },
  { id:'quantumHive', name:'D-クオンタムハイヴ', icon:'QH', type:'drone', cost:350000, color:'#36f39b', mult:{attack:140,fireRate:95} },
  { id:'zeroPointCore', name:'C-ゼロポイント炉', icon:'ZP', type:'coreBoost', cost:2500000, color:'#1ed6ff', mult:{hp:300,defense:250,attack:450,fireRate:120} },
  { id:'eventHorizonCore', name:'C-事象境界コア', icon:'EH', type:'coreBoost', cost:750000000, color:'#eef7ff', mult:{hp:120000,defense:90000,attack:180000,fireRate:20000} },
];
const DRONE_DEFS = [
  { id:'spark', name:'D-01 スパーク', icon:'SP', role:'近距離支援機', cost:450, color:'#66ccff', mult:{count:1,damage:1.00} },
  { id:'lumen', name:'D-04 ルーメン', icon:'LM', role:'高出力支援機', cost:4200, color:'#9cff5e', mult:{count:1,damage:1.35} },
  { id:'vector', name:'D-11 ベクター', icon:'VC', role:'追尾支援機', cost:36000, color:'#b8a7ff', mult:{count:1,damage:1.85} },
  { id:'aurora', name:'D-99 オーロラ', icon:'AU', role:'最上位支援機', cost:420000, color:'#eef7ff', mult:{count:2,damage:2.65} },
];
const PART_EFFECTS = {
  cannon:'3射ごとに超高威力ランス弾',
  barrel:'5射ごとにサイドニードル',
  railgun:'6射ごとに貫通レール弾',
  plate:'シールド +2',
  frame:'自動修復 +3/s',
  aegis:'シールド +3',
  droneBay:'支援ドローン +2',
  bitLink:'迎撃ビット +2',
  swarmLink:'支援ドローン +3',
  coreLink:'経験値 +50%',
  overclock:'会心率 +15%',
  rangeExt:'距離減衰軽減 +35%',
  plasmaArray:'高火力プラズマ連装砲',
  phaseCannon:'位相干渉で単発火力を増幅',
  singularityRail:'重力収束レールで超火力',
  neutronHull:'上位耐久と装甲を両立',
  chronosPlate:'時間装甲で耐久を大幅強化',
  celestialAegis:'終盤用の高級防壁',
  nanoSwarm:'ナノ群体が連射を補助',
  quantumHive:'量子ドローン火力を展開',
  zeroPointCore:'全性能を上位水準へ増幅',
  eventHorizonCore:'超高額の最終拡張コア'
};
const SHIP_BY_ID = Object.fromEntries(SHIP_DEFS.map(d=>[d.id,d]));
const CORE_BY_ID = Object.fromEntries(CORE_DEFS.map(d=>[d.id,d]));
const PART_BY_ID = Object.fromEntries(PART_DEFS.map(d=>[d.id,d]));
const DRONE_BY_ID = Object.fromEntries(DRONE_DEFS.map(d=>[d.id,d]));
const BASIC_STAT_BY_ID = Object.fromEntries(BASIC_STAT_DEFS.map(d=>[d.id,d]));
const LOADOUT_STAT_IDS = ['hp','defense','attack','fireRate'];
const TAU = Math.PI * 2;
const BG_CORNERS = [[8,8,1,1],[W-8,8,-1,1],[8,H-8,1,-1],[W-8,H-8,-1,-1]];
const STAT_LABELS={hp:'耐久',defense:'装甲',attack:'攻撃',fireRate:'連射'};
const SHORT_STAT_LABELS={hp:'HP',defense:'AR',attack:'AT',fireRate:'FR'};
const PART_INFO={
  cannon:{tier:'RARE',desc:'単発火力を強化。'},
  barrel:{tier:'RARE',desc:'射撃サイクルを短縮。'},
  railgun:{tier:'EPIC',desc:'低速だが重い直線火力。'},
  plate:{tier:'RARE',desc:'被ダメージを軽減。'},
  frame:{tier:'RARE',desc:'最大耐久を上昇。'},
  aegis:{tier:'EPIC',desc:'防壁と装甲を大幅強化。'},
  droneBay:{tier:'EPIC',desc:'攻撃と連射を補助。'},
  bitLink:{tier:'EPIC',desc:'高連射を安定化。'},
  swarmLink:{tier:'EPIC',desc:'支援ユニット数を増やす。'},
  coreLink:{tier:'EPIC',desc:'全システムを底上げ。'},
  overclock:{tier:'EPIC',desc:'攻撃と連射を過励起。'},
  rangeExt:{tier:'EPIC',desc:'遠距離のダメージ減衰を抑える。'},
  plasmaArray:{tier:'MYTH',desc:'上位砲台の入口。'},
  phaseCannon:{tier:'MYTH',desc:'火力を指数的に押し上げる。'},
  singularityRail:{tier:'RELIC',desc:'超重量の一点突破火力。'},
  neutronHull:{tier:'MYTH',desc:'高耐久フレーム用外殻。'},
  chronosPlate:{tier:'RELIC',desc:'後半WAVE向けの時間装甲。'},
  celestialAegis:{tier:'RELIC',desc:'高額防壁で被弾を受け切る。'},
  nanoSwarm:{tier:'MYTH',desc:'高速ドローン火力を展開。'},
  quantumHive:{tier:'RELIC',desc:'ドローン枠を終盤火力へ変える。'},
  zeroPointCore:{tier:'RELIC',desc:'全性能の桁をひとつ上げる。'},
  eventHorizonCore:{tier:'OMEGA',desc:'最終機体向けの超高額拡張。'},
};
const SLOT_ORDER=['turret','armor','drone','coreBoost'];
const SPECIAL_DEFS = [
  { id:'multiShot', name:'マルチショット', icon:'MS', color:'#1ed6ff', desc:lv=>`弾数 +${lv} / 威力 ${Math.round(100/Math.pow(1+lv,MULTISHOT_DAMAGE_EXP))}%` },
  { id:'homing',    name:'ホーミング',     icon:'HM', color:'#b96cff', desc:lv=>`誘導性能 Lv.${lv}` },
  { id:'piercing',  name:'貫通',           icon:'PR', color:'#b8a7ff', desc:lv=>`${lv}体まで貫通` },
  { id:'powerShot', name:'強化弾',         icon:'PW', color:'#ff3b62', desc:lv=>`ダメージ +${lv*30}%` },
  { id:'gatling',   name:'ガトリング', icon:'GT', color:'#36f39b', desc:lv=>`連射 +${Math.round(gatlingFireBonus(lv)*100)}% / 威力 ${Math.round(gatlingDamageScale(lv)*100)}%` },
  { id:'supportDrone', name:'支援ドローン', icon:'DR', color:'#82d7ff', desc:lv=>`${lv}機の支援ユニット` },
  { id:'explosive',    name:'炸裂弾', icon:'EX', color:'#ff7a3d', desc:lv=>`爆風半径 ${34+lv*6}px` },
  { id:'ricochet',     name:'跳弾', icon:'RC', color:'#b8a7ff', desc:lv=>`${lv}回跳ね返る` },
  { id:'chainLightning', name:'電撃チェーン', icon:'CL', color:'#9cff5e', desc:lv=>`${lv+1}体へ連鎖` },
  { id:'adrenaline',   name:'背水陣', icon:'AD', color:'#ff6b93', desc:lv=>`低耐久時 火力 +${lv*25}%` },
  { id:'statSynergy',  name:'ステータス同期', icon:'SY', color:'#b96cff', desc:lv=>`弾速を火力へ変換 Lv.${lv}` },
  { id:'stasisAura',   name:'停滞フィールド', icon:'ST', color:'#82d7ff', desc:lv=>`近距離の敵を減速 Lv.${lv}` },
  { id:'energyShield', name:'自動防壁', icon:'SH', color:'#1ed6ff', desc:lv=>`${1+Math.floor((lv-1)/3)}枚のシールド` },
  { id:'splitter',     name:'スプリット弾', icon:'SP', color:'#b8a7ff', desc:lv=>`${2+lv}分裂 / 威力 ${Math.round(100*SPLIT_DAMAGE_BASE/Math.sqrt(2+lv))}%` },
  { id:'interceptor',  name:'迎撃ビット', icon:'IN', color:'#eef7ff', desc:lv=>`${lv}基が近距離迎撃` },
];
const makeSpecialLevels = () => Object.fromEntries(SPECIAL_DEFS.map(d=>[d.id,0]));

// ─────────────────────────────────────
//  状態変数
// ─────────────────────────────────────
let state   = 'start';
let score   = 0, wave = 1, frame = 0;
let runStartWave = 1;
let coins   = 0;
let tokensEarned = 0;
let hp      = 100, maxHp = 100;
let xp      = 0, xpLevel = 0, hitXpBank = 0;
let invincible = 0, skillPoints = 0, fireTimer = 0;
let regenBank = 0;
let shield = 0, shieldCooldown = 0, droneTimer = 0, bitTimer = 0;
let shotSeq = 0;
let touchDir = 0, touchAxis = 0, touchTargetX = null, mouseX = -1, mouseY = -1;
let activePointerId = null, suppressNextClick = false;
let stickState = { active:false, baseX:W/2, baseY:H-166, knobX:W/2, knobY:H-166 };
let installPromptEvent = null, appInstalled = (window.matchMedia?.('(display-mode: standalone)').matches ?? false) || navigator.standalone === true;
let shakeT = 0, shakeAmp = 0;
let waveBanner = 0;
let waveFrame = 0;
let audioState = { ctx:null, unlocked:false, bgm:null, bgmMissing:false, bgmAttempts:0, track:0, lastSfx:{} };

const keys = {};
let statLevels    = { fireRate:0, bulletSpeed:0, damage:0, range:0, hp:0, xpMult:0, speed:0, critChance:0, critDamage:0, regen:0 };
let specialLevels = makeSpecialLevels();

let arrows=[], enemies=[], enemyBullets=[], particles=[];
let epOrbs=[], floatTexts=[];
let pendingSpecials=[];
let upgradeZones=[];
let bgStars=[], bgLines=[], bgBeams=[];
let player = { x:W/2, y:PLAYER_Y, prevX:W/2, prevY:PLAYER_Y, size:14 };
let loadoutCache = null;
function freshMeta(settings={...DEFAULT_SETTINGS}){
  return {
    tokens:DEMO_START_TOKENS,
    upgrades:{ hp:0, defense:0, attack:0, fireRate:0 },
    homeUpgrades:{ fireRate:0, bulletSpeed:0, damage:0, range:0, hp:0, xpMult:0, speed:0, critChance:0, critDamage:0, regen:0 },
    selectedShip:'coreOnly',
    selectedCore:'basic',
    ownedShips:{coreOnly:true},
    ownedCores:{basic:true},
    ownedParts:{},
    ownedDrones:{},
    coreLevels:{basic:0},
    droneLevels:{},
    mountedParts:{},
    grants:{[DEMO_GRANT_KEY]:true},
    highScore:{score:0,wave:1},
    bestWave:1,
    saveResetVersion:SAVE_RESET_VERSION,
    settings:{...DEFAULT_SETTINGS,...settings}
  };
}
let meta = freshMeta();
let homeState = 'home'; // 'home' | 'store' | 'warehouse' | 'upgrade' | 'settings' | 'codex'
let storeTab = 'ship';   // 'ship' | 'core' | 'part' | 'drone'
let storePages = { ship:0, core:0, part:0, drone:0 };
let warehouseTab = 'ship'; // 'ship' | 'turret' | 'armor' | 'drone' | 'coreBoost'
let codexTab = 'special';
let codexPage = 0;
let pauseView = 'menu';
let resetConfirmFrames = 0;
let pendingStorePurchase = null;

// ─────────────────────────────────────
//  ステータス計算
// ─────────────────────────────────────
const xpThresh  = () => Math.floor(XP_BASE * Math.pow(1.6, xpLevel));
const statMultFor = lv => Math.pow(BASIC_STAT_GROWTH, lv);
// ホームアップグレード（永続）＋ゲーム内アップグレード（一時）を合算した実効レベル
const effectiveStatLevel = id => statLevels[id] + (meta.homeUpgrades?.[id] || 0);
const statMult    = id => statMultFor(effectiveStatLevel(id));
const bodyLevel = id => meta.upgrades[id] || 0;
const bodyMultFor = lv => Math.pow(BODY_STAT_GROWTH, lv);
const selectedShipDef = () => SHIP_BY_ID[meta.selectedShip] || SHIP_DEFS[0];
const selectedCoreDef = () => CORE_BY_ID[meta.selectedCore] || CORE_DEFS[0];
const shipMult = id => getLoadoutSnapshot().ship.mult[id] ?? 1;
const selectedCoreLevel = () => meta.coreLevels[meta.selectedCore] || 0;
const coreMult = id => getLoadoutSnapshot().coreMult[id] ?? 1;
const mountedForShip = (shipId=meta.selectedShip) => meta.mountedParts[shipId] || {};
function mountedPartIds(shipId=meta.selectedShip){
  const mount=mountedForShip(shipId);
  const ids=[];
  for(const type of SLOT_ORDER){
    const list=mount[type] || [];
    for(let i=0;i<list.length;i++) ids.push(list[i]);
  }
  return ids;
}
function invalidateLoadoutCache(){ loadoutCache=null; }
function buildLoadoutSnapshot(){
  const ship=selectedShipDef();
  const core=selectedCoreDef();
  const coreScale=Math.pow(1.12, selectedCoreLevel());
  const mount=mountedForShip(ship.id);
  const partSet=new Set();
  const partMult={hp:1,defense:1,attack:1,fireRate:1};
  for(const type of SLOT_ORDER){
    const list=mount[type] || [];
    for(let i=0;i<list.length;i++){
      const pid=list[i];
      partSet.add(pid);
      const mult=PART_BY_ID[pid]?.mult;
      if(!mult) continue;
      for(const id of LOADOUT_STAT_IDS) partMult[id] *= mult[id] ?? 1;
    }
  }
  const coreMults={};
  const body={};
  for(const id of LOADOUT_STAT_IDS){
    coreMults[id]=(core.mult[id] ?? 1) * coreScale;
    body[id]=bodyMultFor(bodyLevel(id)) * (ship.mult[id] ?? 1) * coreMults[id] * partMult[id];
  }
  return {ship,core,mount,partSet,partMult,coreMult:coreMults,body};
}
const getLoadoutSnapshot = () => loadoutCache || (loadoutCache=buildLoadoutSnapshot());
const activeShipDef = () => getLoadoutSnapshot().ship;
const activeCoreDef = () => getLoadoutSnapshot().core;
const hasMountedPart = id => getLoadoutSnapshot().partSet.has(id);
const partsMult = id => getLoadoutSnapshot().partMult[id] ?? 1;
const bodyMult = id => getLoadoutSnapshot().body[id] ?? 1;
const bodyUpgradeCost = id => Math.floor(20 * Math.pow(1.40, bodyLevel(id)));
// ホームアップグレードコスト: レベルごとに大きく増加（青天井）
const homeUpgradeCost = id => {
  const lv=meta.homeUpgrades[id] || 0;
  return lv===0 ? 30 : Math.floor(60 * Math.pow(1.42, lv-1));
};
const coreUpgradeCost = () => Math.floor(80 * Math.pow(1.38, selectedCoreLevel()));
const hpRatio   = () => maxHp>0 ? hp/maxHp : 0;
const adrenalinePower = () => specialLevels.adrenaline * .25 * (1-hpRatio());
const synergyMult = () => 1 + Math.max(0, statMult('bulletSpeed')-1) * specialLevels.statSynergy * .35;
const fireRate  = () => Math.max(1, 22 / (statMult('fireRate') * bodyMult('fireRate')));
const bulletSpd = () => 9 * statMult('bulletSpeed');
const damageFalloffRange = () => BASE_ARROW_RANGE * statMult('range') * (activeShipDef().id==='sniper' ? 1.40 : 1) * (hasMountedPart('rangeExt') ? 1.35 : 1);
function distanceDamageMult(target){
  const d=Math.hypot((target?.x??player.x)-player.x,(target?.y??player.y)-player.y);
  if(d<=DISTANCE_DAMAGE_FULL) return 1;
  const t=Math.max(0,Math.min(1,(d-DISTANCE_DAMAGE_FULL)/damageFalloffRange()));
  return DISTANCE_DAMAGE_MIN+(1-DISTANCE_DAMAGE_MIN)*(1-t);
}
const damage    = () => (10 + wave*2) * statMult('damage') * bodyMult('attack') * (1 + specialLevels.powerShot*0.30) * (1+adrenalinePower()) * synergyMult();
const xpMult    = () => statMult('xpMult') * (hasMountedPart('coreLink') ? 1.50 : 1);
const moveSpeed = () => 3.7 * statMult('speed');
const critChance  = () => Math.min(1, effectiveStatLevel('critChance') * CRIT_STEP + (hasMountedPart('overclock') ? .15 : 0) + (activeShipDef().id==='mirage' ? .10 : 0));
const doubleCritChance = () => Math.min(1, Math.max(0, effectiveStatLevel('critChance')-20) * CRIT_STEP);
const critDamage  = () => CRIT_BASE_DAMAGE * statMult('critDamage');
const regenPerSec = () => effectiveStatLevel('regen') * REGEN_STEP + (hasMountedPart('frame') ? 3 : 0);
const arrowCnt  = () => 1 + specialLevels.multiShot;
const multiShotDamageScale = (n=arrowCnt()) => 1 / Math.pow(Math.max(1,n), MULTISHOT_DAMAGE_EXP);
const splitDamageScale = (parentScale,n) => parentScale * Math.max(.16, SPLIT_DAMAGE_BASE / Math.sqrt(Math.max(1,n)));
const gatlingFireBonus = (lv=specialLevels.gatling) => lv * GATLING_FIRE_STEP;
const gatlingFireMult = (lv=specialLevels.gatling) => 1 + gatlingFireBonus(lv);
const gatlingDamageScale = (lv=specialLevels.gatling) => 1 / (1 + lv * GATLING_DAMAGE_STEP);
const gatlingBulletScale = (lv=specialLevels.gatling) => Math.max(.65, 1 - lv * GATLING_SIZE_STEP);
const homingStr = () => specialLevels.homing * 0.13;
const pierce    = () => specialLevels.piercing;
const multiShotFireDelay = () => 1 + specialLevels.multiShot * MULTISHOT_FIRE_DELAY_STEP;
const rawFireInterval = () => Math.max(MIN_RAW_FIRE_INTERVAL, fireRate() * multiShotFireDelay() / ((1+adrenalinePower()) * gatlingFireMult()));
const fireInterval = () => Math.max(MIN_RENDERED_FIRE_INTERVAL, rawFireInterval());
const fireCompressionBoost = () => Math.min(MAX_FIRE_COMPRESSION_DAMAGE, fireInterval()/rawFireInterval());
function fireRateReadout(){
  const shots=(60/fireInterval()).toFixed(1);
  const boost=fireCompressionBoost();
  return boost>1.01 ? `${shots}/s x${boost.toFixed(boost>=10?0:1)}` : `${shots}/s`;
}
const ownedDroneDefs = () => DRONE_DEFS.filter(d=>meta.ownedDrones?.[d.id]);
const purchasedDroneCount = () => ownedDroneDefs().reduce((sum,d)=>sum+(d.mult.count||1),0);
const droneLevel = id => Math.max(0,Number(meta.droneLevels?.[id])||0);
const droneUpgradeCost = id => {
  const d=DRONE_BY_ID[id];
  if(!d) return Infinity;
  return Math.floor(Math.max(120,d.cost*.55)*Math.pow(1.55,droneLevel(id)));
};
function purchasedDroneDamageMult(){
  const owned=ownedDroneDefs();
  if(owned.length===0) return 1;
  return owned.reduce((mult,d)=>mult + Math.max(0,(d.mult.damage||1)-1) + droneLevel(d.id)*0.18,1);
}
const passiveShieldBonus = () => (activeShipDef().id==='guardian'?3:0) + (hasMountedPart('plate')?2:0) + (hasMountedPart('aegis')?3:0);
const supportDroneCount = () => Math.min(10, specialLevels.supportDrone + purchasedDroneCount() + (activeShipDef().id==='carrier'?3:0) + (hasMountedPart('droneBay')?2:0) + (hasMountedPart('swarmLink')?3:0));
const interceptorCount = () => Math.min(10, specialLevels.interceptor + (hasMountedPart('bitLink')?2:0));
const shieldMax = () => (specialLevels.energyShield>0 ? 1+Math.floor((specialLevels.energyShield-1)/3) : 0) + passiveShieldBonus();
const stasisRadius = () => 72 + specialLevels.stasisAura*10;
const stasisMult = () => Math.max(.35, 1-specialLevels.stasisAura*.07);
const incomingDamage = amount => Math.max(1, Math.ceil(amount / bodyMult('defense')));
const playerHitRadius = () => activeShipDef().id==='coreOnly' ? 9 : (activeShipDef().id==='mirage' ? 10 : 12);
const fmtMult   = v => `x${v>=10 ? v.toFixed(1) : v.toFixed(2)}`;
function formatCompactNumber(value){
  const raw=String(value).trim();
  const sign=raw.startsWith('+')?'+':(raw.startsWith('-')?'-':'');
  const body=sign?raw.slice(1):raw;
  const num=Number(body);
  if(!Number.isFinite(num)) return raw;
  const abs=Math.abs(num);
  if(abs<1000) return `${sign}${Math.round(abs).toLocaleString()}`;
  const units=[
    {v:1e15,s:'P'},
    {v:1e12,s:'T'},
    {v:1e9,s:'G'},
    {v:1e6,s:'M'},
    {v:1e3,s:'K'},
  ];
  const unit=units.find(u=>abs>=u.v);
  const scaled=abs/unit.v;
  const digits=scaled>=100?0:(scaled>=10?1:2);
  return `${sign}${scaled.toFixed(digits).replace(/\.0+$|(\.\d*[1-9])0+$/,'$1')}${unit.s}`;
}
const hpText = () => `${formatCompactNumber(hp)}/${formatCompactNumber(maxHp)}`;
const basicGainText = (id, lv=statLevels[id]) => {
  if(id==='regen') return `+${REGEN_STEP.toFixed(1)}/s`;
  if(id==='critChance'&&lv>=20) return '二重+5%';
  if(id==='range') return '+5% 補正距離';
  return '+5%';
};
const critReadout = () => doubleCritChance()>0 ? `100% 二重${Math.round(doubleCritChance()*100)}%` : `${Math.round(critChance()*100)}%`;
function rollCritTier(chance=critChance(), doubleChance=doubleCritChance()){
  if(Math.random()>=chance) return 0;
  return Math.random()<doubleChance ? 2 : 1;
}
const ownedSpecialCount = () => SPECIAL_DEFS.reduce((n,d)=>n+(specialLevels[d.id]>0?1:0),0);
function basicStatReadouts(){
  return [
    { id:'fireRate',    icon:'FR', label:'連射', value:fireRateReadout(), color:'#00f0ff' },
    { id:'bulletSpeed', icon:'▶▶', label:'弾速', value:fmtMult(statMult('bulletSpeed')),      color:'#b8a7ff' },
    { id:'damage',      icon:'✦',  label:'威力', value:fmtMult(statMult('damage')),           color:'#ff6020' },
    { id:'range',       icon:'RG', label:'距離補正', value:`${Math.round(damageFalloffRange())}`, color:'#88aaff' },
    { id:'speed',       icon:'⇄',  label:'移動', value:fmtMult(statMult('speed')),             color:'#66ccff' },
    { id:'critChance',  icon:'※',  label:'会心', value:critReadout(),                          color:'#b8a7ff' },
    { id:'critDamage',  icon:'✹',  label:'倍率', value:fmtMult(critDamage()),                  color:'#ff7040' },
    { id:'regen',       icon:'＋', label:'回復', value:`${regenPerSec().toFixed(1)}/s`,         color:'#ff7ad9' },
    { id:'hp',          icon:'❤',  label:'HP',   value:fmtMult(maxHp/100),                     color:'#ff2d78' },
    { id:'xpMult',      icon:'★',  label:'XP',   value:fmtMult(xpMult()),                      color:'#00dd77' },
  ];
}
function bodyStatReadouts(){
  return [
    { label:'HP', value:`最大 ${fmtMult(bodyMult('hp'))}`, color:'#ff2d78' },
    { label:'防御', value:`被ダメ ${fmtMult(1/bodyMult('defense'))}`, color:'#66ccff' },
    { label:'攻撃', value:fmtMult(bodyMult('attack')), color:'#ff6020' },
    { label:'連射', value:fmtMult(bodyMult('fireRate')), color:'#00f0ff' },
  ];
}
function normalizeHighScore(){
  const saved=meta.highScore || {};
  const scoreValue=Math.max(0,Math.floor(Number(saved.score)||Number(meta.bestScore)||0));
  const highScoreWave=Math.max(1,Math.floor(Number(saved.wave)||Number(meta.bestWave)||1));
  const bestWave=Math.max(1,Math.floor(Number(meta.bestWave)||highScoreWave));
  meta.highScore={score:scoreValue,wave:highScoreWave};
  meta.bestWave=Math.max(bestWave,highScoreWave);
}
function highScoreWave(){
  normalizeHighScore();
  return Math.max(meta.bestWave||1,meta.highScore?.wave||1);
}
function highScoreCheckpointWave(){
  const best=highScoreWave();
  return Math.max(1,Math.floor((best-1)/BOSS_WAVE_INTERVAL)*BOSS_WAVE_INTERVAL+1);
}
function canUseHighScoreCheckpoint(){
  return highScoreCheckpointWave()>1;
}
function recordRunHighScore(){
  normalizeHighScore();
  const currentWave=Math.max(1,Math.floor(wave)||1);
  const currentScore=Math.max(0,Math.floor(score)||0);
  let changed=false;
  if(currentWave>meta.bestWave){
    meta.bestWave=currentWave;
    changed=true;
  }
  if(currentScore>meta.highScore.score || (currentScore===meta.highScore.score&&currentWave>meta.highScore.wave)){
    meta.highScore={score:currentScore,wave:currentWave};
    changed=true;
  }
  if(changed) saveMeta();
  return changed;
}
function loadMeta(){
  let shouldSave=false;
  try{
    const raw=localStorage.getItem('barrage-meta');
    if(raw){
      const saved=JSON.parse(raw);
      if(saved.saveResetVersion!==SAVE_RESET_VERSION){
        meta=freshMeta();
        shouldSave=true;
      }else{
        const legacyLoad=!('selectedCore' in saved);
        meta.tokens=Number(saved.tokens)||0;
        for(const d of BODY_UPGRADE_DEFS) meta.upgrades[d.id]=Number(saved.upgrades?.[d.id])||0;
        for(const d of BASIC_STAT_DEFS) meta.homeUpgrades[d.id]=Number(saved.homeUpgrades?.[d.id])||0;
        meta.selectedShip=saved.selectedShip || 'coreOnly';
        meta.selectedCore=saved.selectedCore || 'basic';
        meta.ownedShips={coreOnly:true,...(saved.ownedShips||{})};
        meta.ownedCores={basic:true,...(saved.ownedCores||{})};
        meta.ownedParts={...(saved.ownedParts||{})};
        meta.ownedDrones={...(saved.ownedDrones||{})};
        meta.coreLevels={basic:0,...(saved.coreLevels||{})};
        meta.droneLevels={...(saved.droneLevels||{})};
        meta.mountedParts={...(saved.mountedParts||{})};
        meta.grants={...(saved.grants||{})};
        meta.highScore={...(saved.highScore||{})};
        meta.bestWave=Number(saved.bestWave)||Number(saved.highScore?.wave)||1;
        meta.saveResetVersion=SAVE_RESET_VERSION;
        meta.settings={...DEFAULT_SETTINGS,...(saved.settings||{})};
        if(!meta.grants[DEMO_GRANT_KEY]){
          meta.tokens+=DEMO_START_TOKENS;
          meta.grants[DEMO_GRANT_KEY]=true;
          shouldSave=true;
        }
        normalizeSettings();
        if(legacyLoad) meta.selectedShip='coreOnly';
        if(!meta.ownedShips[meta.selectedShip]) meta.selectedShip='coreOnly';
        if(!meta.ownedCores[meta.selectedCore]) meta.selectedCore='basic';
        normalizeMounts();
      }
    }else{
      shouldSave=true;
    }
  }catch(e){
    meta=freshMeta();
    shouldSave=true;
  }
  normalizeSettings();
  normalizeHighScore();
  invalidateLoadoutCache();
  if(shouldSave) saveMeta();
}
function saveMeta(){
  invalidateLoadoutCache();
  try{localStorage.setItem('barrage-meta',JSON.stringify(meta));}catch(e){}
}
function resetSaveData(){
  const keepSettings={...DEFAULT_SETTINGS,...(meta.settings||{})};
  meta=freshMeta(keepSettings);
  normalizeSettings();
  normalizeMounts();
  storeTab='ship';
  storePages={ship:0,core:0,part:0,drone:0};
  warehouseTab='ship';
  codexTab='special';
  codexPage=0;
  clearPendingStorePurchase();
  saveMeta();
  stopTouchMove();
  resetConfirmFrames=0;
  shake(4);
  burst(W/2,560,HOYO_UI.rose,18);
  addFloat(W/2,532,'セーブデータを初期化しました',HOYO_UI.rose,12);
  playSfx('upgrade');
}
function normalizeSettings(){
  meta.settings={...DEFAULT_SETTINGS,...(meta.settings||{})};
  if(!['buttons','stick'].includes(meta.settings.touchControl)) meta.settings.touchControl='buttons';
  for(const key of ['sound','music','sfx']) meta.settings[key]=meta.settings[key]!==false;
  meta.settings.musicVolume=Math.max(0,Math.min(1,Number(meta.settings.musicVolume)||DEFAULT_SETTINGS.musicVolume));
  meta.settings.sfxVolume=Math.max(0,Math.min(1,Number(meta.settings.sfxVolume)||DEFAULT_SETTINGS.sfxVolume));
}
function ensureAudioContext(){
  if(audioState.ctx) return audioState.ctx;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx) return null;
  audioState.ctx=new AudioCtx();
  return audioState.ctx;
}
function unlockAudio(){
  audioState.unlocked=true;
  const ac=ensureAudioContext();
  if(ac&&ac.state==='suspended') ac.resume().catch(()=>{});
  if(state==='play') playBgm();
}
function pauseBgm(){
  if(audioState.bgm) audioState.bgm.pause();
}
function resetBgmTrack(randomize=false){
  pauseBgm();
  audioState.bgm=null;
  audioState.bgmMissing=false;
  audioState.bgmAttempts=0;
  if(randomize) audioState.track=Math.floor(Math.random()*AUDIO_ASSETS.bgm.length);
}
function playBgm(){
  if(!audioState.unlocked||!meta.settings.sound||!meta.settings.music||audioState.bgmMissing) return;
  if(!audioState.bgm){
    const src=AUDIO_ASSETS.bgm[audioState.track%AUDIO_ASSETS.bgm.length];
    const bgm=new Audio(src);
    bgm.loop=true;
    bgm.preload='auto';
    bgm.volume=meta.settings.musicVolume;
    bgm.addEventListener('error',()=>{
      audioState.bgm=null;
      audioState.bgmAttempts++;
      if(audioState.bgmAttempts>=AUDIO_ASSETS.bgm.length){
        audioState.bgmMissing=true;
        return;
      }
      audioState.track=(audioState.track+1)%AUDIO_ASSETS.bgm.length;
      playBgm();
    },{once:true});
    audioState.bgm=bgm;
  }
  audioState.bgm.volume=meta.settings.musicVolume;
  audioState.bgm.play().catch(()=>{});
}
function updateAudioSettings(){
  normalizeSettings();
  if(audioState.bgm) audioState.bgm.volume=meta.settings.musicVolume;
  if(meta.settings.sound&&meta.settings.music&&state==='play') playBgm();
  else pauseBgm();
  saveMeta();
}
function setAudioToggle(key){
  meta.settings[key]=!meta.settings[key];
  updateAudioSettings();
  playSfx(meta.settings[key]?'select':'denied');
}
function playSfx(name){
  if(!audioState.unlocked||!meta.settings.sound||!meta.settings.sfx) return;
  const now=performance.now();
  const throttle=name==='shot'?72:(name==='hit'?48:0);
  if(throttle&&now-(audioState.lastSfx[name]||0)<throttle) return;
  audioState.lastSfx[name]=now;
  const ac=ensureAudioContext();
  if(!ac) return;
  if(ac.state==='suspended') ac.resume().catch(()=>{});
  const p=SFX_PRESETS[name]||SFX_PRESETS.select;
  const t=ac.currentTime;
  const gain=ac.createGain();
  const osc=ac.createOscillator();
  osc.type=p.type;
  osc.frequency.setValueAtTime(p.f,t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20,p.to),t+p.d);
  gain.gain.setValueAtTime(.0001,t);
  gain.gain.exponentialRampToValueAtTime(p.gain*meta.settings.sfxVolume,t+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,t+p.d);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t+p.d+.025);
}
const touchControlMode = () => meta.settings?.touchControl==='stick' ? 'stick' : 'buttons';
function setTouchControlMode(mode){
  meta.settings={...DEFAULT_SETTINGS,...(meta.settings||{})};
  meta.settings.touchControl=mode==='stick' ? 'stick' : 'buttons';
  saveMeta();
  stopTouchMove();
  playSfx('select');
  addFloat(W/2,142,meta.settings.touchControl==='stick'?'スティック操作':'タップ操作','#00f0ff',11);
}
function calculateTokenPayout(){
  const scoreBonus=Math.floor(score/TOKEN_SCORE_UNIT);
  const coinBonus=coins*RUN_TOKEN_COIN_MULT;
  const waveBonus=Math.max(0,wave-runStartWave)*RUN_TOKEN_WAVE_BONUS;
  const timeBonus=Math.floor((frame/FPS)*RUN_TOKEN_TIME_BONUS);
  const rawGain=scoreBonus+coinBonus+waveBonus+timeBonus;
  return Math.max(0,Math.floor(rawGain/RUN_TOKEN_PAYOUT_DIVISOR));
}
function awardTokens(){
  const gain=calculateTokenPayout();
  if(gain<=0) return;
  meta.tokens+=gain;
  tokensEarned+=gain;
  saveMeta();
}
function buyBodyUpgrade(id){
  const cost=bodyUpgradeCost(id);
  if(meta.tokens<cost){
    addFloat(W/2,H-130,`トークン ${cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=cost;
  meta.upgrades[id]++;
  saveMeta();
  playSfx('upgrade');
  const d=BODY_UPGRADE_DEFS.find(v=>v.id===id);
  burst(W/2,H-180,d.color,14);
  addFloat(W/2,H-150,`${d.icon} ${d.name} アップ`,d.color,12);
}
function buyHomeUpgrade(id){
  const cost=homeUpgradeCost(id);
  if(meta.tokens<cost){
    addFloat(W/2,300,`トークン ${cost} 必要`,'#b8a7ff',11);
    shake(3); return;
  }
  meta.tokens-=cost;
  meta.homeUpgrades[id]=(meta.homeUpgrades[id]||0)+1;
  saveMeta();
  playSfx('upgrade');
  const d=BASIC_STAT_BY_ID[id];
  burst(W/2,300,d.color,14);
  addFloat(W/2,280,`${d.icon} ${d.name} Lv.${meta.homeUpgrades[id]}`,d.color,12);
}
function homeStatBonus(id){
  const lv=meta.homeUpgrades[id]||0;
  if(lv===0) return '未アップ';
  if(id==='regen') return `+${(lv*REGEN_STEP).toFixed(1)}HP/s`;
  if(id==='critChance') return `会心 +${(lv*CRIT_STEP*100).toFixed(0)}%`;
  if(id==='range') return `補正距離 ×${Math.pow(BASIC_STAT_GROWTH,lv).toFixed(2)}`;
  return `×${Math.pow(BASIC_STAT_GROWTH,lv).toFixed(2)}`;
}
function normalizeMounts(){
  for(const ship of SHIP_DEFS){
    const mount=meta.mountedParts[ship.id] || {};
    for(const type of ['turret','armor','drone','coreBoost']){
      const limit=ship.slots[type]||0;
      mount[type]=(mount[type]||[]).filter(pid=>{
        const p=PART_BY_ID[pid];
        return p&&p.type===type&&meta.ownedParts[pid];
      }).slice(0,limit);
    }
    meta.mountedParts[ship.id]=mount;
  }
}
function partMountedShip(partId){
  for(const ship of SHIP_DEFS){
    const mount=mountedForShip(ship.id);
    for(const list of Object.values(mount)) if(list.includes(partId)) return ship.id;
  }
  return null;
}
function clearPendingStorePurchase(){
  pendingStorePurchase=null;
}
function setPendingStorePurchase(action){
  pendingStorePurchase=action;
  addFloat(W/2,156,`${action.title}しますか？`,action.color,11);
  playSfx('select');
}
function isPendingStorePurchase(kind,id=null){
  return pendingStorePurchase?.kind===kind && (id===null || pendingStorePurchase.id===id);
}
function buyOrSelectShip(id){
  const ship=SHIP_BY_ID[id];
  if(!ship) return;
  if(meta.ownedShips[id]){
    meta.selectedShip=id;
    normalizeMounts();
    saveMeta();
    clearPendingStorePurchase();
    addFloat(W/2,156,`${ship.icon} ${displayName('ship',ship)} セレクト`,ship.color,11);
    return;
  }
  if(meta.tokens<ship.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${ship.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=ship.cost;
  meta.ownedShips[id]=true;
  meta.selectedShip=id;
  normalizeMounts();
  clearPendingStorePurchase();
  saveMeta();
  burst(W/2,170,ship.color,16);
  addFloat(W/2,156,`${ship.icon} ${displayName('ship',ship)} ゲット`,ship.color,11);
}
function requestShipPurchase(id){
  const ship=SHIP_BY_ID[id];
  if(!ship) return;
  if(meta.ownedShips[id]){
    buyOrSelectShip(id);
    return;
  }
  if(meta.tokens<ship.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${ship.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  setPendingStorePurchase({
    kind:'ship',
    id,
    tab:'ship',
    icon:ship.icon,
    color:ship.color,
    cost:ship.cost,
    title:`${displayName('ship',ship)} を購入`,
    desc:'購入するとすぐセレクトされます。'
  });
}
function buyOrMountCore(id){
  const core=CORE_BY_ID[id];
  if(!core) return;
  if(meta.ownedCores[id]){
    meta.selectedCore=id;
    saveMeta();
    clearPendingStorePurchase();
    addFloat(W/2,156,`${core.icon} ${displayName('core',core)} セット`,core.color,11);
    return;
  }
  if(meta.tokens<core.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${core.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=core.cost;
  meta.ownedCores[id]=true;
  meta.coreLevels[id]=0;
  meta.selectedCore=id;
  clearPendingStorePurchase();
  saveMeta();
  burst(W/2,170,core.color,16);
  addFloat(W/2,156,`${core.icon} ${displayName('core',core)} ゲット`,core.color,11);
}
function requestCorePurchase(id){
  const core=CORE_BY_ID[id];
  if(!core) return;
  if(meta.ownedCores[id]){
    buyOrMountCore(id);
    return;
  }
  if(meta.tokens<core.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${core.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  setPendingStorePurchase({
    kind:'core',
    id,
    tab:'core',
    icon:core.icon,
    color:core.color,
    cost:core.cost,
    title:`${displayName('core',core)} を購入`,
    desc:'購入するとすぐセットされます。'
  });
}
function upgradeMountedCore(){
  const cost=coreUpgradeCost();
  const core=selectedCoreDef();
  if(meta.tokens<cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=cost;
  meta.coreLevels[core.id]=(meta.coreLevels[core.id]||0)+1;
  clearPendingStorePurchase();
  saveMeta();
  burst(W/2,170,core.color,16);
  addFloat(W/2,156,`${core.icon} コア Lv.${meta.coreLevels[core.id]}`,core.color,11);
}
function requestCoreUpgrade(){
  const cost=coreUpgradeCost();
  const core=selectedCoreDef();
  if(meta.tokens<cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  setPendingStorePurchase({
    kind:'coreUpgrade',
    id:core.id,
    tab:'core',
    icon:core.icon,
    color:core.color,
    cost,
    title:`${displayName('core',core)} を強化`,
    desc:`Lv.${selectedCoreLevel()} > Lv.${selectedCoreLevel()+1}`
  });
}
function buyPart(id){
  const part=PART_BY_ID[id];
  if(!part||meta.ownedParts[id]) return;
  if(meta.tokens<part.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${part.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=part.cost;
  meta.ownedParts[id]=true;
  normalizeMounts();
  const ship=selectedShipDef();
  const mount=meta.mountedParts[ship.id] || {};
  const list=mount[part.type] || [];
  const limit=ship.slots[part.type]||0;
  const autoMounted=limit>0&&list.length<limit;
  if(autoMounted){
    list.push(id);
    mount[part.type]=list;
    meta.mountedParts[ship.id]=mount;
  }
  clearPendingStorePurchase();
  saveMeta();
  burst(W/2,170,part.color,16);
  addFloat(W/2,156,`${part.icon} ${displayName('part',part)} ${autoMounted?'オートセット':'ゲット'}`,part.color,11);
}
function requestPartPurchase(id){
  const part=PART_BY_ID[id];
  if(!part||meta.ownedParts[id]) return;
  if(meta.tokens<part.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${part.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  setPendingStorePurchase({
    kind:'part',
    id,
    tab:'part',
    icon:part.icon,
    color:part.color,
    cost:part.cost,
    title:`${displayName('part',part)} を購入`,
    desc:'空きスロットがあれば自動セットされます。'
  });
}
function buyDrone(id){
  const drone=DRONE_BY_ID[id];
  if(!drone||meta.ownedDrones[id]) return;
  if(meta.tokens<drone.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${drone.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=drone.cost;
  meta.ownedDrones[id]=true;
  meta.droneLevels[id]=0;
  clearPendingStorePurchase();
  saveMeta();
  burst(W/2,170,drone.color,16);
  addFloat(W/2,156,`${drone.icon} ${drone.name} 起動`,drone.color,11);
}
function requestDronePurchase(id){
  const drone=DRONE_BY_ID[id];
  if(!drone) return;
  if(meta.ownedDrones[id]){
    requestDroneUpgrade(id);
    return;
  }
  if(meta.tokens<drone.cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${drone.cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  setPendingStorePurchase({
    kind:'drone',
    id,
    tab:'drone',
    icon:drone.icon,
    color:drone.color,
    cost:drone.cost,
    title:`${drone.name} を購入`,
    desc:'戦闘中に支援ドローンとして自動射撃します。'
  });
}
function upgradeDrone(id){
  const drone=DRONE_BY_ID[id];
  if(!drone||!meta.ownedDrones[id]) return;
  const cost=droneUpgradeCost(id);
  if(meta.tokens<cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  meta.tokens-=cost;
  meta.droneLevels[id]=droneLevel(id)+1;
  clearPendingStorePurchase();
  saveMeta();
  burst(W/2,170,drone.color,16);
  addFloat(W/2,156,`${drone.icon} Lv.${meta.droneLevels[id]}`,drone.color,11);
}
function requestDroneUpgrade(id){
  const drone=DRONE_BY_ID[id];
  if(!drone||!meta.ownedDrones[id]) return;
  const cost=droneUpgradeCost(id);
  if(meta.tokens<cost){
    clearPendingStorePurchase();
    addFloat(W/2,156,`トークン ${cost} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  setPendingStorePurchase({
    kind:'droneUpgrade',
    id,
    tab:'drone',
    icon:drone.icon,
    color:drone.color,
    cost,
    title:`${drone.name} を強化`,
    desc:`Lv.${droneLevel(id)} > Lv.${droneLevel(id)+1} / 火力 +18%`
  });
}
function confirmStorePurchase(){
  const action=pendingStorePurchase;
  if(!action) return;
  if(action.kind==='ship') buyOrSelectShip(action.id);
  else if(action.kind==='core') buyOrMountCore(action.id);
  else if(action.kind==='coreUpgrade') upgradeMountedCore();
  else if(action.kind==='part') buyPart(action.id);
  else if(action.kind==='drone') buyDrone(action.id);
  else if(action.kind==='droneUpgrade') upgradeDrone(action.id);
}
function toggleMountPart(id){
  const part=PART_BY_ID[id];
  if(!part||!meta.ownedParts[id]) return;
  normalizeMounts();
  const ship=selectedShipDef();
  const mount=meta.mountedParts[ship.id] || {};
  const list=mount[part.type] || [];
  if(list.includes(id)){
    mount[part.type]=list.filter(pid=>pid!==id);
    meta.mountedParts[ship.id]=mount;
    saveMeta();
    addFloat(W/2,156,`${part.icon} 解除`,part.color,11);
    return;
  }
  const otherShip=partMountedShip(id);
  if(otherShip){
    const other=meta.mountedParts[otherShip];
    other[part.type]=(other[part.type]||[]).filter(pid=>pid!==id);
  }
  const limit=ship.slots[part.type]||0;
  if(list.length>=limit){
    addFloat(W/2,156,`${partTypeName(part.type)} スロット満杯`,'#b8a7ff',11);
    shake(3);
    return;
  }
  list.push(id);
  mount[part.type]=list;
  meta.mountedParts[ship.id]=mount;
  saveMeta();
  addFloat(W/2,156,`${part.icon} セット`,part.color,11);
}

// ─────────────────────────────────────
//  ユーティリティ
// ─────────────────────────────────────
function h2r(hex,a){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function displayName(kind,itemOrId){
  const id=typeof itemOrId==='string'?itemOrId:itemOrId?.id;
  return UI_COPY[kind]?.[id] || itemOrId?.name || id || '';
}
const statName = id => UI_COPY.stat[id] || basicSkillDef(id)?.name || id;
const partTypeName = type => UI_COPY.partType[type] || type;
const shipEffectText = shipOrId => SHIP_EFFECTS[typeof shipOrId==='string'?shipOrId:shipOrId?.id] || '';
const partEffectText = partOrId => PART_EFFECTS[typeof partOrId==='string'?partOrId:partOrId?.id] || '';
function rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}
function rrTop(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}
function cutPanel(x,y,w,h,cut=12){
  ctx.beginPath();
  ctx.moveTo(x+cut,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h-cut);
  ctx.lineTo(x+w-cut,y+h);ctx.lineTo(x,y+h);ctx.lineTo(x,y+cut);
  ctx.closePath();
}
function drawCutPanel(x,y,w,h,accent=HOYO_UI.gold,active=false){
  ctx.save();
  cutPanel(x,y,w,h,active?15:10);
  ctx.fillStyle=active?h2r(accent,.18):'rgba(12,15,17,.94)';
  ctx.fill();
  cutPanel(x+1,y+1,w-2,h-2,active?14:9);
  ctx.fillStyle=active?'rgba(238,247,255,.070)':'rgba(238,247,255,.035)';
  ctx.fill();

  ctx.strokeStyle=active?h2r(accent,.88):'rgba(238,247,255,.20)';
  ctx.lineWidth=active?1.8:1.05;
  cutPanel(x,y,w,h,active?15:10);ctx.stroke();
  ctx.fillStyle=h2r(accent,active?.95:.58);
  ctx.fillRect(x+1,y+4,4,Math.max(14,h-8));
  ctx.fillRect(x+10,y+1,Math.min(38,w*.24),2);
  ctx.fillStyle='rgba(0,0,0,.36)';
  ctx.fillRect(x+7,y+h-3,Math.max(18,w-18),2);
  ctx.restore();
}
function drawHoyoPanel(x,y,w,h,r=10,accent=HOYO_UI.gold){
  drawCutPanel(x,y,w,h,accent,false);
  ctx.fillStyle='rgba(255,247,232,.045)';
  ctx.fillRect(x+16,y+16,w-32,1);
  ctx.fillRect(x+16,y+h-18,w-32,1);
}
function drawHoyoChip(x,y,w,h,text,accent=HOYO_UI.gold){
  cutPanel(x,y,w,h,6);
  ctx.fillStyle=h2r(accent,.075);ctx.fill();
  ctx.strokeStyle=h2r(accent,.36);ctx.lineWidth=1;cutPanel(x,y,w,h,6);ctx.stroke();
  ctx.font=`bold 10px ${UI_FONT}`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(text,x+w/2,y+h/2+1);
}
function drawBarrageLogo(x,y,scale=1){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(scale,scale);
  cutPanel(0,0,244,68,18);
  ctx.fillStyle='rgba(5,7,9,.98)';
  ctx.fill();
  ctx.strokeStyle='rgba(238,247,255,.28)';
  ctx.lineWidth=1.2;
  cutPanel(0,0,244,68,18);
  ctx.stroke();
  ctx.fillStyle=h2r(HOYO_UI.gold,.92);
  ctx.fillRect(0,0,6,68);
  ctx.fillRect(18,4,78,3);
  ctx.fillStyle=h2r(HOYO_UI.blue,.80);
  ctx.fillRect(78,64,108,3);
  ctx.fillStyle=h2r(HOYO_UI.rose,.82);
  ctx.fillRect(188,10,36,3);

  ctx.save();
  ctx.translate(20,36);
  ctx.transform(1,0,-.13,1,0,0);
  ctx.font=`900 39px ${DISPLAY_FONT}`;
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.lineWidth=5;
  ctx.strokeStyle='rgba(0,0,0,.92)';
  ctx.strokeText('BARRAGE',0,0,204);
  ctx.fillStyle=h2r(HOYO_UI.blue,.76);
  ctx.fillText('BARRAGE',-2,-1,204);
  ctx.fillStyle=h2r(HOYO_UI.rose,.70);
  ctx.fillText('BARRAGE',2,2,204);
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('BARRAGE',0,0,204);
  ctx.restore();

  ctx.strokeStyle=h2r(HOYO_UI.gold,.72);
  ctx.lineWidth=2;
  for(let i=0;i<3;i++){
    const px=205+i*9;
    ctx.beginPath();
    ctx.moveTo(px,42);
    ctx.lineTo(px+7,34);
    ctx.lineTo(px,26);
    ctx.stroke();
  }
  ctx.restore();
}
function shake(amp){ shakeT=14; shakeAmp=amp; }
function removeAtFast(arr,i){
  const last=arr.length-1;
  if(i<0||i>last) return;
  if(i!==last) arr[i]=arr[last];
  arr.pop();
}
const projectileLoad = () => arrows.length + enemyBullets.length;
function effectLoadScale(){
  const load=projectileLoad()+particles.length;
  return load>150?.35:(load>110?.55:(load>80?.75:1));
}
function addFloat(x,y,text,color,size=13){
  if(floatTexts.length>=MAX_FLOAT_TEXTS) removeAtFast(floatTexts,0);
  floatTexts.push({x,y,text,color,size,life:65,maxLife:65,vy:-0.9});
}
const waveSecondsLeft = () => {
  return Math.max(0, Math.ceil((WAVE_DURATION_FRAMES - waveFrame) / FPS));
};
function startNextWave(){
  wave++;
  recordRunHighScore();
  waveFrame=0;
  waveBanner=120;
  grantSkillPoint();
  if(activeShipDef().id==='standard'&&hp<maxHp){
    const heal=Math.max(12,Math.ceil(maxHp*.10));
    hp=Math.min(maxHp,hp+heal);
    addFloat(player.x,player.y-38,`AUTO REPAIR +${heal}`,HOYO_UI.jade,11);
  }
  if(wave%BOSS_WAVE_INTERVAL===0) spawnBoss();
  addFloat(W/2,86,`WAVE ${wave} 開始`,HOYO_UI.rose,13);
  playSfx('special');
}
function advanceWaveTimer(){
  waveFrame++;
  if(waveFrame>=WAVE_DURATION_FRAMES) startNextWave();
}
const distSq = (ax,ay,bx,by) => {
  const dx=ax-bx, dy=ay-by;
  return dx*dx+dy*dy;
};
function nearestEnemy(x,y,exclude=null,range=Infinity){
  let near=null, nd2=range*range;
  const bounded=Number.isFinite(range);
  for(let i=0;i<enemies.length;i++){
    const e=enemies[i];
    if(e===exclude||e.dead) continue;
    const dx=e.x-x, dy=e.y-y;
    if(bounded&&(dx<-range||dx>range||dy<-range||dy>range)) continue;
    const d2=dx*dx+dy*dy;
    if(d2<nd2){nd2=d2;near=e;}
  }
  return near;
}

// ─────────────────────────────────────
//  背景
// ─────────────────────────────────────
function initBg(){
  bgBaseGradient=ctx.createLinearGradient(0,0,W,H);
  bgBaseGradient.addColorStop(0,'#151211');
  bgBaseGradient.addColorStop(.46,'#090b0f');
  bgBaseGradient.addColorStop(1,'#030508');
  bgNebulaA=ctx.createRadialGradient(W*.22,H*.17,8,W*.22,H*.17,230);
  bgNebulaA.addColorStop(0,'rgba(184,167,255,.10)');
  bgNebulaA.addColorStop(.42,'rgba(184,167,255,.035)');
  bgNebulaA.addColorStop(1,'rgba(0,0,0,0)');
  bgNebulaB=ctx.createRadialGradient(W*.88,H*.72,12,W*.88,H*.72,260);
  bgNebulaB.addColorStop(0,'rgba(101,230,193,.090)');
  bgNebulaB.addColorStop(.48,'rgba(130,215,255,.028)');
  bgNebulaB.addColorStop(1,'rgba(0,0,0,0)');
  bgScanGradient=ctx.createLinearGradient(0,0,0,H);
  bgScanGradient.addColorStop(0,'rgba(255,247,232,.020)');
  bgScanGradient.addColorStop(.5,'rgba(255,255,255,0)');
  bgScanGradient.addColorStop(1,'rgba(255,247,232,.014)');
  hudTopGradient=ctx.createLinearGradient(0,0,0,HUD_T+16);
  hudTopGradient.addColorStop(0,'rgba(10,11,13,.94)');
  hudTopGradient.addColorStop(.72,'rgba(10,11,13,.70)');
  hudTopGradient.addColorStop(1,'rgba(10,11,13,0)');
  hudBottomGradient=ctx.createLinearGradient(0,H-HUD_B-18,0,H);
  hudBottomGradient.addColorStop(0,'rgba(7,8,10,0)');
  hudBottomGradient.addColorStop(.4,'rgba(7,8,10,.84)');
  hudBottomGradient.addColorStop(1,'rgba(7,8,10,.98)');
  pauseButtonGradient=ctx.createLinearGradient(PAUSE_BTN.x,PAUSE_BTN.y,PAUSE_BTN.x+PAUSE_BTN.w,PAUSE_BTN.y+PAUSE_BTN.h);
  pauseButtonGradient.addColorStop(0,'rgba(255,247,232,.12)');
  pauseButtonGradient.addColorStop(.55,'rgba(21,20,18,.84)');
  pauseButtonGradient.addColorStop(1,'rgba(5,8,13,.92)');
  bgLines=[];
  for(let x=0;x<=W;x+=BG_GRID_STEP) bgLines.push({t:'v',x});
  for(let y=0;y<=H;y+=BG_GRID_STEP) bgLines.push({t:'h',y});
  bgStars=[];
  for(let i=0;i<BG_STAR_COUNT;i++) bgStars.push({
    x:Math.random()*W, y:Math.random()*H,
    r:Math.random()*1.5+.25,
    layer:Math.random()<.72?0:1,
    phase:Math.random()*Math.PI*2,
    spd:Math.random()*.018+.006
  });
  bgBeams=[];
  for(let i=0;i<BG_BEAM_COUNT;i++) bgBeams.push({
    x:-W+Math.random()*W*2,
    y:Math.random()*H,
    len:90+Math.random()*170,
    spd:.12+Math.random()*.32,
    a:.025+Math.random()*.045,
    c:Math.random()<.55?'184,167,255':'101,230,193'
  });
}
function drawBg(){
  const t=(globalThis.performance?.now?.() ?? Date.now())*.001;
  const reduced=state==='play'&&projectileLoad()>115;
  ctx.fillStyle=bgBaseGradient; ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=bgNebulaA;ctx.fillRect(0,0,W,H);
  ctx.fillStyle=bgNebulaB;ctx.fillRect(0,0,W,H);
  ctx.restore();

  ctx.fillStyle='rgba(255,247,232,.025)';
  for(let y=28;y<H;y+=88){
    ctx.fillRect(0,y,W,1);
    ctx.fillRect(24,y+14,W-48,1);
  }

  const gridShift=(t*7)%BG_GRID_STEP;
  ctx.strokeStyle='rgba(184,167,255,0.030)'; ctx.lineWidth=.5;
  for(const l of bgLines){
    ctx.beginPath();
    if(l.t==='v'){
      const x=(l.x+Math.sin(t*.22+l.x*.04)*2);
      ctx.moveTo(x,0);ctx.lineTo(x,H);
    }else{
      const y=(l.y+gridShift)%H;
      ctx.moveTo(0,y);ctx.lineTo(W,y);
    }
    ctx.stroke();
  }

  if(!reduced){
    ctx.strokeStyle='rgba(101,230,193,0.024)'; ctx.setLineDash([6,20]); ctx.lineWidth=1;
    for(let i=-5;i<18;i++){
      const o=i*80+(t*10)%80;
      ctx.beginPath();ctx.moveTo(o,0);ctx.lineTo(o+H,H);ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  ctx.save();
  ctx.globalCompositeOperation='lighter';
  if(!reduced){
    for(const b of bgBeams){
      const x=((b.x+t*b.spd*120)%(W+260))-130;
      ctx.strokeStyle=`rgba(${b.c},${b.a})`;
      ctx.lineWidth=1.2;
      ctx.beginPath();
      ctx.moveTo(x,b.y);
      ctx.lineTo(x+b.len,b.y+b.len*.35);
      ctx.stroke();
    }
  }
  ctx.restore();

  const starStep=reduced?2:1;
  for(let i=0;i<bgStars.length;i+=starStep){
    const s=bgStars[i];
    s.phase+=s.spd;
    const drift=s.layer?((t*9+s.x*.02)%H):0;
    const y=s.layer?(s.y+drift)%H:s.y;
    const a=(s.layer?.13:.08)+Math.abs(Math.sin(s.phase))*(s.layer?.22:.14);
    ctx.fillStyle=`rgba(255,247,232,${a})`;
    const d=Math.max(1,s.r*1.4);
    ctx.fillRect(s.x-d*.5,y-d*.5,d,d);
  }

  if(!reduced){
    ctx.fillStyle=bgScanGradient;
    for(let y=(t*24)%24;y<H;y+=24) ctx.fillRect(0,y,W,1);
  }

  ctx.strokeStyle='rgba(184,167,255,0.18)'; ctx.lineWidth=1.1;
  const L=22;
  for(const[cx,cy,sx,sy] of BG_CORNERS){
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+sx*L,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy+sy*L);ctx.stroke();
  }
}

// ─────────────────────────────────────
//  プレイヤー
// ─────────────────────────────────────
function drawPlayer(){
  if(player.prevX!==player.x){
    ctx.strokeStyle='rgba(0,240,255,.16)';
    ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(player.prevX,player.prevY);ctx.lineTo(player.x,player.y);ctx.stroke();
  }
  if(invincible>0&&Math.floor(invincible/5)%2===0) return;
  drawCraft(player.x,player.y,.72);
}
function poly(points){
  ctx.beginPath();
  for(let i=0;i<points.length;i++){
    const p=points[i];
    i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]);
  }
  ctx.closePath();
}
function drawCraft(x,y,s=1,overrideShipId=null,overrideCoreId=null){
  const ship=overrideShipId?(SHIP_BY_ID[overrideShipId]||SHIP_DEFS[0]):activeShipDef();
  const core=overrideCoreId?(CORE_BY_ID[overrideCoreId]||CORE_DEFS[0]):activeCoreDef();
  const mount=mountedForShip(ship.id);
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(s,s);
  ctx.lineJoin='round';
  const lightCraft=s<.85;
  ctx.shadowColor=core.color;ctx.shadowBlur=lightCraft?5:18;

  if(ship.id!=='coreOnly'){
    ctx.fillStyle=h2r(ship.color,.16);
    ctx.strokeStyle=ship.color;
    ctx.lineWidth=2;
    if(ship.id==='striker'){
      poly([[0,-28],[24,18],[7,10],[0,26],[-7,10],[-24,18]]);
    }else if(ship.id==='sniper'){
      poly([[0,-34],[12,-10],[25,12],[8,9],[0,30],[-8,9],[-25,12],[-12,-10]]);
    }else if(ship.id==='guardian'){
      poly([[0,-22],[24,-4],[20,22],[0,30],[-20,22],[-24,-4]]);
    }else if(ship.id==='mirage'){
      poly([[0,-30],[20,-2],[29,15],[9,8],[0,28],[-9,8],[-29,15],[-20,-2]]);
    }else if(ship.id==='carrier'){
      poly([[0,-24],[28,4],[18,18],[8,12],[0,28],[-8,12],[-18,18],[-28,4]]);
    }else{
      poly([[0,-26],[20,4],[12,22],[0,16],[-12,22],[-20,4]]);
    }
    ctx.fill();ctx.stroke();
    ctx.fillStyle=h2r(ship.color,.28);
    ctx.beginPath();ctx.ellipse(-14,8,5,14,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(14,8,5,14,0,0,Math.PI*2);ctx.fill();
    const turretN=(mount.turret||[]).length;
    const armorN=(mount.armor||[]).length;
    const droneN=(mount.drone||[]).length;
    const boostN=(mount.coreBoost||[]).length;
    ctx.strokeStyle='#ff6020';ctx.lineWidth=2;ctx.shadowColor='#ff6020';ctx.shadowBlur=lightCraft?0:(turretN?10:0);
    for(let i=0;i<turretN;i++){
      const ox=(i-(turretN-1)/2)*12;
      ctx.beginPath();ctx.moveTo(ox,-22);ctx.lineTo(ox,-36);ctx.stroke();
    }
    ctx.strokeStyle='#66ccff';ctx.lineWidth=armorN?2.2:1;
    for(let i=0;i<armorN;i++){
      const side=i%2===0?-1:1;
      ctx.beginPath();ctx.moveTo(side*18,-2);ctx.lineTo(side*25,14);ctx.lineTo(side*16,24);ctx.stroke();
    }
    ctx.fillStyle='#9cff6a';ctx.shadowColor='#9cff6a';ctx.shadowBlur=lightCraft?0:(droneN?10:0);
    for(let i=0;i<droneN;i++){
      const side=i%2===0?-1:1;
      ctx.beginPath();ctx.arc(side*(30+Math.floor(i/2)*8),-2+Math.floor(i/2)*14,3.5,0,Math.PI*2);ctx.fill();
    }
    if(boostN>0){
      ctx.strokeStyle='#cc00ff';ctx.shadowColor='#cc00ff';ctx.shadowBlur=lightCraft?0:12;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.stroke();
    }
  }else{
    ctx.strokeStyle=h2r(core.color,.7);
    ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,30,frame*.02,Math.PI*1.35+frame*.02);ctx.stroke();
  }

  ctx.shadowColor=core.color;ctx.shadowBlur=lightCraft?6:20;
  ctx.fillStyle=h2r(core.color,.28);
  ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=core.color;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#e8e8f0';
  ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function fireAtTarget(x,y,target,scale,kind){
  if(!target) return;
  const dx=target.x-x, dy=target.y-y, len=Math.hypot(dx,dy)||1;
  const spd=bulletSpd()*.85;
  spawnArrow(x,y,0,{vx:dx/len*spd,vy:dy/len*spd,damageScale:scale,life:140,kind});
}
function updateSupportUnits(){
  const drones=supportDroneCount();
  if(drones>0){
    droneTimer++;
    const n=drones;
    if(droneTimer>=Math.max(10,34-n*2)){
      droneTimer=0;
      const droneScale=.42*purchasedDroneDamageMult();
      for(let i=0;i<n;i++){
        const a=frame*.028+i*TAU/n;
        const x=player.x+Math.cos(a)*32, y=player.y+Math.sin(a)*32;
        fireAtTarget(x,y,nearestEnemy(x,y,null,260),droneScale,'drone');
      }
    }
  }
  const bits=interceptorCount();
  if(bits>0){
    bitTimer++;
    const n=bits;
    if(bitTimer>=Math.max(8,28-n*2)){
      bitTimer=0;
      for(let i=0;i<n;i++){
        const a=frame*-.04+i*TAU/n;
        const x=player.x+Math.cos(a)*48, y=player.y+Math.sin(a)*48;
        fireAtTarget(x,y,nearestEnemy(x,y,null,210),.32,'bit');
      }
    }
  }
}
function drawSupportGroup(n,r,color,size,spin){
  n=Math.min(10,n);
  if(n<=0) return;
  ctx.strokeStyle=h2r(color,.18);ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(player.x,player.y,r,0,TAU);ctx.stroke();
  ctx.fillStyle=color;
  for(let i=0;i<n;i++){
    const a=frame*spin+i*TAU/n;
    ctx.beginPath();ctx.arc(player.x+Math.cos(a)*r,player.y+Math.sin(a)*r,size,0,TAU);ctx.fill();
  }
}
function drawSupportUnits(){
  ctx.save();
  drawSupportGroup(supportDroneCount(),32,'#66ccff',4,.028);
  drawSupportGroup(interceptorCount(),48,'#e8e8f0',3,-.04);
  ctx.restore();
}
function updateShield(){
  const max=shieldMax();
  if(max<=0){shield=0;shieldCooldown=0;return;}
  if(shield>max) shield=max;
  if(shield<max){
    if(shieldCooldown>0) shieldCooldown--;
    else shield++;
  }
}
function drawShield(){
  if(shield<=0) return;
  ctx.save();
  ctx.strokeStyle='rgba(0,240,255,.75)';
  ctx.lineWidth=1.5;
  for(let i=0;i<shield;i++){
    ctx.beginPath();ctx.arc(player.x,player.y,24+i*5,0,TAU);ctx.stroke();
  }
  ctx.restore();
}
function drawStasisAura(){
  if(specialLevels.stasisAura<=0) return;
  ctx.save();
  ctx.strokeStyle='rgba(136,170,255,.34)';
  ctx.fillStyle='rgba(136,170,255,.045)';
  ctx.beginPath();ctx.arc(player.x,player.y,stasisRadius(),0,TAU);ctx.fill();ctx.stroke();
  ctx.restore();
}
function blockWithShield(){
  if(shield<=0) return false;
  shield--;
  shieldCooldown=Math.max(120,SHIELD_DELAY-specialLevels.energyShield*12);
  shake(6);
  burst(player.x,player.y,'#00f0ff',18);
  addFloat(player.x,player.y-30,'SHIELD','#00f0ff',12);
  return true;
}

// ─────────────────────────────────────
//  矢
// ─────────────────────────────────────
function spawnArrow(x,y,angle,opts={}){
  if(arrows.length>=MAX_ARROWS) return;
  const spd=bulletSpd(), pw=specialLevels.powerShot>0;
  const vx=opts.vx ?? Math.sin(angle)*spd;
  const vy=opts.vy ?? -Math.cos(angle)*spd;
  const speed=opts.speed??Math.hypot(vx,vy);
  const life=opts.life??240;
  const sizeScale=opts.sizeScale??1;
  arrows.push({x,y,prevX:x,prevY:y,vx,vy,speed,pierced:0,pierceBonus:opts.pierceBonus??0,pw,ricocheted:0,split:opts.split??false,dist:0,life,scanPhase:(shotSeq+arrows.length)&3,damageScale:opts.damageScale??1,sizeScale,hitRadius:opts.hitRadius??(4*sizeScale),kind:opts.kind??'main'});
}
function fireArrows(){
  shotSeq++;
  const n=arrowCnt(), sp=n===1?0:Math.min(.7,.15*n);
  const cx=player.x, cy=player.y-player.size;
  const shipId=activeShipDef().id;
  const sizeScale=gatlingBulletScale();
  const scale=multiShotDamageScale(n)*gatlingDamageScale()*fireCompressionBoost();
  for(let i=0;i<n;i++){
    const off=n===1?0:(i/(n-1)-.5)*sp;
    spawnArrow(cx,cy,off,{damageScale:scale,sizeScale,hitRadius:4*sizeScale});
  }
  if(shipId==='striker'&&shotSeq%4===0){
    spawnArrow(cx,cy,0,{damageScale:scale*3.00,sizeScale:1.45,hitRadius:6.5,kind:'lance'});
  }
  if((shipId==='sniper'||hasMountedPart('railgun'))&&shotSeq%6===0){
    spawnArrow(cx,cy,0,{damageScale:scale*(shipId==='sniper'?4.20:3.40),sizeScale:1.62,hitRadius:7.0,kind:'rail',pierceBonus:3});
  }
  if(hasMountedPart('cannon')&&shotSeq%3===0){
    spawnArrow(cx,cy,0,{damageScale:scale*2.40,sizeScale:1.42,hitRadius:6.2,kind:'lance'});
  }
  if(hasMountedPart('barrel')&&shotSeq%5===0){
    spawnArrow(cx-8,cy,.24,{damageScale:scale*.85,sizeScale:.82,hitRadius:3.4,kind:'needle'});
    spawnArrow(cx+8,cy,-.24,{damageScale:scale*.85,sizeScale:.82,hitRadius:3.4,kind:'needle'});
  }
  playSfx('shot');
}
function splitArrow(a){
  const lv=specialLevels.splitter;
  if(lv<=0) return;
  const n=Math.min(6,2+lv);
  const base=Math.atan2(a.vx,-a.vy);
  const spread=Math.min(1.4,.35+lv*.08);
  const scale=splitDamageScale(a.damageScale,n);
  for(let i=0;i<n;i++){
    const off=n===1?0:(i/(n-1)-.5)*spread;
    const sizeScale=Math.max(.55,(a.sizeScale??1)*.85);
    spawnArrow(a.x,a.y,base+off,{kind:'split',split:true,damageScale:scale,sizeScale,hitRadius:3.2*sizeScale,life:120});
  }
  a.damageScale*=SPLIT_PARENT_RETENTION;
  burst(a.x,a.y,'#b8a7ff',5);
}
function redirectArrowToEnemy(a,fromEnemy){
  const target=nearestEnemy(a.x,a.y,fromEnemy,320);
  if(!target) return false;
  const spd=a.speed;
  const dx=target.x-a.x, dy=target.y-a.y, len=Math.hypot(dx,dy)||1;
  a.vx=dx/len*spd;
  a.vy=dy/len*spd;
  a.speed=spd;
  a.ricocheted++;
  return true;
}
function updateArrows(){
  const hs=homingStr();
  const homingMask=arrows.length>85?3:1;
  for(let i=arrows.length-1;i>=0;i--){
    const a=arrows[i];
    if(hs>0&&enemies.length>0&&a.kind!=='split'&&((frame+(a.scanPhase||0))&homingMask)===0){
      let near=null;
      let nd2=240*240;
      for(let ei=0;ei<enemies.length;ei++){
        const e=enemies[ei];
        if(e.dead) continue;
        const dx=e.x-a.x, dy=e.y-a.y;
        if(dx<-240||dx>240||dy<-240||dy>240) continue;
        const d2=dx*dx+dy*dy;
        if(d2<nd2){nd2=d2;near=e;}
      }
      if(near){
        const dx=near.x-a.x,dy=near.y-a.y,len=Math.hypot(dx,dy)||1;
        const spd=a.speed;
        a.vx+=(dx/len)*hs*1.7; a.vy+=(dy/len)*hs*1.7;
        const ns=Math.sqrt(a.vx*a.vx+a.vy*a.vy)||1;
        a.vx=a.vx/ns*spd; a.vy=a.vy/ns*spd;
      }
    }
    a.prevX=a.x;
    a.prevY=a.y;
    a.x+=a.vx; a.y+=a.vy;
    a.dist+=a.speed;
    a.life--;
    if(specialLevels.ricochet>0&&(a.x<4||a.x>W-4)){a.vx*=-1;a.x=Math.max(4,Math.min(W-4,a.x));a.ricocheted++;}
    if(specialLevels.splitter>0&&!a.split&&a.kind!=='split'&&a.dist>150){
      splitArrow(a);
      a.split=true;
    }
    if(a.life<=0||a.y<-ARROW_DESPAWN_MARGIN||a.y>H+ARROW_DESPAWN_MARGIN||a.x<-ARROW_DESPAWN_MARGIN||a.x>W+ARROW_DESPAWN_MARGIN) removeAtFast(arrows,i);
  }
}
function drawArrows(){
  const simple=projectileLoad()>125;
  for(const a of arrows){
    const palette=a.pw
      ? {core:'#fff1d0',main:'#ff7a24',soft:'255,120,36'}
      : a.kind==='split'
        ? {core:'#e6fbff',main:'#b8a7ff',soft:'184,167,255'}
        : a.kind==='drone'
          ? {core:'#e8fbff',main:'#66ccff',soft:'102,204,255'}
          : a.kind==='bit'
            ? {core:'#ffffff',main:'#c8d8ff',soft:'200,216,255'}
            : a.kind==='lance'
              ? {core:'#eef7ff',main:'#ff3b62',soft:'255,59,98'}
              : a.kind==='rail'
                ? {core:'#ffffff',main:'#eef7ff',soft:'238,247,255'}
              : a.kind==='needle'
                ? {core:'#eef7ff',main:'#b8a7ff',soft:'184,167,255'}
                : {core:'#e8fbff',main:'#00f0ff',soft:'0,240,255'};
    const spd=a.speed||1;
    const ux=a.vx/spd, uy=a.vy/spd, px=-uy, py=ux;
    const sizeScale=a.sizeScale??1;
    const tail=(a.pw?13:9)*sizeScale;
    const wing=(a.pw?4.2:3)*sizeScale;
    const len=(a.pw?10:7.5)*sizeScale;
    const nose=(a.pw?4.2:2.8)*sizeScale;
    const backX=a.x-ux*len, backY=a.y-uy*len;
    const tailX=a.x-ux*tail, tailY=a.y-uy*tail;

    if(simple&&(a.kind==='main'||a.kind==='drone'||a.kind==='bit'||a.kind==='needle')&&!a.pw){
      ctx.fillStyle=palette.main;
      const s=Math.max(2.4,3.2*sizeScale);
      ctx.fillRect(a.x-s*.5,a.y-s*.5,s,s);
      continue;
    }

    ctx.strokeStyle=`rgba(${palette.soft},${a.pw?.40:.28})`;
    ctx.lineWidth=(a.pw?2.4:1.5)*sizeScale;
    ctx.beginPath();ctx.moveTo(a.prevX??tailX,a.prevY??tailY);ctx.lineTo(a.x-ux*2*sizeScale,a.y-uy*2*sizeScale);ctx.stroke();

    ctx.fillStyle=palette.main;
    ctx.beginPath();
    ctx.moveTo(a.x+ux*nose,a.y+uy*nose);
    ctx.lineTo(backX+px*wing,backY+py*wing);
    ctx.lineTo(backX-px*wing,backY-py*wing);
    ctx.closePath();
    ctx.fill();
  }
}
function bossBulletDamage(tier){
  return Math.ceil((BOSS_BULLET_BASE_DAMAGE+tier*BOSS_BULLET_DAMAGE_STEP)*Math.pow(1.018,wave-1));
}
const BOSS_ARCHETYPES=[
  {id:'duelist',name:'SCARLET DUELIST',color:HOYO_UI.rose,shape:'hex',rgb:[255,59,98],hp:1.00,size:0,targetY:108,shot:1.00,move:'weave'},
  {id:'helix',name:'HELIX ORACLE',color:HOYO_UI.gold,shape:'circle',rgb:[184,167,255],hp:1.12,size:-2,targetY:118,shot:.86,move:'orbit'},
  {id:'sniper',name:'RAIL EXECUTOR',color:HOYO_UI.blue,shape:'tri',rgb:[30,214,255],hp:.92,size:-4,targetY:96,shot:.78,move:'stalker'},
  {id:'wall',name:'BULWARK GATE',color:HOYO_UI.jade,shape:'rect',rgb:[54,243,155],hp:1.28,size:6,targetY:126,shot:1.08,move:'gate'},
  {id:'warden',name:'GRAVITY WARDEN',color:'#b96cff',shape:'hex',rgb:[185,108,255],hp:1.45,size:4,targetY:112,shot:1.18,move:'drift'},
];
function bossArchetypeForWave(w=wave){
  const tier=bossTierForWave(w);
  return BOSS_ARCHETYPES[(tier-1)%BOSS_ARCHETYPES.length];
}
function spawnEnemyBullet(x,y,angle,speed,damage,size=5,color=HOYO_UI.rose,kind='aimed',extra=null){
  if(enemyBullets.length>=MAX_ENEMY_BULLETS) removeAtFast(enemyBullets,0);
  enemyBullets.push({
    x,y,prevX:x,prevY:y,
    vx:Math.cos(angle)*speed,
    vy:Math.sin(angle)*speed,
    speed,damage,size,color,kind,
    life:220,
    ...(extra||{})
  });
}
function fireBossFan(boss,base,count,spread,speed,dmg,size,color,kind='aimed'){
  for(let i=0;i<count;i++){
    const off=count===1?0:(i/(count-1)-.5)*spread;
    spawnEnemyBullet(boss.x,boss.y+boss.size*.55,base+off,speed,dmg,size,color,kind);
  }
}
function fireBossRing(boss,count,rot,speed,dmg,size,color,kind='ring',extra=null){
  for(let i=0;i<count;i++) spawnEnemyBullet(boss.x,boss.y,rot+i*TAU/count,speed,dmg,size,color,kind,extra);
}
function fireBossPatternDuelist(boss,base,tier,dmg){
  const count=Math.min(9,3+Math.floor(tier/3));
  const spread=Math.min(.82,.18+tier*.035);
  fireBossFan(boss,base,count,spread,2.1+tier*.13,dmg,5.2,boss.color,'aimed');
  if(boss.volley%4===0){
    fireBossRing(boss,Math.min(18,8+tier),frame*.035+boss.phase,1.55+tier*.07,Math.ceil(dmg*.72),4.4,HOYO_UI.gold,'ring');
    shake(4);
  }
}
function fireBossPatternHelix(boss,base,tier,dmg){
  const arms=Math.min(4,2+Math.floor(tier/4));
  const rot=frame*.085+boss.phase+boss.volley*.42;
  for(let i=0;i<arms;i++){
    const a=rot+i*TAU/arms;
    spawnEnemyBullet(boss.x,boss.y,a,1.75+tier*.08,Math.ceil(dmg*.72),4.6,boss.color,'ring');
    if(boss.volley%2===0) spawnEnemyBullet(boss.x,boss.y,a+Math.PI/(arms||1),1.22+tier*.05,Math.ceil(dmg*.58),3.8,HOYO_UI.gold,'ring');
  }
  if(boss.volley%3===0) fireBossFan(boss,base,3,.18,2.45+tier*.09,dmg,4.6,HOYO_UI.rose,'aimed');
}
function fireBossPatternSniper(boss,base,tier,dmg){
  const speed=3.05+tier*.16;
  const burstCount=3+(tier>=5?1:0);
  for(let i=0;i<burstCount;i++){
    const off=(i-(burstCount-1)/2)*.045;
    spawnEnemyBullet(boss.x,boss.y+boss.size*.38,base+off,speed+i*.18,Math.ceil(dmg*1.25),4.2,boss.color,'needle',{life:190});
  }
  if(boss.volley%3===0){
    const n=Math.min(8,4+Math.floor(tier/2));
    for(let i=0;i<n;i++){
      const x=28+i*(W-56)/Math.max(1,n-1);
      const a=Math.PI/2+(Math.sin(frame*.04+i)*.10);
      spawnEnemyBullet(x,42,a,2.15+tier*.08,Math.ceil(dmg*.72),3.8,HOYO_UI.gold,'needle',{life:230});
    }
    shake(5);
  }
}
function fireBossPatternWall(boss,base,tier,dmg){
  const lanes=Math.min(7,4+Math.floor(tier/3));
  const gap=(W-68)/Math.max(1,lanes-1);
  const offset=(boss.volley%2)*gap*.5;
  for(let i=0;i<lanes;i++){
    const x=34+((i*gap+offset)%(W-68));
    const sway=(i%2?-.11:.11)+Math.sin(frame*.025+i)*.04;
    spawnEnemyBullet(x,boss.y+boss.size*.15,Math.PI/2+sway,1.7+tier*.08,Math.ceil(dmg*.78),5.4,boss.color,'ring');
  }
  if(boss.volley%2===0) fireBossFan(boss,base,3,.34,2.35+tier*.07,dmg,4.8,HOYO_UI.rose,'aimed');
}
function fireBossPatternWarden(boss,base,tier,dmg){
  const orbCount=Math.min(3,1+Math.floor(tier/3));
  for(let i=0;i<orbCount;i++){
    const a=base+(i-(orbCount-1)/2)*.24;
    spawnEnemyBullet(boss.x,boss.y+boss.size*.4,a,1.55+tier*.045,Math.ceil(dmg*1.05),6.8,boss.color,'orb',{turn:.018,life:220});
  }
  if(boss.volley%3===0){
    fireBossRing(boss,Math.min(14,8+tier),-frame*.045+boss.phase,1.18+tier*.05,Math.ceil(dmg*.66),4.7,HOYO_UI.gold,'ring');
    shake(4);
  }
}
function fireBossPattern(boss){
  const tier=boss.tier || bossTierForWave();
  const dx=player.x-boss.x, dy=player.y-boss.y;
  const base=Math.atan2(dy,dx);
  const dmg=bossBulletDamage(tier);
  boss.volley=(boss.volley||0)+1;
  if(boss.bossType==='helix') fireBossPatternHelix(boss,base,tier,dmg);
  else if(boss.bossType==='sniper') fireBossPatternSniper(boss,base,tier,dmg);
  else if(boss.bossType==='wall') fireBossPatternWall(boss,base,tier,dmg);
  else if(boss.bossType==='warden') fireBossPatternWarden(boss,base,tier,dmg);
  else fireBossPatternDuelist(boss,base,tier,dmg);
  playSfx('shot');
}
function updateBoss(boss,slow=1){
  const amp=Math.min(116,54+boss.tier*7);
  let homeX=W/2+Math.sin(frame*.018+boss.phase)*amp;
  if(boss.moveType==='orbit') homeX=W/2+Math.sin(frame*.026+boss.phase)*Math.min(130,74+boss.tier*8);
  else if(boss.moveType==='stalker') homeX=Math.max(54,Math.min(W-54,player.x+Math.sin(frame*.035+boss.phase)*34));
  else if(boss.moveType==='gate'){
    boss.drift=(boss.drift||1);
    homeX=boss.x+boss.drift*(1.2+boss.tier*.08);
    if(homeX<54||homeX>W-54){boss.drift*=-1;homeX=Math.max(54,Math.min(W-54,homeX));}
  }else if(boss.moveType==='drift') homeX=W/2+Math.sin(frame*.012+boss.phase)*Math.min(92,48+boss.tier*6)+Math.sin(frame*.037)*22;
  boss.x+=(homeX-boss.x)*(boss.moveType==='gate'?.18:.022)*slow;
  if(boss.y<boss.targetY) boss.y+=boss.vy*slow;
  else boss.y+=Math.sin(frame*.045+boss.phase)*.18*slow;
  boss.rot+=boss.rotSpd*slow;
  if(boss.y<34) return;
  boss.shotTimer=(boss.shotTimer??60)-slow;
  if(boss.shotTimer<=0){
    fireBossPattern(boss);
    boss.shotTimer=Math.max(28,(78-boss.tier*3)*(boss.shotRate||1));
  }
}
function updateEnemyBullets(){
  for(let i=enemyBullets.length-1;i>=0;i--){
    const b=enemyBullets[i];
    b.prevX=b.x;
    b.prevY=b.y;
    if(b.turn&&(frame&1)===0){
      const desired=Math.atan2(player.y-b.y,player.x-b.x);
      const current=Math.atan2(b.vy,b.vx);
      let diff=((desired-current+Math.PI*3)%TAU)-Math.PI;
      diff=Math.max(-b.turn,Math.min(b.turn,diff));
      const next=current+diff;
      const speed=Math.hypot(b.vx,b.vy)||b.speed||1;
      b.vx=Math.cos(next)*speed;
      b.vy=Math.sin(next)*speed;
    }
    b.x+=b.vx;
    b.y+=b.vy;
    b.life--;
    if(b.life<=0||b.x<-30||b.x>W+30||b.y<-40||b.y>H+44) removeAtFast(enemyBullets,i);
  }
}
function drawEnemyBullets(){
  ctx.save();
  ctx.shadowBlur=0;
  const simple=enemyBullets.length>64;
  for(const b of enemyBullets){
    const col=b.color||HOYO_UI.rose;
    ctx.fillStyle=col;
    if(simple){
      const s=b.size*1.25;
      ctx.fillRect(b.x-s*.5,b.y-s*.5,s,s);
    }else if(b.kind==='orb'){
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.size,0,TAU);
      ctx.fill();
    }else if(b.kind==='ring'){
      const s=b.size*1.35;
      ctx.fillRect(b.x-s*.5,b.y-s*.5,s,s);
    }else if(b.kind==='needle'){
      ctx.fillRect(b.x-b.size*1.55,b.y-b.size*.28,b.size*3.1,b.size*.56);
    }else{
      const s=b.size*1.15;
      ctx.fillRect(b.x-s*.5,b.y-s*.5,s,s);
    }
  }
  ctx.restore();
}

// ─────────────────────────────────────
//  敵
// ─────────────────────────────────────
const SHAPES=['tri','rect','hex','circle'];
const SHAPE_PROPS={
  tri:    { hpMult:.8,  spdMult:1.3, sizeAdj:-2, rewardMult:.88, r:200,g:80, b:80  },
  rect:   { hpMult:1.0, spdMult:1.0, sizeAdj:0,  rewardMult:1.00, r:80, g:160,b:220 },
  hex:    { hpMult:1.6, spdMult:.8,  sizeAdj:4,  rewardMult:1.28, r:160,g:60, b:220 },
  circle: { hpMult:.7,  spdMult:1.1, sizeAdj:-3, rewardMult:.76, r:220,g:160,b:40  },
};
function enemyHpCurve(wB){
  const base=ENEMY_HP_BASE+wB*ENEMY_HP_LINEAR+wB*wB*ENEMY_HP_QUAD;
  const early=Math.pow(ENEMY_HP_EXP,wB);
  const late=Math.pow(ENEMY_HP_LATE_EXP,Math.max(0,wB-ENEMY_HP_LATE_START));
  const brutal=Math.pow(ENEMY_HP_BRUTAL_EXP,Math.max(0,wB-ENEMY_HP_BRUTAL_START));
  return base*early*late*brutal;
}
function bossTierForWave(w=wave){
  return Math.max(1,Math.floor(w/BOSS_WAVE_INTERVAL));
}
function spawnBoss(){
  const wB=wave-1, tier=bossTierForWave();
  const type=bossArchetypeForWave(wave);
  const size=Math.min(72,42+tier*3+(type.size||0));
  const hpCurve=enemyHpCurve(wB);
  const baseHp=Math.floor(hpCurve*(BOSS_HP_MULT+tier*2.5)*(type.hp||1));
  const x=W/2, y=-size*2;
  const scoreValue=Math.max(5000,Math.floor(baseHp*1.65+wave*900));
  const xpValue=Math.max(120,Math.floor(80+wave*18+Math.sqrt(baseHp)*2.8));
  const orbValue=Math.max(18,Math.floor(14+tier*4+Math.sqrt(baseHp)/80));
  const contactDamage=Math.ceil((88+tier*22)*Math.pow(ENEMY_CONTACT_EXP,wB)*BOSS_CONTACT_MULT);
  const [r,g,b]=type.rgb;
  enemies.push({
    x,y,vx:0,vy:.82,hp:baseHp,maxHp:baseHp,xpValue,scoreValue,orbValue,contactDamage,
    hasCore:true,shape:type.shape,size,r,g,b,flash:0,rot:0,rotSpd:.014,dead:false,
    boss:true,bossWave:wave,tier,bossType:type.id,bossName:type.name,color:type.color,moveType:type.move,
    targetY:type.targetY,phase:Math.random()*TAU,shotTimer:80,shotRate:type.shot,volley:0,drift:Math.random()<.5?-1:1
  });
  waveBanner=150;
  shake(9);
  addFloat(W/2,112,`${type.name}  WAVE ${wave}`,type.color,16);
  playSfx('dead');
}
function spawnEnemy(){
  const wB=wave-1;
  const shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
  const p=SHAPE_PROPS[shape];
  const base=12+Math.random()*14;
  const size=Math.floor(base*(1+p.sizeAdj*.1));
  const hpCurve=enemyHpCurve(wB);
  const sizeScale=Math.max(.55,Math.min(1.75,size/20));
  const hpSizeMult=Math.pow(sizeScale,1.55);
  const rewardMult=p.rewardMult*Math.pow(sizeScale,1.05);
  const hasCore=size>=(shape==='tri'?22:18);
  const corelessMult=hasCore?1.12:.34;
  const baseHp=Math.max(5,Math.floor((hpCurve+Math.random()*22)*p.hpMult*hpSizeMult*corelessMult));
  const smallRewardScale=hasCore?1:.70;
  const xpValue=Math.max(1,Math.floor((7+wave*2.4+Math.sqrt(baseHp)*1.45)*rewardMult*smallRewardScale));
  const scoreValue=Math.max(8,Math.floor((baseHp*.90+wave*18)*rewardMult*smallRewardScale));
  const orbValue=Math.max(1,Math.floor(1+Math.sqrt(baseHp)*rewardMult*smallRewardScale/5.6));
  const contactDamage=Math.ceil((hasCore?28:10)*(1+wB*.055)*Math.pow(ENEMY_CONTACT_EXP,wB));
  const spd=(1.05+Math.random()*.6+wB*.11)*p.spdMult;
  const x=size+10+Math.random()*(W-(size+10)*2);
  const rot=Math.random()*Math.PI*2;
  const rotSpd=(Math.random()<.5?-1:1)*(.006+Math.random()*.012);
  enemies.push({x,y:-size*2,vx:(Math.random()-.5)*.6,vy:spd,hp:baseHp,maxHp:baseHp,xpValue,scoreValue,orbValue,contactDamage,hasCore,shape,size,r:p.r,g:p.g,b:p.b,flash:0,rot,rotSpd,dead:false});
}
function drawBossHpBar(e){
  const pct=Math.max(0,Math.min(1,e.hp/e.maxHp));
  const x=28,y=58,w=W-56,h=10;
  const accent=e.color||HOYO_UI.rose;
  ctx.save();
  ctx.fillStyle='rgba(5,6,7,.82)';
  ctx.fillRect(x,y,w,h);
  const g=ctx.createLinearGradient(x,y,x+w,y);
  g.addColorStop(0,accent);
  g.addColorStop(.55,HOYO_UI.gold);
  g.addColorStop(1,'#eef7ff');
  ctx.fillStyle=g;
  ctx.fillRect(x,y,w*pct,h);
  ctx.strokeStyle=h2r(accent,.74);
  ctx.lineWidth=1.2;
  ctx.strokeRect(x-.5,y-.5,w+1,h+1);
  ctx.font=`900 10px ${UI_FONT}`;
  ctx.textAlign='center';
  ctx.textBaseline='bottom';
  ctx.fillStyle=HOYO_UI.text;
  ctx.shadowColor=accent;
  ctx.shadowBlur=5;
  ctx.fillText(`${e.bossName||'BOSS'}  WAVE ${e.bossWave}`,W/2,y-4);
  ctx.restore();
}
function drawEnemy(e){
  const{x,y,size,shape,r,g,b,hp,maxHp,flash,rot=0}=e;
  const fl=flash>0;
  const hpPct=Math.max(0,Math.min(1,hp/maxHp));
  const col=`rgb(${r},${g},${b})`;
  const fill=fl?'rgba(255,255,255,.9)':`rgba(${r},${g},${b},.50)`;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rot);
  ctx.shadowColor=fl?'#fff':col; ctx.shadowBlur=fl?14:0;
  ctx.strokeStyle=fl?'#fff':col;
  ctx.fillStyle=fill;
  ctx.lineWidth=1.4;
  const hasCore=e.hasCore ?? size>=(shape==='tri'?22:18);
  const bodyInner=hasCore?Math.max(10,size*.48):0;
  const spokeFrom=hasCore?bodyInner:0;
  ctx.shadowBlur=fl?14:(hasCore?6:2);

  if(e.boss){
    const pulse=.62+Math.sin(frame*.075+e.phase)*.38;
    const accent=e.color||HOYO_UI.rose;
    const reducedBossDetail=state==='play'&&projectileLoad()>115;
    ctx.save();
    ctx.shadowColor=accent;
    ctx.shadowBlur=24;
    ctx.strokeStyle=h2r(accent,.32+pulse*.28);
    ctx.lineWidth=2.4;
    ctx.beginPath();
    ctx.arc(0,0,size+9+pulse*5,0,TAU);
    ctx.stroke();
    if(!reducedBossDetail){
      ctx.rotate(-rot+frame*.013);
      ctx.strokeStyle=h2r(e.bossType==='helix'?accent:HOYO_UI.gold,.30);
      ctx.lineWidth=1.4;
      const sigils=e.bossType==='sniper'?3:(e.bossType==='wall'?4:8);
      for(let i=0;i<sigils;i++){
        const a=i*TAU/sigils;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*(size+15),Math.sin(a)*(size+15));
        ctx.lineTo(Math.cos(a+TAU/(sigils*2))*(size+24),Math.sin(a+TAU/(sigils*2))*(size+24));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  if(shape==='circle'){
    ctx.beginPath();ctx.arc(0,0,size,0,Math.PI*2);ctx.fill();ctx.stroke();
    if(hasCore){
      ctx.strokeStyle=`rgba(${r},${g},${b},.36)`;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(0,0,(bodyInner+size)*.5,0,Math.PI*2);ctx.stroke();
    }
  }else{
    const sides=shape==='tri'?3:(shape==='rect'?4:6);
    const offset=shape==='rect'?Math.PI/4:(shape==='tri'?-Math.PI/2:-Math.PI/6);
    ctx.beginPath();
    for(let i=0;i<sides;i++){
      const a=offset+i*Math.PI*2/sides;
      i===0?ctx.moveTo(size*Math.cos(a),size*Math.sin(a)):ctx.lineTo(size*Math.cos(a),size*Math.sin(a));
    }
    ctx.closePath();ctx.fill();ctx.stroke();
    if(hasCore){
      ctx.strokeStyle=`rgba(${r},${g},${b},.42)`;ctx.lineWidth=1;
      for(let i=0;i<sides;i++){
        const a=offset+i*Math.PI*2/sides;
        ctx.beginPath();
        ctx.moveTo(spokeFrom*Math.cos(a),spokeFrom*Math.sin(a));
        ctx.lineTo(size*Math.cos(a),size*Math.sin(a));
        ctx.stroke();
      }
    }
  }
  ctx.rotate(-rot);
  if(!hasCore){
    ctx.restore();
    if(e.flash>0) e.flash--;
    return;
  }
  const coreY=0;
  const coreR=Math.max(4.5,Math.min(8,size*.34));
  const hpStage=hpPct>.66?3:(hpPct>.33?2:(hpPct>.12?1:0));
  const coreScale=[.54,.68,.84,1][hpStage];
  const coreColor=fl?'255,255,255':`${r},${g},${b}`;
  ctx.shadowBlur=0;
  ctx.fillStyle='rgba(6,6,14,.84)';
  ctx.beginPath();ctx.arc(0,coreY,coreR+5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=`rgba(${coreColor},${hpStage===0?.34:.48})`;
  ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(0,coreY,coreR+4,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle=`rgba(${coreColor},${hpStage===0?.48:.82})`;
  ctx.beginPath();ctx.arc(0,coreY,coreR*coreScale,0,Math.PI*2);ctx.fill();
  if(hpStage>=2){
    ctx.strokeStyle='rgba(232,232,240,.18)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,coreY,coreR*(hpStage===3?1.35:1.18),0,Math.PI*2);ctx.stroke();
  }
  if(hpStage<=1){
    ctx.strokeStyle=`rgba(${coreColor},.72)`;ctx.lineWidth=1;
    const crack=coreR*(hpStage===0?.95:.72);
    ctx.beginPath();ctx.moveTo(-crack*.55,coreY-crack*.36);ctx.lineTo(-crack*.12,coreY+crack*.08);ctx.lineTo(crack*.18,coreY-crack*.02);ctx.stroke();
    ctx.beginPath();ctx.moveTo(crack*.52,coreY-crack*.28);ctx.lineTo(crack*.18,coreY+crack*.18);ctx.lineTo(crack*.46,coreY+crack*.42);ctx.stroke();
  }
  if(hpStage===0){
    ctx.fillStyle=`rgba(${coreColor},.34)`;
    ctx.fillRect(-coreR*.9,coreY+coreR*.95,coreR*.55,1);
    ctx.fillRect(coreR*.25,coreY-coreR*1.1,coreR*.62,1);
  }
  ctx.restore();
  if(e.boss) drawBossHpBar(e);
  if(e.flash>0) e.flash--;
}

// ─────────────────────────────────────
//  パーティクル
// ─────────────────────────────────────
function burst(x,y,color,n){
  const cnt=Math.min(Math.ceil(n*.45*effectLoadScale()), MAX_PARTICLES-particles.length);
  for(let i=0;i<cnt;i++){
    const angle=Math.random()*Math.PI*2, spd=1+Math.random()*3.5;
    particles.push({x,y,vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,life:28+Math.random()*22,maxLife:50,color,size:1.5+Math.random()*2});
  }
}
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.89;p.vy*=.89;p.life--;
    if(p.life<=0) removeAtFast(particles,i);
  }
}
function drawParticles(){
  for(const p of particles){
    ctx.globalAlpha=p.life/p.maxLife; ctx.fillStyle=p.color;
    const s=p.size;
    ctx.fillRect(p.x-s*.5,p.y-s*.5,s,s);
  }
  ctx.globalAlpha=1;
}

// ─────────────────────────────────────
//  EPオーブ
// ─────────────────────────────────────
function spawnEpOrbs(x,y,n){
  const cnt=Math.min(Math.ceil(n*effectLoadScale()), MAX_EP_ORBS-epOrbs.length);
  for(let i=0;i<cnt;i++){
    const angle=Math.random()*Math.PI*2, spd=1.5+Math.random()*2.5;
    epOrbs.push({x,y,prevX:x,prevY:y,vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,delay:6+Math.floor(Math.random()*16),size:2.3+Math.random()*1.5});
  }
}
function updateEpOrbs(){
  for(let i=epOrbs.length-1;i>=0;i--){
    const o=epOrbs[i];
    o.prevX=o.x;
    o.prevY=o.y;
    const dx=player.x-o.x, dy=player.y-o.y, dist2=dx*dx+dy*dy;
    if(dist2<16*16 || (dist2<28*28 && o.vx*o.vx+o.vy*o.vy>7*7)){
      removeAtFast(epOrbs,i);
      continue;
    }
    if(o.delay>0){o.delay--;o.vx*=.86;o.vy*=.86;}
    else{
      const dist=Math.sqrt(dist2)||1;
      const pull=Math.min(1.8,.75+dist/140);
      o.vx+=(dx/dist)*pull; o.vy+=(dy/dist)*pull;
      const s2=o.vx*o.vx+o.vy*o.vy;if(s2>10*10){const s=Math.sqrt(s2);o.vx=o.vx/s*10;o.vy=o.vy/s*10;}
    }
    o.x+=o.vx; o.y+=o.vy;
    if(distSq(o.x,o.y,player.x,player.y)<20*20) removeAtFast(epOrbs,i);
  }
}
function drawEpOrbs(){
  for(const o of epOrbs){
    ctx.strokeStyle='rgba(0,220,100,.24)';
    ctx.lineWidth=Math.max(1,o.size*.55);
    ctx.beginPath();ctx.moveTo(o.prevX,o.prevY);ctx.lineTo(o.x,o.y);ctx.stroke();
    ctx.fillStyle='#66ffbb';
    ctx.beginPath();ctx.arc(o.x,o.y,o.size,0,Math.PI*2);ctx.fill();
  }
}

// ─────────────────────────────────────
//  フローティングテキスト
// ─────────────────────────────────────
function updateFloatTexts(){
  for(let i=floatTexts.length-1;i>=0;i--){
    const t=floatTexts[i];t.y+=t.vy;t.life--;
    if(t.life<=0) removeAtFast(floatTexts,i);
  }
}
function drawFloatTexts(){
  for(const t of floatTexts){
    ctx.globalAlpha=t.life/t.maxLife;
    ctx.save();
    ctx.font=`bold ${t.size}px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=t.color;ctx.fillText(t.text,t.x,t.y);
    ctx.restore();
  }
  ctx.globalAlpha=1;
}

// ─────────────────────────────────────
//  ゲーム内アップグレード
// ─────────────────────────────────────
function basicSkillDef(id){
  return BASIC_STAT_BY_ID[id] || BASIC_STAT_DEFS[0];
}
function basicSkillNodeAt(cx,cy){
  for(let i=0;i<BASIC_STAT_DEFS.length;i++){
    const r=upgradeCardRect(i);
    if(cx>=r.x&&cx<=r.x+r.w&&cy>=r.y&&cy<=r.y+r.h) return { id:BASIC_STAT_DEFS[i].id };
  }
  return null;
}
function basicSkillUnlocked(n){
  return !!n;
}
function basicSkillValue(id){
  if(id==='fireRate') return fireRateReadout();
  if(id==='regen') return `${regenPerSec().toFixed(1)}HP/s`;
  if(id==='critChance') return critReadout();
  if(id==='critDamage') return fmtMult(critDamage());
  if(id==='hp') return fmtMult(maxHp/100);
  if(id==='range') return `${Math.round(damageFalloffRange())}`;
  return fmtMult(statMult(id));
}
function applyBasicSkill(id){
  const d=basicSkillDef(id);
  const gainText=basicGainText(id);
  statLevels[id]++;
  if(id==='hp'){
    const oldMax=maxHp;
    maxHp=Math.ceil(maxHp*BASIC_STAT_GROWTH);
    hp=Math.min(maxHp,hp+(maxHp-oldMax));
  }
  shake(5);
  burst(player.x,player.y,d.color,16);
  playSfx('upgrade');
  addFloat(player.x,player.y-30,`${d.icon} ${d.name} ${gainText}`,d.color,12);
}
function spendBasicSkill(id){
  const d=basicSkillDef(id);
  if(!d || skillPoints<=0) return false;
  skillPoints--;
  applyBasicSkill(id);
  return true;
}
function grantSkillPoint(amount=1){
  skillPoints+=amount;
  addFloat(W/2,116,`SP +${amount}`,'#b8a7ff',13);
  playSfx('special');
}
function openSkillTree(){
  if(state!=='play') return;
  state='skillTree';
  stopTouchMove();
  activePointerId=null;
  playSfx('select');
}
function closeSkillTree(){
  state='play';
  playSfx('select');
}
function hitSkillOpen(cx,cy){
  return cx>=SKILL_BTN.x&&cx<=SKILL_BTN.x+SKILL_BTN.w&&cy>=SKILL_BTN.y&&cy<=SKILL_BTN.y+SKILL_BTN.h;
}
function hitSkillClose(cx,cy){
  return cx>=SKILL_CLOSE_BTN.x&&cx<=SKILL_CLOSE_BTN.x+SKILL_CLOSE_BTN.w&&cy>=SKILL_CLOSE_BTN.y&&cy<=SKILL_CLOSE_BTN.y+SKILL_CLOSE_BTN.h;
}
function handleSkillTreeClick(cx,cy){
  const n=basicSkillNodeAt(cx,cy);
  if(n){
    if(spendBasicSkill(n.id)) return true;
    const d=basicSkillDef(n.id);
    addFloat(W/2,H-112,'SP不足',d.color,11);
    shake(3);
    return true;
  }
  if(hitSkillClose(cx,cy)){closeSkillTree();return true;}
  return false;
}
function rollBasicUpgradeOptions(){
  let pool=BASIC_STAT_DEFS.filter(d=>d.id!=='critDamage'||effectiveStatLevel('critChance')>0);
  if(pool.length<3) pool=[...BASIC_STAT_DEFS];
  pool=[...pool];
  for(let i=pool.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [pool[i],pool[j]]=[pool[j],pool[i]];
  }
  return pool.slice(0,3);
}
function spawnUpgradeZones(){
  if(upgradeZones.length>0) return;
  const xs=[W*.22,W*.5,W*.78];
  const opts=rollBasicUpgradeOptions();
  upgradeZones=opts.map((d,i)=>({
    id:d.id,
    x:xs[i]-UPGRADE_ZONE.w/2,
    y:-UPGRADE_ZONE.h,
    w:UPGRADE_ZONE.w,
    h:UPGRADE_ZONE.h,
    vy:UPGRADE_ZONE.vy,
    pulse:Math.random()*Math.PI*2
  }));
  addFloat(W/2,118,'ベースアップ','#e8e8f0',10);
}
function upgradeZoneHit(z){
  const nx=Math.max(z.x+8,Math.min(player.x,z.x+z.w-8));
  const ny=Math.max(z.y+8,Math.min(player.y,z.y+z.h-8));
  return Math.hypot(player.x-nx,player.y-ny)<player.size+3;
}
function updateUpgradeZones(){
  if(upgradeZones.length===0) return;
  for(const z of upgradeZones){
    z.y+=z.vy;
    z.pulse+=.08;
    if(upgradeZoneHit(z)){
      const d=basicSkillDef(z.id);
      applyBasicSkill(z.id);
      burst(z.x+z.w/2,z.y+z.h/2,d.color,18);
      addFloat(W/2,132,'ベースアップ',d.color,11);
      upgradeZones=[];
      return;
    }
  }
  if(upgradeZones.every(z=>z.y>UPGRADE_ZONE.missY)){
    upgradeZones=[];
    addFloat(W/2,132,'取り逃し','rgba(232,232,240,.70)',11);
  }
}
function drawUpgradeZones(){
  if(upgradeZones.length===0) return;
  ctx.save();
  const minX=Math.min(...upgradeZones.map(z=>z.x));
  const maxX=Math.max(...upgradeZones.map(z=>z.x+z.w));
  const y=upgradeZones[0].y;
  const h=upgradeZones[0].h;
  const topFade=ctx.createLinearGradient(0,y-28,0,y+16);
  topFade.addColorStop(0,'rgba(6,6,14,0)');
  topFade.addColorStop(1,'rgba(6,6,14,.64)');
  ctx.fillStyle=topFade;ctx.fillRect(0,y-28,W,44);
  ctx.fillStyle='rgba(6,6,14,.42)';ctx.fillRect(0,y+16,W,h-32);
  const bottomFade=ctx.createLinearGradient(0,y+h-16,0,y+h+28);
  bottomFade.addColorStop(0,'rgba(6,6,14,.64)');
  bottomFade.addColorStop(1,'rgba(6,6,14,0)');
  ctx.fillStyle=bottomFade;ctx.fillRect(0,y+h-16,W,44);
  ctx.strokeStyle='rgba(232,232,240,.08)';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(minX-12,y+13);ctx.lineTo(maxX+12,y+13);
  ctx.moveTo(minX-12,y+h-13);ctx.lineTo(maxX+12,y+h-13);
  ctx.stroke();

  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.30)';
  ctx.fillText('ベースアップをセレクト',W/2,y+4);

  for(const z of upgradeZones){
    const d=basicSkillDef(z.id), lv=statLevels[z.id]||0;
    const cx=z.x+z.w/2;
    const pulse=.5+Math.sin(z.pulse)*.5;
    const x=z.x+6, yy=z.y+18, w=z.w-12, hh=z.h-28;
    const card=ctx.createLinearGradient(0,yy,0,yy+hh);
    card.addColorStop(0,h2r(d.color,.11+pulse*.03));
    card.addColorStop(.42,'rgba(12,16,26,.90)');
    card.addColorStop(1,'rgba(5,7,12,.90)');
    ctx.fillStyle=card;
    ctx.fillRect(x,yy,w,hh);
    ctx.strokeStyle=h2r(d.color,.52+pulse*.18);
    ctx.lineWidth=1.5;
    ctx.strokeRect(x,yy,w,hh);

    ctx.fillStyle=h2r(d.color,.70+pulse*.14);
    ctx.fillRect(x,yy,4,hh);
    ctx.fillRect(x,yy,w,2);
    ctx.strokeStyle='rgba(232,232,240,.055)';
    ctx.lineWidth=.8;
    for(let ly=yy+10;ly<yy+hh-8;ly+=10){
      ctx.beginPath();
      ctx.moveTo(x+10,ly);
      ctx.lineTo(x+w-10,ly);
      ctx.stroke();
    }

    const ringR=23+pulse*1.6;
    ctx.beginPath();
    ctx.arc(cx,yy+34,ringR,0,Math.PI*2);
    ctx.fillStyle=h2r(d.color,.10+pulse*.03);
    ctx.fill();
    ctx.strokeStyle=h2r(d.color,.46+pulse*.20);
    ctx.lineWidth=1.2;
    ctx.stroke();

    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=d.icon.length>1?'bold 24px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif':'31px serif';
    ctx.fillStyle=h2r(d.color,.95);
    ctx.shadowColor=d.color;ctx.shadowBlur=6+pulse*4;
    ctx.fillText(d.icon,cx,yy+34);
    ctx.shadowBlur=0;

    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle='rgba(232,232,240,.62)';
    ctx.fillText(d.name,cx,yy+62);

    const pillW=58,pillH=15,pillX=cx-pillW/2,pillY=yy+hh-20;
    rr(pillX,pillY,pillW,pillH,3);
    ctx.fillStyle='rgba(232,232,240,.055)';
    ctx.fill();
    ctx.strokeStyle=h2r(d.color,.26);
    ctx.lineWidth=1;
    rr(pillX,pillY,pillW,pillH,3);
    ctx.stroke();
    ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle=h2r(d.color,.78);
    ctx.fillText(`Lv.${lv}  ${basicGainText(z.id,lv)}`,cx,pillY+pillH/2+1);
  }
  ctx.restore();
}
function drawSkillTree(){
  ctx.save();
  ctx.fillStyle='rgba(5,6,7,.97)';
  ctx.fillRect(0,0,W,H);

  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'rgba(184,167,255,.13)');
  bg.addColorStop(.38,'rgba(30,214,255,.045)');
  bg.addColorStop(.72,'rgba(255,59,98,.040)');
  bg.addColorStop(1,'rgba(5,6,7,0)');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(238,247,255,.045)';ctx.lineWidth=1;
  for(let y=34;y<H;y+=44){
    ctx.beginPath();ctx.moveTo(26,y);ctx.lineTo(W-26,y);ctx.stroke();
  }
  ctx.strokeStyle='rgba(30,214,255,.050)';
  for(let i=-5;i<13;i++){
    const x=i*56;
    ctx.beginPath();ctx.moveTo(x,86);ctx.lineTo(x+H*.42,H-98);ctx.stroke();
  }

  ctx.fillStyle=HOYO_UI.gold;
  cutPanel(0,0,182,58,14);ctx.fill();
  ctx.fillStyle=HOYO_UI.ink;
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 24px ${DISPLAY_FONT}`;
  ctx.fillText('アップグレード',18,28);
  ctx.font=`900 10px ${UI_FONT}`;
  ctx.fillText('タクティカルノード',18,50);

  drawCutPanel(W-166,12,68,28,skillPoints>0?HOYO_UI.gold:HOYO_UI.blue,skillPoints>0);
  drawCutPanel(W-90,12,72,28,HOYO_UI.blue,false);
  ctx.textAlign='center';
  ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=skillPoints>0?HOYO_UI.gold:HOYO_UI.muted;
  ctx.fillText(`SP ${skillPoints}`,W-132,27);
  ctx.fillStyle=HOYO_UI.blue;
  ctx.fillText(`WAVE ${wave}`,W-54,27);

  const panelX=14, panelY=76, panelW=W-28, panelH=512;
  drawCutPanel(panelX,panelY,panelW,panelH,HOYO_UI.blue,false);
  ctx.save();
  ctx.beginPath();ctx.rect(panelX,panelY,panelW,panelH);ctx.clip();
  const scan=((globalThis.performance?.now?.() ?? Date.now())*.08)%panelH;
  const scanG=ctx.createLinearGradient(0,panelY+scan-34,0,panelY+scan+34);
  scanG.addColorStop(0,'rgba(30,214,255,0)');
  scanG.addColorStop(.5,'rgba(30,214,255,.055)');
  scanG.addColorStop(1,'rgba(30,214,255,0)');
  ctx.fillStyle=scanG;ctx.fillRect(panelX,panelY+scan-34,panelW,68);
  ctx.restore();

  const hovered=BASIC_SKILL_TREE.find(n=>Math.hypot(mouseX-n.x,mouseY-n.y)<=34);
  const focused=hovered || BASIC_SKILL_TREE.find(n=>basicSkillUnlocked(n)&&skillPoints>0) || BASIC_SKILL_TREE[0];

  ctx.lineCap='round';
  for(const n of BASIC_SKILL_TREE){
    if(!n.requires) continue;
    const p=BASIC_SKILL_TREE.find(v=>v.id===n.requires);
    const parentActive=statLevels[n.requires]>0;
    const childActive=(statLevels[n.id]||0)>0;
    const color=childActive?basicSkillDef(n.id).color:(parentActive?HOYO_UI.gold:'rgba(238,247,255,.25)');
    ctx.strokeStyle=parentActive?h2r(color,.62):'rgba(238,247,255,.13)';
    ctx.lineWidth=parentActive?3.2:1.4;
    ctx.shadowColor=parentActive?color:'transparent';
    ctx.shadowBlur=parentActive?8:0;
    ctx.beginPath();
    ctx.moveTo(p.x,p.y+30);
    const midY=(p.y+n.y)/2;
    ctx.lineTo(p.x,midY);
    ctx.lineTo(n.x,midY);
    ctx.lineTo(n.x,n.y-31);
    ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=parentActive?h2r(color,.82):'rgba(238,247,255,.18)';
    ctx.beginPath();ctx.arc(n.x,midY,3.2,0,Math.PI*2);ctx.fill();
  }

  for(const n of BASIC_SKILL_TREE){
    const d=basicSkillDef(n.id), lv=statLevels[n.id]||0;
    const unlocked=basicSkillUnlocked(n), can=unlocked&&skillPoints>0;
    const active=lv>0, hov=hovered===n;
    ctx.save();
    ctx.globalAlpha=unlocked?1:.58;
    const nodeColor=active?d.color:(can?HOYO_UI.gold:d.color);
    const r=hov?31:28;
    ctx.shadowColor=nodeColor;ctx.shadowBlur=can?(hov?20:12):(active?8:0);
    ctx.beginPath();ctx.arc(n.x,n.y,r+7,0,Math.PI*2);
    ctx.fillStyle=h2r(nodeColor,can?.12:(active?.10:.045));ctx.fill();
    ctx.strokeStyle=h2r(nodeColor,can?.55:(active?.44:.18));ctx.lineWidth=1.4;ctx.stroke();
    ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
    ctx.fillStyle=active?h2r(d.color,.18):(can?'rgba(184,167,255,.16)':'rgba(238,247,255,.045)');
    ctx.fill();
    ctx.strokeStyle=can?HOYO_UI.gold:(active?h2r(d.color,.72):'rgba(238,247,255,.22)');
    ctx.lineWidth=can?2.3:1.3;ctx.stroke();
    ctx.shadowBlur=0;

    cutPanel(n.x-19,n.y-16,38,32,8);
    ctx.fillStyle=active?h2r(d.color,.92):(can?HOYO_UI.gold:'rgba(238,247,255,.18)');
    ctx.fill();
    ctx.fillStyle=active||can?HOYO_UI.ink:HOYO_UI.faint;
    ctx.font=`900 12px ${UI_FONT}`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(d.icon,n.x,n.y+1);

    const cardW=88, cardH=34, cardX=n.x-cardW/2, cardY=n.y+35;
    cutPanel(cardX,cardY,cardW,cardH,7);
    ctx.fillStyle=hov?'rgba(238,247,255,.12)':'rgba(8,10,10,.70)';
    ctx.fill();
    ctx.strokeStyle=can?HOYO_UI.goldSoft:(active?h2r(d.color,.44):'rgba(238,247,255,.13)');
    ctx.lineWidth=1;cutPanel(cardX,cardY,cardW,cardH,7);ctx.stroke();
    ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=unlocked?HOYO_UI.text:'rgba(238,247,255,.52)';
    ctx.fillText(statName(n.id),n.x,cardY+12);
    ctx.font=`900 10px ${UI_FONT}`;
    ctx.fillStyle=active?d.color:(can?HOYO_UI.gold:'rgba(238,247,255,.42)');
    ctx.fillText(`Lv.${lv}  ${basicSkillValue(n.id)}`,n.x,cardY+25);

    if(!unlocked || can){
      const tag=!unlocked?'ロック':`+${basicGainText(n.id,lv)}`;
      const tw=Math.min(70,Math.max(48,ctx.measureText(tag).width+14));
      cutPanel(n.x-tw/2,n.y-48,tw,18,5);
      ctx.fillStyle=!unlocked?'rgba(238,247,255,.08)':'rgba(184,167,255,.18)';ctx.fill();
      ctx.strokeStyle=!unlocked?'rgba(238,247,255,.15)':HOYO_UI.goldSoft;ctx.lineWidth=1;cutPanel(n.x-tw/2,n.y-48,tw,18,5);ctx.stroke();
      ctx.font=`900 9px ${UI_FONT}`;ctx.fillStyle=!unlocked?HOYO_UI.faint:HOYO_UI.gold;
      ctx.fillText(tag,n.x,n.y-38);
    }
    ctx.restore();
  }

  if(focused){
    const d=basicSkillDef(focused.id), lv=statLevels[focused.id]||0;
    const infoX=22, infoY=594, infoW=W-44, infoH=42;
    drawCutPanel(infoX,infoY,infoW,infoH,d.color,basicSkillUnlocked(focused));
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=d.color;
    ctx.fillText(statName(focused.id).toUpperCase(),infoX+14,infoY+14);
    ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
    const status=basicSkillUnlocked(focused)?(skillPoints>0?'アップ可能':'SP不足'):'ロック';
    ctx.fillText(`${status} / Lv.${lv} / ${basicSkillValue(focused.id)} / 次 ${basicGainText(focused.id,lv)}`,infoX+14,infoY+30);
  }

  const bx=SKILL_CLOSE_BTN.x, by=H-48, bw=SKILL_CLOSE_BTN.w, bh=34;
  drawCutPanel(bx,by,bw,bh,HOYO_UI.gold,false);
  ctx.font=`900 14px ${UI_FONT}`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText('戻る',W/2,by+bh/2+1);
  ctx.restore();
}
function drawSkillTreeV2(){
  ctx.save();
  ctx.fillStyle='rgba(5,6,7,.98)';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(238,247,255,.035)';
  for(let y=78;y<620;y+=34) ctx.fillRect(18,y,W-36,1);
  ctx.fillStyle='rgba(184,167,255,.88)';
  ctx.fillRect(0,0,5,H);

  ctx.fillStyle='rgba(10,13,15,.96)';
  ctx.fillRect(0,0,W,86);
  ctx.strokeStyle='rgba(238,247,255,.16)';
  ctx.beginPath();ctx.moveTo(0,86);ctx.lineTo(W,86);ctx.stroke();

  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 28px ${DISPLAY_FONT}`;
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('アップグレード',18,28);
  ctx.font=`bold 11px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('SPでベース能力をアップ。距離補正もここで強化できます。',18,55);

  drawCutPanel(W-162,12,70,28,skillPoints>0?HOYO_UI.gold:HOYO_UI.blue,skillPoints>0);
  drawCutPanel(W-84,12,66,28,HOYO_UI.blue,false);
  ctx.textAlign='center';
  ctx.font=`900 11px ${UI_FONT}`;
  ctx.fillStyle=skillPoints>0?HOYO_UI.gold:HOYO_UI.muted;
  ctx.fillText(`SP ${skillPoints}`,W-127,27);
  ctx.fillStyle=HOYO_UI.blue;
  ctx.fillText(`WAVE ${wave}`,W-51,27);

  const hovered=basicSkillNodeAt(mouseX,mouseY);
  const focused=hovered || BASIC_SKILL_TREE.find(n=>basicSkillUnlocked(n)&&skillPoints>0) || BASIC_SKILL_TREE[0];

  ctx.save();
  ctx.lineCap='round';
  ctx.lineJoin='round';
  for(const n of BASIC_SKILL_TREE){
    if(!n.requires) continue;
    const p=BASIC_SKILL_TREE.find(v=>v.id===n.requires);
    if(!p) continue;
    const d=basicSkillDef(n.id);
    const parentActive=statLevels[n.requires]>0;
    const childActive=(statLevels[n.id]||0)>0;
    const x1=p.x+SKILL_NODE_W/2, y1=p.y+SKILL_NODE_H;
    const x2=n.x+SKILL_NODE_W/2, y2=n.y;
    const midY=(y1+y2)/2;
    ctx.strokeStyle=childActive?h2r(d.color,.76):(parentActive?h2r(HOYO_UI.gold,.52):'rgba(238,247,255,.12)');
    ctx.lineWidth=childActive?3:(parentActive?2.2:1.2);
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x1,midY);
    ctx.lineTo(x2,midY);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
  ctx.restore();

  for(const n of BASIC_SKILL_TREE){
    const d=basicSkillDef(n.id), lv=statLevels[n.id]||0;
    const unlocked=basicSkillUnlocked(n);
    const can=unlocked&&skillPoints>0;
    const active=lv>0;
    const hov=hovered===n;
    drawCutPanel(n.x,n.y,SKILL_NODE_W,SKILL_NODE_H,d.color,can||hov);
    ctx.globalAlpha=unlocked?1:.52;
    ctx.textAlign='left';ctx.textBaseline='middle';
    drawStatusTag(n.x+10,n.y+11,38,24,d.icon,d.color,active||can);
    ctx.font=`900 13px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.text;
    ctx.fillText(statName(n.id),n.x+58,n.y+18);
    ctx.font=`900 10px ${UI_FONT}`;
    ctx.fillStyle=active?d.color:(can?HOYO_UI.gold:HOYO_UI.faint);
    ctx.fillText(`Lv.${lv}  ${basicSkillValue(n.id)}`,n.x+58,n.y+36);
    ctx.textAlign='right';
    ctx.font=`900 10px ${UI_FONT}`;
    const stateText=!unlocked?'ロック':(can?`+${basicGainText(n.id,lv)}`:'SP不足');
    ctx.fillStyle=!unlocked?HOYO_UI.faint:(can?HOYO_UI.gold:HOYO_UI.muted);
    ctx.fillText(stateText,n.x+SKILL_NODE_W-10,n.y+51);
    if(!unlocked&&n.requires){
      ctx.textAlign='left';
      ctx.font=`bold 9px ${UI_FONT}`;
      ctx.fillStyle='rgba(238,247,255,.36)';
      ctx.fillText(`要 ${statName(n.requires)}`,n.x+58,n.y+50);
    }
    ctx.globalAlpha=1;
  }

  if(focused){
    const d=basicSkillDef(focused.id), lv=statLevels[focused.id]||0;
    const infoX=18, infoY=488, infoW=W-36, infoH=112;
    drawCutPanel(infoX,infoY,infoW,infoH,d.color,basicSkillUnlocked(focused));
    ctx.textAlign='left';ctx.textBaseline='middle';
    drawStatusTag(infoX+14,infoY+15,46,30,d.icon,d.color,true);
    ctx.font=`900 18px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.text;
    ctx.fillText(statName(focused.id),infoX+72,infoY+28);
    ctx.font=`900 11px ${UI_FONT}`;
    ctx.fillStyle=d.color;
    ctx.fillText(`現在 Lv.${lv} / ${basicSkillValue(focused.id)}`,infoX+72,infoY+51);
    ctx.font=`bold 12px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.muted;
    const status=basicSkillUnlocked(focused)?(skillPoints>0?'カードをタップしてアップ':'SPが必要です'):`先に ${statName(focused.requires)} をアップ`;
    ctx.fillText(status,infoX+18,infoY+78);
    ctx.fillStyle=HOYO_UI.gold;
    ctx.fillText(`次の効果: ${basicGainText(focused.id,lv)}`,infoX+18,infoY+96);
  }

  drawCutPanel(SKILL_CLOSE_BTN.x,SKILL_CLOSE_BTN.y,SKILL_CLOSE_BTN.w,SKILL_CLOSE_BTN.h,HOYO_UI.gold,false);
  ctx.font=`900 14px ${UI_FONT}`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText('戻る',W/2,SKILL_CLOSE_BTN.y+SKILL_CLOSE_BTN.h/2+1);
  ctx.restore();
}
function upgradeCardRect(i){
  const col=i%2, row=Math.floor(i/2);
  return {
    x:UPGRADE_CARD.x+col*(UPGRADE_CARD.w+UPGRADE_CARD.gapX),
    y:UPGRADE_CARD.y+row*(UPGRADE_CARD.h+UPGRADE_CARD.gapY),
    w:UPGRADE_CARD.w,
    h:UPGRADE_CARD.h
  };
}
function drawFrozenPlayScene(){
  ctx.save();
  drawBg();
  drawArrows();
  for(const e of enemies){
    const flash=e.flash;
    drawEnemy(e);
    e.flash=flash;
  }
  drawEnemyBullets();
  drawEpOrbs();
  drawStasisAura();
  drawSupportUnits();
  drawShield();
  drawPlayer();
  drawParticles();
  ctx.restore();
  drawHUDZZZ();
}
function drawUpgradeDrawer(){
  const p=UPGRADE_PANEL;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.42)';
  ctx.fillRect(0,0,W,p.y);
  ctx.fillStyle='rgba(5,6,7,.96)';
  ctx.fillRect(0,p.y,W,H-p.y);
  ctx.strokeStyle='rgba(238,247,255,.20)';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,p.y+.5);ctx.lineTo(W,p.y+.5);ctx.stroke();

  drawCutPanel(p.x,p.y+8,p.w,p.h-8,HOYO_UI.gold,false);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 22px ${DISPLAY_FONT}`;
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('アップグレード',22,p.y+31);
  ctx.font=`bold 11px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('SPで好きな能力をアップ。接続条件はありません。',22,p.y+54);

  drawCutPanel(W-172,p.y+14,68,28,skillPoints>0?HOYO_UI.gold:HOYO_UI.blue,skillPoints>0);
  ctx.textAlign='center';ctx.font=`900 11px ${UI_FONT}`;
  ctx.fillStyle=skillPoints>0?HOYO_UI.gold:HOYO_UI.muted;
  ctx.fillText(`SP ${skillPoints}`,W-138,p.y+29);
  drawCutPanel(SKILL_CLOSE_BTN.x,SKILL_CLOSE_BTN.y,SKILL_CLOSE_BTN.w,SKILL_CLOSE_BTN.h,HOYO_UI.blue,false);
  ctx.fillStyle=HOYO_UI.blue;
  ctx.fillText('閉じる',SKILL_CLOSE_BTN.x+SKILL_CLOSE_BTN.w/2,SKILL_CLOSE_BTN.y+SKILL_CLOSE_BTN.h/2+1);

  const hovered=basicSkillNodeAt(mouseX,mouseY);
  for(let i=0;i<BASIC_STAT_DEFS.length;i++){
    const d=BASIC_STAT_DEFS[i], lv=statLevels[d.id]||0;
    const r=upgradeCardRect(i);
    const can=skillPoints>0, hov=hovered?.id===d.id;
    drawCutPanel(r.x,r.y,r.w,r.h,d.color,can||hov);
    ctx.textAlign='left';ctx.textBaseline='middle';
    drawStatusTag(r.x+8,r.y+9,35,24,d.icon,d.color,lv>0||can);
    ctx.font=`900 12px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.text;
    ctx.fillText(statName(d.id),r.x+52,r.y+15);
    ctx.font=`900 10px ${UI_FONT}`;
    ctx.fillStyle=lv>0?d.color:HOYO_UI.muted;
    ctx.fillText(`Lv.${lv} / ${basicSkillValue(d.id)}`,r.x+52,r.y+31);
    ctx.textAlign='right';
    ctx.font=`900 10px ${UI_FONT}`;
    ctx.fillStyle=can?HOYO_UI.gold:HOYO_UI.faint;
    ctx.fillText(can?`+${basicGainText(d.id,lv)}`:'SP不足',r.x+r.w-9,r.y+31);
  }

  const focused=hovered || {id:BASIC_STAT_DEFS[0].id};
  const fd=basicSkillDef(focused.id), flv=statLevels[focused.id]||0;
  const iy=H-56;
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=fd.color;
  ctx.fillText(statName(focused.id),22,iy);
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(`現在 ${basicSkillValue(focused.id)} / 次 ${basicGainText(focused.id,flv)}`,116,iy);
  ctx.restore();
}

// ─────────────────────────────────────
//  Unique Ability
// ─────────────────────────────────────
const SC={w:116, h:250, gap:7, y:226};
const RR={w:128,h:30,y:586};
const PAUSE_BTN={x:8,y:6,w:88,h:30};
const PAUSE_MENU={
  panelX:14,panelY:214,panelW:W-28,panelH:462,
  buttons:[
    {id:'resume',label:'再開',sub:'プレイに戻る',icon:'▶',color:HOYO_UI.gold},
    {id:'stats',label:'ベースステータス',sub:'アップ値をチェック',icon:'◆',color:HOYO_UI.blue},
    {id:'settings',label:'オプション',sub:'操作とサウンド',icon:'OP',color:'#9fc7aa'},
    {id:'home',label:'ホーム',sub:'トークンを受け取る',icon:'⌂',color:'#ff2d78'},
  ]
};
Object.assign(PAUSE_MENU.buttons[0],{label:'再開',sub:'バトルに戻る',icon:'>>',color:HOYO_UI.blue});
Object.assign(PAUSE_MENU.buttons[1],{label:'ステータス',sub:'バトル性能をチェック',icon:'ST',color:HOYO_UI.gold});
Object.assign(PAUSE_MENU.buttons[2],{label:'オプション',sub:'操作とサウンド',icon:'OP',color:HOYO_UI.jade});
Object.assign(PAUSE_MENU.buttons[3],{label:'ホーム',sub:'トークンを精算して終了',icon:'HM',color:HOYO_UI.rose});
const SKILL_BTN={x:136,y:H-30,w:118,h:22};
const UPGRADE_PANEL={x:8,y:H-386,w:W-16,h:372};
const UPGRADE_CARD={x:18,y:H-318,w:170,h:42,gapX:14,gapY:8};
const SKILL_CLOSE_BTN={x:W-94,y:UPGRADE_PANEL.y+14,w:76,h:28};
const TOUCH_PAD={y:H-204,w:104,h:70,edge:12};
const TOUCH_STICK={idleX:W/2,y:H-166,baseR:37,knobR:15,max:34,dead:.16};
const hasTouchInput = (navigator.maxTouchPoints || 0) > 0 || (window.matchMedia?.('(pointer: coarse)').matches ?? false);
function specialCandidatePool(){
  const owned=ownedSpecialCount();
  return SPECIAL_DEFS.filter(d=>specialLevels[d.id]<10&&(specialLevels[d.id]>0||owned<MAX_SPECIAL_TYPES));
}
function rollSpecialOptions(avoidCurrent=false){
  const current=new Set(pendingSpecials.map(d=>d.id));
  let available=specialCandidatePool();
  if(avoidCurrent&&available.length>3){
    const fresh=available.filter(d=>!current.has(d.id));
    if(fresh.length>=3) available=fresh;
  }
  for(let i=available.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
  return available.slice(0,Math.min(3,available.length));
}
function triggerSpecial(){
  pendingSpecials=rollSpecialOptions();
  if(pendingSpecials.length===0){xpLevel++;xp=0;return;}
  playSfx('special');
  state='specialUpgrade';
}
function rerollSpecials(){
  if(coins<REROLL_COST){
    addFloat(W/2,310,`トークン ${REROLL_COST} 必要`,'#b8a7ff',11);
    shake(3);
    return;
  }
  const next=rollSpecialOptions(true);
  if(next.length===0) return;
  coins-=REROLL_COST;
  pendingSpecials=next;
  shake(4);
  burst(W/2,330,'#b8a7ff',14);
}
function hitReroll(cx,cy){
  return cx>=W/2-RR.w/2&&cx<=W/2+RR.w/2&&cy>=RR.y&&cy<=RR.y+RR.h;
}
function specialHelpText(id,lv){
  const next=lv+1;
  const map={
    multiShot:`同時に${1+next}方向へ撃つ。弾幕密度が上がる。`,
    homing:`弾が敵を追尾する。動く敵へ当てやすい。`,
    piercing:`弾が敵を${next}体まで貫通する。列に強い。`,
    powerShot:`メインショットのダメージが${next*30}%上がる。`,
    gatling:`連射速度を上げる。弾は軽くなるが手数が増える。`,
    supportDrone:`支援ドローンが${next}機、周囲から射撃する。`,
    explosive:`ヒット時に爆風を発生。密集した敵へ有効。`,
    ricochet:`弾が壁で${next}回反射する。画面内を制圧する。`,
    chainLightning:`ヒット時に電撃が${next+1}体へ連鎖する。`,
    adrenaline:`耐久が低いほど火力と連射が上がる。`,
    statSynergy:`弾速アップを火力へ変換する。ビルド連携用。`,
    stasisAura:`近距離の敵をスローにする防衛フィールド。`,
    energyShield:`一定時間ごとにシールドを展開する。`,
    splitter:`弾が分裂して複数の小弾になる。面制圧向き。`,
    interceptor:`迎撃ビットが近い敵を自動で狙う。`
  };
  return map[id] || 'バトル中の性能をアップする。';
}
function drawWrappedCenter(text,x,y,maxChars,lineH,maxLines,color=HOYO_UI.muted){
  const chars=Array.from(String(text));
  const lines=[];
  for(let i=0;i<chars.length&&lines.length<maxLines;i+=maxChars){
    lines.push(chars.slice(i,i+maxChars).join(''));
  }
  ctx.fillStyle=color;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  for(let i=0;i<lines.length;i++) ctx.fillText(lines[i],x,y+i*lineH);
}
function drawSpecialSilhouette(id,cx,cy,s,color,active=false){
  ctx.save();
  ctx.translate(cx,cy);
  ctx.fillStyle=active?color:h2r(color,.86);
  ctx.strokeStyle=active?HOYO_UI.text:color;
  ctx.lineWidth=Math.max(1.4,s*.07);
  ctx.lineJoin='round';
  ctx.lineCap='round';
  const path=pts=>{
    ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p[0]*s,p[1]*s):ctx.moveTo(p[0]*s,p[1]*s));
    ctx.closePath();
    ctx.fill();
  };
  const blade=(x,y,rot=0,scale=1)=>{
    ctx.save();ctx.translate(x*s,y*s);ctx.rotate(rot);ctx.scale(scale,scale);
    path([[0,-.62],[.18,-.08],[.07,.48],[-.07,.48],[-.18,-.08]]);
    ctx.restore();
  };
  if(id==='multiShot'){
    blade(-.30,-.02,-.22,.74);blade(0,-.08,0,.86);blade(.30,-.02,.22,.74);
  }else if(id==='homing'){
    ctx.beginPath();ctx.arc(0,0,s*.44,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,s*.15,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(-s*.55,0);ctx.lineTo(-s*.25,0);ctx.moveTo(s*.25,0);ctx.lineTo(s*.55,0);ctx.moveTo(0,-s*.55);ctx.lineTo(0,-s*.25);ctx.moveTo(0,s*.25);ctx.lineTo(0,s*.55);ctx.stroke();
  }else if(id==='piercing'){
    path([[0,-.66],[.17,-.18],[.09,.56],[-.09,.56],[-.17,-.18]]);
    ctx.strokeRect(-s*.34,s*.10,s*.68,s*.12);
  }else if(id==='powerShot'){
    path([[0,-.62],[.44,0],[0,.62],[-.44,0]]);
    ctx.strokeRect(-s*.18,-s*.18,s*.36,s*.36);
  }else if(id==='gatling'){
    for(let i=-1;i<=1;i++){ctx.fillRect(i*s*.20-s*.055,-s*.56,s*.11,s*.78);}
    ctx.beginPath();ctx.arc(0,s*.28,s*.22,0,Math.PI*2);ctx.fill();
  }else if(id==='supportDrone'){
    ctx.beginPath();ctx.arc(0,0,s*.24,0,Math.PI*2);ctx.fill();
    path([[-.58,-.08],[-.30,-.22],[-.26,.16],[-.56,.24]]);
    path([[.58,-.08],[.30,-.22],[.26,.16],[.56,.24]]);
  }else if(id==='explosive'){
    for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*s*.18,Math.sin(a)*s*.18);ctx.lineTo(Math.cos(a)*s*.58,Math.sin(a)*s*.58);ctx.stroke();}
    ctx.beginPath();ctx.arc(0,0,s*.22,0,Math.PI*2);ctx.fill();
  }else if(id==='ricochet'){
    ctx.beginPath();ctx.moveTo(-s*.55,s*.40);ctx.lineTo(-s*.12,-s*.10);ctx.lineTo(s*.18,s*.18);ctx.lineTo(s*.55,-s*.42);ctx.stroke();
    blade(s*.58/s,-s*.42/s,.68,.42);
  }else if(id==='chainLightning'){
    path([[-.08,-.62],[.30,-.12],[.08,-.12],[.24,.62],[-.32,.02],[-.05,.02]]);
  }else if(id==='adrenaline'){
    path([[0,-.62],[.38,-.08],[.20,.54],[-.20,.54],[-.38,-.08]]);
    ctx.fillStyle=HOYO_UI.ink;ctx.fillRect(-s*.05,-s*.18,s*.10,s*.46);
  }else if(id==='statSynergy'){
    ctx.beginPath();ctx.arc(-s*.22,0,s*.24,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(s*.22,0,s*.24,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,s*.12,0,Math.PI*2);ctx.fill();
  }else if(id==='stasisAura'){
    ctx.beginPath();ctx.arc(0,0,s*.50,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,s*.28,0,Math.PI*2);ctx.stroke();
    ctx.fillRect(-s*.06,-s*.42,s*.12,s*.84);
  }else if(id==='energyShield'){
    path([[0,-.60],[.46,-.36],[.34,.32],[0,.62],[-.34,.32],[-.46,-.36]]);
    ctx.fillStyle=HOYO_UI.ink;ctx.beginPath();ctx.arc(0,-s*.04,s*.18,0,Math.PI*2);ctx.fill();
  }else if(id==='splitter'){
    blade(0,-.32,0,.58);
    blade(-.34,.25,-.55,.46);
    blade(.34,.25,.55,.46);
    ctx.beginPath();ctx.moveTo(0,-s*.04);ctx.lineTo(-s*.24,s*.18);ctx.moveTo(0,-s*.04);ctx.lineTo(s*.24,s*.18);ctx.stroke();
  }else if(id==='interceptor'){
    path([[0,-.56],[.24,-.04],[.54,.12],[.16,.26],[0,.56],[-.16,.26],[-.54,.12],[-.24,-.04]]);
  }else{
    path([[0,-.58],[.50,.28],[0,.52],[-.50,.28]]);
  }
  ctx.restore();
}
function drawSpecialScreen(){
  ctx.save();
  ctx.fillStyle='rgba(4,6,12,.96)'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(184,167,255,.055)'; ctx.fillRect(0,0,W,110);
  ctx.fillStyle=HOYO_UI.goldSoft; ctx.fillRect(0,0,W,1);

  ctx.font=`900 25px ${DISPLAY_FONT}`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor=HOYO_UI.gold; ctx.shadowBlur=5; ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('特殊アップグレード',W/2,32); ctx.shadowBlur=0;
  ctx.font=`bold 12px ${UI_FONT}`; ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('3つの候補から1つセレクト。選ぶとバトルへ戻ります。',W/2,60);
  ctx.font=`bold 12px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText(`セット済み ${ownedSpecialCount()}/${MAX_SPECIAL_TYPES}   トークン ${coins}`,W/2,80);

  const ownedUnique=SPECIAL_DEFS.filter(d=>specialLevels[d.id]>0);
  const slotW=60, slotH=28, slotGap=7;
  const slotsX=(W-(slotW*MAX_SPECIAL_TYPES+slotGap*(MAX_SPECIAL_TYPES-1)))/2;
  const slotsY=92;
  for(let i=0;i<MAX_SPECIAL_TYPES;i++){
    const d=ownedUnique[i];
    const x=slotsX+i*(slotW+slotGap);
    const color=d?.color || '#e8e8f0';
    rr(x,slotsY,slotW,slotH,4);
    ctx.fillStyle=d?'rgba(238,247,255,.075)':'rgba(238,247,255,.030)';ctx.fill();
    ctx.strokeStyle=d?h2r(HOYO_UI.gold,.42):HOYO_UI.line;ctx.lineWidth=1;rr(x,slotsY,slotW,slotH,4);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';
    if(d){
      drawSpecialSilhouette(d.id,x+slotW/2,slotsY+11,13,color,true);
      ctx.font=`bold 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
      ctx.fillText(`Lv.${specialLevels[d.id]}`,x+slotW/2,slotsY+21);
    }else{
      ctx.font=`bold 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.faint;
      ctx.fillText('空き',x+slotW/2,slotsY+slotH/2);
    }
  }

  const n=pendingSpecials.length;
  const{w:cw,h:ch,gap,y:cardY}=SC;
  const sx=(W-(cw*n+gap*(n-1)))/2;
  ctx.fillStyle='rgba(4,6,12,.72)';
  ctx.fillRect(0,cardY-28,W,H-cardY+28);
  for(let i=0;i<n;i++){
    const d=pendingSpecials[i];
    const cx=sx+i*(cw+gap);
    const lv=specialLevels[d.id];
    const hov=mouseX>=cx&&mouseX<=cx+cw&&mouseY>=cardY&&mouseY<=cardY+ch;
    ctx.save();
    ctx.shadowColor=HOYO_UI.gold; ctx.shadowBlur=hov?8:0;
    rr(cx,cardY,cw,ch,8); ctx.fillStyle=hov?'rgba(238,247,255,.105)':'rgba(238,247,255,.055)'; ctx.fill();
    ctx.strokeStyle=hov?HOYO_UI.goldSoft:HOYO_UI.line; ctx.lineWidth=hov?1.8:1;
    rr(cx,cardY,cw,ch,8); ctx.stroke(); ctx.shadowBlur=0;
    rrTop(cx,cardY,cw,68,8); ctx.fillStyle=h2r(d.color,hov?.16:.09); ctx.fill();
    drawSpecialSilhouette(d.id,cx+cw/2,cardY+36,31,d.color,hov);
    ctx.font=`900 12px ${UI_FONT}`;
    ctx.shadowColor=HOYO_UI.gold; ctx.shadowBlur=hov?3:0; ctx.fillStyle=HOYO_UI.text;
    ctx.fillText((UI_COPY.special[d.id] || d.name).replace(/\s/g,''),cx+cw/2,cardY+86); ctx.shadowBlur=0;
    ctx.strokeStyle=HOYO_UI.line; ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx+8,cardY+98);ctx.lineTo(cx+cw-8,cardY+98);ctx.stroke();
    const bw=70,bh=18,bxc=cx+cw/2-35,byc=cardY+106;
    rr(bxc,byc,bw,bh,4); ctx.fillStyle='rgba(184,167,255,.10)'; ctx.fill();
    rr(bxc,byc,bw,bh,4); ctx.strokeStyle=HOYO_UI.goldSoft; ctx.lineWidth=1; ctx.stroke();
    ctx.font=`bold 11px ${UI_FONT}`; ctx.fillStyle=HOYO_UI.gold; ctx.textBaseline='middle';
    ctx.fillText(lv===0?'新規':`Lv.${lv} → ${lv+1}`,cx+cw/2,byc+bh/2);
    ctx.font=`11px ${UI_FONT}`;
    drawWrappedCenter(specialHelpText(d.id,lv),cx+cw/2,cardY+143,10,14,3,HOYO_UI.muted);
    ctx.font=`900 10px ${UI_FONT}`;
    ctx.fillStyle=d.color;
    ctx.fillText(d.desc(lv+1),cx+cw/2,cardY+192);
    if(lv>=9){ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.gold;ctx.fillText('次で最大',cx+cw/2,cardY+208);}
    const ctaY=cardY+ch-16;
    if(hov){
      rr(cx+6,ctaY-9,cw-12,18,4); ctx.fillStyle='rgba(184,167,255,.13)'; ctx.fill();
      ctx.font=`bold 11px ${UI_FONT}`; ctx.fillStyle=HOYO_UI.gold;
    } else {
      ctx.font=`11px ${UI_FONT}`; ctx.fillStyle=HOYO_UI.faint;
    }
    ctx.textBaseline='middle'; ctx.fillText(hov?'セレクト':'タップでセレクト',cx+cw/2,ctaY);
    ctx.restore();
  }

  const canReroll=coins>=REROLL_COST;
  const rx=W/2-RR.w/2, ry=RR.y;
  ctx.save();
  rr(rx,ry,RR.w,RR.h,6);
  ctx.fillStyle=canReroll?'rgba(184,167,255,.15)':'rgba(238,247,255,.055)';
  ctx.fill();
  ctx.strokeStyle=canReroll?HOYO_UI.goldSoft:HOYO_UI.line;
  ctx.lineWidth=1.4; rr(rx,ry,RR.w,RR.h,6); ctx.stroke();
  ctx.font=`900 13px ${UI_FONT}`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=canReroll?HOYO_UI.gold:HOYO_UI.faint;
  ctx.shadowColor=HOYO_UI.gold;ctx.shadowBlur=canReroll?3:0;
  ctx.fillText(`再抽選  ${REROLL_COST}トークン`,W/2,ry+RR.h/2);
  ctx.restore();
  ctx.restore();
}
function handleSpecialAt(cx,cy){
  if(hitReroll(cx,cy)){rerollSpecials();return;}
  const n=pendingSpecials.length;
  const{w:cw,h:ch,gap,y:cardY}=SC;
  const sx=(W-(cw*n+gap*(n-1)))/2;
  for(let i=0;i<n;i++){
    const cardX=sx+i*(cw+gap);
    if(cx>=cardX&&cx<=cardX+cw&&cy>=cardY&&cy<=cardY+ch){
      const chosen=pendingSpecials[i];
      if(specialLevels[chosen.id]===0&&ownedSpecialCount()>=MAX_SPECIAL_TYPES) return;
      specialLevels[chosen.id]++;
      playSfx('upgrade');
      shake(6); burst(player.x,player.y,chosen.color,20);
      addFloat(W/2,H/2-20,`${chosen.name}  Lv.${specialLevels[chosen.id]}`,chosen.color,14);
      xpLevel++; xp=0;
      pendingSpecials=[]; state='play'; break;
    }
  }
}
function handleSpecialClick(e){
  const rect=canvas.getBoundingClientRect();
  const cx=(e.clientX-rect.left)*(W/rect.width);
  const cy=(e.clientY-rect.top)*(H/rect.height);
  handleSpecialAt(cx,cy);
}

// ─────────────────────────────────────
//  XP
// ─────────────────────────────────────
function addXp(amount){
  const gained=Math.floor(amount*xpMult());
  xp+=gained;
  addFloat(player.x,player.y-20,`+${formatCompactNumber(gained)} XP`,'#00dd77',10);
  if(xp>=xpThresh()) triggerSpecial();
}
function addDamageXp(amount){
  if(amount<=0) return;
  hitXpBank+=amount*xpMult()*DAMAGE_XP_RATE;
  const gained=Math.floor(hitXpBank);
  if(gained<=0) return;
  hitXpBank-=gained;
  xp+=gained;
  if(xp>=xpThresh()) triggerSpecial();
}

function killEnemy(e){
  if(!e||e.dead) return;
  const idx=enemies.indexOf(e);
  if(idx<0) return;
  e.dead=true;
  const pts=e.scoreValue ?? (Math.floor(e.maxHp*.5)+wave*5);
  const coinGain=1+Math.floor(wave/4)+Math.floor(Math.sqrt(e.maxHp)/120);
  score+=pts;
  coins+=coinGain;
  addXp(e.xpValue ?? Math.floor(10+wave*3+Math.sqrt(e.maxHp)*2.2));
  addFloat(e.x,e.y-10,`+${formatCompactNumber(pts)}  +${formatCompactNumber(coinGain)}トークン`,'#e8e8f0',11);
  burst(e.x,e.y,`rgb(${e.r},${e.g},${e.b})`,14);
  playSfx('kill');
  spawnEpOrbs(e.x,e.y,e.orbValue ?? (3+Math.floor(e.maxHp/22)));
  removeAtFast(enemies,idx);
}
function damageEnemy(e,amount,color,label=null){
  if(!e||e.dead) return false;
  const actual=Math.max(0,Math.min(e.hp,amount));
  e.hp-=amount; e.flash=6;
  addDamageXp(actual);
  if(label) addFloat(e.x,e.y-18,label,color,10);
  burst(e.x,e.y,color,5);
  if(e.hp<=0){killEnemy(e);return true;}
  playSfx('hit');
  return false;
}
function applyOnHitEffects(source,x,y,baseDmg){
  if(specialLevels.explosive>0){
    const r=34+specialLevels.explosive*6;
    const r2=r*r;
    const dmg=baseDmg*(.32+specialLevels.explosive*.04);
    burst(x,y,'#ff7040',12+specialLevels.explosive*2);
    for(let i=enemies.length-1;i>=0;i--){
      const e=enemies[i];
      if(e!==source&&distSq(e.x,e.y,x,y)<r2) damageEnemy(e,dmg,'#ff7040');
    }
  }
  if(specialLevels.chainLightning>0){
    const jumps=Math.min(8,specialLevels.chainLightning+1);
    let from=source;
    const used=new Set([source]);
    for(let j=0;j<jumps;j++){
      if(!from) break;
      let next=null, nd2=Math.pow(150+specialLevels.chainLightning*10,2);
      for(const e of enemies){
        if(used.has(e)) continue;
        const d2=distSq(e.x,e.y,from.x,from.y);
        if(d2<nd2){nd2=d2;next=e;}
      }
      if(!next) break;
      used.add(next);
      damageEnemy(next,baseDmg*(.22+specialLevels.chainLightning*.025),'#9cff6a','CHAIN');
      from=next;
    }
  }
}

// ─────────────────────────────────────
//  衝突判定
// ─────────────────────────────────────
function checkCollisions(){
  const dmg=damage(), pc=pierce(), critD=critDamage();
  const critC=critChance(), doubleCritC=doubleCritChance();
  const ricochetLv=specialLevels.ricochet;
  if(arrows.length>0&&enemies.length>0) for(let ai=arrows.length-1;ai>=0;ai--){
    const a=arrows[ai]; let rem=false;
    const ar=a.hitRadius??4;
    for(let ei=enemies.length-1;ei>=0;ei--){
      if(rem) break;
      const e=enemies[ei];
      const hitR=e.size+ar;
      if(Math.abs(a.x-e.x)>hitR||Math.abs(a.y-e.y)>hitR) continue;
      if(distSq(a.x,a.y,e.x,e.y)<hitR*hitR){
        const critTier=rollCritTier(critC,doubleCritC);
        const distanceMult=distanceDamageMult(e);
        const hitDmg=dmg*a.damageScale*distanceMult*Math.pow(critD,critTier);
        const actualDmg=Math.max(0,Math.min(e.hp,hitDmg));
        e.hp-=hitDmg; e.flash=6;
        addDamageXp(actualDmg);
        const hitBurst=a.kind==='split' ? 3 : 5;
        burst(a.x,a.y,critTier?'#b8a7ff':(a.pw?'#ff6020':'#00f0ff'),critTier?9+critTier*4:hitBurst);
        if(critTier) addFloat(e.x,e.y-18,critTier>1?'DOUBLE CRIT':'CRIT',critTier>1?'#ff7040':'#b8a7ff',10);
        applyOnHitEffects(e,a.x,a.y,hitDmg);
        if(e.hp<=0) killEnemy(e);
        else playSfx('hit');
        const bounced=ricochetLv>0&&a.ricocheted<ricochetLv&&redirectArrowToEnemy(a,e);
        if(bounced){rem=true;break;}
        const maxPierce=pc+(a.pierceBonus||0);
        if(maxPierce===0||a.pierced>=maxPierce){removeAtFast(arrows,ai);rem=true;}
        else a.pierced++;
      }
    }
  }
  if(invincible>0){invincible--;}
  else{
    const playerR=playerHitRadius();
    let damaged=false;
    for(const e of enemies){
      const hitR=e.size+playerR;
      if(distSq(player.x,player.y,e.x,e.y)<hitR*hitR){
        if(blockWithShield()){damaged=true;break;}
        hp-=incomingDamage(e.contactDamage ?? 26); invincible=80;
        shake(8); burst(player.x,player.y,'#ff2d78',12);
        if(hp<=0){hp=0; endGame(); return;}
        damaged=true;
        break;
      }
    }
    if(!damaged){
      for(let i=enemyBullets.length-1;i>=0;i--){
        const b=enemyBullets[i];
        const hitR=playerR+(b.size||5);
        if(distSq(player.x,player.y,b.x,b.y)<hitR*hitR){
          removeAtFast(enemyBullets,i);
          if(blockWithShield()) break;
          hp-=incomingDamage(b.damage ?? BOSS_BULLET_BASE_DAMAGE);
          invincible=76;
          shake(7);
          burst(player.x,player.y,b.color||HOYO_UI.rose,12);
          if(hp<=0){hp=0; endGame(); return;}
          break;
        }
      }
    }
  }
  const regen=regenPerSec();
  if(regen>0&&hp<maxHp){
    regenBank+=regen/60;
    if(regenBank>=1){
      const heal=Math.floor(regenBank);
      hp=Math.min(maxHp,hp+heal);
      regenBank-=heal;
    }
  }else if(hp>=maxHp){
    regenBank=0;
  }
}

// ─────────────────────────────────────
//  HUD描画（キャンバス内オーバーレイ）
// ─────────────────────────────────────
function drawHUD(){
  ctx.save();

  // ── 上部HUD ──
  ctx.fillStyle=hudTopGradient; ctx.fillRect(0,0,W,HUD_T+16);

  const bx=10, bw=W-20;
  const topY=7, topH=22;

  // ホームボタン
  rr(PAUSE_BTN.x,PAUSE_BTN.y,PAUSE_BTN.w,PAUSE_BTN.h,4);
  ctx.fillStyle=pauseButtonGradient;ctx.fill();
  ctx.strokeStyle='rgba(232,232,240,.22)';ctx.lineWidth=1;rr(PAUSE_BTN.x,PAUSE_BTN.y,PAUSE_BTN.w,PAUSE_BTN.h,4);ctx.stroke();
  ctx.fillStyle=HOYO_UI.gold;
  ctx.shadowColor=HOYO_UI.gold;ctx.shadowBlur=3;
  ctx.fillRect(PAUSE_BTN.x+12,PAUSE_BTN.y+9,3,12);
  ctx.fillRect(PAUSE_BTN.x+20,PAUSE_BTN.y+9,3,12);
  ctx.fillStyle=HOYO_UI.goldSoft;
  ctx.fillRect(PAUSE_BTN.x,PAUSE_BTN.y,3,PAUSE_BTN.h);
  ctx.font='bold 13px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('停止',PAUSE_BTN.x+34,PAUSE_BTN.y+PAUSE_BTN.h/2+1);
  ctx.shadowBlur=0;

  // WAVE
  ctx.textAlign='center'; ctx.textBaseline='middle';
  rr(W/2-44,topY,88,topH,4);
  ctx.fillStyle='rgba(184,167,255,.10)';ctx.fill();
  ctx.strokeStyle=HOYO_UI.goldSoft;ctx.lineWidth=1;rr(W/2-44,topY,88,topH,4);ctx.stroke();
  ctx.font=`bold 13px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText(`WAVE ${wave}`,W/2,topY+topH/2+1);

  // スコア
  ctx.textAlign='right';
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle=HOYO_UI.faint;
  ctx.fillText('スコア',W-bx,topY+5);
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(`${formatCompactNumber(score)}  トークン ${formatCompactNumber(coins)}`,W-bx,topY+17);

  // ── 下部グラデーションオーバーレイ ──
  ctx.fillStyle=hudBottomGradient; ctx.fillRect(0,H-HUD_B-18,W,HUD_B+18);

  // 現在ステータス
  ctx.textBaseline='middle';
  ctx.textAlign='left';
  const barX=bx, barW=bw, hpY=H-118, hpH=15, xpY=H-96, xpH=12;
  function drawMeter(y,h,label,valueText,ratio,colorA,colorB){
    rr(barX,y,barW,h,6);ctx.fillStyle='rgba(238,247,255,.060)';ctx.fill();
    const mw=barW*Math.max(0,Math.min(1,ratio));
    if(mw>0){
      const mg=ctx.createLinearGradient(barX,0,barX+barW,0);
      mg.addColorStop(0,colorA);mg.addColorStop(1,colorB);
      rr(barX,y,mw,h,6);ctx.fillStyle=mg;ctx.fill();
    }
    ctx.strokeStyle=HOYO_UI.line;ctx.lineWidth=1;rr(barX,y,barW,h,6);ctx.stroke();
    ctx.font=`bold 12px ${UI_FONT}`;ctx.textAlign='left';ctx.fillStyle=HOYO_UI.text;
    ctx.fillText(label,barX+6,y+h/2);
    ctx.textAlign='right';ctx.fillStyle=HOYO_UI.muted;
    ctx.fillText(valueText,barX+barW-6,y+h/2);
  }
  drawMeter(hpY,hpH,'HP',hpText(),hp/maxHp,'#b94564','#f0a0b2');
  drawMeter(xpY,xpH,'XP',`Lv.${formatCompactNumber(xpLevel)}  ${formatCompactNumber(xp)}/${formatCompactNumber(xpThresh())}`,Math.min(1,xp/xpThresh()),'#6f9f8e','#cfe8c0');

  const chipY=H-74, chipH=22, chipGap=6, chipW=(bw-chipGap*2)/3;
  const chips=[
    {label:'LV',value:xpLevel,color:'#00dd77'},
    {label:'トークン',value:coins,color:'#b8a7ff'},
    {label:'BASE',value:`${skillPoints} SP`,color:'#88aaff'},
  ];
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=0;i<chips.length;i++){
    const c=chips[i], x=bx+i*(chipW+chipGap);
    const g=ctx.createLinearGradient(x,chipY,x,chipY+chipH);
    g.addColorStop(0,h2r(c.color,.10));
    g.addColorStop(1,'rgba(12,15,24,.72)');
    rr(x,chipY,chipW,chipH,4);
    ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(238,247,255,.13)';ctx.lineWidth=1;rr(x,chipY,chipW,chipH,4);ctx.stroke();
    ctx.font=`bold 9px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.faint;
    ctx.fillText(c.label,x+chipW*.32,chipY+chipH/2+1);
    ctx.font=`bold 13px ${UI_FONT}`;
    ctx.fillStyle=c.color=== '#b8a7ff'?HOYO_UI.gold:h2r(c.color,.82);
    ctx.fillText(String(c.value),x+chipW*.68,chipY+chipH/2+1);
  }

  // Upgrade zone status
  rr(SKILL_BTN.x,SKILL_BTN.y,SKILL_BTN.w,SKILL_BTN.h,5);
  const canUpgrade=skillPoints>0;
  ctx.fillStyle=canUpgrade?'rgba(184,167,255,.16)':'rgba(238,247,255,.060)';
  ctx.fill();
  ctx.strokeStyle=canUpgrade?h2r(HOYO_UI.gold,.72):HOYO_UI.line;
  ctx.lineWidth=1.1;rr(SKILL_BTN.x,SKILL_BTN.y,SKILL_BTN.w,SKILL_BTN.h,5);ctx.stroke();
  ctx.font='bold 14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=canUpgrade?HOYO_UI.gold:HOYO_UI.text;
  ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=canUpgrade?7:3;
  ctx.fillText(canUpgrade?`アップ ${skillPoints}SP`:'アップグレード',SKILL_BTN.x+SKILL_BTN.w/2,SKILL_BTN.y+SKILL_BTN.h/2);
  ctx.shadowBlur=0;

  ctx.restore();
}
function drawHUDZZZ(){
  ctx.save();
  ctx.fillStyle='rgba(5,6,7,.90)';ctx.fillRect(0,0,W,HUD_T+20);

  drawCutPanel(PAUSE_BTN.x,PAUSE_BTN.y,PAUSE_BTN.w,PAUSE_BTN.h,HOYO_UI.gold,false);
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillRect(PAUSE_BTN.x+12,PAUSE_BTN.y+9,3,12);
  ctx.fillRect(PAUSE_BTN.x+20,PAUSE_BTN.y+9,3,12);
  ctx.font=`900 12px ${UI_FONT}`;ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('ポーズ',PAUSE_BTN.x+34,PAUSE_BTN.y+PAUSE_BTN.h/2+1);

  ctx.textAlign='center';
  drawCutPanel(W/2-48,7,96,24,HOYO_UI.rose,true);
  ctx.font=`900 14px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  ctx.fillText(`WAVE ${wave}`,W/2,20);
  const timerColor=HOYO_UI.rose;
  const remain=waveSecondsLeft();
  drawCutPanel(W/2-62,34,124,14,timerColor,false);
  const progress=Math.max(0, Math.min(1, waveFrame / WAVE_DURATION_FRAMES));
  if(progress>0){
    ctx.fillStyle=h2r(timerColor,.26);
    cutPanel(W/2-59,37,118*progress,8,4);ctx.fill();
  }
  ctx.font=`900 9px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(`次WAVEまで ${remain}秒`,W/2,42);

  const counterX=258, counterY=6, counterW=W-counterX-8, counterH=42;
  drawCutPanel(counterX,counterY,counterW,counterH,HOYO_UI.blue,false);
  ctx.fillStyle='rgba(238,247,255,.055)';
  cutPanel(counterX+4,counterY+4,counterW-8,counterH-8,8);ctx.fill();
  ctx.fillStyle=h2r(HOYO_UI.blue,.72);
  ctx.fillRect(counterX+7,counterY+8,3,counterH-16);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 9px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('スコア',counterX+16,counterY+13);
  ctx.fillText('トークン',counterX+16,counterY+31);
  ctx.textAlign='right';
  ctx.shadowColor='rgba(0,0,0,.85)';
  ctx.shadowBlur=4;
  ctx.font=`900 15px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText(fitText(formatCompactNumber(score),64),counterX+counterW-10,counterY+13);
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText(fitText(formatCompactNumber(coins),64),counterX+counterW-10,counterY+31);
  ctx.shadowBlur=0;

  ctx.fillStyle='rgba(5,6,7,.92)';ctx.fillRect(0,H-HUD_B-20,W,HUD_B+20);
  const bx=12,bw=W-24;
  const meter=(y,h,label,value,ratio,a,b)=>{
    drawCutPanel(bx,y,bw,h,a,false);
    const mw=(bw-6)*Math.max(0,Math.min(1,ratio));
    if(mw>0){
      cutPanel(bx+3,y+3,mw,h-6,6);ctx.fillStyle=h2r(a,.82);ctx.fill();
    }
    ctx.font=`900 11px ${UI_FONT}`;ctx.textAlign='left';ctx.fillStyle='#070808';
    ctx.fillStyle=HOYO_UI.text;ctx.fillText(label,bx+10,y+h/2+1);
    ctx.textAlign='right';ctx.fillStyle=HOYO_UI.muted;ctx.fillText(value,bx+bw-10,y+h/2+1);
  };
  meter(H-119,17,'HP',hpText(),hp/maxHp,HOYO_UI.rose,'#ffb3a5');
  meter(H-94,14,'XP',`Lv.${formatCompactNumber(xpLevel)}  ${formatCompactNumber(xp)}/${formatCompactNumber(xpThresh())}`,Math.min(1,xp/xpThresh()),HOYO_UI.jade,'#d6ff69');

  const chips=[
    {label:'LV',value:formatCompactNumber(xpLevel),color:HOYO_UI.jade},
    {label:'トークン',value:formatCompactNumber(coins),color:HOYO_UI.gold},
    {label:'SP',value:formatCompactNumber(skillPoints),color:HOYO_UI.blue},
  ];
  const chipY=H-67, chipGap=7, chipW=(bw-chipGap*2)/3;
  for(let i=0;i<chips.length;i++){
    const c=chips[i], x=bx+i*(chipW+chipGap);
    drawCutPanel(x,chipY,chipW,24,c.color,false);
    ctx.font=`900 9px ${UI_FONT}`;ctx.textAlign='left';ctx.fillStyle=h2r(c.color,.95);
    ctx.fillText(c.label,x+10,chipY+9);
    ctx.font=`900 16px ${UI_FONT}`;ctx.textAlign='right';ctx.fillStyle=HOYO_UI.text;
    ctx.shadowColor='rgba(0,0,0,.75)';ctx.shadowBlur=3;
    ctx.fillText(fitText(c.value,chipW-22),x+chipW-10,chipY+17);
    ctx.shadowBlur=0;
  }

  const canUpgrade=skillPoints>0;
  drawCutPanel(SKILL_BTN.x,SKILL_BTN.y,SKILL_BTN.w,SKILL_BTN.h,canUpgrade?HOYO_UI.gold:HOYO_UI.blue,canUpgrade);
  ctx.font=`900 12px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=canUpgrade?HOYO_UI.gold:HOYO_UI.muted;
  ctx.fillText(canUpgrade?`アップ ${skillPoints}SP`:'アップグレード',SKILL_BTN.x+SKILL_BTN.w/2,SKILL_BTN.y+SKILL_BTN.h/2+1);
  ctx.restore();
}

// ─────────────────────────────────────
//  ウェーブバナー
// ─────────────────────────────────────
function drawTouchControls(){
  return;
}
function pauseButtonRect(i){
  const p=PAUSE_MENU, x=p.panelX+18, y=p.panelY+116, gap=10;
  if(i===0) return {x,y,w:p.panelW-36,h:64};
  const w=(p.panelW-36-gap)/2, h=74;
  const n=i-1, col=n%2, row=Math.floor(n/2);
  return {x:x+col*(w+gap),y:y+78+row*(h+gap),w,h};
}
function pauseSettingRect(i){
  const p=PAUSE_MENU, x=p.panelX+18, y=p.panelY+112;
  return {x,y:y+i*76,w:p.panelW-36,h:62};
}
function pauseBackRect(){
  const p=PAUSE_MENU;
  return {x:p.panelX+18,y:p.panelY+p.panelH-60,w:p.panelW-36,h:42};
}
function drawPauseRow(b,label,sub,color,meta='',active=false,icon=''){
  drawCutPanel(b.x,b.y,b.w,b.h,color,active);
  if(icon){
    ctx.fillStyle=h2r(color,active?.95:.74);
    cutPanel(b.x+12,b.y+b.h/2-16,38,32,8);ctx.fill();
    ctx.font=`900 13px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#070808';ctx.fillText(icon,b.x+31,b.y+b.h/2+1);
  }
  const rowTx=b.x+(icon?62:18);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 ${active?20:15}px ${UI_FONT}`;ctx.fillStyle=active?HOYO_UI.text:h2r(color,.96);
  ctx.fillText(label,rowTx,b.y+(active?24:22));
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(sub,rowTx,b.y+(active?47:42));
  if(meta){
    ctx.textAlign='right';ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=active?color:HOYO_UI.faint;
    ctx.fillText(meta,b.x+b.w-14,b.y+b.h/2+1);
  }
  return;
  rr(b.x,b.y,b.w,b.h,7);
  const bg=ctx.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);
  bg.addColorStop(0,active?h2r(color,.20):'rgba(232,232,240,.060)');
  bg.addColorStop(.55,'rgba(14,18,30,.82)');
  bg.addColorStop(1,'rgba(5,7,14,.94)');
  ctx.fillStyle=bg;ctx.fill();
  ctx.strokeStyle=active?h2r(color,.70):'rgba(232,232,240,.14)';
  ctx.lineWidth=active?1.5:1;rr(b.x,b.y,b.w,b.h,7);ctx.stroke();
  ctx.fillStyle=h2r(color,active?.72:.36);
  ctx.fillRect(b.x,b.y,4,b.h);
  if(icon){
    const ir=Math.min(22,b.h*.28);
    ctx.beginPath();ctx.arc(b.x+30,b.y+b.h/2,ir,0,Math.PI*2);
    ctx.fillStyle=h2r(color,active?.18:.10);ctx.fill();
    ctx.strokeStyle=h2r(color,active?.48:.24);ctx.lineWidth=1;ctx.stroke();
    ctx.font=icon.length>1?`bold 16px ${UI_FONT}`:'18px serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=active?color:h2r(color,.74);
    ctx.fillText(icon,b.x+30,b.y+b.h/2+1);
  }
  const tx=b.x+(icon?62:20);
  ctx.fillStyle=active?color:'rgba(232,232,240,.88)';
  ctx.font=`bold ${active?20:16}px ${UI_FONT}`;
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText(label,tx,b.y+(active?24:25));
  ctx.font=`12px ${UI_FONT}`;
  ctx.fillStyle='rgba(232,232,240,.45)';
  ctx.fillText(sub,tx,b.y+(active?45:48));
  if(meta){
    ctx.textAlign='right';
    ctx.font=`bold 13px ${UI_FONT}`;
    ctx.fillStyle=active?h2r(color,.92):'rgba(232,232,240,.42)';
    ctx.fillText(meta,b.x+b.w-16,b.y+b.h/2);
  }
}
function drawPauseStatsPanel(){
  const p=PAUSE_MENU;
  const stats=basicStatReadouts();
  const left=p.panelX+18, top=p.panelY+108;
  const gapX=10, gapY=8;
  const colW=(p.panelW-36-gapX)/2, rowH=43;
  for(let i=0;i<stats.length;i++){
    const s=stats[i];
    const col=i%2, row=Math.floor(i/2);
    const x=left+col*(colW+gapX), y=top+row*(rowH+gapY);
    const active=effectiveStatLevel(s.id)>0;
    rr(x,y,colW,rowH,5);
    const bg=ctx.createLinearGradient(x,y,x+colW,y+rowH);
    bg.addColorStop(0,h2r(s.color,active?.15:.06));
    bg.addColorStop(.62,'rgba(12,16,28,.78)');
    bg.addColorStop(1,'rgba(6,6,14,.88)');
    ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=h2r(s.color,active?.48:.20);ctx.lineWidth=active?1.3:1;rr(x,y,colW,rowH,5);ctx.stroke();
    ctx.fillStyle=h2r(s.color,active?.72:.34);
    ctx.fillRect(x,y,3,rowH);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=s.icon.length>1?`bold 15px ${UI_FONT}`:'17px serif';
    ctx.fillStyle=h2r(s.color,.90);
    ctx.fillText(s.icon,x+12,y+15);
    ctx.font=`bold 12px ${UI_FONT}`;
    ctx.fillStyle='rgba(232,232,240,.72)';
    ctx.fillText(s.label,x+36,y+15);
    ctx.font=`bold 14px ${UI_FONT}`;
    ctx.fillStyle='rgba(232,232,240,.92)';
    ctx.fillText(String(s.value),x+12,y+32);
  }
    drawPauseRow(pauseBackRect(),'戻る','ポーズメニューへ','#88aaff','',false,'←');
}
function drawPauseMenu(){
  ctx.save();
  const shade=ctx.createLinearGradient(0,0,0,H);
  shade.addColorStop(0,'rgba(2,4,10,.38)');
  shade.addColorStop(.45,'rgba(2,4,10,.62)');
  shade.addColorStop(1,'rgba(2,4,10,.86)');
  ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  const p=PAUSE_MENU;
  const halo=ctx.createRadialGradient(W/2,p.panelY+40,10,W/2,p.panelY+40,p.panelW*.85);
  halo.addColorStop(0,'rgba(0,240,255,.12)');
  halo.addColorStop(.46,'rgba(136,170,255,.035)');
  halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo;
  ctx.fillRect(0,p.panelY-90,W,p.panelH+120);
  rr(p.panelX,p.panelY,p.panelW,p.panelH,10);
  const g=ctx.createLinearGradient(p.panelX,p.panelY,p.panelX,p.panelY+p.panelH);
  g.addColorStop(0,'rgba(18,23,36,.97)');
  g.addColorStop(.32,'rgba(9,13,24,.98)');
  g.addColorStop(1,'rgba(4,6,12,.99)');
  ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle='rgba(232,232,240,.16)';
  ctx.lineWidth=1;rr(p.panelX,p.panelY,p.panelW,p.panelH,10);ctx.stroke();
  ctx.fillStyle='rgba(232,232,240,.22)';
  rr(W/2-28,p.panelY+10,56,4,2);ctx.fill();
  ctx.fillStyle='rgba(0,240,255,.38)';
  ctx.fillRect(p.panelX,p.panelY+18,3,p.panelH-36);
  ctx.fillStyle='rgba(232,232,240,.055)';
  ctx.fillRect(p.panelX+18,p.panelY+88,p.panelW-36,1);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`42px ${DISPLAY_FONT}`;
  ctx.fillStyle='#e8e8f0';ctx.shadowColor='#00f0ff';ctx.shadowBlur=4;
  const title=pauseView==='settings'?'操作オプション':(pauseView==='stats'?'ベースステータス':'ポーズ');
  ctx.fillText(title,p.panelX+22,p.panelY+48);ctx.shadowBlur=0;
  ctx.font=`bold 11px ${UI_FONT}`;
  ctx.fillStyle='rgba(232,232,240,.44)';
  ctx.fillText('PAUSE MENU',p.panelX+24,p.panelY+74);
  const chipY=p.panelY+43;
  const chips=[`WAVE ${wave}`,`SCORE ${formatCompactNumber(score)}`];
  ctx.textAlign='right';
  for(let i=0;i<chips.length;i++){
    const w=i===0?74:112, x=p.panelX+p.panelW-18-w, y=chipY+i*24;
    rr(x,y,w,18,4);
    ctx.fillStyle='rgba(232,232,240,.055)';ctx.fill();
    ctx.strokeStyle='rgba(232,232,240,.11)';ctx.lineWidth=1;rr(x,y,w,18,4);ctx.stroke();
    ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle='rgba(232,232,240,.62)';
    ctx.fillText(chips[i],x+w-8,y+9);
  }
  if(pauseView==='stats'){
    drawPauseStatsPanel();
    ctx.restore();
    return;
  }
  if(pauseView==='settings'){
    const modes=[
      {id:'buttons',label:'タップ操作',sub:'触った位置へ移動',color:'#00f0ff'},
      {id:'stick',label:'ドラッグ操作',sub:'下部をドラッグして移動',color:'#00dd77'},
    ];
    for(let i=0;i<modes.length;i++){
      const b=pauseSettingRect(i), m=modes[i], active=touchControlMode()===m.id;
      drawPauseRow(b,m.label,m.sub,m.color,active?'使用中':'変更',active,i===0?'TAP':'DRAG');
    }
    drawPauseRow(pauseBackRect(),'戻る','メニューへ戻る','#88aaff','',false,'←');
    ctx.restore();
    return;
  }
  for(let i=0;i<p.buttons.length;i++){
    const b=pauseButtonRect(i), item=p.buttons[i];
    drawPauseRow(b,item.label,item.sub,item.color,i===0?'':'›',i===0,item.icon);
  }
  ctx.restore();
}
function drawPauseMenuZZZ(){
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.62)';ctx.fillRect(0,0,W,H);
  const p=PAUSE_MENU;
  drawCutPanel(p.panelX,p.panelY,p.panelW,p.panelH,HOYO_UI.gold,true);
  ctx.fillStyle=HOYO_UI.gold;
  cutPanel(p.panelX+18,p.panelY+16,92,28,8);ctx.fill();
  ctx.fillStyle='#070808';
  ctx.font=`900 15px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('停止中',p.panelX+64,p.panelY+31);
  ctx.textAlign='left';
  ctx.font=`900 34px ${DISPLAY_FONT}`;ctx.fillStyle=HOYO_UI.text;
  const title=pauseView==='settings'?'オプション':(pauseView==='stats'?'ステータス':'バトルメニュー');
  ctx.fillText(title,p.panelX+20,p.panelY+65);
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(`WAVE ${wave} / スコア ${formatCompactNumber(score)}`,p.panelX+22,p.panelY+88);

  if(pauseView==='stats'){
    const stats=[
      ['HP',hpText(),HOYO_UI.rose],
      ['連射',fmtMult(statMult('fireRate')*bodyMult('fireRate')),HOYO_UI.blue],
      ['攻撃',fmtMult(statMult('damage')*bodyMult('attack')),HOYO_UI.gold],
      ['速度',fmtMult(statMult('speed')),HOYO_UI.jade],
      ['会心',`${Math.round(critChance()*100)}%`,HOYO_UI.rose],
      ['トークン',coins,HOYO_UI.gold],
    ];
    const left=p.panelX+18, top=p.panelY+112, gap=10, w=(p.panelW-46)/2, h=58;
    for(let i=0;i<stats.length;i++){
      const [label,value,color]=stats[i], col=i%2,row=Math.floor(i/2);
      const x=left+col*(w+gap), y=top+row*(h+gap);
      drawCutPanel(x,y,w,h,color,false);
      ctx.textAlign='left';ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=h2r(color,.95);
      ctx.fillText(label,x+12,y+18);
      ctx.font=`900 19px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
      ctx.fillText(String(value),x+12,y+40);
    }
    drawPauseRow(pauseBackRect(),'戻る','メニューへ戻る',HOYO_UI.blue,'',false,'<');
    ctx.restore();return;
  }
  if(pauseView==='settings'){
    const modes=[
      {id:'buttons',label:'タップ操作',sub:'触れた位置へ移動',color:HOYO_UI.blue},
      {id:'stick',label:'ドラッグ操作',sub:'仮想スティックで移動',color:HOYO_UI.jade},
    ];
    for(let i=0;i<modes.length;i++){
      const b=pauseSettingRect(i), m=modes[i], active=touchControlMode()===m.id;
      drawPauseRow(b,m.label,m.sub,m.color,active?'使用中':'変更',active,i===0?'TP':'DG');
    }
    drawPauseRow(pauseBackRect(),'戻る','メニューへ戻る',HOYO_UI.blue,'',false,'<');
    ctx.restore();return;
  }
  for(let i=0;i<p.buttons.length;i++){
    const b=pauseButtonRect(i), item=p.buttons[i];
    drawPauseRow(b,item.label,item.sub,item.color,'',i===0,item.icon);
  }
  ctx.restore();
}
function pauseGame(){
  if(state!=='play') return;
  state='pause';
  pauseView='menu';
  stopTouchMove();
  activePointerId=null;
  pauseBgm();
  playSfx('select');
}
function resumeGame(){
  if(state!=='pause') return;
  state='play';
  pauseView='menu';
  playBgm();
  playSfx('select');
}
function handlePauseClick(cx,cy){
  if(pauseView==='stats'){
    const back=pauseBackRect();
    if(cx>=back.x&&cx<=back.x+back.w&&cy>=back.y&&cy<=back.y+back.h){pauseView='menu';return true;}
    return true;
  }
  if(pauseView==='settings'){
    for(let i=0;i<2;i++){
      const b=pauseSettingRect(i);
      if(cx>=b.x&&cx<=b.x+b.w&&cy>=b.y&&cy<=b.y+b.h){
        setTouchControlMode(i===0?'buttons':'stick');
        return true;
      }
    }
    const back=pauseBackRect();
    if(cx>=back.x&&cx<=back.x+back.w&&cy>=back.y&&cy<=back.y+back.h){pauseView='menu';return true;}
    return true;
  }
  for(let i=0;i<PAUSE_MENU.buttons.length;i++){
    const b=pauseButtonRect(i), id=PAUSE_MENU.buttons[i].id;
    if(cx>=b.x&&cx<=b.x+b.w&&cy>=b.y&&cy<=b.y+b.h){
      if(id==='resume') resumeGame();
      else if(id==='stats') pauseView='stats';
      else if(id==='home') returnHome();
      else if(id==='settings') pauseView='settings';
      return true;
    }
  }
  return true;
}
function drawWaveBanner(){
  if(waveBanner<=0) return;
  waveBanner--;
  const a=Math.min(1,waveBanner/30)*Math.min(1,(waveBanner>90?1:(waveBanner/30)));
  ctx.save();
  ctx.globalAlpha=a;
  ctx.font='72px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor='#ff2d78'; ctx.shadowBlur=12; ctx.fillStyle='#ff2d78';
  ctx.fillText(`WAVE  ${wave}`,W/2,H/2);
  ctx.restore();
}

// ─────────────────────────────────────
//  ボタン描画ヘルパー
// ─────────────────────────────────────
function drawBtn(bx,by,bw,bh,label,color){
  ctx.save();
  const accent=color||HOYO_UI.gold;
  ctx.shadowColor=accent; ctx.shadowBlur=5;
  rr(bx,by,bw,bh,8); ctx.fillStyle='rgba(238,247,255,.070)'; ctx.fill();
  ctx.strokeStyle=h2r(accent,.48); ctx.lineWidth=1.2; rr(bx,by,bw,bh,8); ctx.stroke();
  ctx.fillStyle=h2r(accent,.28);ctx.fillRect(bx,by+7,4,bh-14);
  ctx.shadowBlur=0;
  ctx.font=`900 18px ${UI_FONT}`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle=accent===HOYO_UI.gold?HOYO_UI.gold:HOYO_UI.text;
  ctx.fillText(label,bx+bw/2,by+bh/2);
  ctx.restore();
}
function drawTokenIcon(cx,cy,r=8){
  ctx.save();
  const hex=(rad,rot=0)=>{
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const a=rot+Math.PI/6+i*Math.PI/3;
      const x=cx+Math.cos(a)*rad, y=cy+Math.sin(a)*rad;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
  };
  hex(r,0);
  const outer=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
  outer.addColorStop(0,'#7fb6ce');
  outer.addColorStop(.28,'#2f85b8');
  outer.addColorStop(.62,'#1b5d92');
  outer.addColorStop(1,'#123052');
  ctx.fillStyle=outer;ctx.fill();
  ctx.lineWidth=Math.max(1,r*.16);
  ctx.strokeStyle='rgba(184,218,232,.58)';
  ctx.stroke();

  hex(r*.76,0);
  const inner=ctx.createLinearGradient(cx-r*.65,cy-r*.65,cx+r*.65,cy+r*.65);
  inner.addColorStop(0,'rgba(130,184,210,.34)');
  inner.addColorStop(.48,'rgba(38,111,164,.42)');
  inner.addColorStop(1,'rgba(12,42,78,.52)');
  ctx.fillStyle=inner;ctx.fill();
  ctx.strokeStyle='rgba(118,174,206,.38)';
  ctx.lineWidth=Math.max(1,r*.10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx,cy-r*.52);
  ctx.lineTo(cx+r*.42,cy);
  ctx.lineTo(cx,cy+r*.52);
  ctx.lineTo(cx-r*.42,cy);
  ctx.closePath();
  const gem=ctx.createLinearGradient(cx-r*.35,cy-r*.48,cx+r*.35,cy+r*.48);
  gem.addColorStop(0,'#9bc7d8');
  gem.addColorStop(.46,'#2b8ac0');
  gem.addColorStop(1,'#174f8a');
  ctx.fillStyle=gem;ctx.fill();
  ctx.strokeStyle='rgba(176,211,226,.48)';
  ctx.lineWidth=Math.max(.8,r*.08);
  ctx.stroke();

  ctx.strokeStyle='rgba(210,232,238,.24)';
  ctx.lineWidth=Math.max(.7,r*.07);
  ctx.beginPath();
  ctx.moveTo(cx-r*.38,cy-r*.30);
  ctx.lineTo(cx+r*.02,cy-r*.50);
  ctx.stroke();
  ctx.strokeStyle='rgba(6,20,42,.28)';
  ctx.beginPath();
  ctx.moveTo(cx-r*.42,cy+r*.42);
  ctx.lineTo(cx+r*.42,cy-r*.42);
  ctx.stroke();
  ctx.restore();
}
function drawTokenAmount(x,y,value,align='right',size=10){
  ctx.save();
  ctx.font=`bold ${size}px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif`;
  ctx.textBaseline='middle';
  const text=formatCompactNumber(value);
  const tw=ctx.measureText(text).width;
  const r=Math.max(6,size*.78);
  const gap=r*.45;
  let ix=x, tx=x;
  if(align==='right'){
    tx=x;
    ix=x-tw-gap-r;
    ctx.textAlign='right';
  }else if(align==='center'){
    const left=x-(r*2+gap+tw)/2;
    ix=left+r;
    tx=left+r*2+gap;
    ctx.textAlign='left';
  }else{
    ix=x+r;
    tx=x+r*2+gap;
    ctx.textAlign='left';
  }
  drawTokenIcon(ix,y,r);
  ctx.fillStyle='#8fefff';
  ctx.shadowColor='#00aaff';
  ctx.shadowBlur=3;
  ctx.fillText(text,tx,y);
  ctx.restore();
}
function drawHomeTokenBadge(){
  const x=238,y=12,w=138,h=42;
  ctx.save();
  drawCutPanel(x,y,w,h,HOYO_UI.gold,false);
  ctx.fillStyle='rgba(238,247,255,.060)';
  cutPanel(x+5,y+5,w-10,h-10,8);ctx.fill();
  ctx.fillStyle=h2r(HOYO_UI.gold,.76);
  ctx.fillRect(x+9,y+9,3,h-18);
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.font=`900 9px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('TOKEN',x+18,y+14);
  drawTokenAmount(x+w-12,y+29,meta.tokens,'right',15);
  ctx.restore();
}

// ─────────────────────────────────────
//  スタート・ゲームオーバー画面
// ─────────────────────────────────────
function checkpointButtonRect(){
  return {x:34,y:326,w:W-68,h:24};
}
function drawHighScoreBadge(x,y,w,h){
  normalizeHighScore();
  ctx.save();
  drawCutPanel(x,y,w,h,HOYO_UI.gold,false);
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.font=`900 9px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText('HIGH SCORE',x+12,y+13);
  ctx.font=`900 15px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.text;
  ctx.fillText(`WAVE ${formatCompactNumber(highScoreWave())}`,x+12,y+31);
  ctx.font=`900 10px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(formatCompactNumber(meta.highScore.score),x+12,y+47);
  ctx.restore();
}
function drawCheckpointButton(){
  const r=checkpointButtonRect();
  const active=canUseHighScoreCheckpoint();
  const target=highScoreCheckpointWave();
  ctx.save();
  drawCutPanel(r.x,r.y,r.w,r.h,active?HOYO_UI.gold:HOYO_UI.faint,active);
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.font=`900 11px ${UI_FONT}`;
  ctx.fillStyle=active?HOYO_UI.gold:HOYO_UI.faint;
  ctx.fillText(active?`CHECKPOINT START  WAVE ${target}`:'CHECKPOINT LOCKED  BEST WAVE 11+',r.x+r.w/2,r.y+r.h/2+1);
  ctx.restore();
}
const BTN_W=200, BTN_H=50;
const GAME_OVER_RETRY_Y=H/2+76;
const GAME_OVER_HOME_Y=H/2+134;
const GAME_OVER_CHECKPOINT_Y=H/2+192;
const INSTALL_BTN={x:W/2-80,y:H-72,w:160,h:34};
const HOME_START_Y=366;
const HOME_TABS=[
  { id:'store', label:'ストア' },
  { id:'warehouse', label:'倉庫' },
  { id:'upgrade', label:'アップグレード' },
];
const HOME_TAB={x:10,y:234,w:118,h:32,gap:6};
const HOME_GRID={x:12,y:274,w:175,h:56,gapX:14,gapY:8};
const HOME_NAV_BTNS=[
  {id:'store',label:'ストア',color:'#00f0ff'},
  {id:'warehouse',label:'倉庫',color:'#b8a7ff'},
  {id:'upgrade',label:'アップグレード',color:'#cc00ff'},
  {id:'codex',label:'アーカイブ',color:'#88aaff'},
  {id:'settings',label:'オプション',color:'#00dd77'},
];
const HOME_NAV={x:24,y:432,w:162,h:54,gapX:18,gapY:10};
const HOME_NAV_VIEW=[
  {id:'store',label:'ストア',sub:'機体 / コア / ドローン',color:'#00f0ff'},
  {id:'warehouse',label:'倉庫',sub:'ロードアウト',color:'#b8a7ff'},
  {id:'upgrade',label:'アップグレード',sub:'ベースステータス',color:'#cc00ff'},
  {id:'codex',label:'アーカイブ',sub:'アビリティデータ',color:'#88aaff'},
  {id:'settings',label:'オプション',sub:'操作とサウンド',color:'#00dd77'},
];
const CODEX={startY:102,rowH:58,pageSize:7,pagerY:624,btnW:88,btnH:30};
HOME_TABS.forEach(t=>{ t.label=UI_COPY.nav[t.id]?.[0] || t.label; });
HOME_NAV_BTNS.forEach(b=>{
  const copy=UI_COPY.nav[b.id];
  if(copy) b.label=copy[0].toUpperCase();
  b.color={store:HOYO_UI.blue,warehouse:HOYO_UI.gold,upgrade:HOYO_UI.rose,codex:'#9cff5e',settings:HOYO_UI.jade}[b.id] || b.color;
});
HOME_NAV_VIEW.forEach(b=>{
  const copy=UI_COPY.nav[b.id];
  if(copy){ b.label=copy[0].toUpperCase(); b.sub=copy[1]; }
  b.color={store:HOYO_UI.blue,warehouse:HOYO_UI.gold,upgrade:HOYO_UI.rose,codex:'#9cff5e',settings:HOYO_UI.jade}[b.id] || b.color;
});
function drawHomeGridCard(i,color,title,value,metaText,owned=false,selected=false){
  const col=i%2,row=Math.floor(i/2);
  const x=HOME_GRID.x+col*(HOME_GRID.w+HOME_GRID.gapX), y=HOME_GRID.y+row*(HOME_GRID.h+HOME_GRID.gapY);
  rr(x,y,HOME_GRID.w,HOME_GRID.h,5);
  const g=ctx.createLinearGradient(x,y,x+HOME_GRID.w,y+HOME_GRID.h);
  g.addColorStop(0,h2r(color,selected?.16:(owned?.10:.055)));
  g.addColorStop(1,'rgba(6,6,14,.72)');
  ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=selected?'rgba(232,232,240,.70)':h2r(color,owned?.42:.22);
  ctx.lineWidth=selected?1.4:1;rr(x,y,HOME_GRID.w,HOME_GRID.h,5);ctx.stroke();
  ctx.fillStyle=h2r(color,.75);
  ctx.fillRect(x,y,3,HOME_GRID.h);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=h2r(color,.90);ctx.shadowBlur=0;
  ctx.fillText(title,x+10,y+14);ctx.shadowBlur=0;
  ctx.font='14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.58)';
  ctx.fillText(value,x+10,y+31);
  ctx.textAlign='right';ctx.font='bold 14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=owned?'#00dd77':'#b8a7ff';
  ctx.fillText(metaText,x+HOME_GRID.w-8,y+46);
}
function drawHomeTabs(){
  for(let i=0;i<HOME_TABS.length;i++){
    const t=HOME_TABS[i], x=HOME_TAB.x+i*(HOME_TAB.w+HOME_TAB.gap), active=homeTab===t.id;
    rr(x,HOME_TAB.y,HOME_TAB.w,HOME_TAB.h,5);
    ctx.fillStyle=active?'rgba(0,240,255,.16)':'rgba(232,232,240,.045)';ctx.fill();
    ctx.strokeStyle=active?'#00f0ff':'rgba(232,232,240,.16)';
    ctx.lineWidth=active?1.6:1;rr(x,HOME_TAB.y,HOME_TAB.w,HOME_TAB.h,5);ctx.stroke();
    ctx.font='bold 14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=active?'#00f0ff':'rgba(232,232,240,.62)';
    ctx.fillText(t.label,x+HOME_TAB.w/2,HOME_TAB.y+HOME_TAB.h/2);
  }
}
const partInfo = part => PART_INFO[part.id] || {tier:'STD',desc:'Modular system part.'};
function multText(mult,short=false){
  const entries=Object.entries(mult).filter(([,v])=>!short || Math.abs(v-1)>.001);
  if(entries.length===0) return short ? '標準' : '標準性能';
  return entries.map(([k,v])=>`${short?(SHORT_STAT_LABELS[k]||k.toUpperCase()):(STAT_LABELS[k]||k)} ${fmtMult(v)}`).join(' ');
}
function equippedPartDefs(shipId=meta.selectedShip){
  return mountedPartIds(shipId).map(id=>PART_BY_ID[id]).filter(Boolean);
}
function loadoutMult(shipId=meta.selectedShip){
  const totals={hp:1,defense:1,attack:1,fireRate:1};
  for(const part of equippedPartDefs(shipId)){
    for(const [k,v] of Object.entries(part.mult)) totals[k]=(totals[k]||1)*v;
  }
  return totals;
}
function loadoutText(shipId=meta.selectedShip){
  const totals=loadoutMult(shipId);
  const active=Object.entries(totals).filter(([,v])=>Math.abs(v-1)>.001);
  return active.length ? active.map(([k,v])=>`${STAT_LABELS[k]||k} ${fmtMult(v)}`).join('  ') : 'パーツ補正なし';
}
function partSlotStatus(part,ship=selectedShipDef()){
  const limit=ship.slots[part.type]||0;
  const cur=(mountedForShip(ship.id)[part.type]||[]).length;
  const shipId=partMountedShip(part.id);
  if(shipId===ship.id) return 'セット中';
  if(shipId) return '他機体';
  if(limit<=0) return '枠なし';
  return `${cur}/${limit}枠`;
}
function slotText(ship=selectedShipDef()){
  if(ship.id==='coreOnly') return 'フレームなし / パーツ不可';
  const short={turret:'砲',armor:'装',drone:'ド',coreBoost:'コ'};
  return SLOT_ORDER.map(t=>`${short[t]||partTypeName(t)} ${(mountedForShip(ship.id)[t]||[]).length}/${ship.slots[t]||0}`).join('  ');
}
function itemValue(item){
  const d=item.def;
  if(item.type==='ship') return slotText(d);
  if(item.type==='core') return `${d.role} / Lv.${meta.coreLevels[d.id]||0}`;
  return `${partTypeName(d.type)}  ${multText(d.mult,true)}`;
}
function itemMeta(item){
  const d=item.def;
  if(item.type==='ship') return meta.selectedShip===d.id?'セレクト中':(meta.ownedShips[d.id]?'セレクト':`トークン ${d.cost}`);
  if(item.type==='core') return meta.selectedCore===d.id?'セット中':(meta.ownedCores[d.id]?'セット':`トークン ${d.cost}`);
  if(!meta.ownedParts[d.id]) return `トークン ${d.cost}`;
  const shipId=partMountedShip(d.id);
  if(shipId===meta.selectedShip) return 'セット中';
  return shipId?'他機体':'セット';
}
// ── サブ画面共通ヘルパー ──
const BACK_BTN={x:8,y:10,w:58,h:30};
function drawSubHeaderZZZ(title,tokenVisible=true){
  ctx.fillStyle='rgba(12,16,28,.72)'; ctx.fillRect(0,0,W,52);
  ctx.strokeStyle='rgba(232,232,240,.12)'; ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(W,52);ctx.stroke();
  rr(BACK_BTN.x,BACK_BTN.y,BACK_BTN.w,BACK_BTN.h,5);
  ctx.fillStyle='rgba(232,232,240,.055)';ctx.fill();
  ctx.strokeStyle='rgba(0,240,255,.38)';ctx.lineWidth=1;rr(BACK_BTN.x,BACK_BTN.y,BACK_BTN.w,BACK_BTN.h,5);ctx.stroke();
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#00f0ff';
  ctx.fillText('← 戻る',BACK_BTN.x+BACK_BTN.w/2,BACK_BTN.y+BACK_BTN.h/2);
  ctx.font='28px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.shadowColor='#00f0ff';ctx.shadowBlur=4;ctx.fillStyle='#e8e8f0';
  ctx.fillText(title,W/2,27);ctx.shadowBlur=0;
  if(tokenVisible){
    drawTokenAmount(W-10,27,meta.tokens,'right',10);
  }
}
function drawTabRowZZZ(tabs,labels,current,y,h=28){
  const tabW=(W-20)/tabs.length;
  for(let i=0;i<tabs.length;i++){
    const tx=10+i*tabW,active=current===tabs[i];
    rr(tx,y,tabW-4,h,4);
    ctx.fillStyle=active?'rgba(0,240,255,.18)':'rgba(232,232,240,.045)';ctx.fill();
    ctx.strokeStyle=active?'#00f0ff':'rgba(232,232,240,.18)';ctx.lineWidth=active?1.5:1;
    rr(tx,y,tabW-4,h,4);ctx.stroke();
    ctx.font='bold 13px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=active?'#00f0ff':'rgba(232,232,240,.55)';
    ctx.fillText(labels[tabs[i]],tx+(tabW-4)/2,y+h/2);
  }
}
function hitTabRow(cx,cy,tabs,y,h=28){
  const tabW=(W-20)/tabs.length;
  for(let i=0;i<tabs.length;i++){
    const tx=10+i*tabW;
    if(cx>=tx&&cx<=tx+tabW-4&&cy>=y&&cy<=y+h) return tabs[i];
  }
  return null;
}
function hitBackBtn(cx,cy){ return cx>=BACK_BTN.x&&cx<=BACK_BTN.x+BACK_BTN.w&&cy>=BACK_BTN.y&&cy<=BACK_BTN.y+BACK_BTN.h; }
function drawSubHeader(title,tokenVisible=true){
  title={store:'ストア',warehouse:'倉庫',upgrade:'アップグレード',codex:'アーカイブ',settings:'オプション'}[homeState] || title;
  ctx.save();
  ctx.fillStyle='rgba(4,5,5,.94)';ctx.fillRect(0,0,W,58);
  ctx.fillStyle='rgba(184,167,255,.92)';
  cutPanel(68,8,164,39,12);ctx.fill();
  ctx.fillStyle='rgba(238,247,255,.055)';
  cutPanel(230,18,78,20,8);ctx.fill();
  ctx.strokeStyle='rgba(238,247,255,.16)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,57);ctx.lineTo(W,57);ctx.stroke();
  ctx.fillStyle=HOYO_UI.gold;ctx.fillRect(0,0,5,58);

  drawCutPanel(BACK_BTN.x,BACK_BTN.y,BACK_BTN.w,BACK_BTN.h,HOYO_UI.gold,false);
  ctx.font=`900 10px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.gold;ctx.fillText('戻る',BACK_BTN.x+BACK_BTN.w/2,BACK_BTN.y+BACK_BTN.h/2+1);
  ctx.font=`900 25px ${DISPLAY_FONT}`;
  ctx.fillStyle=HOYO_UI.ink;
  ctx.fillText(fitText(title,138),150,29);
  ctx.font=`900 9px ${UI_FONT}`;
  ctx.fillText('BARRAGE SYS',151,45);
  ctx.textAlign='right';
  ctx.font=`900 9px ${UI_FONT}`;
  ctx.fillStyle='rgba(238,247,255,.45)';
  ctx.fillText('HOLLOW LINK // READY',W-16,52);
  if(tokenVisible) drawTokenAmount(W-13,28,meta.tokens,'right',10);
  ctx.restore();
}
function drawTabRow(tabs,labels,current,y,h=28){
  const tabW=(W-20)/tabs.length;
  for(let i=0;i<tabs.length;i++){
    const tx=10+i*tabW, active=current===tabs[i];
    const color=active?HOYO_UI.gold:HOYO_UI.blue;
    const label=({ship:'機体',core:'コア',part:'パーツ',drone:'ドローン',special:'能力',basic:'基礎'}[tabs[i]]) || labels[tabs[i]] || tabs[i].toUpperCase();
    ctx.save();
    cutPanel(tx,y,tabW-4,h,9);
    ctx.fillStyle=active?color:'rgba(238,247,255,.060)';
    ctx.fill();
    ctx.strokeStyle=active?h2r(color,.95):'rgba(238,247,255,.18)';
    ctx.lineWidth=active?1.6:1;
    cutPanel(tx,y,tabW-4,h,9);ctx.stroke();
    ctx.fillStyle=active?HOYO_UI.ink:h2r(color,.55);
    ctx.fillRect(tx+2,y+2,4,h-4);
    ctx.font=`900 12px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=active?HOYO_UI.ink:HOYO_UI.muted;
    ctx.fillText(label,tx+(tabW-4)/2,y+h/2+1);
    ctx.restore();
  }
}
function trimText(text,max=24){
  const s=String(text);
  return s.length>max ? `${s.slice(0,max-3)}...` : s;
}
function fitText(text,maxWidth){
  const s=String(text);
  if(ctx.measureText(s).width<=maxWidth) return s;
  let out=s;
  while(out.length>1 && ctx.measureText(`${out}...`).width>maxWidth) out=out.slice(0,-1);
  return `${out}...`;
}
function fillFitText(text,x,y,maxWidth){
  ctx.fillText(fitText(text,maxWidth),x,y);
}
function drawSubBackdrop(alpha=.74){
  ctx.fillStyle=`rgba(5,6,7,${alpha})`;
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(184,167,255,.055)';
  ctx.fillRect(0,58,W,220);
  ctx.strokeStyle='rgba(238,247,255,.050)';
  ctx.lineWidth=1;
  for(let y=80;y<H;y+=44){ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-20,y);ctx.stroke();}
  ctx.strokeStyle='rgba(30,214,255,.040)';
  for(let i=-4;i<9;i++){const x=i*70;ctx.beginPath();ctx.moveTo(x,96);ctx.lineTo(x+260,H-40);ctx.stroke();}
  ctx.fillStyle='rgba(184,167,255,.86)';
  ctx.fillRect(0,58,5,H-116);
  ctx.fillStyle='rgba(238,247,255,.030)';
  for(let y=58;y<H;y+=6) ctx.fillRect(0,y,W,1);
}
function drawStatusTag(x,y,w,h,text,color=HOYO_UI.gold,active=false){
  ctx.save();
  drawCutPanel(x,y,w,h,color,active);
  ctx.font=`900 ${h>22?11:10}px ${UI_FONT}`;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillStyle=active?color:h2r(color,.92);
  ctx.fillText(text,x+w/2,y+h/2+1);
  ctx.restore();
}
function drawSectionLabel(text,x,y,color=HOYO_UI.gold){
  ctx.save();
  ctx.font=`900 10px ${UI_FONT}`;
  const w=Math.max(86,ctx.measureText(text).width+24);
  cutPanel(x,y-11,w,22,7);
  ctx.fillStyle=color;ctx.fill();
  ctx.fillStyle=HOYO_UI.ink;
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.fillText(text,x+10,y+1);
  ctx.restore();
}
function drawCraftInCard(x,y,w,h,shipId,coreId){
  ctx.save();
  ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  drawCraft(x+w/2,y+h/2,0.42,shipId,coreId);
  ctx.restore();
}

// ── ストア画面 ──
const STORE_TABS=['ship','core','part','drone'];
const STORE_LABELS={ship:'SHIP',core:'CORE',part:'PART',drone:'DRONE'};
const STORE_PAGE_SIZE={ship:8,core:6,part:8,drone:8};
const STORE_PAGER={y:522,w:78,h:20,gap:18};
function storeDefs(tab=storeTab){
  if(tab==='ship') return SHIP_DEFS;
  if(tab==='core') return CORE_DEFS;
  if(tab==='drone') return DRONE_DEFS;
  return PART_DEFS;
}
function storePageCount(tab=storeTab){
  return Math.max(1,Math.ceil(storeDefs(tab).length/(STORE_PAGE_SIZE[tab]||8)));
}
function normalizeStorePage(tab=storeTab){
  const pages=storePageCount(tab);
  storePages[tab]=Math.max(0,Math.min(pages-1,storePages[tab]||0));
}
function visibleStoreDefs(tab=storeTab){
  normalizeStorePage(tab);
  const size=STORE_PAGE_SIZE[tab]||8;
  const start=(storePages[tab]||0)*size;
  return storeDefs(tab).slice(start,start+size);
}
function drawStorePager(tab=storeTab){
  const pages=storePageCount(tab);
  if(pages<=1) return;
  const p=STORE_PAGER, left={x:W/2-p.w-p.gap/2,y:p.y,w:p.w,h:p.h}, right={x:W/2+p.gap/2,y:p.y,w:p.w,h:p.h};
  const page=storePages[tab]||0;
  for(const b of [
    {r:left,label:'前へ',on:page>0},
    {r:right,label:'次へ',on:page<pages-1}
  ]){
    drawCutPanel(b.r.x,b.r.y,b.r.w,b.r.h,b.on?HOYO_UI.blue:HOYO_UI.faint,b.on);
    ctx.font=`900 10px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=b.on?HOYO_UI.blue:HOYO_UI.faint;
    ctx.fillText(b.label,b.r.x+b.r.w/2,b.r.y+b.r.h/2+1);
  }
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(`${page+1}/${pages}`,W/2,p.y+p.h/2+1);
}
function handleStorePager(cx,cy,tab=storeTab){
  const pages=storePageCount(tab);
  if(pages<=1) return false;
  const p=STORE_PAGER;
  if(cy<p.y||cy>p.y+p.h) return false;
  const left={x:W/2-p.w-p.gap/2,y:p.y,w:p.w,h:p.h}, right={x:W/2+p.gap/2,y:p.y,w:p.w,h:p.h};
  if(cx>=left.x&&cx<=left.x+left.w&&storePages[tab]>0){
    clearPendingStorePurchase();
    storePages[tab]--;
    playSfx('select');
    return true;
  }
  if(cx>=right.x&&cx<=right.x+right.w&&storePages[tab]<pages-1){
    clearPendingStorePurchase();
    storePages[tab]++;
    playSfx('select');
    return true;
  }
  return cx>=left.x&&cx<=right.x+right.w;
}
function drawLoadoutPanel(x,y,w,h,ship=selectedShipDef()){
  const core=selectedCoreDef();
  drawCutPanel(x,y,w,h,ship.color,false);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText('ロードアウト',x+14,y+14);
  ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=ship.color;
  fillFitText(`${displayName('ship',ship)} + ${displayName('core',core)} Lv.${selectedCoreLevel()}`,x+14,y+32,w-28);
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(slotText(ship),x+14,y+50,w-28);
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.gold;
  fillFitText(`${shipEffectText(ship)} / ${loadoutText(ship.id)}`,x+14,y+h-12,w-28);
}
function drawStoreShipCard(i,ship,startY){
  const cw=(W-36)/2,ch=92,gap=8,col=i%2,row=Math.floor(i/2);
  const cx=14+col*(cw+8),cy=startY+row*(ch+gap);
  const owned=meta.ownedShips[ship.id],sel=meta.selectedShip===ship.id;
  drawCutPanel(cx,cy,cw,ch,ship.color,sel);
  drawCraftInCard(cx+2,cy+2,cw-4,48,ship.id,'basic');
  ctx.fillStyle=h2r(ship.color,.75);
  ctx.fillRect(cx,cy,3,ch);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=h2r(ship.color,.9);
  fillFitText(`${ship.icon} / ${ship.role.toUpperCase()}`,cx+10,cy+57,cw-20);
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(displayName('ship',ship),cx+10,cy+72,cw-20);
  ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(shipEffectText(ship),cx+10,cy+85,cw-20);
  if(sel) drawStatusTag(cx+cw-86,cy+7,76,17,'セレクト中',HOYO_UI.gold,true);
  else if(owned) drawStatusTag(cx+cw-76,cy+7,66,17,'セレクト',HOYO_UI.jade,false);
  else if(isPendingStorePurchase('ship',ship.id)) drawStatusTag(cx+cw-76,cy+7,66,17,'確認中',HOYO_UI.rose,true);
  else drawTokenAmount(cx+cw-9,cy+16,ship.cost,'right',8);
}
function storePurchaseConfirmPanelRect(){
  return {x:14,y:546,w:W-28,h:104};
}
function storePurchaseConfirmButtonRect(kind){
  const p=storePurchaseConfirmPanelRect();
  const gap=10, bw=(p.w-36-gap)/2, by=p.y+58;
  return kind==='cancel'
    ? {x:p.x+18,y:by,w:bw,h:34}
    : {x:p.x+18+bw+gap,y:by,w:bw,h:34};
}
function drawStorePurchaseConfirmPanel(){
  const action=pendingStorePurchase;
  if(!action || action.tab!==storeTab) return;
  const p=storePurchaseConfirmPanelRect();
  ctx.save();
  ctx.fillStyle='rgba(5,6,7,.68)';
  ctx.fillRect(0,p.y-10,W,H-p.y+10);
  drawCutPanel(p.x,p.y,p.w,p.h,action.color,true);
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawStatusTag(p.x+14,p.y+14,48,28,action.icon,action.color,true);
  ctx.font=`900 14px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(action.title,p.x+74,p.y+20,p.w-150);
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(action.desc,p.x+74,p.y+40);
  drawTokenAmount(p.x+p.w-16,p.y+28,action.cost,'right',9);

  const cancel=storePurchaseConfirmButtonRect('cancel');
  const buy=storePurchaseConfirmButtonRect('buy');
  drawCutPanel(cancel.x,cancel.y,cancel.w,cancel.h,HOYO_UI.faint,false);
  drawCutPanel(buy.x,buy.y,buy.w,buy.h,meta.tokens>=action.cost?HOYO_UI.gold:HOYO_UI.faint,true);
  ctx.font=`900 13px ${UI_FONT}`;ctx.textAlign='center';
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('キャンセル',cancel.x+cancel.w/2,cancel.y+cancel.h/2+1);
  ctx.fillStyle=meta.tokens>=action.cost?HOYO_UI.gold:HOYO_UI.faint;
  ctx.fillText(action.kind.endsWith('Upgrade')?'強化する':'購入する',buy.x+buy.w/2,buy.y+buy.h/2+1);
  ctx.restore();
}
function drawStoreCoreCard(i,core,startY){
  const cw=(W-36)/2,ch=92,gap=8,col=i%2,row=Math.floor(i/2);
  const cx=14+col*(cw+8),cy=startY+row*(ch+gap);
  const owned=meta.ownedCores[core.id],sel=meta.selectedCore===core.id;
  drawCutPanel(cx,cy,cw,ch,core.color,sel);
  ctx.textAlign='center';ctx.textBaseline='middle';
  drawStatusTag(cx+9,cy+8,36,22,core.icon,core.color,sel);
  ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  ctx.fillText(fitText(displayName('core',core),cw-58),cx+cw/2,cy+27);
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(fitText(core.role,cw-22),cx+cw/2,cy+45);
  ctx.fillStyle=h2r(core.color,.86);
  ctx.font=`900 10px ${UI_FONT}`;
  ctx.fillText(fitText(multText(core.mult,true),cw-22),cx+cw/2,cy+61);
  if(sel) drawStatusTag(cx+cw/2-42,cy+70,84,17,'セット中',HOYO_UI.gold,true);
  else if(owned) drawStatusTag(cx+cw/2-32,cy+70,64,17,'セット',HOYO_UI.jade,false);
  else if(isPendingStorePurchase('core',core.id)) drawStatusTag(cx+cw/2-32,cy+70,64,17,'確認中',HOYO_UI.rose,true);
  else drawTokenAmount(cx+cw/2,cy+79,core.cost,'center',8);
}
function drawStorePartCard(i,part,startY){
  const cw=(W-36)/2,ch=80,gap=8,col=i%2,row=Math.floor(i/2);
  const cx=14+col*(cw+8),cy=startY+row*(ch+gap);
  const owned=meta.ownedParts[part.id];
  const mounted=partMountedShip(part.id)===meta.selectedShip;
  const info=partInfo(part);
  drawCutPanel(cx,cy,cw,ch,part.color,mounted);
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawStatusTag(cx+8,cy+8,30,20,part.icon,part.color,mounted);
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=h2r(part.color,.88);
  fillFitText(`${info.tier} / ${partTypeName(part.type)}`,cx+44,cy+16,cw-88);
  ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(displayName('part',part),cx+10,cy+36,cw-20);
  ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(partEffectText(part),cx+10,cy+53,cw-20);
  ctx.fillStyle=part.color;ctx.font=`900 10px ${UI_FONT}`;
  fillFitText(multText(part.mult,true),cx+10,cy+68,cw-20);
  if(mounted) drawStatusTag(cx+cw-74,cy+7,64,17,'装着中',HOYO_UI.gold,true);
  else if(owned) drawStatusTag(cx+cw-70,cy+7,60,17,partSlotStatus(part),HOYO_UI.jade,false);
  else if(isPendingStorePurchase('part',part.id)) drawStatusTag(cx+cw-70,cy+7,60,17,'確認中',HOYO_UI.rose,true);
  else drawTokenAmount(cx+cw-8,cy+16,part.cost,'right',8);
  ctx.textAlign='right';ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.faint;
  ctx.fillText(owned?'倉庫':partSlotStatus(part),cx+cw-8,cy+38);
}
function drawStoreDroneCard(i,drone,startY){
  const cw=(W-36)/2,ch=86,gap=8,col=i%2,row=Math.floor(i/2);
  const cx=14+col*(cw+8),cy=startY+row*(ch+gap);
  const owned=!!meta.ownedDrones[drone.id], lv=droneLevel(drone.id), cost=owned?droneUpgradeCost(drone.id):drone.cost;
  drawCutPanel(cx,cy,cw,ch,drone.color,owned);
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawStatusTag(cx+8,cy+8,32,22,drone.icon,drone.color,owned);
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=h2r(drone.color,.9);
  fillFitText(`${drone.role} / ${drone.mult.count||1}機`,cx+46,cy+17,cw-92);
  ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(drone.name,cx+10,cy+39,cw-20);
  ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(`火力 x${(drone.mult.damage+lv*.18).toFixed(2)} / 全ドローン火力 ${fmtMult(purchasedDroneDamageMult())}`,cx+10,cy+57,cw-20);
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=drone.color;
  ctx.fillText(owned?`Lv.${lv}  次 +18%`:'購入で自動射撃',cx+10,cy+72);
  if(isPendingStorePurchase(owned?'droneUpgrade':'drone',drone.id)) drawStatusTag(cx+cw-70,cy+7,60,17,'確認中',HOYO_UI.rose,true);
  else if(owned) drawTokenAmount(cx+cw-8,cy+16,cost,'right',8);
  else drawTokenAmount(cx+cw-8,cy+16,cost,'right',8);
}
function drawStoreScreen(){
  drawBg();ctx.save();
  drawSubBackdrop(.78);
  drawSubHeader('ストア');
  drawTabRow(STORE_TABS,STORE_LABELS,storeTab,62);
  const cy=102;
  if(storeTab==='ship'){
    const items=visibleStoreDefs('ship');
    for(let i=0;i<items.length;i++) drawStoreShipCard(i,items[i],cy);
  }else if(storeTab==='core'){
    const core=selectedCoreDef(),lv=selectedCoreLevel(),uc=coreUpgradeCost(),can=meta.tokens>=uc;
    drawCutPanel(14,cy,W-28,46,can?HOYO_UI.gold:core.color,can);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=core.color;
    fillFitText(`${core.icon} ${displayName('core',core)}  Lv.${lv} > ${lv+1}`,26,cy+17,W-128);
    ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=can?HOYO_UI.gold:HOYO_UI.muted;
    ctx.fillText(isPendingStorePurchase('coreUpgrade',core.id)?'強化確認中':(can?'コアアップ可能':'トークン不足'),26,cy+33);
    drawTokenAmount(W-22,cy+23,uc,'right',9);
    const items=visibleStoreDefs('core');
    for(let i=0;i<items.length;i++) drawStoreCoreCard(i,items[i],cy+58);
  }else{
    if(storeTab==='drone'){
      const ownedCount=purchasedDroneCount(), power=purchasedDroneDamageMult();
      drawCutPanel(14,cy,W-28,56,HOYO_UI.blue,ownedCount>0);
      ctx.textAlign='left';ctx.textBaseline='middle';
      ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.blue;
      ctx.fillText(`支援ドローン ${ownedCount}機 / 火力 ${fmtMult(power)}`,26,cy+18);
      ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
      ctx.fillText('購入したドローンはバトル中に自動射撃します。',26,cy+38);
      const items=visibleStoreDefs('drone');
      for(let i=0;i<items.length;i++) drawStoreDroneCard(i,items[i],cy+66);
    }else{
    drawLoadoutPanel(14,cy,W-28,72);
    const items=visibleStoreDefs('part');
    for(let i=0;i<items.length;i++) drawStorePartCard(i,items[i],cy+74);
    }
  }
  drawStorePager(storeTab);
  drawStorePurchaseConfirmPanel();
  ctx.restore();
}
const WAREHOUSE_TABS=['ship','turret','armor','drone','coreBoost'];
const WAREHOUSE_TAB_LABELS={ship:'機体',turret:'砲台',armor:'装甲',drone:'ドローン',coreBoost:'コア拡張'};
function hitTwoColCard(cx,cy,count,startY,ch,gap=8){
  const cw=(W-36)/2;
  for(let i=0;i<count;i++){
    const col=i%2,row=Math.floor(i/2);
    const x=14+col*(cw+8),y=startY+row*(ch+gap);
    if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch) return i;
  }
  return -1;
}
function handleStoreClick(cx,cy){
  if(hitBackBtn(cx,cy)){clearPendingStorePurchase();homeState='home';return;}
  const tab=hitTabRow(cx,cy,STORE_TABS,62);
  if(tab){clearPendingStorePurchase();storeTab=tab;normalizeStorePage(storeTab);return;}
  if(handleStorePager(cx,cy,storeTab)) return;
  const cy0=102;
  if(pendingStorePurchase&&pendingStorePurchase.tab===storeTab){
    const cancel=storePurchaseConfirmButtonRect('cancel');
    const buy=storePurchaseConfirmButtonRect('buy');
    if(cx>=cancel.x&&cx<=cancel.x+cancel.w&&cy>=cancel.y&&cy<=cancel.y+cancel.h){
      clearPendingStorePurchase();
      playSfx('denied');
      return;
    }
    if(cx>=buy.x&&cx<=buy.x+buy.w&&cy>=buy.y&&cy<=buy.y+buy.h){
      confirmStorePurchase();
      return;
    }
    const panel=storePurchaseConfirmPanelRect();
    if(cy>=panel.y-10){
      clearPendingStorePurchase();
      return;
    }
  }
  if(storeTab==='ship'){
    const items=visibleStoreDefs('ship');
    const idx=hitTwoColCard(cx,cy,items.length,cy0,92,8);
    if(idx>=0) requestShipPurchase(items[idx].id);
  }else if(storeTab==='core'){
    if(cx>=14&&cx<=W-14&&cy>=cy0&&cy<=cy0+46){requestCoreUpgrade();return;}
    const items=visibleStoreDefs('core');
    const idx=hitTwoColCard(cx,cy,items.length,cy0+58,92,8);
    if(idx>=0) requestCorePurchase(items[idx].id);
  }else if(storeTab==='drone'){
    const items=visibleStoreDefs('drone');
    const idx=hitTwoColCard(cx,cy,items.length,cy0+66,86,8);
    if(idx>=0) requestDronePurchase(items[idx].id);
  }else{
    const items=visibleStoreDefs('part');
    const idx=hitTwoColCard(cx,cy,items.length,cy0+74,80,8);
    if(idx>=0) requestPartPurchase(items[idx].id);
  }
}

// ── 倉庫画面 ──
function drawWarehouseCorePanel(x,y,w,h){
  const core=selectedCoreDef(),lv=selectedCoreLevel();
  drawCutPanel(x,y,w,h,core.color,true);
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawStatusTag(x+12,y+12,42,28,core.icon,core.color,true);
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText('選択中コア',x+66,y+16);
  ctx.font=`900 15px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(`${displayName('core',core)}  Lv.${lv}`,x+66,y+34,w-154);
  ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(`${core.role} / ${multText(core.mult,true)}`,x+66,y+52,w-86);
  ctx.textAlign='right';
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=core.color;
  ctx.fillText('変更はストア',x+w-16,y+18);
}
function drawWarehouseShipCard(i,ship,startY){
  const cw=(W-36)/2,ch=98,gap=8,col=i%2,row=Math.floor(i/2);
  const x=14+col*(cw+8),y=startY+row*(ch+gap);
  const sel=meta.selectedShip===ship.id;
  drawCutPanel(x,y,cw,ch,ship.color,sel);
  drawCraftInCard(x,y,cw,50,ship.id,meta.selectedCore);
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=sel?HOYO_UI.text:ship.color;
  fillFitText(displayName('ship',ship),x+cw/2,y+60,cw-16);
  ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(shipEffectText(ship),x+cw/2,y+75,cw-16);
  ctx.fillStyle=sel?HOYO_UI.gold:HOYO_UI.muted;
  ctx.fillText(sel?'セレクト中':'タップでセレクト',x+cw/2,y+90);
}
function drawWarehousePartCard(i,part,startY,ship){
  const cw=(W-36)/2,ch=82,gap=8,col=i%2,row=Math.floor(i/2);
  const x=14+col*(cw+8),y=startY+row*(ch+gap);
  const mounted=partMountedShip(part.id)===ship.id;
  const onOther=partMountedShip(part.id)&&!mounted;
  const limit=ship.slots[part.type]||0;
  const cur=(mountedForShip(ship.id)[part.type]||[]).length;
  const info=partInfo(part);
  const canMount=limit>0&&(mounted||cur<limit);
  drawCutPanel(x,y,cw,ch,part.color,mounted);
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawStatusTag(x+8,y+8,32,20,part.icon,part.color,mounted||canMount);
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=h2r(part.color,.9);
  fillFitText(`${info.tier} / ${partTypeName(part.type)}`,x+48,y+16,cw-112);
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(displayName('part',part),x+10,y+38,cw-20);
  ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  fillFitText(partEffectText(part),x+10,y+55,cw-20);
  ctx.fillStyle=part.color;ctx.font=`900 10px ${UI_FONT}`;
  fillFitText(multText(part.mult,true),x+10,y+70,cw-20);
  if(mounted) drawStatusTag(x+cw-70,y+7,60,17,'セット中',HOYO_UI.gold,true);
  else if(onOther) drawStatusTag(x+cw-68,y+7,58,17,'他機体',HOYO_UI.gold,false);
  else if(limit<=0) drawStatusTag(x+cw-68,y+7,58,17,'枠なし',HOYO_UI.faint,false);
  else drawStatusTag(x+cw-68,y+7,58,17,cur<limit?'セット':'満杯',cur<limit?HOYO_UI.jade:HOYO_UI.muted,false);
}
function drawWarehouseScreen(){
  drawBg();ctx.save();
  drawSubBackdrop(.78);
  drawSubHeader('倉庫',false);
  drawWarehouseCorePanel(14,62,W-28,60);
  drawTabRow(WAREHOUSE_TABS,WAREHOUSE_TAB_LABELS,warehouseTab,132,30);
  const startY=176;
  if(warehouseTab==='ship'){
    const owned=SHIP_DEFS.filter(s=>meta.ownedShips[s.id]);
    for(let i=0;i<owned.length;i++) drawWarehouseShipCard(i,owned[i],startY);
  }else{
    const ship=selectedShipDef();
    const type=warehouseTab;
    const limit=ship.slots[type]||0;
    const cur=(mountedForShip(ship.id)[type]||[]).length;
    drawCutPanel(14,startY-10,W-28,48,ship.color,false);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=ship.color;
    fillFitText(`${displayName('ship',ship)} / ${WAREHOUSE_TAB_LABELS[type]}`,26,startY+6,W-112);
    ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
    ctx.fillText(`スロット ${cur}/${limit}`,26,startY+27);
    ctx.textAlign='right';ctx.fillStyle=limit>0?HOYO_UI.gold:HOYO_UI.faint;
    ctx.fillText(limit>0?'パーツをタップでセット':'この機体は枠なし',W-26,startY+27);
    const owned=PART_DEFS.filter(p=>p.type===type&&meta.ownedParts[p.id]);
    const listY=startY+50;
    if(owned.length===0){
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle=HOYO_UI.muted;ctx.font=`900 13px ${UI_FONT}`;
      ctx.fillText(`${WAREHOUSE_TAB_LABELS[type]}パーツなし / ストアでゲット`,W/2,listY+38);
    }
    for(let i=0;i<owned.length;i++) drawWarehousePartCard(i,owned[i],listY,ship);
  }
  ctx.restore();
}
function handleWarehouseClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const tab=hitTabRow(cx,cy,WAREHOUSE_TABS,132,30);
  if(tab){warehouseTab=tab;return;}
  const startY=176;
  if(warehouseTab==='ship'){
    const owned=SHIP_DEFS.filter(s=>meta.ownedShips[s.id]);
    const cw=(W-36)/2,ch=98,gap=8;
    for(let i=0;i<owned.length;i++){
      const col=i%2,row=Math.floor(i/2);
      const x=14+col*(cw+8),y=startY+row*(ch+gap);
      if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch){buyOrSelectShip(owned[i].id);return;}
    }
  }else{
    const owned=PART_DEFS.filter(p=>p.type===warehouseTab&&meta.ownedParts[p.id]);
    const listY=startY+50;
    const cw=(W-36)/2,ch=82,gap=8;
    for(let i=0;i<owned.length;i++){
      const col=i%2,row=Math.floor(i/2);
      const x=14+col*(cw+8),y=listY+row*(ch+gap);
      if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch){toggleMountPart(owned[i].id);return;}
    }
  }
}

// ── アップグレード画面（基礎ステータス恒久強化） ──
function drawUpgradeScreen(){
  drawBg();ctx.save();
  drawSubBackdrop(.80);
  drawSubHeader('アップグレード');
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('ベースアップ / アップごとに必要トークン上昇',W/2,61);
  const startY=76,cw=(W-36)/2,ch=64,gapY=8;
  for(let i=0;i<BASIC_STAT_DEFS.length;i++){
    const d=BASIC_STAT_DEFS[i],col=i%2,row=Math.floor(i/2);
    const x=14+col*(cw+8),y=startY+row*(ch+gapY);
    const lv=meta.homeUpgrades[d.id]||0,cost=homeUpgradeCost(d.id),can=meta.tokens>=cost;
    drawCutPanel(x,y,cw,ch,d.color,can);
    ctx.textAlign='left';ctx.textBaseline='middle';
    drawStatusTag(x+8,y+10,32,20,d.icon,d.color,lv>0);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;ctx.fillText(statName(d.id),x+48,y+16);
    ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle=d.color;ctx.fillText(`Lv.${lv}`,x+48,y+32);
    ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;ctx.fillText(homeStatBonus(d.id),x+10,y+52);
    drawTokenAmount(x+cw-8,y+18,cost,'right',8);
    drawStatusTag(x+cw-57,y+39,47,16,can?'UP':'不足',can?HOYO_UI.gold:HOYO_UI.faint,can);
  }
  ctx.restore();
}
function handleUpgradeClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const startY=76,cw=(W-36)/2,ch=64,gapY=8;
  for(let i=0;i<BASIC_STAT_DEFS.length;i++){
    const col=i%2,row=Math.floor(i/2);
    const x=14+col*(cw+8),y=startY+row*(ch+gapY);
    if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch){buyHomeUpgrade(BASIC_STAT_DEFS[i].id);return;}
  }
}

// ── 図鑑画面 ──
function codexItems(){
  if(codexTab==='basic'){
    return BASIC_STAT_DEFS.map(d=>({
      id:d.id,
      name:statName(d.id),
      icon:d.icon,
      color:d.color,
      meta:basicGainText(d.id,0),
      desc:homeStatBonus(d.id)==='未アップ' ? 'バトル中とアップグレードで強化可能。' : homeStatBonus(d.id)
    }));
  }
  return SPECIAL_DEFS.map(d=>({
    id:d.id,
    name:UI_COPY.special[d.id] || d.name,
    icon:d.icon,
    color:d.color,
    meta:'Lv.1',
    desc:d.desc(1)
  }));
}
function codexPageCount(){
  return Math.max(1,Math.ceil(codexItems().length/CODEX.pageSize));
}
function drawCodexRow(item,x,y,w,h){
  drawCutPanel(x,y,w,h,item.color,false);
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawStatusTag(x+9,y+10,34,20,item.icon,item.color,false);
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  ctx.fillText(trimText(item.name,24),x+52,y+18);
  ctx.textAlign='right';
  drawStatusTag(x+w-72,y+9,58,18,trimText(item.meta,8),item.color,false);
  ctx.textAlign='left';ctx.font=`bold 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(trimText(item.desc,42),x+14,y+42);
}
function drawCodexScreen(){
  drawBg();ctx.save();
  drawSubBackdrop(.80);
  drawSubHeader('アーカイブ');
  drawTabRow(['special','basic'],{special:'アビリティ',basic:'ベース'},codexTab,58);
  const items=codexItems();
  const pages=codexPageCount();
  codexPage=Math.max(0,Math.min(pages-1,codexPage));
  const start=codexPage*CODEX.pageSize;
  const pageItems=items.slice(start,start+CODEX.pageSize);
  for(let i=0;i<pageItems.length;i++){
    drawCodexRow(pageItems[i],14,CODEX.startY+i*(CODEX.rowH+6),W-28,CODEX.rowH);
  }
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(codexTab==='special'?'特殊アビリティはレベルアップ時にセレクトできます。':'ベース能力はバトル中とアップグレードで伸ばせます。',W/2,590);
  const py=CODEX.pagerY, leftX=W/2-CODEX.btnW-14, rightX=W/2+14;
  const canPrev=codexPage>0, canNext=codexPage<pages-1;
  for(const b of [
    {x:leftX,label:'前へ',on:canPrev},
    {x:rightX,label:'次へ',on:canNext},
  ]){
    drawCutPanel(b.x,py,CODEX.btnW,CODEX.btnH,b.on?HOYO_UI.blue:HOYO_UI.faint,b.on);
    ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=b.on?HOYO_UI.blue:HOYO_UI.faint;
    ctx.fillText(b.label,b.x+CODEX.btnW/2,py+CODEX.btnH/2);
  }
  ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(`${codexPage+1} / ${pages}`,W/2,py+CODEX.btnH+18);
  ctx.restore();
}
function handleCodexClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const tab=hitTabRow(cx,cy,['special','basic'],58);
  if(tab){codexTab=tab;codexPage=0;return;}
  const py=CODEX.pagerY,leftX=W/2-CODEX.btnW-14,rightX=W/2+14,pages=codexPageCount();
  if(cy>=py&&cy<=py+CODEX.btnH){
    if(cx>=leftX&&cx<=leftX+CODEX.btnW&&codexPage>0){codexPage--;return;}
    if(cx>=rightX&&cx<=rightX+CODEX.btnW&&codexPage<pages-1){codexPage++;return;}
  }
}

// ── 設定画面 ──
function audioSettingsRows(startY=318){
  return [
    {key:'sound',label:'マスター音量',desc:'すべての音を切り替えます。',color:HOYO_UI.blue,y:startY},
    {key:'music',label:'BGM',desc:'バトル中のミュージック。',color:'#b96cff',y:startY+60},
    {key:'sfx',label:'SE',desc:'ショット・ヒット・アップ音。',color:HOYO_UI.gold,y:startY+120},
  ];
}
function drawAudioSettingsRows(startY=318){
  const bx=24,bw=W-48,bh=50;
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawSectionLabel('サウンド',24,startY-24,HOYO_UI.gold);
  for(const row of audioSettingsRows(startY)){
    const on=!!meta.settings[row.key];
    drawCutPanel(bx,row.y,bw,bh,row.color,on);
    ctx.font=`900 14px ${UI_FONT}`;
    ctx.fillStyle=on?HOYO_UI.text:HOYO_UI.faint;
    ctx.fillText(row.label,bx+18,row.y+18);
    ctx.font=`bold 11px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.muted;
    ctx.fillText(row.desc,bx+18,row.y+36);
    const tx=bx+bw-70,ty=row.y+13,tw=52,th=24;
    cutPanel(tx,ty,tw,th,10);
    ctx.fillStyle=on?h2r(row.color,.35):'rgba(232,232,240,.08)';ctx.fill();
    ctx.strokeStyle=on?h2r(row.color,.76):'rgba(232,232,240,.18)';ctx.lineWidth=1;cutPanel(tx,ty,tw,th,10);ctx.stroke();
    ctx.beginPath();ctx.arc(tx+(on?tw-14:14),ty+th/2,8,0,Math.PI*2);
    ctx.fillStyle=on?row.color:'rgba(232,232,240,.38)';ctx.fill();
    ctx.textAlign='right';
    ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle=on?'#e8e8f0':'rgba(232,232,240,.34)';
    ctx.fillText(on?'オン':'オフ',tx-8,ty+th/2+1);
    ctx.textAlign='left';
  }
}
function handleAudioSettingsClick(cx,cy,startY=318){
  const bx=24,bw=W-48,bh=50;
  for(const row of audioSettingsRows(startY)){
    if(cx>=bx&&cx<=bx+bw&&cy>=row.y&&cy<=row.y+bh){
      setAudioToggle(row.key);
      return true;
    }
  }
  return false;
}
function resetDataButtonRect(){
  return {x:24,y:552,w:W-48,h:54};
}
function drawResetDataButton(){
  const b=resetDataButtonRect();
  const confirming=resetConfirmFrames>0;
  drawSectionLabel('セーブデータ',24,b.y-20,HOYO_UI.rose);
  drawCutPanel(b.x,b.y,b.w,b.h,HOYO_UI.rose,confirming);
  drawStatusTag(b.x+12,b.y+14,56,26,confirming?'確認':'RESET',HOYO_UI.rose,confirming);
  ctx.textAlign='left';
  ctx.textBaseline='middle';
  ctx.font=`900 14px ${UI_FONT}`;
  ctx.fillStyle=confirming?HOYO_UI.rose:HOYO_UI.text;
  ctx.fillText(confirming?'もう一度タップで初期化':'データ初期化',b.x+82,b.y+19);
  ctx.font=`bold 11px ${UI_FONT}`;
  ctx.fillStyle=confirming?HOYO_UI.text:HOYO_UI.muted;
  ctx.fillText(confirming?'この操作は取り消せません。':'トークン・機体・強化を初期状態に戻します。',b.x+82,b.y+38);
}
function hitResetDataButton(cx,cy){
  const b=resetDataButtonRect();
  return cx>=b.x&&cx<=b.x+b.w&&cy>=b.y&&cy<=b.y+b.h;
}
function handleResetDataClick(){
  if(resetConfirmFrames>0){
    resetSaveData();
    return;
  }
  resetConfirmFrames=RESET_CONFIRM_FRAMES;
  shake(2);
  addFloat(W/2,532,'もう一度タップで初期化',HOYO_UI.rose,11);
  playSfx('select');
}
function drawSettingsScreen(){
  drawBg();ctx.save();
  if(resetConfirmFrames>0) resetConfirmFrames--;
  drawSubBackdrop(.80);
  drawSubHeader('オプション');
  ctx.textAlign='left';ctx.textBaseline='middle';
  drawSectionLabel('操作方法',24,88,HOYO_UI.gold);
  const modes=[
    {id:'buttons',label:'タップ操作',desc:'触れた位置へ移動します。',color:HOYO_UI.blue},
    {id:'stick',label:'ドラッグスティック',desc:'仮想スティックで移動します。',color:HOYO_UI.jade},
  ];
  const bx=24, by=110, bw=W-48, bh=70, gap=12;
  for(let i=0;i<modes.length;i++){
    const m=modes[i], y=by+i*(bh+gap), active=touchControlMode()===m.id;
    drawCutPanel(bx,y,bw,bh,m.color,active);
    drawStatusTag(bx+12,y+17,48,36,i===0?'TAP':'DRAG',m.color,active);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 15px ${UI_FONT}`;ctx.fillStyle=active?m.color:HOYO_UI.text;
    ctx.fillText(m.label,bx+74,y+24);ctx.shadowBlur=0;
    ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
    ctx.fillText(m.desc,bx+74,y+47);
    drawStatusTag(bx+bw-92,y+24,72,21,active?'使用中':'変更',active?HOYO_UI.gold:m.color,active);
    ctx.textAlign='left';
  }
  drawAudioSettingsRows();
  drawResetDataButton();
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.faint;
  ctx.textAlign='center';
  ctx.fillText('BGMファイルは public/audio に配置できます。',W/2,516);
  ctx.restore();
}
function handleSettingsClick(cx,cy){
  if(hitBackBtn(cx,cy)){resetConfirmFrames=0;homeState='home';return;}
  const bx=24, by=110, bw=W-48, bh=70, gap=12;
  const modes=['buttons','stick'];
  if(hitResetDataButton(cx,cy)){handleResetDataClick();return;}
  for(let i=0;i<modes.length;i++){
    const y=by+i*(bh+gap);
    if(cx>=bx&&cx<=bx+bw&&cy>=y&&cy<=y+bh){resetConfirmFrames=0;setTouchControlMode(modes[i]);return;}
  }
  if(handleAudioSettingsClick(cx,cy)){resetConfirmFrames=0;return;}
  resetConfirmFrames=0;
}

// ── ホーム画面 ──
function drawHomeScreen(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(6,6,14,.72)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(12,16,28,.72)';ctx.fillRect(0,0,W,52);
  ctx.strokeStyle='rgba(232,232,240,.12)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(W,52);ctx.stroke();
  ctx.font='34px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.shadowColor='#00f0ff';ctx.shadowBlur=8;ctx.fillStyle='#00f0ff';
  ctx.fillText('BARRAGE',16,27);ctx.shadowBlur=0;
  drawTokenAmount(W-16,27,meta.tokens,'right',10);
  const ship=selectedShipDef();
  rr(14,60,W-28,110,8);
  const cg=ctx.createLinearGradient(14,60,W-14,170);
  cg.addColorStop(0,h2r(ship.color,.16));cg.addColorStop(1,'rgba(6,6,14,.5)');
  ctx.fillStyle=cg;ctx.fill();
  ctx.strokeStyle=h2r(ship.color,.30);ctx.lineWidth=1;rr(14,60,W-28,110,8);ctx.stroke();
  ctx.fillStyle=h2r(ship.color,.52);ctx.fillRect(14,60,3,110);
  drawCraft(W/2,108,1.0);
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#e8e8f0';ctx.fillText(ship.name,W/2,152);
  ctx.font='13px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.48)';
  ctx.fillText(`CORE: ${selectedCoreDef().name}  Lv.${selectedCoreLevel()}  │  ${ship.role}`,W/2,164);

  const actionBg=ctx.createLinearGradient(0,330,0,H);
  actionBg.addColorStop(0,'rgba(6,6,14,0)');
  actionBg.addColorStop(.34,'rgba(12,16,28,.62)');
  actionBg.addColorStop(1,'rgba(6,6,14,.92)');
  ctx.fillStyle=actionBg;
  ctx.fillRect(0,330,W,H-330);
  ctx.strokeStyle='rgba(232,232,240,.08)';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(18,356);ctx.lineTo(W-18,356);ctx.stroke();

  drawBtn(W/2-BTN_W/2,HOME_START_Y,BTN_W,BTN_H,'スタート','#ff2d78');
  for(let i=0;i<HOME_NAV_BTNS.length;i++){
    const b=HOME_NAV_BTNS[i],col=i%2,row=Math.floor(i/2);
    const bx=HOME_NAV.x+col*(HOME_NAV.w+HOME_NAV.gapX),by=HOME_NAV.y+row*(HOME_NAV.h+HOME_NAV.gapY);
    rr(bx,by,HOME_NAV.w,HOME_NAV.h,6);ctx.fillStyle='rgba(232,232,240,.045)';ctx.fill();
    ctx.shadowColor=b.color;ctx.shadowBlur=3;ctx.strokeStyle=h2r(b.color,.42);ctx.lineWidth=1;
    rr(bx,by,HOME_NAV.w,HOME_NAV.h,6);ctx.stroke();ctx.shadowBlur=0;
    ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=h2r(b.color,.88);ctx.shadowColor=b.color;ctx.shadowBlur=0;
    ctx.fillText(b.label,bx+HOME_NAV.w/2,by+HOME_NAV.h/2);ctx.shadowBlur=0;
  }
  if(canShowInstallAction()){
    rr(INSTALL_BTN.x,INSTALL_BTN.y,INSTALL_BTN.w,INSTALL_BTN.h,5);
    ctx.fillStyle='rgba(0,221,119,.12)';ctx.fill();
    ctx.strokeStyle='#00dd77';ctx.lineWidth=1.4;rr(INSTALL_BTN.x,INSTALL_BTN.y,INSTALL_BTN.w,INSTALL_BTN.h,5);ctx.stroke();
    ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#00dd77';ctx.shadowColor='#00dd77';ctx.shadowBlur=8;
    ctx.fillText(installPromptEvent?'アプリを追加':'ホームに追加',W/2,INSTALL_BTN.y+INSTALL_BTN.h/2);
    ctx.shadowBlur=0;
  }
  ctx.restore();
}
function drawHomeScreenV2(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(4,6,12,.54)';ctx.fillRect(0,0,W,H);

  const top=ctx.createLinearGradient(0,0,0,96);
  top.addColorStop(0,'rgba(4,6,12,.96)');
  top.addColorStop(.66,'rgba(22,24,32,.70)');
  top.addColorStop(1,'rgba(4,6,12,0)');
  ctx.fillStyle=top;ctx.fillRect(0,0,W,96);
  ctx.fillStyle=HOYO_UI.goldSoft;ctx.fillRect(14,16,3,30);
  ctx.font=`900 31px ${DISPLAY_FONT}`;ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.shadowColor=HOYO_UI.gold;ctx.shadowBlur=5;ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('BARRAGE',24,32);ctx.shadowBlur=0;
  ctx.font=`bold 12px ${UI_FONT}`;
  ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('ネオン迎撃プラットフォーム',25,52);
  drawTokenAmount(W-16,31,meta.tokens,'right',10);

  const ship=selectedShipDef(), core=selectedCoreDef();
  const hx=16, hy=74, hw=W-32, hh=254;
  drawHoyoPanel(hx,hy,hw,hh,10,HOYO_UI.gold);
  ctx.fillStyle=h2r(ship.color,.28);ctx.fillRect(hx,hy+16,3,hh-32);
  ctx.fillStyle='rgba(238,247,255,.050)';
  ctx.fillRect(hx+14,hy+42,hw-28,1);
  ctx.fillRect(hx+14,hy+196,hw-28,1);
  ctx.save();
  ctx.beginPath();ctx.rect(hx,hy,hw,hh);ctx.clip();
  ctx.strokeStyle='rgba(238,247,255,.055)';ctx.lineWidth=1;
  for(let i=-4;i<9;i++){
    const y=hy+138+i*18;
    ctx.beginPath();ctx.moveTo(hx+18,y);ctx.lineTo(hx+hw-18,y+34);ctx.stroke();
  }
  ctx.strokeStyle=h2r(ship.color,.22);ctx.lineWidth=1.1;
  ctx.beginPath();ctx.ellipse(W/2,hy+142,118,44,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(W/2,hy+142,76,26,0,0,Math.PI*2);ctx.stroke();
  ctx.restore();

  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`bold 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText('セレクト中のマシン',hx+18,hy+20);
  ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  ctx.fillText(ship.name,hx+18,hy+39);
  ctx.textAlign='right';ctx.font=`bold 12px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(`コア ${core.name} / Lv.${selectedCoreLevel()}`,hx+hw-18,hy+39);

  ctx.save();
  ctx.shadowColor=ship.color;ctx.shadowBlur=24;
  drawCraft(W/2,hy+132,1.28);
  ctx.restore();

  ctx.textAlign='center';
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.fillText(slotText(ship).slice(0,54),W/2,hy+214);
  ctx.fillStyle=h2r(ship.color,.76);
  ctx.fillText(loadoutText(ship.id).slice(0,58),W/2,hy+232);

  const actionBg=ctx.createLinearGradient(0,330,0,H);
  actionBg.addColorStop(0,'rgba(4,6,12,0)');
  actionBg.addColorStop(.30,'rgba(8,10,18,.72)');
  actionBg.addColorStop(1,'rgba(4,6,12,.96)');
  ctx.fillStyle=actionBg;ctx.fillRect(0,330,W,H-330);

  const sx=W/2-BTN_W/2, sy=HOME_START_Y;
  rr(sx,sy,BTN_W,BTN_H,10);
  const sg=ctx.createLinearGradient(sx,sy,sx+BTN_W,sy+BTN_H);
  sg.addColorStop(0,'rgba(184,167,255,.32)');
  sg.addColorStop(.50,'rgba(184,167,255,.16)');
  sg.addColorStop(1,'rgba(10,12,20,.90)');
  ctx.fillStyle=sg;ctx.fill();
  ctx.strokeStyle=HOYO_UI.goldSoft;ctx.lineWidth=1.4;rr(sx,sy,BTN_W,BTN_H,10);ctx.stroke();
  ctx.fillStyle=HOYO_UI.goldSoft;ctx.fillRect(sx,sy+8,5,BTN_H-16);
  ctx.font=`900 24px ${DISPLAY_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor=HOYO_UI.gold;ctx.shadowBlur=6;ctx.fillStyle=HOYO_UI.text;
  ctx.fillText('スタート',W/2,sy+BTN_H/2+2);ctx.shadowBlur=0;

  for(let i=0;i<HOME_NAV_VIEW.length;i++){
    const b=HOME_NAV_VIEW[i],col=i%2,row=Math.floor(i/2);
    const bx=HOME_NAV.x+col*(HOME_NAV.w+HOME_NAV.gapX),by=HOME_NAV.y+row*(HOME_NAV.h+HOME_NAV.gapY);
    rr(bx,by,HOME_NAV.w,HOME_NAV.h,8);
    const ng=ctx.createLinearGradient(bx,by,bx+HOME_NAV.w,by+HOME_NAV.h);
    ng.addColorStop(0,'rgba(238,247,255,.070)');
    ng.addColorStop(1,'rgba(10,13,22,.86)');
    ctx.fillStyle=ng;ctx.fill();
    ctx.strokeStyle=HOYO_UI.line;ctx.lineWidth=1;rr(bx,by,HOME_NAV.w,HOME_NAV.h,8);ctx.stroke();
    ctx.fillStyle=h2r(b.color,.36);ctx.fillRect(bx,by+8,3,HOME_NAV.h-16);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 14px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
    ctx.fillText(b.label,bx+14,by+21);
    ctx.font=`11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
    ctx.fillText(b.sub,bx+14,by+39);
    ctx.textAlign='right';ctx.font=`bold 14px ${UI_FONT}`;
    ctx.fillStyle=HOYO_UI.faint;
    ctx.fillText('>',bx+HOME_NAV.w-12,by+HOME_NAV.h/2);
  }
  if(canShowInstallAction()){
    rr(INSTALL_BTN.x,INSTALL_BTN.y,INSTALL_BTN.w,INSTALL_BTN.h,5);
    ctx.fillStyle='rgba(0,221,119,.10)';ctx.fill();
    ctx.strokeStyle='rgba(0,221,119,.54)';ctx.lineWidth=1;rr(INSTALL_BTN.x,INSTALL_BTN.y,INSTALL_BTN.w,INSTALL_BTN.h,5);ctx.stroke();
    ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#00dd77';
    ctx.fillText(installPromptEvent?'アプリを追加':'ホームに追加',W/2,INSTALL_BTN.y+INSTALL_BTN.h/2);
  }
  ctx.restore();
}
function drawHomeScreenV3(){
  drawBg();ctx.save();
  drawSubBackdrop(.54);

  drawBarrageLogo(0,0,1);
  drawHomeTokenBadge();

  const ship=selectedShipDef(), core=selectedCoreDef();
  const hx=14, hy=78, hw=W-28, hh=276;
  drawCutPanel(hx,hy,hw,hh,ship.color,true);
  ctx.save();
  ctx.beginPath();ctx.rect(hx,hy,hw,hh);ctx.clip();
  ctx.fillStyle=h2r(ship.color,.10);
  ctx.fillRect(hx,hy,hw,hh);
  ctx.fillStyle='rgba(0,0,0,.18)';
  ctx.fillRect(hx,hy+hh-74,hw,74);
  ctx.strokeStyle='rgba(238,247,255,.060)';ctx.lineWidth=1;
  for(let i=-3;i<9;i++){
    const y=hy+24+i*30;
    ctx.beginPath();ctx.moveTo(hx+28,y);ctx.lineTo(hx+hw-28,y+72);ctx.stroke();
  }
  ctx.fillStyle=h2r(HOYO_UI.gold,.88);
  cutPanel(hx+16,hy+14,104,30,8);ctx.fill();
  ctx.fillStyle=HOYO_UI.ink;
  ctx.font=`900 14px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('SELECTED',hx+68,hy+30);
  ctx.restore();
  drawHighScoreBadge(hx+hw-128,hy+16,108,58);

  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=`900 28px ${DISPLAY_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(displayName('ship',ship),hx+20,hy+73,214);
  ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=h2r(ship.color,.95);
  fillFitText(ship.role.toUpperCase(),hx+21,hy+99,178);

  drawCutPanel(hx+20,hy+118,143,48,HOYO_UI.gold,false);
  ctx.font=`900 9px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.gold;
  ctx.fillText('コアモジュール',hx+34,hy+136);
  ctx.font=`900 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.text;
  fillFitText(`${displayName('core',core)}  Lv.${selectedCoreLevel()}`,hx+34,hy+153,112);

  ctx.save();
  ctx.shadowColor=ship.color;ctx.shadowBlur=30;
  drawCraft(hx+hw-118,hy+132,1.56);
  ctx.restore();

  const infoY=hy+190;
  drawCutPanel(hx+18,infoY,hw-36,54,ship.color,false);
  ctx.font=`bold 11px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
  ctx.textAlign='left';
  fillFitText(slotText(ship),hx+32,infoY+20,hw-64);
  ctx.font=`900 12px ${UI_FONT}`;ctx.fillStyle=ship.color;
  fillFitText(loadoutText(ship.id),hx+32,infoY+39,hw-64);
  drawCheckpointButton();

  const sx=W/2-BTN_W/2, sy=HOME_START_Y;
  drawCutPanel(sx,sy,BTN_W,BTN_H,HOYO_UI.gold,true);
  ctx.fillStyle=HOYO_UI.gold;
  cutPanel(sx+2,sy+2,BTN_W-4,BTN_H-4,13);ctx.fill();
  ctx.fillStyle='rgba(7,8,8,.20)';ctx.fillRect(sx+8,sy+8,5,BTN_H-16);
  ctx.font=`900 31px ${DISPLAY_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=HOYO_UI.ink;
  ctx.fillText('スタート',W/2,sy+BTN_H/2+1);
  ctx.font=`900 10px ${UI_FONT}`;ctx.fillStyle='rgba(7,8,8,.70)';
  ctx.fillText('READY',W/2,sy+BTN_H-9);

  for(let i=0;i<HOME_NAV_VIEW.length;i++){
    const b=HOME_NAV_VIEW[i],col=i%2,row=Math.floor(i/2);
    const bx=HOME_NAV.x+col*(HOME_NAV.w+HOME_NAV.gapX),by=HOME_NAV.y+row*(HOME_NAV.h+HOME_NAV.gapY);
    drawCutPanel(bx,by,HOME_NAV.w,HOME_NAV.h,b.color,false);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font=`900 13px ${UI_FONT}`;ctx.fillStyle=h2r(b.color,.98);
    fillFitText(b.label,bx+15,by+19,HOME_NAV.w-42);
    ctx.font=`bold 10px ${UI_FONT}`;ctx.fillStyle=HOYO_UI.muted;
    fillFitText(b.sub,bx+15,by+38,HOME_NAV.w-34);
    ctx.fillStyle=h2r(b.color,.88);
    ctx.font=`900 16px ${UI_FONT}`;
    ctx.textAlign='right';
    ctx.fillText('>',bx+HOME_NAV.w-12,by+HOME_NAV.h/2+1);
  }
  if(canShowInstallAction()){
    drawCutPanel(INSTALL_BTN.x,INSTALL_BTN.y,INSTALL_BTN.w,INSTALL_BTN.h,HOYO_UI.jade,false);
    ctx.font=`900 12px ${UI_FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=HOYO_UI.jade;
    ctx.fillText(installPromptEvent?'アプリを追加':'ホームに追加',W/2,INSTALL_BTN.y+INSTALL_BTN.h/2);
  }
  ctx.restore();
}
function drawStartScreen(){
  if(homeState==='store'){drawStoreScreen();return;}
  if(homeState==='warehouse'){drawWarehouseScreen();return;}
  if(homeState==='upgrade'){drawUpgradeScreen();return;}
  if(homeState==='codex'){drawCodexScreen();return;}
  if(homeState==='settings'){drawSettingsScreen();return;}
  drawHomeScreenV3();
}
function drawGameOver(){
  ctx.save();
  ctx.fillStyle='rgba(6,6,14,.82)'; ctx.fillRect(0,0,W,H);
  ctx.font='66px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor='#ff2d78'; ctx.shadowBlur=12; ctx.fillStyle='#ff2d78';
  ctx.fillText('GAME OVER',W/2,H/2-74); ctx.shadowBlur=0;
  ctx.font='14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle='#c8c8e0';
  ctx.fillText(`SCORE   ${formatCompactNumber(score)} / HI ${formatCompactNumber(meta.highScore.score)}`,W/2,H/2+6);
  ctx.fillText(`WAVE    ${wave} / BEST ${formatCompactNumber(highScoreWave())}`,W/2,H/2+30);
  ctx.globalAlpha=tokensEarned>0?1:.45;
  drawTokenAmount(W/2,H/2+54,`+${tokensEarned}`,'center',14);
  ctx.globalAlpha=1;
  drawBtn(W/2-BTN_W/2,GAME_OVER_RETRY_Y,BTN_W,BTN_H,'リトライ','#00f0ff');
  drawBtn(W/2-BTN_W/2,GAME_OVER_HOME_Y,BTN_W,BTN_H,'ホーム','#88aaff');
  if(canUseHighScoreCheckpoint()) drawBtn(W/2-BTN_W/2,GAME_OVER_CHECKPOINT_Y,BTN_W,BTN_H,`WAVE ${highScoreCheckpointWave()}`,'#b8a7ff');
  ctx.restore();
}

// ─────────────────────────────────────
//  ゲーム開始・終了
// ─────────────────────────────────────
function startGame(startWave=1){
  unlockAudio();
  invalidateLoadoutCache();
  const loadout=getLoadoutSnapshot();
  const startAt=Math.max(1,Math.floor(Number(startWave)||1));
  runStartWave=startAt;
  state='play'; score=0; coins=0; wave=startAt; frame=0; hp=100; maxHp=100;
  maxHp=Math.ceil(100*bodyMult('hp')); hp=maxHp;
  xp=0; xpLevel=0; hitXpBank=0; tokensEarned=0; invincible=0; skillPoints=(loadout.ship.id==='coreOnly'?2:1)+Math.max(0,startAt-1); fireTimer=0; regenBank=0; shield=0; shieldCooldown=0; droneTimer=0; bitTimer=0; shotSeq=0; waveBanner=startAt>1?120:0; waveFrame=0;
  arrows=[];enemies=[];enemyBullets=[];particles=[];epOrbs=[];floatTexts=[];pendingSpecials=[];upgradeZones=[];
  statLevels   ={fireRate:0,bulletSpeed:0,damage:0,range:0,hp:0,xpMult:0,speed:0,critChance:0,critDamage:0,regen:0};
  specialLevels=makeSpecialLevels();
  player.x=W/2; player.y=PLAYER_Y; player.prevX=player.x; player.prevY=player.y;
  if(startAt>1) addFloat(W/2,86,`CHECKPOINT WAVE ${startAt}`,HOYO_UI.gold,13);
  if(startAt%BOSS_WAVE_INTERVAL===0) spawnBoss();
  resetBgmTrack(true);
  playBgm();
  playSfx('start');
}
function endGame(){
  if(state!=='dead'){
    recordRunHighScore();
    awardTokens();
  }
  state='dead';
  pauseBgm();
  playSfx('dead');
}
function returnHome(){
  if(state==='play'||state==='pause'){
    recordRunHighScore();
    awardTokens();
  }
  state='start';
  homeState='home';
  pauseView='menu';
  stopTouchMove();
  activePointerId=null;
  arrows=[];enemies=[];enemyBullets=[];epOrbs=[];upgradeZones=[];pendingSpecials=[];
  pauseBgm();
}
function canShowInstallAction(){
  return !appInstalled && (installPromptEvent || hasTouchInput);
}
async function installApp(){
  if(installPromptEvent){
    const promptEvent=installPromptEvent;
    installPromptEvent=null;
    promptEvent.prompt();
    const choice=await promptEvent.userChoice.catch(()=>null);
    if(choice?.outcome==='accepted') appInstalled=true;
    return;
  }
  addFloat(W/2,H-110,'共有からホームに追加','#00dd77',11);
  shake(3);
}
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  installPromptEvent=e;
});
window.addEventListener('appinstalled',()=>{
  appInstalled=true;
  installPromptEvent=null;
});
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}

// ─────────────────────────────────────
//  入力
// ─────────────────────────────────────
window.addEventListener('keydown',e=>{
  unlockAudio();
  keys[e.key]=true;
  if(e.key==='Enter'||e.key===' '){if(state==='start'||state==='dead') startGame();}
  if(e.key==='Escape'){
    if(state==='play') pauseGame();
    else if(state==='pause') resumeGame();
    else if(state==='skillTree') closeSkillTree();
  }
});
window.addEventListener('keyup',e=>{keys[e.key]=false;});
function canvasPoint(e){
  const rect=canvas.getBoundingClientRect();
  const cx=(e.clientX-rect.left)*(W/rect.width);
  const cy=(e.clientY-rect.top)*(H/rect.height);
  mouseX=cx;
  mouseY=cy;
  return {cx,cy,rect};
}
function startTouchMove(cx){
  touchTargetX=Math.max(player.size,Math.min(W-player.size,cx));
  touchDir=touchTargetX<player.x-6?-1:(touchTargetX>player.x+6?1:0);
  touchAxis=touchDir;
}
function startStickMove(cx,cy){
  const minY=H-HUD_B+8, maxY=H-24;
  stickState.active=true;
  stickState.baseX=Math.max(TOUCH_STICK.baseR+10,Math.min(W-TOUCH_STICK.baseR-10,cx));
  stickState.baseY=Math.max(minY,Math.min(maxY,cy));
  updateStickMove(cx,cy);
}
function updateStickMove(cx,cy){
  if(!stickState.active) return;
  const dx=Math.max(-TOUCH_STICK.max,Math.min(TOUCH_STICK.max,cx-stickState.baseX));
  const dy=Math.max(-TOUCH_STICK.max,Math.min(TOUCH_STICK.max,cy-stickState.baseY));
  const axis=dx/TOUCH_STICK.max;
  touchAxis=Math.abs(axis)<TOUCH_STICK.dead ? 0 : axis;
  touchDir=touchAxis<-TOUCH_STICK.dead ? -1 : (touchAxis>TOUCH_STICK.dead ? 1 : 0);
  stickState.knobX=stickState.baseX+dx;
  stickState.knobY=stickState.baseY+dy;
}
function startTouchControl(cx,cy){
  if(touchControlMode()==='stick') startStickMove(cx,cy);
  else startTouchMove(cx);
}
function updateTouchControl(cx,cy){
  if(touchControlMode()==='stick') updateStickMove(cx,cy);
  else startTouchMove(cx);
}
function stopTouchMove(){
  touchDir=0;
  touchAxis=0;
  touchTargetX=null;
  stickState.active=false;
  stickState.baseX=TOUCH_STICK.idleX;
  stickState.baseY=TOUCH_STICK.y;
  stickState.knobX=TOUCH_STICK.idleX;
  stickState.knobY=TOUCH_STICK.y;
}
function handleCanvasAction(cx,cy){
  unlockAudio();
  if(state==='specialUpgrade'){handleSpecialAt(cx,cy);return true;}
  if(state==='skillTree'){handleSkillTreeClick(cx,cy);return true;}
  if(state==='pause'){handlePauseClick(cx,cy);return true;}
  if(state==='play'&&hitPause(cx,cy)){pauseGame();return true;}
  if(state==='play'&&hitSkillOpen(cx,cy)){openSkillTree();return true;}
  if(state==='start'){
    if(homeState==='store'){handleStoreClick(cx,cy);return true;}
    if(homeState==='warehouse'){handleWarehouseClick(cx,cy);return true;}
    if(homeState==='upgrade'){handleUpgradeClick(cx,cy);return true;}
    if(homeState==='codex'){handleCodexClick(cx,cy);return true;}
    if(homeState==='settings'){handleSettingsClick(cx,cy);return true;}
    if(handleHomeClick(cx,cy)) return true;
  }
  if(state==='dead'){
    if(hitRetry(cx,cy)){startGame();return true;}
    if(hitGameOverHome(cx,cy)){returnHome();return true;}
    if(hitGameOverCheckpoint(cx,cy)){startGame(highScoreCheckpointWave());return true;}
  }
  return false;
}
canvas.addEventListener('mousemove',e=>{
  canvasPoint(e);
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('selectstart',e=>e.preventDefault());
canvas.addEventListener('dragstart',e=>e.preventDefault());
// ホームボタン判定
function hitBtn(cx,cy){ return cx>W/2-BTN_W/2&&cx<W/2+BTN_W/2&&cy>HOME_START_Y&&cy<HOME_START_Y+BTN_H; }
function hitCheckpointStart(cx,cy){
  const r=checkpointButtonRect();
  return canUseHighScoreCheckpoint()&&cx>=r.x&&cx<=r.x+r.w&&cy>=r.y&&cy<=r.y+r.h;
}
function hitInstall(cx,cy){ return canShowInstallAction()&&cx>=INSTALL_BTN.x&&cx<=INSTALL_BTN.x+INSTALL_BTN.w&&cy>=INSTALL_BTN.y&&cy<=INSTALL_BTN.y+INSTALL_BTN.h; }
function hitRetry(cx,cy){ return cx>W/2-BTN_W/2&&cx<W/2+BTN_W/2&&cy>GAME_OVER_RETRY_Y&&cy<GAME_OVER_RETRY_Y+BTN_H; }
function hitGameOverHome(cx,cy){ return cx>W/2-BTN_W/2&&cx<W/2+BTN_W/2&&cy>GAME_OVER_HOME_Y&&cy<GAME_OVER_HOME_Y+BTN_H; }
function hitGameOverCheckpoint(cx,cy){ return canUseHighScoreCheckpoint()&&cx>W/2-BTN_W/2&&cx<W/2+BTN_W/2&&cy>GAME_OVER_CHECKPOINT_Y&&cy<GAME_OVER_CHECKPOINT_Y+BTN_H; }
function hitPause(cx,cy){ return cx>=PAUSE_BTN.x&&cx<=PAUSE_BTN.x+PAUSE_BTN.w&&cy>=PAUSE_BTN.y&&cy<=PAUSE_BTN.y+PAUSE_BTN.h; }
function hitNavBtn(cx,cy){
  for(let i=0;i<HOME_NAV_BTNS.length;i++){
    const col=i%2,row=Math.floor(i/2);
    const bx=HOME_NAV.x+col*(HOME_NAV.w+HOME_NAV.gapX);
    const by=HOME_NAV.y+row*(HOME_NAV.h+HOME_NAV.gapY);
    if(cx>=bx&&cx<=bx+HOME_NAV.w&&cy>=by&&cy<=by+HOME_NAV.h) return HOME_NAV_BTNS[i].id;
  }
  return null;
}
function handleHomeClick(cx,cy){
  if(hitInstall(cx,cy)){installApp();return true;}
  if(hitCheckpointStart(cx,cy)){startGame(highScoreCheckpointWave());return true;}
  if(hitBtn(cx,cy)){startGame();return true;}
  const nav=hitNavBtn(cx,cy);
  if(nav){homeState=nav;return true;}
  return false;
}

canvas.addEventListener('click',e=>{
  if(suppressNextClick){suppressNextClick=false;return;}
  const {cx,cy}=canvasPoint(e);
  handleCanvasAction(cx,cy);
});
if(window.PointerEvent){
  canvas.addEventListener('pointerdown',e=>{
    const {cx,cy}=canvasPoint(e);
    suppressNextClick=true;
    if(handleCanvasAction(cx,cy)) return;
    if(state==='play'){
      activePointerId=e.pointerId;
      canvas.setPointerCapture?.(e.pointerId);
      startTouchControl(cx,cy);
      e.preventDefault();
    }
  });
  canvas.addEventListener('pointermove',e=>{
    const {cx,cy}=canvasPoint(e);
    if(state==='play'&&activePointerId===e.pointerId){
      updateTouchControl(cx,cy);
      e.preventDefault();
    }
  });
  const endPointer=e=>{
    if(activePointerId===e.pointerId){
      canvas.releasePointerCapture?.(e.pointerId);
      activePointerId=null;
      stopTouchMove();
      e.preventDefault();
    }
  };
  canvas.addEventListener('pointerup',endPointer);
  canvas.addEventListener('pointercancel',endPointer);
}else{
  canvas.addEventListener('touchstart',e=>{
    e.preventDefault();
    const t0=e.touches[0];
    const {cx,cy}=canvasPoint(t0);
    if(handleCanvasAction(cx,cy)) return;
    if(state==='play') startTouchControl(cx,cy);
  },{passive:false});
  canvas.addEventListener('touchmove',e=>{
    e.preventDefault();
    if(state!=='play') return;
    const {cx,cy}=canvasPoint(e.touches[0]);
    updateTouchControl(cx,cy);
  },{passive:false});
  canvas.addEventListener('touchend',e=>{e.preventDefault();stopTouchMove();},{passive:false});
  canvas.addEventListener('touchcancel',e=>{e.preventDefault();stopTouchMove();},{passive:false});
}

// ─────────────────────────────────────
//  ゲームループ
// ─────────────────────────────────────
function loop(){
  requestAnimationFrame(loop);

  if(state==='start'){
    updateParticles();updateFloatTexts();
    drawStartScreen();drawParticles();drawFloatTexts();return;
  }
  if(state==='dead'){
    drawBg();
    drawArrows();for(const e of enemies)drawEnemy(e);
    drawEnemyBullets();
    drawEpOrbs();drawStasisAura();drawSupportUnits();drawShield();drawPlayer();drawParticles();drawFloatTexts();
    drawGameOver();return;
  }
  if(state==='pause'){
    drawBg();
    drawArrows();
    for(const e of enemies)drawEnemy(e);
    drawEnemyBullets();
    drawEpOrbs();
    drawStasisAura();
    drawSupportUnits();
    drawShield();
    drawPlayer();
    drawParticles();
    drawFloatTexts();
    drawHUDZZZ();
    drawPauseMenuZZZ();
    return;
  }
  if(state==='specialUpgrade'){
    drawBg();updateParticles();updateEpOrbs();updateFloatTexts();
    drawParticles();drawEpOrbs();
    drawSpecialScreen();drawFloatTexts();return;
  }
  if(state==='skillTree'){
    // スキルツリー中はゲーム側の時間を完全停止する。
    drawFrozenPlayScene();
    drawUpgradeDrawer();
    drawFloatTexts();
    return;
  }

  // ── プレイ中 ──
  frame++;
  advanceWaveTimer();

  // シェイク計算
  let sx=0, sy=0;
  if(shakeT>0){shakeT--;const s=shakeAmp*(shakeT/14);sx=(Math.random()-.5)*s*2;sy=(Math.random()-.5)*s*2;}

  // 移動
  if(touchTargetX!==null){
    touchDir=touchTargetX<player.x-6?-1:(touchTargetX>player.x+6?1:0);
    touchAxis=touchDir;
  }
  let moveAxis=0;
  if(keys['ArrowLeft']||keys['a']||keys['A']) moveAxis-=1;
  if(keys['ArrowRight']||keys['d']||keys['D']) moveAxis+=1;
  if(Math.abs(touchAxis)>0) moveAxis+=touchAxis;
  moveAxis=Math.max(-1,Math.min(1,moveAxis));
  const spd=moveSpeed();
  player.prevX=player.x;
  player.prevY=player.y;
  player.x+=spd*moveAxis;
  player.x=Math.max(player.size, Math.min(W-player.size, player.x));

  // トレイル
  // 発射
  fireTimer++;
  const shotInterval=fireInterval();
  if(fireTimer>=shotInterval){fireTimer-=shotInterval;fireArrows();}

  // 敵スポーン
  if(frame>GRACE_FRAMES&&waveFrame>0){
    const sr=Math.max(65,175-wave*11);
    if(waveFrame%sr===0){const n=1+Math.floor(wave/6);for(let i=0;i<n;i++)spawnEnemy();}
  }

  // ゲートタイマー
  // 更新
  updateSupportUnits();updateShield();updateArrows();updateEnemyBullets();updateEpOrbs();updateParticles();updateFloatTexts();
  const stasisActive=specialLevels.stasisAura>0;
  const stasisR=stasisActive?stasisRadius():0;
  const stasisR2=stasisR*stasisR;
  const stasisSlow=stasisActive?stasisMult():1;
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];
    const slow=stasisActive&&distSq(player.x,player.y,e.x,e.y)<stasisR2?stasisSlow:1;
    if(e.boss) updateBoss(e,slow);
    else{
      e.x+=e.vx*slow;e.y+=e.vy*slow;
      e.rot+=e.rotSpd*slow;
      if(e.y>H+e.size*2) removeAtFast(enemies,i);
    }
  }
  checkCollisions();

  // 描画（シェイク付き）
  ctx.save();
  ctx.translate(sx,sy);
  drawBg();
  drawArrows();
  for(const e of enemies)drawEnemy(e);
  drawEnemyBullets();
  drawEpOrbs();
  drawStasisAura();
  drawSupportUnits();
  drawShield();
  drawPlayer();
  drawParticles();
  drawFloatTexts();
  drawWaveBanner();
  ctx.restore();

  // HUDはシェイクの外で描画
  drawHUDZZZ();
  drawTouchControls();
}

// ─────────────────────────────────────
//  初期化
// ─────────────────────────────────────
loadMeta();
resizeCanvas();
initBg();
loop();

