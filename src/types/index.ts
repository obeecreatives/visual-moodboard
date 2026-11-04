export type Role = 'developer' | 'bendahara' | 'admin' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  email: string;
  division: string;
  avatarText: string;
}

export type BriefStatus = 
  | 'draft'
  | 'review_internal'
  | 'waiting_client'
  | 'revision'
  | 'approved';

export interface PersonalityScores {
  ekonomisMewah: number;     // 1: Ekonomis, 5: Mewah
  feminimMaskulin: number;   // 1: Feminim, 5: Maskulin
  tradisionalModern: number; // 1: Tradisional, 5: Modern
  simpleRumit: number;       // 1: Simple, 5: Rumit
  monoFullcolor: number;     // 1: Monochrome, 5: Full Color
  anakDewasa: number;        // 1: Anak, 5: Dewasa
  funSerius: number;         // 1: Fun, 5: Serius
}

export type PackagingShapeKey =
  | 'box'
  | 'pouch'
  | 'bottle'
  | 'jar'
  | 'tube'
  | 'paperbag'
  | 'kraftbag'
  | 'giftbox'
  | 'mailerbox'
  | 'canister'
  | 'standpouch'
  | 'flowbag'
  | 'zipperpouch'
  | 'gabletop'
  | 'handlebag'
  | 'sachet'
  | 'flatpillow';

export type MaterialStyle = 'glossy' | 'matte' | 'kraft';

export type TextureType = 'none' | 'kraft-grain' | 'linen' | 'canvas' | 'dots';

export interface ExtraImageLayer {
  id: string | number;
  src: string;
  x: number;      // 0 - 100 percentage
  y: number;      // 0 - 100 percentage
  scale: number;
  rot: number;
}

export interface ExtraTextLayer {
  id: string | number;
  text: string;
  font: string;
  size: number;
  color: string;
  x: number;      // 0 - 100 percentage
  y: number;      // 0 - 100 percentage
  rot: number;
}

export interface MockupConfig {
  shape: PackagingShapeKey;
  color: string;
  scene: 'studio-light' | 'studio-dark' | 'kraft';
  logo: string | null;
  logoScale: number;
  logoX: number;
  logoY: number;
  logoRot: number;
  prodName: string;
  prodTag: string;
  textFont: string;
  textColor: string;
  textSize: number;
  textY: number;
  texture: TextureType;
  textureOpacity: number;
  materialStyle: MaterialStyle;
  windowEnabled: boolean;
  extraImages: ExtraImageLayer[];
  extraTexts: ExtraTextLayer[];
}

export interface SceneItem {
  id: number;
  shape: PackagingShapeKey;
  color: string;
}

export interface SceneConfig {
  items: SceneItem[];
  showLogo: boolean;
  scene: 'studio-light' | 'studio-dark' | 'kraft';
}

export interface TargetMarket {
  economy: 'Menengah Bawah' | 'Menengah Atas' | 'Premium / Luxury';
  age: 'Anak-anak' | 'Remaja' | 'Dewasa' | 'Semua Usia';
}

export interface VisualPhotoGuide {
  character: 'Low Key' | 'High Key' | 'Normal' | 'Moody / Dramatic' | 'Clean Minimalist';
  ratio: 'Square 1:1' | 'Landscape 16:9' | 'Potrait 4:3' | 'Story / Reels 9:16';
}

export interface BriefProject {
  id: string;
  briefNumber: string;         // e.g. "OBEE-2026-001"
  clientName: string;          // e.g. "Dawana Herbal Indonesia"
  brandName: string;           // e.g. "Dawana Honey"
  packageName: string;         // e.g. "Full Branding & Foto Produk"
  category: string;            // e.g. "Food & Beverages"
  status: BriefStatus;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  personality: PersonalityScores;
  lookfeel: string[];
  jenisLogo: string;
  bentukIcon: string;
  targetMarket: TargetMarket;
  visualPhoto: VisualPhotoGuide;
  captionStyle: string;
  notes: string;
  palette: string[];
  fontDisplay: string;
  fontBody: string;
  keywords: string[];
  refImages: string[];
  mockupConfig: MockupConfig;
  sceneConfig: SceneConfig;
  approvalNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  slidesUrl?: string;
  pdfUrl?: string;
}

export interface GasConfig {
  webAppUrl: string;
  spreadsheetId: string;
  lastSyncTime: string | null;
  isConnected: boolean;
  autoSync: boolean;
  latencyMs?: number;
}

export type ActiveTab = 
  | 'pipeline'
  | 'brief'
  | 'mood'
  | 'mockup'
  | 'scene'
  | 'photo-studio'
  | 'client-review';

export type LightType = 'key' | 'fill' | 'rim' | 'back' | 'hair' | 'bounce';
export type LightModifier = 'Softbox Octa' | 'Beauty Dish' | 'Hard Reflector' | 'Snoot' | 'Scrim Diffuser' | 'Stripbox' | 'White Foamcore';

export interface StudioLight {
  id: string;
  name: string;
  type: LightType;
  x: number; // 0 - 100 percentage inside studio floor
  y: number; // 0 - 100 percentage inside studio floor
  angle: number; // 0 - 360 degrees
  power: number; // 1 - 100%
  kelvin: number; // 3200K - 6500K
  modifier: LightModifier;
  active: boolean;
}

export type PhotoAspect = '1:1' | '4:5' | '9:16' | '16:9';
export type PhotoAngle = 'Hero 45°' | 'Flat Lay 90°' | 'Eye Level 0°' | 'Macro Detail' | 'In-Hand Lifestyle' | 'Dynamic Splash/Action';
export type ShotStatus = 'Planned' | 'Tested' | 'Approved' | 'Completed';

export interface PhotoShotItem {
  id: string;
  title: string;
  format: PhotoAspect;
  angle: PhotoAngle;
  platform: 'Instagram Feed' | 'Instagram Reels / TikTok' | 'E-Commerce Catalog' | 'Website Hero Banner' | 'Print Ad / Billboard';
  propNotes: string;
  lightingNotes: string;
  status: ShotStatus;
  refImage?: string;
}

export interface PhotoShootConcept {
  id: string;
  briefId?: string; // Optional link to BriefProject
  title: string;
  clientName: string;
  brandName: string;
  campaignType: 'Hybrid Commercial & Social' | 'Commercial Catalog' | 'Social Media Feeds' | 'Reels / Video Campaign';
  themeMood: string; // e.g., 'Earthy Warm & Organic', 'Clean Minimalist Clinical', 'Moody High-End Dark', 'Sunlit Golden Hour'
  surfaceKey: string;
  customSurfaceName?: string;
  selectedProps: string[];
  palette: string[];
  cameraSettings: {
    lens: string; // e.g. 50mm f/1.8, 85mm f/1.4, 100mm Macro
    shutter: string; // e.g. 1/160s, 1/250s
    aperture: string; // e.g. f/2.8, f/5.6, f/8
    iso: string; // e.g. ISO 100
  };
  lights: StudioLight[];
  shots: PhotoShotItem[];
  colorGradingNotes: string;
  callSheetDate: string;
  callSheetLocation: string;
  photographerName: string;
  stylistName: string;
  updatedAt: string;
}
