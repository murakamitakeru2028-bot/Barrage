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
const REROLL_COST  = 5;
const TOKEN_SCORE_UNIT = 100;
const BODY_STAT_GROWTH = 1.05;
const MAX_PARTICLES = 120;
const MAX_EP_ORBS   = 42;
const MAX_ARROWS    = 140;
const MAX_FLOAT_TEXTS = 28;
const GRACE_FRAMES  = 120;
const ENEMY_HP_BASE = 58;
const ENEMY_HP_LINEAR = 32;
const ENEMY_HP_QUAD = 2.8;
const ENEMY_HP_EXP = 1.035;
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
const HUD_T         = 32;   // 上部HUD高さ
const HUD_B         = 132;  // 下部HUD高さ
const PLAYER_Y      = H - HUD_B - 48;

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let renderScaleX = 1, renderScaleY = 1;
let bgBaseGradient=null, bgNebulaA=null, bgNebulaB=null, bgScanGradient=null;
let hudTopGradient=null, hudBottomGradient=null, pauseButtonGradient=null;

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, rect.width || W);
  const cssH = Math.max(1, rect.height || H);
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
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
  ctx.imageSmoothingQuality = 'high';
}

window.addEventListener('resize', resizeCanvas);
if(window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas);

// ─────────────────────────────────────
//  定義テーブル
// ─────────────────────────────────────
const BASIC_STAT_DEFS = [
  { id:'fireRate',    name:'連射速度', icon:'FR', color:'#00f0ff' },
  { id:'bulletSpeed', name:'弾速',     icon:'▶▶', color:'#ffe040' },
  { id:'damage',      name:'ダメージ', icon:'⚔',  color:'#ff6020' },
  { id:'range',       name:'射程距離', icon:'RG', color:'#88aaff' },
  { id:'hp',          name:'HP強化',   icon:'❤',  color:'#ff2d78' },
  { id:'xpMult',      name:'経験値',   icon:'★',  color:'#00dd77' },
  { id:'speed',       name:'移動速度', icon:'⇄',   color:'#66ccff' },
  { id:'critChance',  name:'会心率',   icon:'※',   color:'#ffb000' },
  { id:'critDamage',  name:'会心倍率', icon:'✹',   color:'#ff7040' },
  { id:'regen',       name:'自動回復', icon:'＋',  color:'#ff7ad9' },
];
const BASIC_SKILL_TREE = [
  { id:'fireRate',    x:195, y:118, requires:null },
  { id:'damage',      x:92,  y:212, requires:'fireRate' },
  { id:'bulletSpeed', x:298, y:212, requires:'fireRate' },
  { id:'critChance',  x:74,  y:318, requires:'damage' },
  { id:'hp',          x:195, y:318, requires:'damage' },
  { id:'speed',       x:316, y:318, requires:'bulletSpeed' },
  { id:'critDamage',  x:100, y:432, requires:'critChance' },
  { id:'regen',       x:195, y:432, requires:'hp' },
  { id:'xpMult',      x:290, y:432, requires:'speed' },
];
const BODY_UPGRADE_DEFS = [
  { id:'hp',       name:'HP',       icon:'❤', color:'#ff2d78', label:'最大HP' },
  { id:'defense',  name:'防御力',   icon:'⬡', color:'#66ccff', label:'被ダメ軽減' },
  { id:'attack',   name:'攻撃力',   icon:'⚔', color:'#ff6020', label:'攻撃倍率' },
  { id:'fireRate', name:'連射速度', icon:'FR', color:'#00f0ff', label:'連射倍率' },
];
const SHIP_DEFS = [
  { id:'coreOnly', name:'NU-00 ネイキッド', icon:'●', role:'裸核駆動', cost:0, color:'#00f0ff', slots:{turret:0,armor:0,drone:0,coreBoost:0}, mult:{hp:.85,defense:.9,attack:1,fireRate:1.05} },
  { id:'standard', name:'AF-01 アーク', icon:'◇', role:'汎用フレーム', cost:6, color:'#00f0ff', slots:{turret:1,armor:1,drone:1,coreBoost:1}, mult:{hp:1,defense:1,attack:1,fireRate:1} },
  { id:'striker',  name:'VX-03 レイザー', icon:'◆', role:'強襲砲撃型', cost:8, color:'#ff6020', slots:{turret:2,armor:0,drone:1,coreBoost:1}, mult:{hp:.92,defense:.95,attack:1.08,fireRate:1.05} },
  { id:'guardian', name:'BG-12 バルワーク', icon:'⬡', role:'重装防壁型', cost:8, color:'#66ccff', slots:{turret:1,armor:2,drone:0,coreBoost:1}, mult:{hp:1.18,defense:1.12,attack:.96,fireRate:.94} },
  { id:'carrier',  name:'DR-07 ハイヴ', icon:'◉', role:'ドローン母機', cost:10, color:'#ffe040', slots:{turret:0,armor:1,drone:2,coreBoost:1}, mult:{hp:1.05,defense:1,attack:1,fireRate:1.04} },
];
const CORE_DEFS = [
  { id:'basic',   name:'C-0 シード', icon:'●', role:'標準演算核', cost:0,  color:'#00f0ff', mult:{hp:1,defense:1,attack:1,fireRate:1} },
  { id:'assault', name:'C-A ブレイズ', icon:'◆', role:'火力偏向核', cost:8,  color:'#ff6020', mult:{hp:.95,defense:.95,attack:1.18,fireRate:1.04} },
  { id:'reactor', name:'C-R パルス', icon:'✦', role:'高速反応核', cost:10, color:'#ffe040', mult:{hp:.95,defense:1,attack:1.04,fireRate:1.18} },
];
const PART_DEFS = [
  { id:'cannon',   name:'T-ランス砲台', icon:'⚔', type:'turret',    cost:6, color:'#ff6020', mult:{attack:1.12} },
  { id:'barrel',   name:'T-クイック砲身', icon:'FR', type:'turret',    cost:6, color:'#00f0ff', mult:{fireRate:1.12} },
  { id:'plate',    name:'A-ミラー装甲', icon:'⬡', type:'armor',     cost:6, color:'#66ccff', mult:{defense:1.15} },
  { id:'frame',    name:'A-バイタル骨格', icon:'❤', type:'armor',     cost:6, color:'#ff2d78', mult:{hp:1.12} },
  { id:'droneBay', name:'D-ハッチ', icon:'◉', type:'drone',   cost:7, color:'#9cff6a', mult:{attack:1.06,fireRate:1.06} },
  { id:'bitLink',  name:'D-リンクアレイ', icon:'◆', type:'drone',     cost:7, color:'#e8e8f0', mult:{fireRate:1.10} },
  { id:'coreLink', name:'C-同期回路', icon:'∞', type:'coreBoost', cost:8, color:'#cc00ff', mult:{hp:1.05,defense:1.05,attack:1.05,fireRate:1.05} },
  { id:'overclock', name:'C-過励起輪', icon:'✹', type:'coreBoost', cost:8, color:'#ffb000', mult:{attack:1.08,fireRate:1.08} },
];
const STAT_LABELS={hp:'HP',defense:'DEF',attack:'ATK',fireRate:'FR'};
const PART_INFO={
  cannon:{tier:'RARE',desc:'Heavy turret: stronger main shots.'},
  barrel:{tier:'RARE',desc:'Quick barrel: faster firing cycle.'},
  plate:{tier:'RARE',desc:'Armor plate: reduces incoming damage.'},
  frame:{tier:'RARE',desc:'Vital frame: expands max HP.'},
  droneBay:{tier:'EPIC',desc:'Drone bay: balanced combat output.'},
  bitLink:{tier:'EPIC',desc:'Bit link: high-rate support control.'},
  coreLink:{tier:'EPIC',desc:'Core link: small bonus to all systems.'},
  overclock:{tier:'EPIC',desc:'Overclock ring: attack and fire-rate bias.'},
};
const SLOT_ORDER=['turret','armor','drone','coreBoost'];
const SPECIAL_DEFS = [
  { id:'multiShot', name:'マルチショット', icon:'↑↑↑', color:'#00f0ff', desc:lv=>`弾数 +${lv}本 / 1発威力 ${Math.round(100/Math.pow(1+lv,MULTISHOT_DAMAGE_EXP))}%` },
  { id:'homing',    name:'ホーミング',     icon:'⊕',   color:'#cc00ff', desc:lv=>`誘導力 Lv.${lv}` },
  { id:'piercing',  name:'貫通',           icon:'◆',   color:'#ffe040', desc:lv=>`${lv}体まで貫通` },
  { id:'powerShot', name:'強化弾',         icon:'✦',   color:'#ff6020', desc:lv=>`ダメージ +${lv*30}%` },
  { id:'gatling',   name:'Gatling', icon:'////', color:'#00dd77', desc:lv=>`Fire rate +${Math.round(gatlingFireBonus(lv)*100)}% / DMG ${Math.round(gatlingDamageScale(lv)*100)}% / SIZE ${Math.round(gatlingBulletScale(lv)*100)}%` },
  { id:'supportDrone', name:'支援ドローン', icon:'◉', color:'#66ccff', desc:lv=>`${lv}機が旋回射撃` },
  { id:'explosive',    name:'炸裂弾',       icon:'✹', color:'#ff7040', desc:lv=>`半径${34+lv*6}pxの範囲攻撃` },
  { id:'ricochet',     name:'跳弾',         icon:'↯', color:'#ffe040', desc:lv=>`${lv}回まで跳ね返る` },
  { id:'chainLightning', name:'電撃チェーン', icon:'ϟ', color:'#9cff6a', desc:lv=>`${lv+1}体へ連鎖` },
  { id:'adrenaline',   name:'背水陣',       icon:'血', color:'#ff2d78', desc:lv=>`低HP時 火力/連射 +${lv*25}%` },
  { id:'statSynergy',  name:'ステータス変換', icon:'∞', color:'#cc00ff', desc:lv=>`弾速増加を威力へ変換 Lv.${lv}` },
  { id:'stasisAura',   name:'停滞フィールド', icon:'◎', color:'#88aaff', desc:lv=>`近距離の敵を減速 Lv.${lv}` },
  { id:'energyShield', name:'自動防壁',     icon:'⬡', color:'#00f0ff', desc:lv=>`${1+Math.floor((lv-1)/3)}枚のシールド` },
  { id:'splitter',     name:'スプリット弾', icon:'✣', color:'#ffb000', desc:lv=>`命中/距離で${2+lv}発 / 分裂威力 ${Math.round(100*SPLIT_DAMAGE_BASE/Math.sqrt(2+lv))}%` },
  { id:'interceptor',  name:'迎撃ビット',   icon:'◆', color:'#e8e8f0', desc:lv=>`${lv}基が近敵を迎撃` },
];
const makeSpecialLevels = () => Object.fromEntries(SPECIAL_DEFS.map(d=>[d.id,0]));

// ─────────────────────────────────────
//  状態変数
// ─────────────────────────────────────
let state   = 'start';
let score   = 0, wave = 1, frame = 0;
let coins   = 0;
let tokensEarned = 0;
let hp      = 100, maxHp = 100;
let xp      = 0, xpLevel = 0, hitXpBank = 0;
let invincible = 0, skillPoints = 0, fireTimer = 0;
let regenBank = 0;
let shield = 0, shieldCooldown = 0, droneTimer = 0, bitTimer = 0;
let touchDir = 0, touchAxis = 0, touchTargetX = null, mouseX = -1, mouseY = -1;
let activePointerId = null, suppressNextClick = false;
let stickState = { active:false, baseX:W/2, baseY:H-166, knobX:W/2, knobY:H-166 };
let installPromptEvent = null, appInstalled = (window.matchMedia?.('(display-mode: standalone)').matches ?? false) || navigator.standalone === true;
let shakeT = 0, shakeAmp = 0;
let waveBanner = 0;

const keys = {};
let statLevels    = { fireRate:0, bulletSpeed:0, damage:0, range:0, hp:0, xpMult:0, speed:0, critChance:0, critDamage:0, regen:0 };
let specialLevels = makeSpecialLevels();

let arrows=[], enemies=[], particles=[];
let epOrbs=[], floatTexts=[];
let pendingSpecials=[];
let upgradeZones=[];
let bgStars=[], bgLines=[], bgBeams=[];
let player = { x:W/2, y:PLAYER_Y, prevX:W/2, prevY:PLAYER_Y, size:14 };
let meta = {
  tokens:0,
  upgrades:{ hp:0, defense:0, attack:0, fireRate:0 },
  homeUpgrades:{ fireRate:0, bulletSpeed:0, damage:0, range:0, hp:0, xpMult:0, speed:0, critChance:0, critDamage:0, regen:0 },
  selectedShip:'coreOnly',
  selectedCore:'basic',
  ownedShips:{coreOnly:true},
  ownedCores:{basic:true},
  ownedParts:{},
  coreLevels:{basic:0},
  mountedParts:{},
  settings:{ touchControl:'buttons' }
};
let homeState = 'home'; // 'home' | 'store' | 'warehouse' | 'upgrade' | 'settings' | 'codex'
let storeTab = 'ship';   // 'ship' | 'core' | 'part'
let warehouseTab = 'ship'; // 'ship' | 'part'
let codexTab = 'special';
let codexPage = 0;
let pauseView = 'menu';

