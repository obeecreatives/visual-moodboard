import { PackagingShapeKey, MaterialStyle, TextureType } from '../types';

export interface ShapeDefinition {
  viewBox: string;
  zone: { x: number; y: number; w: number; h: number };
  windowZone?: { x: number; y: number; w: number; h: number; rx?: number };
  shadowY?: number;
  baseClip: string;
  build: (base: string, top: string, side: string) => string;
}

export const SHAPE_LABELS: Record<PackagingShapeKey, string> = {
  box: 'Kotak Karton Box (Folding Box)',
  pouch: 'Standing Pouch Klasik',
  bottle: 'Botol Kaca Minuman & Madu',
  jar: 'Toples Jar Kaca (Madu & Selai)',
  tube: 'Tube Fleksibel (Kosmetik & Pasta)',
  paperbag: 'Paper Bag Jinjing (Tali Rope)',
  kraftbag: 'Kantong Kertas Kraft (Bakery & Roti)',
  giftbox: 'Gift Box Mewah (Tutup Lepas / Lid & Base)',
  mailerbox: 'Mailer Box E-commerce (Karton Lipat)',
  canister: 'Canister Kaleng Silinder (Tea & Cookies)',
  standpouch: 'Standing Pouch Doypack (Window View)',
  flowbag: 'Flow Wrap Snack (Segel Horizontal)',
  zipperpouch: 'Pouch Zipper Klip (Resealable Doypack)',
  gabletop: 'Karton Gable-Top (Atap Segitiga Susu/Jus)',
  handlebag: 'Handle Bag Jinjing (Die-Cut Oval)',
  sachet: 'Sachet Saset Mini (Kopi / Bumbu / Sambal)',
  flatpillow: 'Pillow Pouch Kembung (Keripik & Snack)'
};

export const SHAPE_DESCRIPTIONS: Record<PackagingShapeKey, string> = {
  box: 'Karton box lipat standar dengan sudut presisi, cocok untuk produk farmasi, herbal, skincare box, teh celup, atau kue.',
  pouch: 'Pouch berdiri dengan lekukan samping ramping dan segel atas rapat untuk kopi bubuk, bubuk herbal, dan bumbu.',
  bottle: 'Botol kaca silinder dengan leher ramping dan tutup ulir emas untuk madu cair, cold brew, sirup, atau minyak herbal.',
  jar: 'Toples jar kaca tebal dengan tutup metal ulir emas dan cairan madu emas, khas madu hutan, selai artisan, dan sambal.',
  tube: 'Tube fleksibel dengan tutup flip-top kokoh di bawah dan segel crimp atas, standar industri facial wash, pasta, dan salep.',
  paperbag: 'Paper bag jinjing dengan lipatan samping accordion dan sepasang tali rope kepang 3D yang elegan untuk butik & gift hampers.',
  kraftbag: 'Kantong kertas cokelat kraft dengan bukaan atas bergerigi (zigzag) dan lipatan samping khas kemasan bakery, donat & kopi.',
  giftbox: 'Kotak hadiah eksklusif dengan tutup terpisah (lid) yang dapat dilepas, aksen leher emas (gold neck), dan pita luxury.',
  mailerbox: 'Karton bergelombang (corrugated) profil rendah dengan sayap lipat samping dan pengunci depan untuk pengiriman e-commerce.',
  canister: 'Tabung silinder kokoh dengan bibir metal emas di atas dan bawah serta tutup logam untuk teh premium, cookies, dan biskuit.',
  standpouch: 'Standing pouch doypack modern dengan lipatan bawah oval stabil dan jendela transparan (window view) memperlihatkan isi produk.',
  flowbag: 'Kemasan bantal horizontal dengan segel gerigi di ujung kiri & kanan untuk wafer, biskuit, snack bar, dan mie instan.',
  zipperpouch: 'Pouch doypack bersegel klip zipper kedap udara dengan lubang gantung (euro-slot) untuk gantungan display rak toko.',
  gabletop: 'Karton minuman khas dengan atap segitiga (gable-top) dan corong tutup ulir plastik untuk susu pasteurisasi, jus, & teh cair.',
  handlebag: 'Tas belanja plastik/spunbond dengan lubang pegangan jinjing berbentuk oval (die-cut handle) yang terpotong rapi.',
  sachet: 'Saset mini ramping segel 4-sisi dengan tepi gerigi lebar dan sobekan laser (tear notch) untuk porsi sekali seduh.',
  flatpillow: 'Kemasan kantong bantal menggelembung berisi udara dengan segel rapat atas & bawah untuk keripik kentang & snack renyah.'
};