// ─────────────────────────────────────
//  ステータス計算
// ─────────────────────────────────────
const xpThresh  = () => Math.floor(XP_BASE * Math.pow(1.6, xpLevel));
const statMultFor = lv => Math.pow(BASIC_STAT_GROWTH, lv);
// ホームアップグレード（永続）＋ゲーム内スキルツリー（一時）を合算した実効レベル
const effectiveStatLevel = id => statLevels[id] + (meta.homeUpgrades?.[id] || 0);
const statMult    = id => statMultFor(effectiveStatLevel(id));
const bodyLevel = id => meta.upgrades[id] || 0;
const bodyMultFor = lv => Math.pow(BODY_STAT_GROWTH, lv);
const selectedShipDef = () => SHIP_DEFS.find(s=>s.id===meta.selectedShip) || SHIP_DEFS[0];
const selectedCoreDef = () => CORE_DEFS.find(c=>c.id===meta.selectedCore) || CORE_DEFS[0];
const shipMult = id => selectedShipDef().mult[id] ?? 1;
const selectedCoreLevel = () => meta.coreLevels[meta.selectedCore] || 0;
const coreMult = id => (selectedCoreDef().mult[id] ?? 1) * Math.pow(1.04, selectedCoreLevel());
const mountedForShip = (shipId=meta.selectedShip) => meta.mountedParts[shipId] || {};
const mountedPartIds = (shipId=meta.selectedShip) => Object.values(mountedForShip(shipId)).flat();
const partsMult = id => mountedPartIds().reduce((m,pid)=>{
  const p=PART_DEFS.find(v=>v.id===pid);
  return m * (p?.mult?.[id] ?? 1);
},1);
const bodyMult = id => bodyMultFor(bodyLevel(id)) * shipMult(id) * coreMult(id) * partsMult(id);
const bodyUpgradeCost = id => 1 + bodyLevel(id);
// ホームアップグレードコスト: レベルごとに30%増加（青天井）
const homeUpgradeCost = id => {
  const lv=meta.homeUpgrades[id] || 0;
  return lv===0 ? 2 : Math.floor(4 * Math.pow(1.32, lv-1));
};
const coreUpgradeCost = () => 2 + selectedCoreLevel()*2;
const hpRatio   = () => maxHp>0 ? hp/maxHp : 0;
const adrenalinePower = () => specialLevels.adrenaline * .25 * (1-hpRatio());
const synergyMult = () => 1 + Math.max(0, statMult('bulletSpeed')-1) * specialLevels.statSynergy * .35;
const fireRate  = () => Math.max(1, 22 / (statMult('fireRate') * bodyMult('fireRate')));
const bulletSpd = () => 9 * statMult('bulletSpeed');
const arrowRange = () => BASE_ARROW_RANGE * statMult('range');
const damage    = () => (10 + wave*2) * statMult('damage') * bodyMult('attack') * (1 + specialLevels.powerShot*0.30) * (1+adrenalinePower()) * synergyMult();
const xpMult    = () => statMult('xpMult');
const moveSpeed = () => 3.7 * statMult('speed');
const critChance  = () => Math.min(1, effectiveStatLevel('critChance') * CRIT_STEP);
const doubleCritChance = () => Math.min(1, Math.max(0, effectiveStatLevel('critChance')-20) * CRIT_STEP);
const critDamage  = () => CRIT_BASE_DAMAGE * statMult('critDamage');
const regenPerSec = () => effectiveStatLevel('regen') * REGEN_STEP;
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
const fireInterval = () => Math.max(1, fireRate() * multiShotFireDelay() / ((1+adrenalinePower()) * gatlingFireMult()));
const shieldMax = () => specialLevels.energyShield>0 ? 1+Math.floor((specialLevels.energyShield-1)/3) : 0;
const stasisRadius = () => 72 + specialLevels.stasisAura*10;
const stasisMult = () => Math.max(.35, 1-specialLevels.stasisAura*.07);
const incomingDamage = amount => Math.max(1, Math.ceil(amount / bodyMult('defense')));
const fmtMult   = v => `x${v>=10 ? v.toFixed(1) : v.toFixed(2)}`;
const basicGainText = (id, lv=statLevels[id]) => {
  if(id==='regen') return `+${REGEN_STEP.toFixed(1)}/s`;
  if(id==='critChance'&&lv>=20) return '二重+5%';
  if(id==='range') return '+5% RANGE';
  return '+5%';
};
const critReadout = () => doubleCritChance()>0 ? `100% 二重${Math.round(doubleCritChance()*100)}%` : `${Math.round(critChance()*100)}%`;
function rollCritTier(){
  if(Math.random()>=critChance()) return 0;
  return Math.random()<doubleCritChance() ? 2 : 1;
}
const ownedSpecialCount = () => SPECIAL_DEFS.reduce((n,d)=>n+(specialLevels[d.id]>0?1:0),0);
function basicStatReadouts(){
  return [
    { label:'連射',   value:`${(60/fireInterval()).toFixed(1)}発/秒`,   color:'#00f0ff' },
    { label:'弾速',   value:`通常 ${fmtMult(statMult('bulletSpeed'))}`, color:'#ffe040' },
    { label:'威力',   value:`通常 ${fmtMult(statMult('damage'))}`,      color:'#ff6020' },
    { label:'射程',   value:`${Math.round(arrowRange())}`,              color:'#88aaff' },
    { label:'移動',   value:`通常 ${fmtMult(statMult('speed'))}`,       color:'#66ccff' },
    { label:'会心',   value:critReadout(),                              color:'#ffb000' },
    { label:'会心倍率', value:fmtMult(critDamage()),                    color:'#ff7040' },
    { label:'回復',   value:`${regenPerSec().toFixed(1)}HP/秒`,         color:'#ff7ad9' },
    { label:'HP',     value:`最大 ${fmtMult(maxHp/100)}`,              color:'#ff2d78' },
    { label:'経験値', value:fmtMult(xpMult()),                         color:'#00dd77' },
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
function loadMeta(){
  try{
    const raw=localStorage.getItem('barrage-meta');
    if(raw){
      const saved=JSON.parse(raw);
      const legacyLoad=!('selectedCore' in saved);
      meta.tokens=Number(saved.tokens)||0;
      for(const d of BODY_UPGRADE_DEFS) meta.upgrades[d.id]=Number(saved.upgrades?.[d.id])||0;
      for(const d of BASIC_STAT_DEFS) meta.homeUpgrades[d.id]=Number(saved.homeUpgrades?.[d.id])||0;
      meta.selectedShip=saved.selectedShip || 'coreOnly';
      meta.selectedCore=saved.selectedCore || 'basic';
      meta.ownedShips={coreOnly:true,...(saved.ownedShips||{})};
      meta.ownedCores={basic:true,...(saved.ownedCores||{})};
      meta.ownedParts={...(saved.ownedParts||{})};
      meta.coreLevels={basic:0,...(saved.coreLevels||{})};
      meta.mountedParts={...(saved.mountedParts||{})};
      meta.settings={touchControl:'buttons',...(saved.settings||{})};
      if(!['buttons','stick'].includes(meta.settings.touchControl)) meta.settings.touchControl='buttons';
      if(legacyLoad) meta.selectedShip='coreOnly';
      if(!meta.ownedShips[meta.selectedShip]) meta.selectedShip='coreOnly';
      if(!meta.ownedCores[meta.selectedCore]) meta.selectedCore='basic';
      normalizeMounts();
    }
  }catch(e){}
}
function saveMeta(){
  try{localStorage.setItem('barrage-meta',JSON.stringify(meta));}catch(e){}
}
const touchControlMode = () => meta.settings?.touchControl==='stick' ? 'stick' : 'buttons';
function setTouchControlMode(mode){
  meta.settings={touchControl:'buttons',...(meta.settings||{})};
  meta.settings.touchControl=mode==='stick' ? 'stick' : 'buttons';
  saveMeta();
  stopTouchMove();
  addFloat(W/2,142,meta.settings.touchControl==='stick'?'STICK CONTROL':'BUTTON CONTROL','#00f0ff',11);
}
function awardTokens(){
  const gain=Math.floor(score/TOKEN_SCORE_UNIT);
  if(gain<=0) return;
  meta.tokens+=gain;
  tokensEarned+=gain;
  saveMeta();
}
function buyBodyUpgrade(id){
  const cost=bodyUpgradeCost(id);
  if(meta.tokens<cost){
    addFloat(W/2,H-130,`TOKEN ${cost} REQUIRED`,'#ffe040',11);
    shake(3);
    return;
  }
  meta.tokens-=cost;
  meta.upgrades[id]++;
  saveMeta();
  const d=BODY_UPGRADE_DEFS.find(v=>v.id===id);
  burst(W/2,H-180,d.color,14);
  addFloat(W/2,H-150,`${d.icon} ${d.name} UP`,d.color,12);
}
function buyHomeUpgrade(id){
  const cost=homeUpgradeCost(id);
  if(meta.tokens<cost){
    addFloat(W/2,300,`TOKEN ${cost} REQUIRED`,'#ffe040',11);
    shake(3); return;
  }
  meta.tokens-=cost;
  meta.homeUpgrades[id]=(meta.homeUpgrades[id]||0)+1;
  saveMeta();
  const d=BASIC_STAT_DEFS.find(v=>v.id===id);
  burst(W/2,300,d.color,14);
  addFloat(W/2,280,`${d.icon} ${d.name} Lv.${meta.homeUpgrades[id]}`,d.color,12);
}
function homeStatBonus(id){
  const lv=meta.homeUpgrades[id]||0;
  if(lv===0) return '未強化';
  if(id==='regen') return `+${(lv*REGEN_STEP).toFixed(1)}HP/s`;
  if(id==='critChance') return `+${(lv*CRIT_STEP*100).toFixed(0)}% 会心`;
  return `×${Math.pow(BASIC_STAT_GROWTH,lv).toFixed(2)}`;
}
function normalizeMounts(){
  for(const ship of SHIP_DEFS){
    const mount=meta.mountedParts[ship.id] || {};
    for(const type of ['turret','armor','drone','coreBoost']){
      const limit=ship.slots[type]||0;
      mount[type]=(mount[type]||[]).filter(pid=>{
        const p=PART_DEFS.find(v=>v.id===pid);
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
function buyOrSelectShip(id){
  const ship=SHIP_DEFS.find(s=>s.id===id);
  if(!ship) return;
  if(meta.ownedShips[id]){
    meta.selectedShip=id;
    normalizeMounts();
    saveMeta();
    addFloat(W/2,156,`${ship.icon} ${ship.name} SELECT`,ship.color,11);
    return;
  }
  if(meta.tokens<ship.cost){
    addFloat(W/2,156,`TOKEN ${ship.cost} REQUIRED`,'#ffe040',11);
    shake(3);
    return;
  }
  meta.tokens-=ship.cost;
  meta.ownedShips[id]=true;
  meta.selectedShip=id;
  normalizeMounts();
  saveMeta();
  burst(W/2,170,ship.color,16);
  addFloat(W/2,156,`${ship.icon} ${ship.name} PURCHASED`,ship.color,11);
}
function buyOrMountCore(id){
  const core=CORE_DEFS.find(c=>c.id===id);
  if(!core) return;
  if(meta.ownedCores[id]){
    meta.selectedCore=id;
    saveMeta();
    addFloat(W/2,156,`${core.icon} ${core.name} MOUNT`,core.color,11);
    return;
  }
  if(meta.tokens<core.cost){
    addFloat(W/2,156,`TOKEN ${core.cost} REQUIRED`,'#ffe040',11);
    shake(3);
    return;
  }
  meta.tokens-=core.cost;
  meta.ownedCores[id]=true;
  meta.coreLevels[id]=0;
  meta.selectedCore=id;
  saveMeta();
  burst(W/2,170,core.color,16);
  addFloat(W/2,156,`${core.icon} ${core.name} PURCHASED`,core.color,11);
}
function upgradeMountedCore(){
  const cost=coreUpgradeCost();
  const core=selectedCoreDef();
  if(meta.tokens<cost){
    addFloat(W/2,156,`TOKEN ${cost} REQUIRED`,'#ffe040',11);
    shake(3);
    return;
  }
  meta.tokens-=cost;
  meta.coreLevels[core.id]=(meta.coreLevels[core.id]||0)+1;
  saveMeta();
  burst(W/2,170,core.color,16);
  addFloat(W/2,156,`${core.icon} CORE Lv.${meta.coreLevels[core.id]}`,core.color,11);
}
function buyPart(id){
  const part=PART_DEFS.find(p=>p.id===id);
  if(!part||meta.ownedParts[id]) return;
  if(meta.tokens<part.cost){
    addFloat(W/2,156,`TOKEN ${part.cost} REQUIRED`,'#ffe040',11);
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
  saveMeta();
  burst(W/2,170,part.color,16);
  addFloat(W/2,156,`${part.icon} ${part.name} ${autoMounted?'AUTO MOUNT':'PURCHASED'}`,part.color,11);
}
function toggleMountPart(id){
  const part=PART_DEFS.find(p=>p.id===id);
  if(!part||!meta.ownedParts[id]) return;
  normalizeMounts();
  const ship=selectedShipDef();
  const mount=meta.mountedParts[ship.id] || {};
  const list=mount[part.type] || [];
  if(list.includes(id)){
    mount[part.type]=list.filter(pid=>pid!==id);
    meta.mountedParts[ship.id]=mount;
    saveMeta();
    addFloat(W/2,156,`${part.icon} UNMOUNT`,part.color,11);
    return;
  }
  const otherShip=partMountedShip(id);
  if(otherShip){
    const other=meta.mountedParts[otherShip];
    other[part.type]=(other[part.type]||[]).filter(pid=>pid!==id);
  }
  const limit=ship.slots[part.type]||0;
  if(list.length>=limit){
    addFloat(W/2,156,`${part.type.toUpperCase()} SLOT FULL`,'#ffe040',11);
    shake(3);
    return;
  }
  list.push(id);
  mount[part.type]=list;
  meta.mountedParts[ship.id]=mount;
  saveMeta();
  addFloat(W/2,156,`${part.icon} MOUNTED`,part.color,11);
}

// ─────────────────────────────────────
//  ユーティリティ
// ─────────────────────────────────────
function h2r(hex,a){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
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
function shake(amp){ shakeT=14; shakeAmp=amp; }
function addFloat(x,y,text,color,size=13){
  if(floatTexts.length>=MAX_FLOAT_TEXTS) floatTexts.shift();
  floatTexts.push({x,y,text,color,size,life:65,maxLife:65,vy:-0.9});
}
const distSq = (ax,ay,bx,by) => {
  const dx=ax-bx, dy=ay-by;
  return dx*dx+dy*dy;
};
function nearestEnemy(x,y,exclude=null,range=Infinity){
  let near=null, nd2=range*range;
  for(const e of enemies){
    if(e===exclude) continue;
    const d2=distSq(e.x,e.y,x,y);
    if(d2<nd2){nd2=d2;near=e;}
  }
  return near;
}

// ─────────────────────────────────────
//  背景
// ─────────────────────────────────────
function initBg(){
  bgBaseGradient=ctx.createLinearGradient(0,0,W,H);
  bgBaseGradient.addColorStop(0,'#050713');
  bgBaseGradient.addColorStop(.52,'#070713');
  bgBaseGradient.addColorStop(1,'#04040b');
  bgNebulaA=ctx.createRadialGradient(W*.22,H*.17,8,W*.22,H*.17,230);
  bgNebulaA.addColorStop(0,'rgba(0,240,255,.13)');
  bgNebulaA.addColorStop(.42,'rgba(0,120,255,.045)');
  bgNebulaA.addColorStop(1,'rgba(0,0,0,0)');
  bgNebulaB=ctx.createRadialGradient(W*.88,H*.72,12,W*.88,H*.72,260);
  bgNebulaB.addColorStop(0,'rgba(255,45,120,.10)');
  bgNebulaB.addColorStop(.48,'rgba(204,0,255,.035)');
  bgNebulaB.addColorStop(1,'rgba(0,0,0,0)');
  bgScanGradient=ctx.createLinearGradient(0,0,0,H);
  bgScanGradient.addColorStop(0,'rgba(255,255,255,.018)');
  bgScanGradient.addColorStop(.5,'rgba(255,255,255,0)');
  bgScanGradient.addColorStop(1,'rgba(255,255,255,.012)');
  hudTopGradient=ctx.createLinearGradient(0,0,0,HUD_T+16);
  hudTopGradient.addColorStop(0,'rgba(6,6,14,.92)');
  hudTopGradient.addColorStop(.72,'rgba(6,6,14,.64)');
  hudTopGradient.addColorStop(1,'rgba(6,6,14,0)');
  hudBottomGradient=ctx.createLinearGradient(0,H-HUD_B-18,0,H);
  hudBottomGradient.addColorStop(0,'rgba(6,6,14,0)');
  hudBottomGradient.addColorStop(.4,'rgba(6,6,14,.82)');
  hudBottomGradient.addColorStop(1,'rgba(6,6,14,.97)');
  pauseButtonGradient=ctx.createLinearGradient(PAUSE_BTN.x,PAUSE_BTN.y,PAUSE_BTN.x+PAUSE_BTN.w,PAUSE_BTN.y+PAUSE_BTN.h);
  pauseButtonGradient.addColorStop(0,'rgba(232,232,240,.10)');
  pauseButtonGradient.addColorStop(.55,'rgba(12,16,28,.82)');
  pauseButtonGradient.addColorStop(1,'rgba(6,6,14,.90)');
  bgLines=[];
  for(let x=0;x<=W;x+=40) bgLines.push({t:'v',x});
  for(let y=0;y<=H;y+=40) bgLines.push({t:'h',y});
  bgStars=[];
  for(let i=0;i<105;i++) bgStars.push({
    x:Math.random()*W, y:Math.random()*H,
    r:Math.random()*1.5+.25,
    layer:Math.random()<.72?0:1,
    phase:Math.random()*Math.PI*2,
    spd:Math.random()*.018+.006
  });
  bgBeams=[];
  for(let i=0;i<8;i++) bgBeams.push({
    x:-W+Math.random()*W*2,
    y:Math.random()*H,
    len:90+Math.random()*170,
    spd:.12+Math.random()*.32,
    a:.025+Math.random()*.045,
    c:Math.random()<.55?'0,240,255':'255,45,120'
  });
}
function drawBg(){
  const t=(globalThis.performance?.now?.() ?? Date.now())*.001;
  ctx.fillStyle=bgBaseGradient; ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=bgNebulaA;ctx.fillRect(0,0,W,H);
  ctx.fillStyle=bgNebulaB;ctx.fillRect(0,0,W,H);
  ctx.restore();

  const gridShift=(t*8)%40;
  ctx.strokeStyle='rgba(0,240,255,0.026)'; ctx.lineWidth=.5;
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

  ctx.strokeStyle='rgba(255,45,120,0.020)'; ctx.setLineDash([5,18]); ctx.lineWidth=1;
  for(let i=-5;i<18;i++){
    const o=i*80+(t*10)%80;
    ctx.beginPath();ctx.moveTo(o,0);ctx.lineTo(o+H,H);ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.save();
  ctx.globalCompositeOperation='lighter';
  for(const b of bgBeams){
    const x=((b.x+t*b.spd*120)%(W+260))-130;
    ctx.strokeStyle=`rgba(${b.c},${b.a})`;
    ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(x,b.y);
    ctx.lineTo(x+b.len,b.y+b.len*.35);
    ctx.stroke();
  }
  ctx.restore();

  for(const s of bgStars){
    s.phase+=s.spd;
    const drift=s.layer?((t*9+s.x*.02)%H):0;
    const y=s.layer?(s.y+drift)%H:s.y;
    const a=(s.layer?.13:.08)+Math.abs(Math.sin(s.phase))*(s.layer?.22:.14);
    ctx.fillStyle=`rgba(200,220,255,${a})`;
    ctx.beginPath();ctx.arc(s.x,y,s.r,0,Math.PI*2);ctx.fill();
  }

  ctx.fillStyle=bgScanGradient;
  for(let y=(t*24)%24;y<H;y+=24) ctx.fillRect(0,y,W,1);

  ctx.strokeStyle='rgba(0,240,255,0.12)'; ctx.lineWidth=1.1;
  const L=22;
  for(const[cx,cy,sx,sy] of [[8,8,1,1],[W-8,8,-1,1],[8,H-8,1,-1],[W-8,H-8,-1,-1]]){
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
  const ship=overrideShipId?(SHIP_DEFS.find(d=>d.id===overrideShipId)||SHIP_DEFS[0]):selectedShipDef();
  const core=overrideCoreId?(CORE_DEFS.find(d=>d.id===overrideCoreId)||CORE_DEFS[0]):selectedCoreDef();
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
    }else if(ship.id==='guardian'){
      poly([[0,-22],[24,-4],[20,22],[0,30],[-20,22],[-24,-4]]);
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
function dronePos(i,n,r,spin=.035){
  const a=frame*spin+i*Math.PI*2/n;
  return {x:player.x+Math.cos(a)*r,y:player.y+Math.sin(a)*r};
}
function updateSupportUnits(){
  if(specialLevels.supportDrone>0){
    droneTimer++;
    const n=Math.min(8,specialLevels.supportDrone);
    if(droneTimer>=Math.max(10,34-specialLevels.supportDrone*2)){
      droneTimer=0;
      for(let i=0;i<n;i++){
        const p=dronePos(i,n,32,.028);
        fireAtTarget(p.x,p.y,nearestEnemy(p.x,p.y,null,260),.42,'drone');
      }
    }
  }
  if(specialLevels.interceptor>0){
    bitTimer++;
    const n=Math.min(8,specialLevels.interceptor);
    if(bitTimer>=Math.max(8,28-specialLevels.interceptor*2)){
      bitTimer=0;
      for(let i=0;i<n;i++){
        const p=dronePos(i,n,48,-.04);
        fireAtTarget(p.x,p.y,nearestEnemy(p.x,p.y,null,210),.32,'bit');
      }
    }
  }
}
function drawSupportUnits(){
  const units=[
    {lv:specialLevels.supportDrone,r:32,color:'#66ccff',size:4,spin:.028},
    {lv:specialLevels.interceptor,r:48,color:'#e8e8f0',size:3,spin:-.04},
  ];
  for(const u of units){
    const n=Math.min(8,u.lv);
    if(n<=0) continue;
    ctx.save();
    ctx.strokeStyle=h2r(u.color,.18);ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(player.x,player.y,u.r,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=u.color;
    for(let i=0;i<n;i++){
      const p=dronePos(i,n,u.r,u.spin);
      ctx.beginPath();ctx.arc(p.x,p.y,u.size,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
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
    ctx.beginPath();ctx.arc(player.x,player.y,24+i*5,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
}
function drawStasisAura(){
  if(specialLevels.stasisAura<=0) return;
  ctx.save();
  ctx.strokeStyle='rgba(136,170,255,.34)';
  ctx.fillStyle='rgba(136,170,255,.045)';
  ctx.beginPath();ctx.arc(player.x,player.y,stasisRadius(),0,Math.PI*2);ctx.fill();ctx.stroke();
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
  const range=opts.range??(opts.life ? speed*life : arrowRange());
  const sizeScale=opts.sizeScale??1;
  arrows.push({x,y,prevX:x,prevY:y,vx,vy,speed,pierced:0,pw,ricocheted:0,split:opts.split??false,dist:0,range,life,damageScale:opts.damageScale??1,sizeScale,hitRadius:opts.hitRadius??(4*sizeScale),kind:opts.kind??'main'});
}
function fireArrows(){
  const n=arrowCnt(), sp=n===1?0:Math.min(.7,.15*n);
  const cx=player.x, cy=player.y-player.size;
  const sizeScale=gatlingBulletScale();
  const scale=multiShotDamageScale(n)*gatlingDamageScale();
  for(let i=0;i<n;i++){
    const off=n===1?0:(i/(n-1)-.5)*sp;
    spawnArrow(cx,cy,off,{damageScale:scale,sizeScale,hitRadius:4*sizeScale});
  }
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
    spawnArrow(a.x,a.y,base+off,{kind:'split',split:true,damageScale:scale,sizeScale,hitRadius:3.2*sizeScale,life:72,range:Math.max(110,a.range*.38)});
  }
  a.damageScale*=SPLIT_PARENT_RETENTION;
  burst(a.x,a.y,'#ffb000',5);
}
function redirectArrowToEnemy(a,fromEnemy){
  const target=nearestEnemy(a.x,a.y,fromEnemy,320);
  if(!target) return false;
  const spd=a.speed||Math.hypot(a.vx,a.vy);
  const dx=target.x-a.x, dy=target.y-a.y, len=Math.hypot(dx,dy)||1;
  a.vx=dx/len*spd;
  a.vy=dy/len*spd;
  a.speed=spd;
  a.ricocheted++;
  return true;
}
function updateArrows(){
  const hs=homingStr();
  for(let i=arrows.length-1;i>=0;i--){
    const a=arrows[i];
    if(hs>0&&enemies.length>0&&a.kind!=='split'&&frame%2===0){
      let near=null;
      let nd2=240*240;
      for(const e of enemies){const d2=distSq(e.x,e.y,a.x,a.y);if(d2<nd2){nd2=d2;near=e;}}
      if(near){
        const dx=near.x-a.x,dy=near.y-a.y,len=Math.hypot(dx,dy);
        const spd=a.speed||Math.hypot(a.vx,a.vy);
        a.vx+=(dx/len)*hs*1.7; a.vy+=(dy/len)*hs*1.7;
        const ns=Math.hypot(a.vx,a.vy);
        a.vx=a.vx/ns*spd; a.vy=a.vy/ns*spd;
        a.speed=spd;
      }
    }
    a.prevX=a.x;
    a.prevY=a.y;
    a.x+=a.vx; a.y+=a.vy;
    a.dist+=a.speed||Math.hypot(a.vx,a.vy);
    a.life--;
    if(specialLevels.ricochet>0&&(a.x<4||a.x>W-4)){a.vx*=-1;a.x=Math.max(4,Math.min(W-4,a.x));a.ricocheted++;}
    if(specialLevels.splitter>0&&!a.split&&a.kind!=='split'&&a.dist>150){
      splitArrow(a);
      a.split=true;
    }
    if(a.life<=0||a.dist>=a.range||a.y<-20||a.y>H+20||a.x<-20||a.x>W+20) arrows.splice(i,1);
  }
}
function drawArrows(){
  for(const a of arrows){
    const palette=a.pw
      ? {core:'#fff1d0',main:'#ff7a24',soft:'255,120,36'}
      : a.kind==='split'
        ? {core:'#fff4b8',main:'#ffb000',soft:'255,176,0'}
        : a.kind==='drone'
          ? {core:'#e8fbff',main:'#66ccff',soft:'102,204,255'}
          : a.kind==='bit'
            ? {core:'#ffffff',main:'#c8d8ff',soft:'200,216,255'}
            : {core:'#e8fbff',main:'#00f0ff',soft:'0,240,255'};
    const spd=a.speed||Math.hypot(a.vx,a.vy)||1;
    const ux=a.vx/spd, uy=a.vy/spd, px=-uy, py=ux;
    const sizeScale=a.sizeScale??1;
    const tail=(a.pw?13:9)*sizeScale;
    const wing=(a.pw?4.2:3)*sizeScale;
    const len=(a.pw?10:7.5)*sizeScale;
    const nose=(a.pw?4.2:2.8)*sizeScale;
    const backX=a.x-ux*len, backY=a.y-uy*len;
    const tailX=a.x-ux*tail, tailY=a.y-uy*tail;

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
function spawnEnemy(){
  const wB=wave-1;
  const shape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
  const p=SHAPE_PROPS[shape];
  const base=12+Math.random()*14;
  const size=Math.floor(base*(1+p.sizeAdj*.1));
  const hpCurve=(ENEMY_HP_BASE+wB*ENEMY_HP_LINEAR+wB*wB*ENEMY_HP_QUAD)*Math.pow(ENEMY_HP_EXP,wB);
  const sizeScale=Math.max(.55,Math.min(1.75,size/20));
  const hpSizeMult=Math.pow(sizeScale,1.55);
  const rewardMult=p.rewardMult*Math.pow(sizeScale,1.05);
  const hasCore=size>=(shape==='tri'?22:18);
  const corelessMult=hasCore?1.12:.34;
  const baseHp=Math.max(5,Math.floor((hpCurve+Math.random()*22)*p.hpMult*hpSizeMult*corelessMult));
  const smallRewardScale=hasCore?1:.70;
  const xpValue=Math.max(1,Math.floor((7+wave*2.4+Math.sqrt(baseHp)*1.45)*rewardMult*smallRewardScale));
  const scoreValue=Math.max(4,Math.floor((baseHp*.42+wave*4)*rewardMult*smallRewardScale));
  const orbValue=Math.max(1,Math.floor(1+Math.sqrt(baseHp)*rewardMult*smallRewardScale/5.6));
  const contactDamage=hasCore?28:10;
  const spd=(1.05+Math.random()*.6+wB*.11)*p.spdMult;
  const x=size+10+Math.random()*(W-(size+10)*2);
  const rot=Math.random()*Math.PI*2;
  const rotSpd=(Math.random()<.5?-1:1)*(.006+Math.random()*.012);
  enemies.push({x,y:-size*2,vx:(Math.random()-.5)*.6,vy:spd,hp:baseHp,maxHp:baseHp,xpValue,scoreValue,orbValue,contactDamage,hasCore,shape,size,r:p.r,g:p.g,b:p.b,flash:0,rot,rotSpd});
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
  if(e.flash>0) e.flash--;
}

// ─────────────────────────────────────
//  パーティクル
// ─────────────────────────────────────
function burst(x,y,color,n){
  const cnt=Math.min(Math.ceil(n*.65), MAX_PARTICLES-particles.length);
  for(let i=0;i<cnt;i++){
    const angle=Math.random()*Math.PI*2, spd=1+Math.random()*3.5;
    particles.push({x,y,vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,life:28+Math.random()*22,maxLife:50,color,size:1.5+Math.random()*2});
  }
}
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.89;p.vy*=.89;p.life--;
    if(p.life<=0) particles.splice(i,1);
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
  const cnt=Math.min(n, MAX_EP_ORBS-epOrbs.length);
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
      epOrbs.splice(i,1);
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
    if(distSq(o.x,o.y,player.x,player.y)<20*20) epOrbs.splice(i,1);
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
    if(t.life<=0) floatTexts.splice(i,1);
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
//  基礎スキルツリー
// ─────────────────────────────────────
function basicSkillDef(id){
  return BASIC_STAT_DEFS.find(d=>d.id===id) || BASIC_STAT_DEFS[0];
}
function basicSkillNodeAt(cx,cy){
  for(const n of BASIC_SKILL_TREE){
    if(Math.hypot(cx-n.x,cy-n.y)<=34) return n;
  }
  return null;
}
function basicSkillUnlocked(n){
  return !n.requires || statLevels[n.requires]>0;
}
function basicSkillValue(id){
  if(id==='fireRate') return `${(60/fireInterval()).toFixed(1)}/s`;
  if(id==='regen') return `${regenPerSec().toFixed(1)}HP/s`;
  if(id==='critChance') return critReadout();
  if(id==='critDamage') return fmtMult(critDamage());
  if(id==='hp') return fmtMult(maxHp/100);
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
  addFloat(player.x,player.y-30,`${d.icon} ${d.name} ${gainText}`,d.color,12);
}
function spendBasicSkill(id){
  const n=BASIC_SKILL_TREE.find(v=>v.id===id);
  if(!n || !basicSkillUnlocked(n) || skillPoints<=0) return false;
  skillPoints--;
  applyBasicSkill(id);
  return true;
}
function openSkillTree(){
  if(state==='play') spawnUpgradeZones();
}
function closeSkillTree(){
  state='play';
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
    addFloat(W/2,H-112,basicSkillUnlocked(n)?'SP REQUIRED':'LOCKED',d.color,11);
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
  addFloat(W/2,118,'BASE UPGRADE','#e8e8f0',10);
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
      addFloat(W/2,132,'BASE UPGRADE',d.color,11);
      upgradeZones=[];
      return;
    }
  }
  if(upgradeZones.every(z=>z.y>UPGRADE_ZONE.missY)){
    upgradeZones=[];
    addFloat(W/2,132,'BASE MISSED','rgba(232,232,240,.70)',11);
  }
}
function drawUpgradeZones(){
  if(upgradeZones.length===0) return;
  ctx.save();
  const minX=Math.min(...upgradeZones.map(z=>z.x));
  const maxX=Math.max(...upgradeZones.map(z=>z.x+z.w));
  const y=upgradeZones[0].y;
  const h=upgradeZones[0].h;
  const topFade=ctx.createLinearGradient(0,y-22,0,y+12);
  topFade.addColorStop(0,'rgba(6,6,14,0)');
  topFade.addColorStop(1,'rgba(6,6,14,.54)');
  ctx.fillStyle=topFade;ctx.fillRect(0,y-22,W,34);
  ctx.fillStyle='rgba(6,6,14,.30)';ctx.fillRect(0,y+12,W,h-24);
  const bottomFade=ctx.createLinearGradient(0,y+h-12,0,y+h+22);
  bottomFade.addColorStop(0,'rgba(6,6,14,.54)');
  bottomFade.addColorStop(1,'rgba(6,6,14,0)');
  ctx.fillStyle=bottomFade;ctx.fillRect(0,y+h-12,W,34);
  ctx.strokeStyle='rgba(232,232,240,.06)';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(minX-10,y+14);ctx.lineTo(maxX+10,y+14);
  ctx.moveTo(minX-10,y+h-14);ctx.lineTo(maxX+10,y+h-14);
  ctx.stroke();
  for(const z of upgradeZones){
    const d=basicSkillDef(z.id), lv=statLevels[z.id]||0;
    const cx=z.x+z.w/2;
    const pulse=.5+Math.sin(z.pulse)*.5;
    const x=z.x+8, yy=z.y+16, w=z.w-16, hh=z.h-32;
    const card=ctx.createLinearGradient(0,yy,0,yy+hh);
    card.addColorStop(0,'rgba(20,24,36,.84)');
    card.addColorStop(.5,'rgba(8,10,18,.88)');
    card.addColorStop(1,'rgba(12,16,28,.72)');
    ctx.fillStyle=card;
    ctx.fillRect(x,yy,w,hh);
    ctx.strokeStyle=h2r(d.color,.30+pulse*.06);
    ctx.lineWidth=1;
    ctx.strokeRect(x,yy,w,hh);

    ctx.fillStyle=h2r(d.color,.58+pulse*.08);
    ctx.fillRect(x,yy,3,hh);
    ctx.fillRect(x+8,yy+8,w-16,1);

    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=d.icon.length>1?'bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif':'16px serif';
    ctx.fillStyle=h2r(d.color,.82);
    ctx.fillText(d.icon,cx,yy+19);
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle='rgba(232,232,240,.84)';
    ctx.fillText(d.name,cx,yy+36);
    ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle='rgba(232,232,240,.50)';
    ctx.fillText(`Lv.${lv}  ${basicGainText(z.id,lv)}`,cx,yy+hh-10);
  }
  ctx.restore();
}
function drawSkillTree(){
  ctx.save();
  ctx.fillStyle='rgba(6,6,14,.94)';
  ctx.fillRect(0,0,W,H);
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'rgba(0,240,255,.16)');
  bg.addColorStop(.42,'rgba(204,0,255,.06)');
  bg.addColorStop(1,'rgba(6,6,14,0)');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='42px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.shadowColor='#00f0ff';ctx.shadowBlur=8;ctx.fillStyle='#e8e8f0';
  ctx.fillText('SKILL TREE',W/2,38);ctx.shadowBlur=0;
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle=skillPoints>0?'#ffe040':'rgba(232,232,240,.55)';
  ctx.fillText(`WAVE ${wave}   SP ${skillPoints}`,W/2,64);

  ctx.lineCap='round';
  for(const n of BASIC_SKILL_TREE){
    if(!n.requires) continue;
    const p=BASIC_SKILL_TREE.find(v=>v.id===n.requires);
    const active=statLevels[n.requires]>0;
    const d=basicSkillDef(n.id);
    ctx.strokeStyle=active?h2r(d.color,.58):'rgba(120,120,150,.22)';
    ctx.lineWidth=active?2.2:1.1;
    ctx.shadowColor=d.color;ctx.shadowBlur=active?8:0;
    ctx.beginPath();ctx.moveTo(p.x,p.y+28);ctx.lineTo(n.x,n.y-28);ctx.stroke();
    ctx.shadowBlur=0;
  }

  for(const n of BASIC_SKILL_TREE){
    const d=basicSkillDef(n.id), lv=statLevels[n.id]||0;
    const unlocked=basicSkillUnlocked(n), can=unlocked&&skillPoints>0;
    const hov=Math.hypot(mouseX-n.x,mouseY-n.y)<=34;
    ctx.save();
    ctx.globalAlpha=unlocked?1:.42;
    ctx.shadowColor=d.color;ctx.shadowBlur=can?(hov?26:14):(lv>0?8:0);
    ctx.beginPath();ctx.arc(n.x,n.y,28,0,Math.PI*2);
    ctx.fillStyle=h2r(d.color,can?.20:(lv>0?.13:.05));ctx.fill();
    ctx.lineWidth=can?(hov?2.8:2):1.2;
    ctx.strokeStyle=can?d.color:(lv>0?h2r(d.color,.65):'rgba(170,170,190,.28)');
    ctx.stroke();ctx.shadowBlur=0;

    ctx.font=d.icon.length>1?'bold 13px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif':'18px serif';
    ctx.fillStyle='#fff';ctx.fillText(d.icon,n.x,n.y-7);
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle=d.color;ctx.fillText(`Lv.${lv}`,n.x,n.y+12);
    ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle='#e8e8f0';ctx.fillText(d.name,n.x,n.y+39);
    ctx.font='8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle='rgba(232,232,240,.62)';
    ctx.fillText(basicSkillValue(n.id),n.x,n.y+51);
    if(!unlocked){
      ctx.fillStyle='rgba(232,232,240,.38)';
      ctx.fillText('LOCKED',n.x,n.y-38);
    }else if(can){
      ctx.fillStyle='#ffe040';
      ctx.fillText(`NEXT ${basicGainText(n.id,lv)}`,n.x,n.y-38);
    }
    ctx.restore();
  }

  const bx=SKILL_CLOSE_BTN.x, by=SKILL_CLOSE_BTN.y, bw=SKILL_CLOSE_BTN.w, bh=SKILL_CLOSE_BTN.h;
  rr(bx,by,bw,bh,5);
  ctx.fillStyle=skillPoints>0?'rgba(255,224,64,.12)':'rgba(0,240,255,.14)';
  ctx.fill();
  ctx.strokeStyle=skillPoints>0?'#ffe040':'#00f0ff';
  ctx.lineWidth=1.5;rr(bx,by,bw,bh,5);ctx.stroke();
  ctx.font='22px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle=skillPoints>0?'#ffe040':'#00f0ff';
  ctx.fillText(skillPoints>0?'DEPLOY':'CONTINUE',W/2,by+bh/2+1);
  ctx.restore();
}

// ─────────────────────────────────────
//  Unique Ability
// ─────────────────────────────────────
const SC={w:112, h:196, gap:8, y:352};
const RR={w:128,h:30,y:574};
const PAUSE_BTN={x:8,y:6,w:88,h:30};
const PAUSE_MENU={
  panelX:28,panelY:176,panelW:W-56,panelH:308,
  buttons:[
    {id:'resume',label:'CONTINUE',sub:'resume current run',color:'#00f0ff'},
    {id:'home',label:'RETURN HOME',sub:'bank tokens and exit',color:'#ff2d78'},
    {id:'settings',label:'CONTROLS',sub:'touch mode settings',color:'#00dd77'},
  ]
};
const SKILL_BTN={x:136,y:H-30,w:118,h:22};
const SKILL_CLOSE_BTN={x:W/2-72,y:H-72,w:144,h:34};
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
  state='specialUpgrade';
}
function rerollSpecials(){
  if(coins<REROLL_COST){
    addFloat(W/2,310,`COIN ${REROLL_COST} REQUIRED`,'#ffe040',11);
    shake(3);
    return;
  }
  const next=rollSpecialOptions(true);
  if(next.length===0) return;
  coins-=REROLL_COST;
  pendingSpecials=next;
  shake(4);
  burst(W/2,330,'#ffe040',14);
}
function hitReroll(cx,cy){
  return cx>=W/2-RR.w/2&&cx<=W/2+RR.w/2&&cy>=RR.y&&cy<=RR.y+RR.h;
}
function drawSpecialScreen(){
  ctx.save();
  ctx.fillStyle='rgba(6,6,14,.94)'; ctx.fillRect(0,0,W,H);
  const hg=ctx.createLinearGradient(0,0,0,82);
  hg.addColorStop(0,'rgba(204,0,255,.10)');hg.addColorStop(1,'rgba(204,0,255,0)');
  ctx.fillStyle=hg; ctx.fillRect(0,0,W,82);
  ctx.fillStyle='rgba(204,0,255,.58)'; ctx.fillRect(0,0,W,1);

  ctx.font='42px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor='#cc00ff'; ctx.shadowBlur=6; ctx.fillStyle='#e8e8f0';
  ctx.fillText('UNIQUE ABILITY',W/2,32); ctx.shadowBlur=0;
  ctx.font='10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle='#7777aa';
  ctx.fillText('3つの候補から選択 / 新規は5系統まで',W/2,60);
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='#ffe040';
  ctx.fillText(`UNIQUE ${ownedSpecialCount()}/${MAX_SPECIAL_TYPES}   COIN ${coins}`,W/2,76);

  const ownedUnique=SPECIAL_DEFS.filter(d=>specialLevels[d.id]>0);
  const slotW=60, slotH=28, slotGap=7;
  const slotsX=(W-(slotW*MAX_SPECIAL_TYPES+slotGap*(MAX_SPECIAL_TYPES-1)))/2;
  const slotsY=92;
  for(let i=0;i<MAX_SPECIAL_TYPES;i++){
    const d=ownedUnique[i];
    const x=slotsX+i*(slotW+slotGap);
    const color=d?.color || '#e8e8f0';
    rr(x,slotsY,slotW,slotH,4);
    ctx.fillStyle=d?h2r(color,.11):'rgba(232,232,240,.035)';ctx.fill();
    ctx.strokeStyle=d?h2r(color,.44):'rgba(232,232,240,.14)';ctx.lineWidth=1;rr(x,slotsY,slotW,slotH,4);ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';
    if(d){
      ctx.font=d.icon.length>1?'bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif':'13px serif';
      ctx.fillStyle=h2r(color,.90);ctx.fillText(d.icon,x+slotW/2,slotsY+9);
      ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.72)';
      ctx.fillText(`Lv.${specialLevels[d.id]}`,x+slotW/2,slotsY+21);
    }else{
      ctx.font='bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.22)';
      ctx.fillText('EMPTY',x+slotW/2,slotsY+slotH/2);
    }
  }

  const n=pendingSpecials.length;
  const{w:cw,h:ch,gap,y:cardY}=SC;
  const sx=(W-(cw*n+gap*(n-1)))/2;
  const panel=ctx.createLinearGradient(0,cardY-44,0,H);
  panel.addColorStop(0,'rgba(6,6,14,0)');
  panel.addColorStop(.22,'rgba(6,6,14,.50)');
  panel.addColorStop(1,'rgba(6,6,14,.92)');
  ctx.fillStyle=panel;ctx.fillRect(0,cardY-44,W,H-cardY+44);
  for(let i=0;i<n;i++){
    const d=pendingSpecials[i];
    const cx=sx+i*(cw+gap);
    const lv=specialLevels[d.id];
    const hov=mouseX>=cx&&mouseX<=cx+cw&&mouseY>=cardY&&mouseY<=cardY+ch;
    ctx.save();
    ctx.shadowColor=d.color; ctx.shadowBlur=hov?10:0;
    rr(cx,cardY,cw,ch,6); ctx.fillStyle=h2r(d.color,hov?.10:.055); ctx.fill();
    ctx.strokeStyle=h2r(d.color,hov?.70:.32); ctx.lineWidth=hov?1.8:1;
    rr(cx,cardY,cw,ch,6); ctx.stroke(); ctx.shadowBlur=0;
    rrTop(cx,cardY,cw,56,6); ctx.fillStyle=h2r(d.color,hov?.20:.11); ctx.fill();
    ctx.font='28px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#fff';
    ctx.fillText(d.icon,cx+cw/2,cardY+30);
    ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.shadowColor=d.color; ctx.shadowBlur=hov?4:0; ctx.fillStyle=d.color;
    ctx.fillText(d.name.replace(/\s/g,''),cx+cw/2,cardY+70); ctx.shadowBlur=0;
    ctx.strokeStyle=h2r(d.color,.22); ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx+8,cardY+82);ctx.lineTo(cx+cw-8,cardY+82);ctx.stroke();
    const bw=64,bh=16,bxc=cx+cw/2-32,byc=cardY+88;
    rr(bxc,byc,bw,bh,3); ctx.fillStyle=h2r(d.color,.18); ctx.fill();
    rr(bxc,byc,bw,bh,3); ctx.strokeStyle=d.color; ctx.lineWidth=1; ctx.stroke();
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle=d.color; ctx.textBaseline='middle';
    ctx.fillText(lv===0?'NEW!':`Lv.${lv} → ${lv+1}`,cx+cw/2,byc+bh/2);
    ctx.font='9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle='#aaaacc';
    ctx.fillText(d.desc(lv+1),cx+cw/2,cardY+126);
    if(lv>=9){ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#ffe040';ctx.fillText('次でMAX!',cx+cw/2,cardY+144);}
    const ctaY=cardY+ch-16;
    if(hov){
      rr(cx+6,ctaY-9,cw-12,18,3); ctx.fillStyle=h2r(d.color,.18); ctx.fill();
      ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle=d.color;
    } else {
      ctx.font='9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle='rgba(232,232,240,.42)';
    }
    ctx.textBaseline='middle'; ctx.fillText(hov?'▶  選  択  ◀':'タップで選択',cx+cw/2,ctaY);
    ctx.restore();
  }

  const canReroll=coins>=REROLL_COST;
  const rx=W/2-RR.w/2, ry=RR.y;
  ctx.save();
  rr(rx,ry,RR.w,RR.h,4);
  ctx.fillStyle=canReroll?'rgba(255,224,64,.16)':'rgba(80,80,96,.16)';
  ctx.fill();
  ctx.strokeStyle=canReroll?'#ffe040':'rgba(160,160,180,.28)';
  ctx.lineWidth=1.4; rr(rx,ry,RR.w,RR.h,4); ctx.stroke();
  ctx.font='bold 12px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=canReroll?'#ffe040':'rgba(180,180,200,.45)';
  ctx.shadowColor='#ffe040';ctx.shadowBlur=canReroll?3:0;
  ctx.fillText(`REROLL  ${REROLL_COST} COIN`,W/2,ry+RR.h/2);
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
      shake(6); burst(player.x,player.y,chosen.color,20);
      addFloat(W/2,H/2-20,`${chosen.icon} ${chosen.name}  Lv.${specialLevels[chosen.id]}`,chosen.color,14);
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
  addFloat(player.x,player.y-20,`+${gained} XP`,'#00dd77',10);
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
  const idx=enemies.indexOf(e);
  if(idx<0) return;
  const pts=e.scoreValue ?? (Math.floor(e.maxHp*.5)+wave*5);
  const coinGain=1+Math.floor(wave/8);
  score+=pts;
  coins+=coinGain;
  addXp(e.xpValue ?? Math.floor(10+wave*3+Math.sqrt(e.maxHp)*2.2));
  addFloat(e.x,e.y-10,`+${pts}  +${coinGain}C`,'#e8e8f0',11);
  burst(e.x,e.y,`rgb(${e.r},${e.g},${e.b})`,14);
  spawnEpOrbs(e.x,e.y,e.orbValue ?? (3+Math.floor(e.maxHp/22)));
  enemies.splice(idx,1);
}
function damageEnemy(e,amount,color,label=null){
  if(!e||enemies.indexOf(e)<0) return false;
  const actual=Math.max(0,Math.min(e.hp,amount));
  e.hp-=amount; e.flash=6;
  addDamageXp(actual);
  if(label) addFloat(e.x,e.y-18,label,color,10);
  burst(e.x,e.y,color,5);
  if(e.hp<=0){killEnemy(e);return true;}
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
  if(arrows.length>0&&enemies.length>0) for(let ai=arrows.length-1;ai>=0;ai--){
    const a=arrows[ai]; let rem=false;
    const ar=a.hitRadius??4;
    for(let ei=enemies.length-1;ei>=0;ei--){
      if(rem) break;
      const e=enemies[ei];
      const hitR=e.size+ar;
      if(Math.abs(a.x-e.x)>hitR||Math.abs(a.y-e.y)>hitR) continue;
      if(distSq(a.x,a.y,e.x,e.y)<hitR*hitR){
        const critTier=rollCritTier();
        const hitDmg=dmg*a.damageScale*Math.pow(critD,critTier);
        const hitColor=critTier?'#ffb000':(a.pw?'#ff6020':'#00f0ff');
        const actualDmg=Math.max(0,Math.min(e.hp,hitDmg));
        e.hp-=hitDmg; e.flash=6;
        addDamageXp(actualDmg);
        const hitBurst=a.kind==='split' ? 3 : 5;
        burst(a.x,a.y,critTier?'#ffb000':(a.pw?'#ff6020':'#00f0ff'),critTier?9+critTier*4:hitBurst);
        if(critTier) addFloat(e.x,e.y-18,critTier>1?'DOUBLE CRIT':'CRIT',critTier>1?'#ff7040':'#ffb000',10);
        applyOnHitEffects(e,a.x,a.y,hitDmg);
        if(e.hp<=0) killEnemy(e);
        const bounced=specialLevels.ricochet>0&&a.ricocheted<specialLevels.ricochet&&redirectArrowToEnemy(a,e);
        if(bounced){rem=true;break;}
        if(pc===0||a.pierced>=pc){arrows.splice(ai,1);rem=true;}
        else a.pierced++;
      }
    }
  }
  if(invincible>0){invincible--;}
  else{
    for(const e of enemies){
      const hitR=e.size+12;
      if(distSq(player.x,player.y,e.x,e.y)<hitR*hitR){
        if(blockWithShield()) break;
        hp-=incomingDamage(e.contactDamage ?? 26); invincible=80;
        shake(8); burst(player.x,player.y,'#ff2d78',12);
        if(hp<=0){hp=0; endGame(); return;}
        break;
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
  ctx.fillStyle='rgba(0,240,255,.84)';
  ctx.shadowColor='#00f0ff';ctx.shadowBlur=3;
  ctx.fillRect(PAUSE_BTN.x+12,PAUSE_BTN.y+9,3,12);
  ctx.fillRect(PAUSE_BTN.x+20,PAUSE_BTN.y+9,3,12);
  ctx.fillStyle='rgba(0,240,255,.34)';
  ctx.fillRect(PAUSE_BTN.x,PAUSE_BTN.y,3,PAUSE_BTN.h);
  ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillStyle='rgba(232,232,240,.82)';
  ctx.fillText('MENU',PAUSE_BTN.x+34,PAUSE_BTN.y+PAUSE_BTN.h/2+1);
  ctx.shadowBlur=0;

  // WAVE
  ctx.textAlign='center'; ctx.textBaseline='middle';
  rr(W/2-44,topY,88,topH,4);
  ctx.fillStyle='rgba(255,45,120,.075)';ctx.fill();
  ctx.strokeStyle='rgba(255,45,120,.32)';ctx.lineWidth=1;rr(W/2-44,topY,88,topH,4);ctx.stroke();
  ctx.font='16px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(255,80,140,.92)';
  ctx.fillText(`WAVE ${wave}`,W/2,topY+topH/2+1);

  // スコア
  ctx.textAlign='right';
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.46)';
  ctx.fillText('SCORE',W-bx,topY+5);
  ctx.font='bold 12px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.86)';
  ctx.fillText(`${score.toLocaleString()}  C ${coins}`,W-bx,topY+17);

  // ── 下部グラデーションオーバーレイ ──
  ctx.fillStyle=hudBottomGradient; ctx.fillRect(0,H-HUD_B-18,W,HUD_B+18);

  // 現在ステータス
  ctx.textBaseline='middle';
  ctx.textAlign='left';
  const barX=bx, barW=bw, hpY=H-124, hpH=13, xpY=H-104, xpH=10;
  function drawMeter(y,h,label,valueText,ratio,colorA,colorB){
    rr(barX,y,barW,h,4);ctx.fillStyle='rgba(232,232,240,.055)';ctx.fill();
    const mw=barW*Math.max(0,Math.min(1,ratio));
    if(mw>0){
      const mg=ctx.createLinearGradient(barX,0,barX+barW,0);
      mg.addColorStop(0,colorA);mg.addColorStop(1,colorB);
      rr(barX,y,mw,h,4);ctx.fillStyle=mg;ctx.fill();
    }
    ctx.strokeStyle='rgba(232,232,240,.14)';ctx.lineWidth=1;rr(barX,y,barW,h,4);ctx.stroke();
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='left';ctx.fillStyle='rgba(232,232,240,.78)';
    ctx.fillText(label,barX+6,y+h/2);
    ctx.textAlign='right';ctx.fillStyle='rgba(232,232,240,.58)';
    ctx.fillText(valueText,barX+barW-6,y+h/2);
  }
  drawMeter(hpY,hpH,'HP',`${hp}/${maxHp}`,hp/maxHp,'#c01850','#ff4080');
  drawMeter(xpY,xpH,'XP',`UNIQUE Lv.${xpLevel}`,Math.min(1,xp/xpThresh()),'#00aa55','#44ffaa');

  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.48)';
  ctx.textAlign='left';
  ctx.fillText('BASE UPGRADES',bx,H-88);

  const stats=basicStatReadouts();
  const cols=5, cardGap=4;
  const cardW=(bw-cardGap*(cols-1))/cols, cardH=17;
  const statY=H-77;
  for(let i=0;i<stats.length;i++){
    const s=stats[i];
    const col=i%cols, row=Math.floor(i/cols);
    const x=bx+col*(cardW+cardGap), y=statY+row*(cardH+4);
    rr(x,y,cardW,cardH,3);
    ctx.fillStyle='rgba(232,232,240,.045)'; ctx.fill();
    ctx.strokeStyle=h2r(s.color,.22); ctx.lineWidth=1; rr(x,y,cardW,cardH,3); ctx.stroke();

    ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle=h2r(s.color,.78); ctx.shadowBlur=0;
    ctx.fillText(s.label,x+4,y+cardH/2);

    ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.textAlign='right';
    ctx.fillStyle='rgba(232,232,240,.80)';
    ctx.fillText(String(s.value).replace('通常 ',''),x+cardW-4,y+cardH/2);
    ctx.textAlign='left';
  }

  // Upgrade zone status
  rr(SKILL_BTN.x,SKILL_BTN.y,SKILL_BTN.w,SKILL_BTN.h,5);
  ctx.fillStyle=upgradeZones.length>0?'rgba(232,232,240,.07)':'rgba(0,240,255,.10)';
  ctx.fill();
  ctx.strokeStyle=upgradeZones.length>0?'rgba(232,232,240,.32)':'rgba(0,240,255,.55)';
  ctx.lineWidth=1.1;rr(SKILL_BTN.x,SKILL_BTN.y,SKILL_BTN.w,SKILL_BTN.h,5);ctx.stroke();
  ctx.font='bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=upgradeZones.length>0?'rgba(232,232,240,.72)':'#00f0ff';
  ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=upgradeZones.length>0?0:4;
  ctx.fillText(upgradeZones.length>0?'BASE UPGRADE':'NEXT WAVE',SKILL_BTN.x+SKILL_BTN.w/2,SKILL_BTN.y+SKILL_BTN.h/2);
  ctx.shadowBlur=0;

  ctx.restore();
}

// ─────────────────────────────────────
//  ウェーブバナー
// ─────────────────────────────────────
function drawTouchControls(){
  return;
}
function pauseButtonRect(i){
  const w=PAUSE_MENU.panelW-44, h=50, gap=12;
  return {x:PAUSE_MENU.panelX+22,y:PAUSE_MENU.panelY+104+i*(h+gap),w,h};
}
function drawPauseRow(b,label,sub,color,meta='',active=false){
  rr(b.x,b.y,b.w,b.h,5);
  const bg=ctx.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);
  bg.addColorStop(0,active?h2r(color,.18):'rgba(232,232,240,.065)');
  bg.addColorStop(.58,'rgba(12,16,28,.72)');
  bg.addColorStop(1,'rgba(6,6,14,.86)');
  ctx.fillStyle=bg;ctx.fill();
  ctx.strokeStyle=active?h2r(color,.72):'rgba(232,232,240,.16)';
  ctx.lineWidth=active?1.4:1;rr(b.x,b.y,b.w,b.h,5);ctx.stroke();
  ctx.fillStyle=h2r(color,active?.75:.44);
  ctx.fillRect(b.x,b.y,4,b.h);
  ctx.fillStyle=h2r(color,active?.28:.16);
  ctx.fillRect(b.x+12,b.y+10,24,30);
  ctx.fillStyle=active?color:h2r(color,.72);
  ctx.font='bold 13px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText(label,b.x+48,b.y+18);
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.46)';
  ctx.fillText(sub,b.x+48,b.y+34);
  if(meta){
    ctx.textAlign='right';
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle=active?h2r(color,.92):'rgba(232,232,240,.42)';
    ctx.fillText(meta,b.x+b.w-16,b.y+b.h/2);
  }
}
function drawPauseMenu(){
  ctx.save();
  ctx.fillStyle='rgba(6,6,14,.72)';
  ctx.fillRect(0,0,W,H);
  const p=PAUSE_MENU;
  const halo=ctx.createRadialGradient(W/2,p.panelY+44,10,W/2,p.panelY+44,p.panelW*.8);
  halo.addColorStop(0,'rgba(0,240,255,.14)');
  halo.addColorStop(.48,'rgba(136,170,255,.05)');
  halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo;
  ctx.fillRect(0,p.panelY-80,W,p.panelH+160);
  rr(p.panelX,p.panelY,p.panelW,p.panelH,8);
  const g=ctx.createLinearGradient(p.panelX,p.panelY,p.panelX,p.panelY+p.panelH);
  g.addColorStop(0,'rgba(20,24,38,.96)');
  g.addColorStop(.42,'rgba(10,14,26,.96)');
  g.addColorStop(1,'rgba(6,6,14,.98)');
  ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle='rgba(232,232,240,.18)';
  ctx.lineWidth=1;rr(p.panelX,p.panelY,p.panelW,p.panelH,8);ctx.stroke();
  ctx.fillStyle='rgba(0,240,255,.46)';
  ctx.fillRect(p.panelX,p.panelY,3,p.panelH);
  ctx.fillStyle='rgba(232,232,240,.06)';
  ctx.fillRect(p.panelX+12,p.panelY+76,p.panelW-24,1);
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='36px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='#e8e8f0';ctx.shadowColor='#00f0ff';ctx.shadowBlur=5;
  ctx.fillText(pauseView==='settings'?'CONTROL SETTINGS':'GAME PAUSED',W/2,p.panelY+34);ctx.shadowBlur=0;
  ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.52)';
  ctx.fillText(`WAVE ${wave} / SCORE ${score.toLocaleString()}`,W/2,p.panelY+61);
  if(pauseView==='settings'){
    const modes=[
      {id:'buttons',label:'BUTTON',sub:'tap lane movement',color:'#00f0ff'},
      {id:'stick',label:'STICK',sub:'drag analog control',color:'#00dd77'},
    ];
    for(let i=0;i<modes.length;i++){
      const b=pauseButtonRect(i), m=modes[i], active=touchControlMode()===m.id;
      drawPauseRow(b,m.label,m.sub,m.color,active?'ACTIVE':'TAP',active);
    }
    const back=pauseButtonRect(2);
    drawPauseRow(back,'BACK','return to pause menu','#88aaff','',false);
    ctx.restore();
    return;
  }
  for(let i=0;i<p.buttons.length;i++){
    const b=pauseButtonRect(i), item=p.buttons[i];
    drawPauseRow(b,item.label,item.sub,item.color,i===0?'':'>',i===0);
  }
  ctx.restore();
}
function pauseGame(){
  if(state!=='play') return;
  state='pause';
  pauseView='menu';
  stopTouchMove();
  activePointerId=null;
}
function resumeGame(){
  if(state!=='pause') return;
  state='play';
  pauseView='menu';
}
function handlePauseClick(cx,cy){
  if(pauseView==='settings'){
    for(let i=0;i<2;i++){
      const b=pauseButtonRect(i);
      if(cx>=b.x&&cx<=b.x+b.w&&cy>=b.y&&cy<=b.y+b.h){
        setTouchControlMode(i===0?'buttons':'stick');
        return true;
      }
    }
    const back=pauseButtonRect(2);
    if(cx>=back.x&&cx<=back.x+back.w&&cy>=back.y&&cy<=back.y+back.h){pauseView='menu';return true;}
    return true;
  }
  for(let i=0;i<PAUSE_MENU.buttons.length;i++){
    const b=pauseButtonRect(i), id=PAUSE_MENU.buttons[i].id;
    if(cx>=b.x&&cx<=b.x+b.w&&cy>=b.y&&cy<=b.y+b.h){
      if(id==='resume') resumeGame();
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
  ctx.shadowColor=color; ctx.shadowBlur=8;
  rr(bx,by,bw,bh,5); ctx.fillStyle=h2r(color,.10); ctx.fill();
  ctx.strokeStyle=h2r(color,.72); ctx.lineWidth=1.2; rr(bx,by,bw,bh,5); ctx.stroke();
  ctx.shadowBlur=0;
  ctx.font='24px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle=color;
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
  const text=String(value);
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

// ─────────────────────────────────────
//  スタート・ゲームオーバー画面
// ─────────────────────────────────────
const BTN_W=200, BTN_H=50;
const GAME_OVER_RETRY_Y=H/2+76;
const GAME_OVER_HOME_Y=H/2+134;
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
  {id:'warehouse',label:'倉庫',color:'#ffe040'},
  {id:'upgrade',label:'強化',color:'#cc00ff'},
  {id:'codex',label:'図鑑',color:'#88aaff'},
  {id:'settings',label:'設定',color:'#00dd77'},
];
const HOME_NAV={x:24,y:432,w:162,h:54,gapX:18,gapY:10};
const HOME_NAV_VIEW=[
  {id:'store',label:'ストア',sub:'パーツ / コア',color:'#00f0ff'},
  {id:'warehouse',label:'格納庫',sub:'装備変更',color:'#ffe040'},
  {id:'upgrade',label:'強化',sub:'基礎ステータス',color:'#cc00ff'},
  {id:'codex',label:'図鑑',sub:'能力データ',color:'#88aaff'},
  {id:'settings',label:'設定',sub:'操作設定',color:'#00dd77'},
];
const CODEX={startY:102,rowH:58,pageSize:7,pagerY:624,btnW:88,btnH:30};
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
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=h2r(color,.90);ctx.shadowBlur=0;
  ctx.fillText(title,x+10,y+14);ctx.shadowBlur=0;
  ctx.font='8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.58)';
  ctx.fillText(value,x+10,y+31);
  ctx.textAlign='right';ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=owned?'#00dd77':'#ffe040';
  ctx.fillText(metaText,x+HOME_GRID.w-8,y+46);
}
function drawHomeTabs(){
  for(let i=0;i<HOME_TABS.length;i++){
    const t=HOME_TABS[i], x=HOME_TAB.x+i*(HOME_TAB.w+HOME_TAB.gap), active=homeTab===t.id;
    rr(x,HOME_TAB.y,HOME_TAB.w,HOME_TAB.h,5);
    ctx.fillStyle=active?'rgba(0,240,255,.16)':'rgba(232,232,240,.045)';ctx.fill();
    ctx.strokeStyle=active?'#00f0ff':'rgba(232,232,240,.16)';
    ctx.lineWidth=active?1.6:1;rr(x,HOME_TAB.y,HOME_TAB.w,HOME_TAB.h,5);ctx.stroke();
    ctx.font='bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=active?'#00f0ff':'rgba(232,232,240,.62)';
    ctx.fillText(t.label,x+HOME_TAB.w/2,HOME_TAB.y+HOME_TAB.h/2);
  }
}
const partTypeName = type => ({turret:'砲台',armor:'装甲',drone:'ドローン',coreBoost:'コア強化'}[type]||type);
const partInfo = part => PART_INFO[part.id] || {tier:'STD',desc:'Modular system part.'};
function multText(mult,short=false){
  return Object.entries(mult).map(([k,v])=>`${short?(STAT_LABELS[k]||k.toUpperCase()):(STAT_LABELS[k]||k)} ${fmtMult(v)}`).join(' ');
}
function equippedPartDefs(shipId=meta.selectedShip){
  return mountedPartIds(shipId).map(id=>PART_DEFS.find(p=>p.id===id)).filter(Boolean);
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
  return active.length ? active.map(([k,v])=>`${STAT_LABELS[k]||k} ${fmtMult(v)}`).join('  ') : 'NO PART BONUS';
}
function partSlotStatus(part,ship=selectedShipDef()){
  const limit=ship.slots[part.type]||0;
  const cur=(mountedForShip(ship.id)[part.type]||[]).length;
  const shipId=partMountedShip(part.id);
  if(shipId===ship.id) return 'MOUNTED';
  if(shipId) return 'ON OTHER';
  if(limit<=0) return 'NO SLOT';
  return `${cur}/${limit} SLOT`;
}
function slotText(ship=selectedShipDef()){
  if(ship.id==='coreOnly') return '機体なし / パーツ不可';
  return SLOT_ORDER.map(t=>`${partTypeName(t)}${(mountedForShip(ship.id)[t]||[]).length}/${ship.slots[t]||0}`).join('  ');
}
function itemValue(item){
  const d=item.def;
  if(item.type==='ship') return slotText(d);
  if(item.type==='core') return `${d.role} / Lv.${meta.coreLevels[d.id]||0}`;
  return `${partTypeName(d.type)}  ${multText(d.mult,true)}`;
}
function itemMeta(item){
  const d=item.def;
  if(item.type==='ship') return meta.selectedShip===d.id?'SELECTED':(meta.ownedShips[d.id]?'SELECT':`TOKEN ${d.cost}`);
  if(item.type==='core') return meta.selectedCore===d.id?'MOUNTED':(meta.ownedCores[d.id]?'MOUNT':`TOKEN ${d.cost}`);
  if(!meta.ownedParts[d.id]) return `TOKEN ${d.cost}`;
  const shipId=partMountedShip(d.id);
  if(shipId===meta.selectedShip) return 'MOUNTED';
  return shipId?'ON OTHER':'MOUNT';
}
// ── サブ画面共通ヘルパー ──
const BACK_BTN={x:8,y:10,w:58,h:30};
function drawSubHeader(title,tokenVisible=true){
  ctx.fillStyle='rgba(12,16,28,.72)'; ctx.fillRect(0,0,W,52);
  ctx.strokeStyle='rgba(232,232,240,.12)'; ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(W,52);ctx.stroke();
  rr(BACK_BTN.x,BACK_BTN.y,BACK_BTN.w,BACK_BTN.h,5);
  ctx.fillStyle='rgba(232,232,240,.055)';ctx.fill();
  ctx.strokeStyle='rgba(0,240,255,.38)';ctx.lineWidth=1;rr(BACK_BTN.x,BACK_BTN.y,BACK_BTN.w,BACK_BTN.h,5);ctx.stroke();
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#00f0ff';
  ctx.fillText('← 戻る',BACK_BTN.x+BACK_BTN.w/2,BACK_BTN.y+BACK_BTN.h/2);
  ctx.font='28px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center';ctx.shadowColor='#00f0ff';ctx.shadowBlur=4;ctx.fillStyle='#e8e8f0';
  ctx.fillText(title,W/2,27);ctx.shadowBlur=0;
  if(tokenVisible){
    drawTokenAmount(W-10,27,meta.tokens,'right',10);
  }
}
function drawTabRow(tabs,labels,current,y,h=28){
  const tabW=(W-20)/tabs.length;
  for(let i=0;i<tabs.length;i++){
    const tx=10+i*tabW,active=current===tabs[i];
    rr(tx,y,tabW-4,h,4);
    ctx.fillStyle=active?'rgba(0,240,255,.18)':'rgba(232,232,240,.045)';ctx.fill();
    ctx.strokeStyle=active?'#00f0ff':'rgba(232,232,240,.18)';ctx.lineWidth=active?1.5:1;
    rr(tx,y,tabW-4,h,4);ctx.stroke();
    ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
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
function drawCraftInCard(x,y,w,h,shipId,coreId){
  ctx.save();
  ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  drawCraft(x+w/2,y+h/2,0.42,shipId,coreId);
  ctx.restore();
}

// ── ストア画面 ──
function drawLoadoutPanel(x,y,w,h,ship=selectedShipDef()){
  const core=selectedCoreDef();
  rr(x,y,w,h,6);
  ctx.fillStyle='rgba(232,232,240,.045)';ctx.fill();
  ctx.strokeStyle='rgba(232,232,240,.16)';ctx.lineWidth=1;rr(x,y,w,h,6);ctx.stroke();
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.50)';
  ctx.fillText('ACTIVE LOADOUT',x+10,y+12);
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=ship.color;
  ctx.fillText(`${ship.name} + ${core.name} Lv.${selectedCoreLevel()}`,x+10,y+29);
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.55)';
  ctx.fillText(slotText(ship),x+10,y+45);
  ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#ffe040';
  ctx.fillText(loadoutText(ship.id),x+10,y+61);
}
function drawStoreShipCard(i,ship,startY){
  const cx=14,cw=W-28,ch=72,cy=startY+i*(ch+6);
  const owned=meta.ownedShips[ship.id],sel=meta.selectedShip===ship.id;
  rr(cx,cy,cw,ch,6);
  const g=ctx.createLinearGradient(cx,cy,cx+cw,cy+ch);
  g.addColorStop(0,h2r(ship.color,sel?.15:(owned?.09:.05)));
  g.addColorStop(1,'rgba(6,6,14,.7)');
  ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=sel?'rgba(232,232,240,.70)':h2r(ship.color,owned?.42:.22);
  ctx.lineWidth=sel?1.4:1;rr(cx,cy,cw,ch,6);ctx.stroke();
  drawCraftInCard(cx,cy,74,ch,ship.id,'basic');
  ctx.strokeStyle=h2r(ship.color,.25);ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(cx+76,cy+6);ctx.lineTo(cx+76,cy+ch-6);ctx.stroke();
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=ship.color;
  ctx.fillText(`${ship.icon} ${ship.name}`,cx+84,cy+15);
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.50)';
  ctx.fillText(ship.role,cx+84,cy+29);
  ctx.fillText(slotText(ship),cx+84,cy+42);
  ctx.fillStyle=h2r(ship.color,.72);ctx.fillText(multText(ship.mult,true),cx+84,cy+55);
  ctx.textAlign='right';ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  if(sel){ctx.fillStyle='#00f0ff';ctx.fillText('SELECTED',cx+cw-8,cy+ch-12);}
  else if(owned){ctx.fillStyle='#00dd77';ctx.fillText('SELECT →',cx+cw-8,cy+ch-12);}
  else{drawTokenAmount(cx+cw-8,cy+ch-12,ship.cost,'right',8);}
}
function drawStoreCoreCard(i,core,startY){
  const cw=(W-36)/2,ch=82,col=i%2,row=Math.floor(i/2);
  const cx=14+col*(cw+8),cy=startY+row*(ch+6);
  const owned=meta.ownedCores[core.id],sel=meta.selectedCore===core.id;
  rr(cx,cy,cw,ch,5);
  ctx.fillStyle=h2r(core.color,sel?.15:(owned?.09:.05));ctx.fill();
  ctx.strokeStyle=sel?'rgba(232,232,240,.70)':h2r(core.color,owned?.42:.22);
  ctx.lineWidth=sel?1.4:1;rr(cx,cy,cw,ch,5);ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='22px serif';ctx.fillStyle=h2r(core.color,.88);ctx.shadowBlur=0;
  ctx.fillText(core.icon,cx+cw/2,cy+22);ctx.shadowBlur=0;
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#e8e8f0';
  ctx.fillText(core.name,cx+cw/2,cy+40);
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.50)';
  ctx.fillText(core.role,cx+cw/2,cy+52);
  ctx.fillStyle=h2r(core.color,.72);
  ctx.fillText(multText(core.mult,true),cx+cw/2,cy+61);
  ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  if(sel){ctx.fillStyle='#00f0ff';ctx.fillText('MOUNTED',cx+cw/2,cy+ch-7);}
  else if(owned){ctx.fillStyle='#00dd77';ctx.fillText('MOUNT',cx+cw/2,cy+ch-7);}
  else{drawTokenAmount(cx+cw/2,cy+ch-7,core.cost,'center',8);}
}
function drawStorePartCard(i,part,startY){
  const cw=(W-36)/2,ch=70,col=i%2,row=Math.floor(i/2);
  const cx=14+col*(cw+8),cy=startY+row*(ch+6);
  const owned=meta.ownedParts[part.id];
  const mounted=partMountedShip(part.id)===meta.selectedShip;
  const info=partInfo(part);
  rr(cx,cy,cw,ch,5);
  ctx.fillStyle=h2r(part.color,mounted?.14:(owned?.09:.05));ctx.fill();
  ctx.strokeStyle=mounted?'rgba(232,232,240,.70)':h2r(part.color,owned?.42:.22);ctx.lineWidth=mounted?1.4:1;rr(cx,cy,cw,ch,5);ctx.stroke();
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font='14px serif';ctx.fillStyle=part.color;ctx.fillText(part.icon,cx+8,cy+14);
  ctx.font='bold 7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=h2r(part.color,.88);
  ctx.fillText(`${info.tier} / ${partTypeName(part.type)}`,cx+28,cy+14);
  ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#e8e8f0';
  ctx.fillText(part.name.slice(0,15),cx+8,cy+30);
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.45)';
  ctx.fillText(info.desc.slice(0,26),cx+8,cy+45);
  ctx.fillStyle=part.color;ctx.fillText(multText(part.mult,true),cx+8,cy+59);
  ctx.textAlign='right';ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  if(mounted){ctx.fillStyle='#00f0ff';ctx.fillText('MOUNTED',cx+cw-8,cy+16);}
  else if(owned){ctx.fillStyle='#00dd77';ctx.fillText(partSlotStatus(part),cx+cw-8,cy+16);}
  else{drawTokenAmount(cx+cw-8,cy+16,part.cost,'right',8);}
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.45)';
  ctx.fillText(owned?'TAP IN WAREHOUSE':partSlotStatus(part),cx+cw-8,cy+34);
}
function drawStoreScreen(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(6,6,14,.82)';ctx.fillRect(0,0,W,H);
  drawSubHeader('STORE');
  drawTabRow(['ship','core','part'],{ship:'機体',core:'コア',part:'パーツ'},storeTab,58);
  const cy=92;
  if(storeTab==='ship'){
    for(let i=0;i<SHIP_DEFS.length;i++) drawStoreShipCard(i,SHIP_DEFS[i],cy);
  }else if(storeTab==='core'){
    const core=selectedCoreDef(),lv=selectedCoreLevel(),uc=coreUpgradeCost(),can=meta.tokens>=uc;
    rr(14,cy,W-28,40,5);ctx.fillStyle=h2r(core.color,.10);ctx.fill();
    ctx.strokeStyle=can?core.color:h2r(core.color,.38);ctx.lineWidth=1.2;rr(14,cy,W-28,40,5);ctx.stroke();
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=core.color;
    ctx.fillText(`${core.icon} ${core.name}  Lv.${lv} → ${lv+1}  コアアップグレード`,24,cy+14);
    ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.50)';
    ctx.fillText(can?'COST':'NOT ENOUGH',24,cy+28);
    drawTokenAmount(W-22,cy+20,uc,'right',9);
    for(let i=0;i<CORE_DEFS.length;i++) drawStoreCoreCard(i,CORE_DEFS[i],cy+48);
  }else{
    drawLoadoutPanel(14,cy,W-28,70);
    for(let i=0;i<PART_DEFS.length;i++) drawStorePartCard(i,PART_DEFS[i],cy+82);
  }
  ctx.restore();
}
function hitTwoColCard(cx,cy,count,startY,ch){
  const cw=(W-36)/2;
  for(let i=0;i<count;i++){
    const col=i%2,row=Math.floor(i/2);
    const x=14+col*(cw+8),y=startY+row*(ch+6);
    if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch) return i;
  }
  return -1;
}
function handleStoreClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const tab=hitTabRow(cx,cy,['ship','core','part'],58);
  if(tab){storeTab=tab;return;}
  const cy0=92;
  if(storeTab==='ship'){
    for(let i=0;i<SHIP_DEFS.length;i++){
      if(cx>=14&&cx<=W-14&&cy>=cy0+i*78&&cy<=cy0+i*78+72){buyOrSelectShip(SHIP_DEFS[i].id);return;}
    }
  }else if(storeTab==='core'){
    if(cx>=14&&cx<=W-14&&cy>=cy0&&cy<=cy0+40){upgradeMountedCore();return;}
    const idx=hitTwoColCard(cx,cy,CORE_DEFS.length,cy0+48,82);
    if(idx>=0) buyOrMountCore(CORE_DEFS[idx].id);
  }else{
    const idx=hitTwoColCard(cx,cy,PART_DEFS.length,cy0+82,70);
    if(idx>=0) buyPart(PART_DEFS[idx].id);
  }
}

// ── 倉庫画面 ──
function drawWarehouseScreen(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(6,6,14,.82)';ctx.fillRect(0,0,W,H);
  drawSubHeader('WAREHOUSE',false);
  const core=selectedCoreDef(),lv=selectedCoreLevel();
  rr(14,58,W-28,34,5);ctx.fillStyle=h2r(core.color,.09);ctx.fill();
  ctx.strokeStyle=h2r(core.color,.38);ctx.lineWidth=1;rr(14,58,W-28,34,5);ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=core.color;
  ctx.fillText(`CORE: ${core.icon} ${core.name}  Lv.${lv}  [固定 / コア変更はストアへ]`,W/2,75);
  drawTabRow(['ship','part'],{ship:'機体',part:'パーツ'},warehouseTab,98);
  const startY=134;
  if(warehouseTab==='ship'){
    const owned=SHIP_DEFS.filter(s=>meta.ownedShips[s.id]);
    const cw=(W-36)/2,ch=82;
    for(let i=0;i<owned.length;i++){
      const ship=owned[i],col=i%2,row=Math.floor(i/2);
      const x=14+col*(cw+8),y=startY+row*(ch+6);
      const sel=meta.selectedShip===ship.id;
      rr(x,y,cw,ch,5);
      ctx.fillStyle=h2r(ship.color,sel?.22:.10);ctx.fill();
      ctx.strokeStyle=sel?'#e8e8f0':h2r(ship.color,.50);ctx.lineWidth=sel?2:1;rr(x,y,cw,ch,5);ctx.stroke();
      if(sel){ctx.fillStyle=h2r(ship.color,.7);ctx.fillRect(x,y,3,ch);}
      drawCraftInCard(x,y,cw,56,ship.id,meta.selectedCore);
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=sel?'#e8e8f0':ship.color;
      ctx.fillText(ship.name,x+cw/2,y+65);
      ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.45)';
      ctx.fillText(sel?'● 選択中':'タップで選択',x+cw/2,y+76);
    }
  }else{
    const ship=selectedShipDef();
    drawLoadoutPanel(14,startY-8,W-28,70,ship);
    const owned=PART_DEFS.filter(p=>meta.ownedParts[p.id]);
    if(owned.length===0){
      ctx.fillStyle='rgba(232,232,240,.32)';ctx.font='bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
      ctx.fillText('パーツ未所持 / ストアで購入',W/2,startY+60);
    }
    const listY=startY+72;
    if(owned.length===0){
      ctx.fillStyle='rgba(6,6,14,.92)';
      ctx.fillRect(24,startY+48,W-48,22);
      ctx.fillRect(24,listY+4,W-48,30);
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font='bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.55)';
      ctx.fillText('NO PARTS / BUY IN STORE',W/2,listY+19);
    }
    const cw=(W-36)/2,ch=70;
    for(let i=0;i<owned.length;i++){
      const part=owned[i],col=i%2,row=Math.floor(i/2);
      const x=14+col*(cw+8),y=listY+row*(ch+6);
      const mounted=partMountedShip(part.id)===ship.id;
      const onOther=partMountedShip(part.id)&&!mounted;
      const limit=ship.slots[part.type]||0;
      const cur=(mountedForShip(ship.id)[part.type]||[]).length;
      const info=partInfo(part);
      rr(x,y,cw,ch,5);ctx.fillStyle=h2r(part.color,mounted?.18:.09);ctx.fill();
      ctx.strokeStyle=mounted?part.color:h2r(part.color,.40);ctx.lineWidth=mounted?1.8:1;rr(x,y,cw,ch,5);ctx.stroke();
      ctx.textAlign='left';ctx.textBaseline='middle';
      ctx.font='13px serif';ctx.fillStyle=part.color;ctx.fillText(part.icon,x+7,y+18);
      ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#e8e8f0';ctx.fillText(part.name.slice(0,11),x+7,y+34);
      ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.45)';ctx.fillText(partTypeName(part.type),x+7,y+47);
      ctx.fillStyle=part.color;ctx.fillText(multText(part.mult,true),x+7,y+60);
      ctx.textAlign='right';ctx.font='bold 7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
      if(mounted){ctx.fillStyle='#00f0ff';ctx.fillText('MOUNTED',x+cw-7,y+14);}
      else if(onOther){ctx.fillStyle='#ffe040';ctx.fillText('他機搭載',x+cw-7,y+14);}
      else{ctx.fillStyle=cur<limit?'#00dd77':'rgba(180,180,200,.45)';ctx.fillText(cur<limit?'装備可':'スロット満',x+cw-7,y+14);}
    }
  }
  ctx.restore();
}
function handleWarehouseClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const tab=hitTabRow(cx,cy,['ship','part'],98);
  if(tab){warehouseTab=tab;return;}
  const startY=134;
  if(warehouseTab==='ship'){
    const owned=SHIP_DEFS.filter(s=>meta.ownedShips[s.id]);
    const cw=(W-36)/2,ch=82;
    for(let i=0;i<owned.length;i++){
      const col=i%2,row=Math.floor(i/2);
      const x=14+col*(cw+8),y=startY+row*(ch+6);
      if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch){buyOrSelectShip(owned[i].id);return;}
    }
  }else{
    const owned=PART_DEFS.filter(p=>meta.ownedParts[p.id]);
    const listY=startY+72;
    const cw=(W-36)/2,ch=70;
    for(let i=0;i<owned.length;i++){
      const col=i%2,row=Math.floor(i/2);
      const x=14+col*(cw+8),y=listY+row*(ch+6);
      if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch){toggleMountPart(owned[i].id);return;}
    }
  }
}