/* ---------------- Texture definitions ---------------- */
export const TEXTURE_FILTERS: Record<Exclude<TextureType, 'none' | 'dots'>, string> = {
  'kraft-grain': `<filter id="texf-kraft-grain" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 1.1 1.1 0 0"/>
    </filter>`,
  'linen': `<filter id="texf-linen" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="turbulence" baseFrequency="0.015 0.25" numOctaves="1" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 1.1 1.1 0 0"/>
    </filter>`,
  'canvas': `<filter id="texf-canvas" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="turbulence" baseFrequency="0.09" numOctaves="3" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 1.1 1.1 0 0"/>
    </filter>`
};

export const TEXTURE_PATTERN_DOTS = `<pattern id="texp-dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.3" fill="#000"/></pattern>`;

export const SHADOW_BLUR_FILTER = `<filter id="shadowBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>`;

export function buildGroundShadow(vbW: number, vbH: number, shadowYFrac?: number): string {
  const cx = vbW / 2;
  const cy = vbH * (shadowYFrac != null ? shadowYFrac : 0.94);
  const rx = vbW * 0.30;
  const ry = rx * 0.16;
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000000" opacity="0.30" filter="url(#shadowBlur)"/>`;
}

export const MATERIAL_CYL_SCALE: Record<MaterialStyle, number> = {
  glossy: 1,
  matte: 0.35,
  kraft: 0.65
};

export function cylLightDefFor(materialStyle: MaterialStyle): string {
  const s = MATERIAL_CYL_SCALE[materialStyle] ?? 1;
  return `<linearGradient id="cylLight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000000" stop-opacity="${(0.16 * s).toFixed(3)}"/>
      <stop offset="0.22" stop-color="#000000" stop-opacity="0"/>
      <stop offset="0.42" stop-color="#ffffff" stop-opacity="${(0.40 * s).toFixed(3)}"/>
      <stop offset="0.58" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="${(0.14 * s).toFixed(3)}"/>
    </linearGradient>`;
}

export const MATERIAL_GLOSS: Record<MaterialStyle, { c1: string; o1: number; c2: string; o2: number; c3: string; o3: number }> = {
  glossy: { c1: '#ffffff', o1: 0.18, c2: '#ffffff', o2: 0, c3: '#000000', o3: 0.12 },
  matte:  { c1: '#ffffff', o1: 0.06, c2: '#ffffff', o2: 0, c3: '#000000', o3: 0.06 },
  kraft:  { c1: '#f4e4c1', o1: 0.16, c2: '#f4e4c1', o2: 0, c3: '#3b2a18', o3: 0.14 }
};

export function glossDefsFor(materialStyle: MaterialStyle): string {
  const m = MATERIAL_GLOSS[materialStyle] || MATERIAL_GLOSS.glossy;
  return `<linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${m.c1}" stop-opacity="${m.o1}"/>
      <stop offset="0.35" stop-color="${m.c2}" stop-opacity="${m.o2}"/>
      <stop offset="1" stop-color="${m.c3}" stop-opacity="${m.o3}"/>
    </linearGradient>`;
}

export const WINDOW_CONTENT_DOTS = [
  { x: 0.15, y: 0.20, r: 0.10, c: '#8B5E34' }, { x: 0.35, y: 0.15, r: 0.08, c: '#C9A227' },
  { x: 0.55, y: 0.25, r: 0.11, c: '#6B3F23' }, { x: 0.78, y: 0.20, r: 0.09, c: '#D9A441' },
  { x: 0.22, y: 0.50, r: 0.09, c: '#A8672E' }, { x: 0.48, y: 0.55, r: 0.12, c: '#7A4A26' },
  { x: 0.72, y: 0.50, r: 0.08, c: '#C98A3E' }, { x: 0.88, y: 0.42, r: 0.07, c: '#5E3A1E' },
  { x: 0.16, y: 0.80, r: 0.10, c: '#B97A38' }, { x: 0.42, y: 0.82, r: 0.08, c: '#8B5E34' },
  { x: 0.65, y: 0.78, r: 0.09, c: '#D9A441' }, { x: 0.85, y: 0.75, r: 0.07, c: '#6B3F23' }
];

export function buildWindowOverlay(wz?: { x: number; y: number; w: number; h: number; rx?: number }): string {
  if (!wz) return '';
  const rx = wz.rx || 10;
  const dots = WINDOW_CONTENT_DOTS.map(d => {
    const cx = wz.x + d.x * wz.w;
    const cy = wz.y + d.y * wz.h;
    const r = d.r * Math.min(wz.w, wz.h);
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${d.c}" opacity="0.85"/>`;
  }).join('');
  return `
    <clipPath id="winClip"><rect x="${wz.x}" y="${wz.y}" width="${wz.w}" height="${wz.h}" rx="${rx}"/></clipPath>
    <g clip-path="url(#winClip)">
      <rect x="${wz.x}" y="${wz.y}" width="${wz.w}" height="${wz.h}" fill="#f2ede0"/>
      ${dots}
      <rect x="${wz.x}" y="${wz.y}" width="${wz.w}" height="${wz.h}" fill="url(#gloss)" opacity="0.55"/>
    </g>
    <rect x="${wz.x}" y="${wz.y}" width="${wz.w}" height="${wz.h}" rx="${rx}" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2"/>`;
}

function crimpLines(xStart: number, y1: number, y2: number, count: number, gap: number): string {
  let s = '';
  for (let i = 0; i < count; i++) {
    const x = xStart + i * gap;
    s += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#000" stroke-opacity="0.12" stroke-width="1.5"/>`;
  }
  return s;
}

export const SHAPES: Record<PackagingShapeKey, ShapeDefinition> = {
  box: {
    viewBox: '0 0 300 300',
    zone: { x: 80, y: 120, w: 120, h: 100 },
    shadowY: 0.905,
    baseClip: '<rect x="60" y="90" width="160" height="180"/>',
    build: (base, top, side) => `
      <polygon points="60,90 220,90 260,50 100,50" fill="${top}"/>
      <polygon points="220,90 260,50 260,230 220,270" fill="${side}"/>
      <rect x="60" y="90" width="160" height="180" fill="${base}"/>
      <rect x="60" y="90" width="160" height="180" fill="url(#gloss)"/>`
  },
  pouch: {
    viewBox: '0 0 300 300',
    zone: { x: 88, y: 120, w: 124, h: 130 },
    windowZone: { x: 105, y: 82, w: 90, h: 38, rx: 12 },
    baseClip: '<rect x="68" y="66" width="164" height="220" rx="40"/>',
    build: (base, top, side) => `
      <polygon points="83,70 83,49 103,70" fill="${side}"/>
      <polygon points="217,70 217,49 197,70" fill="${side}"/>
      <rect x="68" y="66" width="164" height="220" rx="40" fill="${base}"/>
      <path d="M148,80 C142,150 150,220 146,272" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="14" stroke-linecap="round"/>
      <path d="M172,90 C178,150 172,215 176,268" fill="none" stroke="#000" stroke-opacity="0.05" stroke-width="16" stroke-linecap="round"/>
      <rect x="68" y="66" width="164" height="220" rx="40" fill="url(#gloss)"/>
      <line x1="82" y1="93" x2="218" y2="93" stroke="${top}" stroke-width="2" opacity="0.45"/>`
  },
  bottle: {
    viewBox: '0 0 200 320',
    zone: { x: 50, y: 158, w: 100, h: 92 },
    baseClip: '<rect x="40" y="108" width="120" height="190" rx="14"/>',
    build: (base, top, side) => `
      <rect x="80" y="8" width="40" height="30" rx="4" fill="${side}"/>
      <rect x="85" y="38" width="30" height="28" fill="${side}"/>
      <polygon points="60,66 140,66 160,108 40,108" fill="${top}"/>
      <rect x="40" y="108" width="120" height="190" rx="14" fill="${base}"/>
      <rect x="40" y="108" width="120" height="190" rx="14" fill="url(#gloss)"/>
      <rect x="40" y="108" width="120" height="190" rx="14" fill="url(#cylLight)"/>`
  },
  jar: {
    viewBox: '0 0 220 260',
    zone: { x: 45, y: 112, w: 130, h: 92 },
    baseClip: '<rect x="30" y="55" width="160" height="185" rx="20"/>',
    build: (base, top, side) => `
      <rect x="40" y="8" width="140" height="30" rx="6" fill="${side}"/>
      <rect x="50" y="36" width="120" height="12" fill="${top}"/>
      <rect x="30" y="55" width="160" height="185" rx="20" fill="${base}"/>
      <rect x="30" y="55" width="160" height="185" rx="20" fill="url(#gloss)"/>
      <rect x="30" y="55" width="160" height="185" rx="20" fill="url(#cylLight)"/>`
  },
  tube: {
    viewBox: '0 0 160 320',
    zone: { x: 50, y: 150, w: 60, h: 110 },
    baseClip: '<rect x="45" y="95" width="70" height="200" rx="14"/>',
    build: (base, top, side) => `
      <polygon points="72,8 88,8 92,26 68,26" fill="${side}"/>
      <rect x="58" y="26" width="44" height="24" rx="4" fill="${side}"/>
      <polygon points="45,50 115,50 105,95 55,95" fill="${top}"/>
      <rect x="45" y="95" width="70" height="200" rx="14" fill="${base}"/>
      <rect x="45" y="95" width="70" height="200" rx="14" fill="url(#gloss)"/>
      <rect x="45" y="95" width="70" height="200" rx="14" fill="url(#cylLight)"/>`
  },
  paperbag: {
    viewBox: '0 0 260 300',
    zone: { x: 60, y: 112, w: 140, h: 108 },
    shadowY: 0.86,
    baseClip: '<rect x="40" y="70" width="160" height="188"/>',
    build: (base, top, side) => `
      <path d="M75,30 C75,5 100,5 100,30" fill="none" stroke="#2c2a26" stroke-width="6"/>
      <path d="M160,30 C160,5 185,5 185,30" fill="none" stroke="#2c2a26" stroke-width="6"/>
      <rect x="40" y="52" width="190" height="18" fill="${top}"/>
      <rect x="200" y="70" width="30" height="188" fill="${side}"/>
      <rect x="40" y="70" width="160" height="188" fill="${base}"/>
      <rect x="40" y="70" width="160" height="188" fill="url(#gloss)"/>
      <line x1="40" y1="90" x2="230" y2="90" stroke="#000" stroke-opacity="0.08" stroke-width="2"/>`
  },
  kraftbag: {
    viewBox: '0 0 220 300',
    zone: { x: 52, y: 118, w: 112, h: 118 },
    shadowY: 0.867,
    baseClip: '<rect x="40" y="72" width="124" height="188"/>',
    build: (base, top, side) => `
      <polygon points="40,60 60,44 80,60 100,44 120,60 140,44 160,60 176,44 176,72 40,72" fill="${top}"/>
      <rect x="164" y="72" width="16" height="188" fill="${side}"/>
      <rect x="40" y="72" width="124" height="188" fill="${base}"/>
      <rect x="40" y="72" width="124" height="188" fill="url(#gloss)"/>
      <line x1="40" y1="96" x2="164" y2="96" stroke="#000" stroke-opacity="0.10" stroke-width="2"/>`
  },
  giftbox: {
    viewBox: '0 0 300 300',
    zone: { x: 85, y: 162, w: 110, h: 88 },
    shadowY: 0.90,
    baseClip: '<rect x="60" y="140" width="160" height="130"/>',
    build: (base, top, side) => `
      <rect x="60" y="130" width="160" height="12" fill="${side}"/>
      <polygon points="220,140 260,110 260,240 220,270" fill="${side}"/>
      <rect x="60" y="140" width="160" height="130" fill="${base}"/>
      <rect x="60" y="140" width="160" height="130" fill="url(#gloss)"/>
      <polygon points="230,88 270,58 270,104 230,134" fill="${side}"/>
      <rect x="50" y="88" width="180" height="46" fill="${top}"/>
      <rect x="50" y="88" width="180" height="46" fill="url(#gloss)"/>`
  },
  mailerbox: {
    viewBox: '0 0 300 260',
    zone: { x: 75, y: 122, w: 130, h: 96 },
    baseClip: '<rect x="50" y="90" width="180" height="150"/>',
    build: (base, top, side) => `
      <polygon points="230,90 260,70 260,220 230,240" fill="${side}"/>
      <polygon points="50,90 90,54 200,54 230,90" fill="${top}"/>
      <rect x="50" y="90" width="180" height="150" fill="${base}"/>
      <rect x="50" y="90" width="180" height="150" fill="url(#gloss)"/>
      <line x1="50" y1="90" x2="230" y2="90" stroke="#000" stroke-opacity="0.15" stroke-width="2"/>`
  },
  canister: {
    viewBox: '0 0 220 300',
    zone: { x: 45, y: 112, w: 130, h: 108 },
    shadowY: 0.883,
    baseClip: '<rect x="30" y="55" width="160" height="210"/>',
    build: (base, top, side) => `
      <ellipse cx="110" cy="264" rx="80" ry="15" fill="${side}"/>
      <rect x="30" y="55" width="160" height="210" fill="${base}"/>
      <rect x="30" y="55" width="160" height="210" fill="url(#gloss)"/>
      <rect x="30" y="55" width="160" height="210" fill="url(#cylLight)"/>
      <rect x="30" y="44" width="160" height="14" fill="${side}"/>
      <ellipse cx="110" cy="44" rx="80" ry="17" fill="${top}"/>`
  },
  standpouch: {
    viewBox: '0 0 300 340',
    zone: { x: 90, y: 170, w: 120, h: 120 },
    windowZone: { x: 105, y: 95, w: 90, h: 65, rx: 14 },
    baseClip: '<rect x="65" y="48" width="170" height="270" rx="26"/>',
    build: (base, top, side) => `
      <rect x="90" y="18" width="120" height="30" rx="10" fill="${side}"/>
      <rect x="65" y="48" width="170" height="270" rx="26" fill="${base}"/>
      <rect x="65" y="48" width="170" height="270" rx="26" fill="url(#gloss)"/>
      <path d="M80,60 C140,110 170,160 230,120" fill="none" stroke="#000" stroke-opacity="0.06" stroke-width="3"/>
      <path d="M85,75 C150,130 190,190 250,150" fill="none" stroke="#000" stroke-opacity="0.05" stroke-width="3"/>
      <path d="M90,95 C160,150 200,210 260,175" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="3"/>
      <path d="M95,115 C165,175 205,235 255,205" fill="none" stroke="#000" stroke-opacity="0.05" stroke-width="2"/>
      <path d="M100,140 C168,195 205,250 250,225" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="2"/>
      <line x1="78" y1="55" x2="108" y2="80" stroke="#333" stroke-width="1.4" stroke-dasharray="3,3"/>
      <path d="M100,72 l9,-2 l-3,9 Z" fill="#333"/>`
  },
  flowbag: {
    viewBox: '0 0 300 300',
    zone: { x: 95, y: 110, w: 110, h: 110 },
    windowZone: { x: 112, y: 68, w: 76, h: 38, rx: 20 },
    baseClip: '<path d="M75,55 C58,100 58,200 75,245 L225,245 C242,200 242,100 225,55 Z"/>',
    build: (base, top, side) => `
      <rect x="60" y="14" width="180" height="34" fill="${side}"/>
      ${crimpLines(68, 16, 46, 10, 16)}
      <path d="M75,55 C58,100 58,200 75,245 L225,245 C242,200 242,100 225,55 Z" fill="${base}"/>
      <path d="M75,55 C58,100 58,200 75,245 L225,245 C242,200 242,100 225,55 Z" fill="url(#gloss)"/>
      <rect x="60" y="246" width="180" height="34" fill="${side}"/>
      ${crimpLines(68, 248, 278, 10, 16)}`
  },
  zipperpouch: {
    viewBox: '0 0 300 340',
    zone: { x: 90, y: 150, w: 120, h: 110 },
    windowZone: { x: 105, y: 126, w: 90, h: 22, rx: 8 },
    shadowY: 0.882,
    baseClip: '<rect x="70" y="90" width="160" height="210" rx="20"/>',
    build: (base, top, side) => `
      <polygon points="70,90 70,58 96,90" fill="${side}"/>
      <polygon points="230,90 230,58 204,90" fill="${side}"/>
      <rect x="70" y="90" width="160" height="210" rx="20" fill="${base}"/>
      <rect x="70" y="90" width="160" height="210" rx="20" fill="url(#gloss)"/>
      <rect x="80" y="108" width="140" height="14" rx="6" fill="${top}"/>
      <line x1="80" y1="115" x2="220" y2="115" stroke="#000" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="4,3"/>
      <rect x="70" y="272" width="160" height="28" rx="14" fill="${side}"/>
      <rect x="70" y="272" width="160" height="28" rx="14" fill="url(#gloss)"/>`
  },
  gabletop: {
    viewBox: '0 0 220 320',
    zone: { x: 65, y: 170, w: 90, h: 105 },
    baseClip: '<rect x="55" y="130" width="110" height="170"/>',
    build: (base, top, side) => `
      <polygon points="55,130 110,95 165,130" fill="${top}"/>
      <rect x="98" y="87" width="24" height="10" rx="3" fill="${side}"/>
      <line x1="55" y1="130" x2="110" y2="95" stroke="#000" stroke-opacity="0.12" stroke-width="1.5"/>
      <line x1="165" y1="130" x2="110" y2="95" stroke="#000" stroke-opacity="0.12" stroke-width="1.5"/>
      <rect x="55" y="130" width="110" height="170" fill="${base}"/>
      <rect x="55" y="130" width="110" height="170" fill="url(#gloss)"/>
      <line x1="55" y1="160" x2="55" y2="290" stroke="#000" stroke-opacity="0.08" stroke-width="2"/>
      <line x1="165" y1="160" x2="165" y2="290" stroke="#000" stroke-opacity="0.08" stroke-width="2"/>
      <rect x="55" y="288" width="110" height="12" fill="${side}" opacity="0.6"/>`
  },
  handlebag: {
    viewBox: '0 0 260 300',
    zone: { x: 60, y: 120, w: 140, h: 120 },
    shadowY: 0.86,
    baseClip: '<rect x="40" y="70" width="160" height="188"/>',
    build: (base, top, side) => `
      <rect x="40" y="45" width="190" height="25" rx="4" fill="${top}"/>
      <rect x="200" y="70" width="30" height="188" fill="${side}"/>
      <rect x="40" y="70" width="160" height="188" fill="${base}"/>
      <rect x="40" y="70" width="160" height="188" fill="url(#gloss)"/>
      <ellipse cx="120" cy="57" rx="38" ry="10" fill="#000" opacity="0.32"/>
      <line x1="40" y1="94" x2="230" y2="94" stroke="#000" stroke-opacity="0.08" stroke-width="2"/>`
  },
  sachet: {
    viewBox: '0 0 160 300',
    zone: { x: 35, y: 150, w: 90, h: 80 },
    windowZone: { x: 48, y: 66, w: 64, h: 48, rx: 8 },
    baseClip: '<path d="M35,44 C22,90 22,210 35,256 L125,256 C138,210 138,90 125,44 Z"/>',
    build: (base, top, side) => `
      <rect x="20" y="18" width="120" height="26" fill="${side}"/>
      ${crimpLines(28, 20, 42, 7, 15)}
      <path d="M35,44 C22,90 22,210 35,256 L125,256 C138,210 138,90 125,44 Z" fill="${base}"/>
      <path d="M35,44 C22,90 22,210 35,256 L125,256 C138,210 138,90 125,44 Z" fill="url(#gloss)"/>
      <rect x="20" y="254" width="120" height="26" fill="${side}"/>
      ${crimpLines(28, 256, 278, 7, 15)}
      <line x1="24" y1="50" x2="42" y2="66" stroke="#333" stroke-width="1.2" stroke-dasharray="3,3"/>`
  },
  flatpillow: {
    viewBox: '0 0 260 260',
    zone: { x: 75, y: 95, w: 110, h: 110 },
    windowZone: { x: 80, y: 42, w: 100, h: 60, rx: 20 },
    shadowY: 0.885,
    baseClip: '<rect x="30" y="30" width="200" height="200" rx="30"/>',
    build: (base, top, side) => `
      <rect x="30" y="30" width="200" height="200" rx="30" fill="${base}"/>
      <rect x="30" y="30" width="200" height="200" rx="30" fill="url(#gloss)"/>
      <line x1="45" y1="130" x2="215" y2="130" stroke="#000" stroke-opacity="0.06" stroke-width="2"/>
      <path d="M30,60 C45,50 55,50 60,30" fill="none" stroke="${side}" stroke-width="3" opacity="0.4"/>
      <path d="M230,60 C215,50 205,50 200,30" fill="none" stroke="${side}" stroke-width="3" opacity="0.4"/>`
  }
};

/* ---------------- Color mathematics ---------------- */
export function hexToHSL(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function HSLToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const lum = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lum, 1 - lum);
  const f = (n: number) => lum - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
  return '#' + toHex(f(0)) + toHex(f(8)) + toHex(f(4));
}