// ── アップグレード画面（基礎ステータス恒久強化） ──
function drawUpgradeScreen(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(6,6,14,.82)';ctx.fillRect(0,0,W,H);
  drawSubHeader('UPGRADE');
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.40)';
  ctx.fillText('恒久強化 / ゲーム内スタッツと別 / コスト青天井',W/2,60);
  const startY=70,cw=(W-36)/2,ch=58;
  for(let i=0;i<BASIC_STAT_DEFS.length;i++){
    const d=BASIC_STAT_DEFS[i],col=i%2,row=Math.floor(i/2);
    const x=14+col*(cw+8),y=startY+row*(ch+6);
    const lv=meta.homeUpgrades[d.id]||0,cost=homeUpgradeCost(d.id),can=meta.tokens>=cost;
    rr(x,y,cw,ch,5);ctx.fillStyle=h2r(d.color,lv>0?.16:.08);ctx.fill();
    ctx.strokeStyle=can?d.color:h2r(d.color,lv>0?.45:.28);ctx.lineWidth=can?1.6:1;rr(x,y,cw,ch,5);ctx.stroke();
    ctx.fillStyle=h2r(d.color,lv>0?.8:.35);ctx.fillRect(x,y,3,ch);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font='15px serif';ctx.fillStyle=d.color;ctx.shadowColor=d.color;ctx.shadowBlur=lv>0?5:0;
    ctx.fillText(d.icon,x+7,y+15);ctx.shadowBlur=0;
    ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#e8e8f0';ctx.fillText(d.name,x+26,y+15);
    ctx.font='8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=d.color;ctx.fillText(`Lv.${lv}`,x+7,y+33);
    ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.50)';ctx.fillText(homeStatBonus(d.id),x+7,y+47);
    ctx.textAlign='right';ctx.font='bold 8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    drawTokenAmount(x+cw-7,y+29,cost,'right',8);
    ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=can?'#00f0ff':'rgba(130,130,160,.35)';
    ctx.fillText(can?'▲ UP':'---',x+cw-7,y+43);
  }
  ctx.restore();
}
function handleUpgradeClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const startY=70,cw=(W-36)/2,ch=58;
  for(let i=0;i<BASIC_STAT_DEFS.length;i++){
    const col=i%2,row=Math.floor(i/2);
    const x=14+col*(cw+8),y=startY+row*(ch+6);
    if(cx>=x&&cx<=x+cw&&cy>=y&&cy<=y+ch){buyHomeUpgrade(BASIC_STAT_DEFS[i].id);return;}
  }
}