export function shadeColor(hex: string, percent: number): string {
  const [h, s, l] = hexToHSL(hex);
  const newL = Math.max(0, Math.min(100, l + percent));
  return HSLToHex(h, s, newL);
}

export function generatePalette(seed: string, scheme: 'analog' | 'complement' | 'mono'): string[] {
  const [h, s, l] = hexToHSL(seed);
  if (scheme === 'analog') {
    return [
      HSLToHex((h - 30 + 360) % 360, s, Math.max(15, l - 25)),
      HSLToHex((h - 15 + 360) % 360, s, Math.max(20, l - 10)),
      seed,
      HSLToHex((h + 15) % 360, s, Math.min(85, l + 15)),
      HSLToHex((h + 30) % 360, Math.round(s * 0.6), Math.min(92, l + 30))
    ];
  }
  if (scheme === 'complement') {
    return [
      HSLToHex(h, s, Math.max(15, l - 20)),
      seed,
      HSLToHex((h + 180) % 360, s, l),
      HSLToHex((h + 180) % 360, s, Math.min(85, l + 18)),
      HSLToHex(h, Math.round(s * 0.4), Math.min(92, l + 35))
    ];
  }
  // Monochromatic
  return [
    HSLToHex(h, s, Math.max(10, l - 35)),
    HSLToHex(h, s, Math.max(20, l - 18)),
    seed,
    HSLToHex(h, Math.round(s * 0.7), Math.min(85, l + 18)),
    HSLToHex(h, Math.round(s * 0.4), Math.min(94, l + 35))
  ];
}