// ── 図鑑画面 ──
function codexItems(){
  if(codexTab==='basic'){
    return BASIC_STAT_DEFS.map(d=>({
      id:d.id,
      name:d.name,
      icon:d.icon,
      color:d.color,
      meta:basicGainText(d.id,0),
      desc:homeStatBonus(d.id)==='未強化' ? 'ゲーム中/恒久強化で伸びる基礎性能' : homeStatBonus(d.id)
    }));
  }
  return SPECIAL_DEFS.map(d=>({
    id:d.id,
    name:d.name,
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
  rr(x,y,w,h,6);
  ctx.fillStyle='rgba(232,232,240,.045)';ctx.fill();
  ctx.strokeStyle=h2r(item.color,.28);ctx.lineWidth=1;rr(x,y,w,h,6);ctx.stroke();
  ctx.fillStyle=h2r(item.color,.48);ctx.fillRect(x,y,3,h);
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font=item.icon.length>1?'bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif':'15px serif';
  ctx.fillStyle=h2r(item.color,.86);ctx.fillText(item.icon,x+12,y+18);
  ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='#e8e8f0';
  ctx.fillText(item.name,x+42,y+18);
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=h2r(item.color,.74);
  ctx.textAlign='right';ctx.fillText(item.meta,x+w-12,y+18);
  ctx.textAlign='left';ctx.font='8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.58)';
  ctx.fillText(item.desc,x+12,y+41);
}
function drawCodexScreen(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(6,6,14,.84)';ctx.fillRect(0,0,W,H);
  drawSubHeader('CODEX');
  drawTabRow(['special','basic'],{special:'Unique Ability',basic:'Base Upgrade'},codexTab,58);
  const items=codexItems();
  const pages=codexPageCount();
  codexPage=Math.max(0,Math.min(pages-1,codexPage));
  const start=codexPage*CODEX.pageSize;
  const pageItems=items.slice(start,start+CODEX.pageSize);
  for(let i=0;i<pageItems.length;i++){
    drawCodexRow(pageItems[i],14,CODEX.startY+i*(CODEX.rowH+6),W-28,CODEX.rowH);
  }
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.42)';
  ctx.fillText(codexTab==='special'?'Unique Ability は経験値レベルアップで出現します':'Base Upgrade はゲーム中とホーム強化の両方で伸びます',W/2,590);
  const py=CODEX.pagerY, leftX=W/2-CODEX.btnW-14, rightX=W/2+14;
  const canPrev=codexPage>0, canNext=codexPage<pages-1;
  for(const b of [
    {x:leftX,label:'PREV',on:canPrev},
    {x:rightX,label:'NEXT',on:canNext},
  ]){
    rr(b.x,py,CODEX.btnW,CODEX.btnH,5);
    ctx.fillStyle=b.on?'rgba(136,170,255,.10)':'rgba(232,232,240,.035)';ctx.fill();
    ctx.strokeStyle=b.on?'rgba(136,170,255,.45)':'rgba(232,232,240,.14)';ctx.lineWidth=1;rr(b.x,py,CODEX.btnW,CODEX.btnH,5);ctx.stroke();
    ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=b.on?'#88aaff':'rgba(232,232,240,.28)';
    ctx.fillText(b.label,b.x+CODEX.btnW/2,py+CODEX.btnH/2);
  }
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.52)';
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
function drawSettingsScreen(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(6,6,14,.82)';ctx.fillRect(0,0,W,H);
  drawSubHeader('SETTINGS');
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font='bold 11px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.62)';
  ctx.fillText('TOUCH CONTROL',24,88);
  const modes=[
    {id:'buttons',label:'ボタン',desc:'タップ位置へ移動',color:'#00f0ff'},
    {id:'stick',label:'スティック',desc:'ドラッグ量で移動',color:'#00dd77'},
  ];
  const bx=24, by=110, bw=W-48, bh=70, gap=12;
  for(let i=0;i<modes.length;i++){
    const m=modes[i], y=by+i*(bh+gap), active=touchControlMode()===m.id;
    rr(bx,y,bw,bh,6);
    const g=ctx.createLinearGradient(bx,y,bx+bw,y+bh);
    g.addColorStop(0,h2r(m.color,active?.22:.08));
    g.addColorStop(1,'rgba(6,6,14,.70)');
    ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle=active?m.color:h2r(m.color,.30);ctx.lineWidth=active?2:1.1;rr(bx,y,bw,bh,6);ctx.stroke();
    ctx.fillStyle=h2r(m.color,active?.85:.35);ctx.fillRect(bx,y,4,bh);
    ctx.font='bold 15px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=active?m.color:'#e8e8f0';
    ctx.shadowColor=m.color;ctx.shadowBlur=active?8:0;
    ctx.fillText(m.label,bx+18,y+24);ctx.shadowBlur=0;
    ctx.font='9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.50)';
    ctx.fillText(m.desc,bx+18,y+47);
    ctx.textAlign='right';ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle=active?'#ffe040':'rgba(232,232,240,.28)';
    ctx.fillText(active?'ACTIVE':'TAP',bx+bw-18,y+35);
    ctx.textAlign='left';
  }
  ctx.font='8px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.38)';
  ctx.textAlign='center';
  ctx.fillText('スマホプレイ中の表示と入力方式を切り替えます',W/2,294);
  ctx.restore();
}
function handleSettingsClick(cx,cy){
  if(hitBackBtn(cx,cy)){homeState='home';return;}
  const bx=24, by=110, bw=W-48, bh=70, gap=12;
  const modes=['buttons','stick'];
  for(let i=0;i<modes.length;i++){
    const y=by+i*(bh+gap);
    if(cx>=bx&&cx<=bx+bw&&cy>=y&&cy<=y+bh){setTouchControlMode(modes[i]);return;}
  }
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
  ctx.font='7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.48)';
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
    ctx.fillText(installPromptEvent?'INSTALL APP':'ADD TO HOME',W/2,INSTALL_BTN.y+INSTALL_BTN.h/2);
    ctx.shadowBlur=0;
  }
  ctx.restore();
}
function drawHomeScreenV2(){
  drawBg();ctx.save();
  ctx.fillStyle='rgba(4,5,12,.58)';ctx.fillRect(0,0,W,H);

  const top=ctx.createLinearGradient(0,0,0,96);
  top.addColorStop(0,'rgba(6,6,14,.96)');
  top.addColorStop(.66,'rgba(10,14,26,.70)');
  top.addColorStop(1,'rgba(6,6,14,0)');
  ctx.fillStyle=top;ctx.fillRect(0,0,W,96);
  ctx.fillStyle='rgba(0,240,255,.42)';ctx.fillRect(14,16,3,30);
  ctx.font='42px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.shadowColor='#00f0ff';ctx.shadowBlur=9;ctx.fillStyle='#e8fbff';
  ctx.fillText('BARRAGE',24,32);ctx.shadowBlur=0;
  ctx.font='bold 7px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.fillStyle='rgba(232,232,240,.42)';
  ctx.fillText('ネオン迎撃プラットフォーム',25,52);
  drawTokenAmount(W-16,31,meta.tokens,'right',10);

  const ship=selectedShipDef(), core=selectedCoreDef();
  const hx=16, hy=74, hw=W-32, hh=254;
  rr(hx,hy,hw,hh,8);
  const hg=ctx.createLinearGradient(hx,hy,hx+hw,hy+hh);
  hg.addColorStop(0,h2r(ship.color,.20));
  hg.addColorStop(.42,'rgba(14,18,32,.82)');
  hg.addColorStop(1,'rgba(5,6,13,.94)');
  ctx.fillStyle=hg;ctx.fill();
  ctx.strokeStyle='rgba(232,232,240,.16)';ctx.lineWidth=1;rr(hx,hy,hw,hh,8);ctx.stroke();
  ctx.fillStyle=h2r(ship.color,.42);ctx.fillRect(hx,hy,4,hh);
  ctx.fillStyle='rgba(232,232,240,.055)';
  ctx.fillRect(hx+14,hy+42,hw-28,1);
  ctx.fillRect(hx+14,hy+196,hw-28,1);
  ctx.save();
  ctx.beginPath();ctx.rect(hx,hy,hw,hh);ctx.clip();
  ctx.strokeStyle='rgba(0,240,255,.08)';ctx.lineWidth=1;
  for(let i=-4;i<9;i++){
    const y=hy+138+i*18;
    ctx.beginPath();ctx.moveTo(hx+18,y);ctx.lineTo(hx+hw-18,y+34);ctx.stroke();
  }
  ctx.strokeStyle=h2r(ship.color,.22);ctx.lineWidth=1.1;
  ctx.beginPath();ctx.ellipse(W/2,hy+142,118,44,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(W/2,hy+142,76,26,0,0,Math.PI*2);ctx.stroke();
  ctx.restore();

  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.48)';
  ctx.fillText('選択中の機体',hx+18,hy+20);
  ctx.font='bold 13px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=h2r(ship.color,.92);
  ctx.fillText(ship.name,hx+18,hy+39);
  ctx.textAlign='right';ctx.font='bold 10px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.58)';
  ctx.fillText(`コア ${core.name} / Lv.${selectedCoreLevel()}`,hx+hw-18,hy+39);

  ctx.save();
  ctx.shadowColor=ship.color;ctx.shadowBlur=24;
  drawCraft(W/2,hy+132,1.28);
  ctx.restore();

  ctx.textAlign='center';
  ctx.font='bold 9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.54)';
  ctx.fillText(slotText(ship).slice(0,54),W/2,hy+214);
  ctx.fillStyle=h2r(ship.color,.76);
  ctx.fillText(loadoutText(ship.id).slice(0,58),W/2,hy+232);

  const actionBg=ctx.createLinearGradient(0,330,0,H);
  actionBg.addColorStop(0,'rgba(6,6,14,0)');
  actionBg.addColorStop(.30,'rgba(8,10,20,.76)');
  actionBg.addColorStop(1,'rgba(4,5,12,.96)');
  ctx.fillStyle=actionBg;ctx.fillRect(0,330,W,H-330);

  const sx=W/2-BTN_W/2, sy=HOME_START_Y;
  rr(sx,sy,BTN_W,BTN_H,6);
  const sg=ctx.createLinearGradient(sx,sy,sx+BTN_W,sy+BTN_H);
  sg.addColorStop(0,'rgba(255,45,120,.34)');
  sg.addColorStop(.50,'rgba(255,64,128,.18)');
  sg.addColorStop(1,'rgba(6,6,14,.88)');
  ctx.fillStyle=sg;ctx.fill();
  ctx.strokeStyle='rgba(255,96,150,.72)';ctx.lineWidth=1.4;rr(sx,sy,BTN_W,BTN_H,6);ctx.stroke();
  ctx.fillStyle='rgba(255,45,120,.45)';ctx.fillRect(sx,sy,5,BTN_H);
  ctx.font='32px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor='#ff2d78';ctx.shadowBlur=8;ctx.fillStyle='#fff2f7';
  ctx.fillText('スタート',W/2,sy+BTN_H/2+2);ctx.shadowBlur=0;

  for(let i=0;i<HOME_NAV_VIEW.length;i++){
    const b=HOME_NAV_VIEW[i],col=i%2,row=Math.floor(i/2);
    const bx=HOME_NAV.x+col*(HOME_NAV.w+HOME_NAV.gapX),by=HOME_NAV.y+row*(HOME_NAV.h+HOME_NAV.gapY);
    rr(bx,by,HOME_NAV.w,HOME_NAV.h,5);
    const ng=ctx.createLinearGradient(bx,by,bx+HOME_NAV.w,by+HOME_NAV.h);
    ng.addColorStop(0,h2r(b.color,.13));
    ng.addColorStop(1,'rgba(8,10,20,.82)');
    ctx.fillStyle=ng;ctx.fill();
    ctx.strokeStyle='rgba(232,232,240,.14)';ctx.lineWidth=1;rr(bx,by,HOME_NAV.w,HOME_NAV.h,5);ctx.stroke();
    ctx.fillStyle=h2r(b.color,.56);ctx.fillRect(bx,by,3,HOME_NAV.h);
    ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.font='bold 15px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle=h2r(b.color,.94);
    ctx.fillText(b.label,bx+14,by+21);
    ctx.font='9px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';ctx.fillStyle='rgba(232,232,240,.48)';
    ctx.fillText(b.sub,bx+14,by+39);
    ctx.textAlign='right';ctx.font='bold 14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
    ctx.fillStyle='rgba(232,232,240,.26)';
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
function drawStartScreen(){
  if(homeState==='store'){drawStoreScreen();return;}
  if(homeState==='warehouse'){drawWarehouseScreen();return;}
  if(homeState==='upgrade'){drawUpgradeScreen();return;}
  if(homeState==='codex'){drawCodexScreen();return;}
  if(homeState==='settings'){drawSettingsScreen();return;}
  drawHomeScreenV2();
}
function drawGameOver(){
  ctx.save();
  ctx.fillStyle='rgba(6,6,14,.82)'; ctx.fillRect(0,0,W,H);
  ctx.font='66px "Teko","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor='#ff2d78'; ctx.shadowBlur=12; ctx.fillStyle='#ff2d78';
  ctx.fillText('GAME OVER',W/2,H/2-74); ctx.shadowBlur=0;
  ctx.font='14px "Rajdhani","Zen Kaku Gothic New","Yu Gothic UI",Meiryo,sans-serif'; ctx.fillStyle='#c8c8e0';
  ctx.fillText(`SCORE   ${score.toLocaleString()}`,W/2,H/2+6);
  ctx.fillText(`WAVE    ${wave}`,W/2,H/2+30);
  ctx.globalAlpha=tokensEarned>0?1:.45;
  drawTokenAmount(W/2,H/2+54,`+${tokensEarned}`,'center',14);
  ctx.globalAlpha=1;
  drawBtn(W/2-BTN_W/2,GAME_OVER_RETRY_Y,BTN_W,BTN_H,'RETRY','#00f0ff');
  drawBtn(W/2-BTN_W/2,GAME_OVER_HOME_Y,BTN_W,BTN_H,'HOME','#88aaff');
  ctx.restore();
}

// ─────────────────────────────────────
//  ゲーム開始・終了
// ─────────────────────────────────────
function startGame(){
  state='play'; score=0; coins=0; wave=1; frame=0; hp=100; maxHp=100;
  maxHp=Math.ceil(100*bodyMult('hp')); hp=maxHp;
  xp=0; xpLevel=0; hitXpBank=0; tokensEarned=0; invincible=0; skillPoints=0; fireTimer=0; regenBank=0; shield=0; shieldCooldown=0; droneTimer=0; bitTimer=0; waveBanner=0;
  arrows=[];enemies=[];particles=[];epOrbs=[];floatTexts=[];pendingSpecials=[];upgradeZones=[];
  statLevels   ={fireRate:0,bulletSpeed:0,damage:0,range:0,hp:0,xpMult:0,speed:0,critChance:0,critDamage:0,regen:0};
  specialLevels=makeSpecialLevels();
  player.x=W/2; player.y=PLAYER_Y; player.prevX=player.x; player.prevY=player.y;
  spawnUpgradeZones();
}
function endGame(){
  if(state!=='dead') awardTokens();
  state='dead';
}
function returnHome(){
  if(state==='play'||state==='pause') awardTokens();
  state='start';
  homeState='home';
  pauseView='menu';
  stopTouchMove();
  activePointerId=null;
  arrows=[];enemies=[];epOrbs=[];upgradeZones=[];pendingSpecials=[];
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
  addFloat(W/2,H-110,'SHARE -> ADD TO HOME','#00dd77',11);
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
  keys[e.key]=true;
  if(e.key==='Enter'||e.key===' '){if(state==='start'||state==='dead') startGame();}
  if(e.key==='Escape'){
    if(state==='play') pauseGame();
    else if(state==='pause') resumeGame();
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
  if(state==='specialUpgrade'){handleSpecialAt(cx,cy);return true;}
  if(state==='pause'){handlePauseClick(cx,cy);return true;}
  if(state==='play'&&hitPause(cx,cy)){pauseGame();return true;}
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
function hitInstall(cx,cy){ return canShowInstallAction()&&cx>=INSTALL_BTN.x&&cx<=INSTALL_BTN.x+INSTALL_BTN.w&&cy>=INSTALL_BTN.y&&cy<=INSTALL_BTN.y+INSTALL_BTN.h; }
function hitRetry(cx,cy){ return cx>W/2-BTN_W/2&&cx<W/2+BTN_W/2&&cy>GAME_OVER_RETRY_Y&&cy<GAME_OVER_RETRY_Y+BTN_H; }
function hitGameOverHome(cx,cy){ return cx>W/2-BTN_W/2&&cx<W/2+BTN_W/2&&cy>GAME_OVER_HOME_Y&&cy<GAME_OVER_HOME_Y+BTN_H; }
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
    drawEpOrbs();drawStasisAura();drawSupportUnits();drawShield();drawPlayer();drawParticles();drawFloatTexts();
    drawGameOver();return;
  }
  if(state==='pause'){
    drawBg();
    drawArrows();
    for(const e of enemies)drawEnemy(e);
    drawEpOrbs();
    drawStasisAura();
    drawSupportUnits();
    drawShield();
    drawPlayer();
    drawUpgradeZones();
    drawParticles();
    drawFloatTexts();
    drawHUD();
    drawPauseMenu();
    return;
  }
  if(state==='specialUpgrade'){
    drawBg();updateParticles();updateEpOrbs();updateFloatTexts();
    drawParticles();drawEpOrbs();
    drawSpecialScreen();drawFloatTexts();return;
  }

  // ── プレイ中 ──
  frame++;

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
  fireTimer++;if(fireTimer>=fireInterval()){fireTimer=0;fireArrows();}

  // ウェーブアップ
  if(frame%600===0){
    wave++;waveBanner=120;
    spawnUpgradeZones();
  }

  // 敵スポーン（グレースピリオド付き）
  if(frame>GRACE_FRAMES){
    const sr=Math.max(65,175-wave*11);
    if(frame%sr===0){const n=1+Math.floor(wave/6);for(let i=0;i<n;i++)spawnEnemy();}
  }

  // ゲートタイマー
  // 更新
  updateSupportUnits();updateShield();updateArrows();updateEpOrbs();updateUpgradeZones();updateParticles();updateFloatTexts();
  const stasisActive=specialLevels.stasisAura>0;
  const stasisR=stasisActive?stasisRadius():0;
  const stasisR2=stasisR*stasisR;
  const stasisSlow=stasisActive?stasisMult():1;
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];
    const slow=stasisActive&&distSq(player.x,player.y,e.x,e.y)<stasisR2?stasisSlow:1;
    e.x+=e.vx*slow;e.y+=e.vy*slow;
    e.rot+=e.rotSpd*slow;
    if(e.y>H+e.size*2) enemies.splice(i,1);
  }
  checkCollisions();

  // 描画（シェイク付き）
  ctx.save();
  ctx.translate(sx,sy);
  drawBg();
  drawArrows();
  for(const e of enemies)drawEnemy(e);
  drawEpOrbs();
  drawStasisAura();
  drawSupportUnits();
  drawShield();
  drawPlayer();
  drawUpgradeZones();
  drawParticles();
  drawFloatTexts();
  drawWaveBanner();
  ctx.restore();

  // HUDはシェイクの外で描画
  drawHUD();
  drawTouchControls();
}

// ─────────────────────────────────────
//  初期化
// ─────────────────────────────────────
loadMeta();
resizeCanvas();
initBg();
loop();
