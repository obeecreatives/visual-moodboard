import { BriefProject, UserProfile } from '../types';

export interface DesignPreset {
  label: string;
  palette: string[];
  fontDisplay: string;
  fontBody: string;
  keywords: string[];
}

export const PRESETS: Record<string, DesignPreset> = {

  natural: {
    label: 'Natural & Organik',
    palette: ['#2F3B25', '#6B7A4A', '#8C5E3C', '#C9B896', '#EDE6D6'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['organik', 'earthy', 'kraft paper', 'tenang', 'hand-drawn', 'sustainable']
  },
  luxury: {
    label: 'Minimalis Mewah (Gold & Dark)',
    palette: ['#141414', '#5C564C', '#8A8378', '#C9A24B', '#F5F1E8'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['elegan', 'premium', 'emas', 'clean', 'eksklusif', 'sophisticated']
  },
  bold: {
    label: 'Berani obeecreatives',
    palette: ['#0d0d0d', '#e31e2b', '#ffffff', '#f0f0ee', '#6c6c72'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'JetBrains Mono',
    keywords: ['berani', 'kontras', 'modern', 'editorial', 'clean', 'impactful']
  },
  rustic: {
    label: 'Rustic Craft & Artisan',
    palette: ['#3E2A1E', '#7A4B32', '#B98554', '#E7C9A3', '#F1E4CE'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'JetBrains Mono',
    keywords: ['artisan', 'tradisional', 'hangat', 'kraft', 'otentik', 'heritage']
  },
  modern: {
    label: 'Modern Tech & Clean Blue',
    palette: ['#0D1B2A', '#1E3A8A', '#3B82F6', '#93C5FD', '#F8FAFC'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['minimalis', 'futuristik', 'presisi', 'tech', 'clean', 'percaya diri']
  },
  vibrant: {
    label: 'Vibrant & Playful F&B',
    palette: ['#FF5E36', '#FFAA00', '#2EC4B6', '#011627', '#FDFFFC'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['playful', 'fresh', 'eye-catching', 'youthful', 'fun', 'tasty']
  }
};

export const PERSONALITY_PAIRS = [
  { key: 'ekonomisMewah', left: 'Ekonomis / Terjangkau', right: 'Mewah / Premium' },
  { key: 'feminimMaskulin', left: 'Feminim / Lembut', right: 'Maskulin / Tegas' },
  { key: 'tradisionalModern', left: 'Tradisional / Etnik', right: 'Modern / Kontemporer' },
  { key: 'simpleRumit', left: 'Simple / Minimalis', right: 'Detail / Kompleks' },
  { key: 'monoFullcolor', left: 'Monokrom / Tenang', right: 'Full Color / Semarak' },
  { key: 'anakDewasa', left: 'Anak-Anak / Remaja', right: 'Dewasa / Mapan' },
  { key: 'funSerius', left: 'Fun / Santai', right: 'Serius / Formal' }
] as const;

export const LOOKFEEL_TAGS = [
  'Dynamic',
  'Fun',
  'Playful',
  'Modern',
  'Timeless',
  'Creative',
  'Techy',
  'Fresh',
  'Formal',
  'Hipster',
  'Traditional',
  'Monochrome',
  'Bold',
  'Elegant',
  'Minimalist',
  'Artisan'
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_lalu',
    name: 'Lalu Mahendra',
    role: 'developer',
    email: 'obeecreatives@gmail.com',
    division: 'Lead Creative & Systems Dev',
    avatarText: 'LM'
  },
  {
    id: 'usr_aldrien',
    name: 'Aldrien Andriansyah',
    role: 'bendahara',
    email: 'finance@obeecreatives.com',
    division: 'Creative Director / Keuangan',
    avatarText: 'AA'
  },
  {
    id: 'usr_adissa',
    name: 'Adissa Rifdah Aulia',
    role: 'admin',
    email: 'adissa@obeecreatives.com',
    division: 'Senior Visual & Photo Lead',
    avatarText: 'AR'
  },
  {
    id: 'usr_febrina',
    name: 'Febrina Putri K',
    role: 'admin',
    email: 'febrina@obeecreatives.com',
    division: 'Branding & Account Specialist',
    avatarText: 'FP'
  },
  {
    id: 'usr_klien_dawana',
    name: 'Bpk. Hendro Prayogo',
    role: 'client',
    email: 'owner@dawanahoney.id',
    division: 'Klien Brand: Dawana Honey',
    avatarText: 'HP'
  }
];

export const INITIAL_BRIEFS: BriefProject[] = [
  {
    id: 'proj_dawana_01',
    briefNumber: 'OBEE-2026-001',
    clientName: 'PT Dawana Herbal Sentosa',
    brandName: 'Dawana Honey',
    packageName: 'Full Branding & Foto Produk',
    category: 'Food & Beverages (Herbal)',
    status: 'approved',
    creatorName: 'Adissa Rifdah Aulia',
    createdAt: '2026-10-12T08:30:00Z',
    updatedAt: '2026-11-01T14:15:00Z',
    personality: {
      ekonomisMewah: 4,
      feminimMaskulin: 3,
      tradisionalModern: 4,
      simpleRumit: 2,
      monoFullcolor: 3,
      anakDewasa: 4,
      funSerius: 3
    },
    lookfeel: ['Timeless', 'Fresh', 'Organic', 'Modern', 'Elegant'],
    jenisLogo: 'Kombinasi Logogram+Logotype',
    bentukIcon: 'Organik (Tetes Madu & Sarang Lebah Minimalis)',
    targetMarket: {
      economy: 'Menengah Atas',
      age: 'Dewasa'
    },
    visualPhoto: {
      character: 'Normal',
      ratio: 'Square 1:1'
    },
    captionStyle: 'Hangat, edukatif manfaat kesehatan, berkelas tanpa kaku.',
    notes: 'Klien menginginkan visual botol/jar kaca madu yang tampak jernih, keemasan saat terkena cahaya studio, dan label tahan air bernuansa earth-tone.',
    palette: ['#2F3B25', '#6B7A4A', '#8C5E3C', '#C9B896', '#EDE6D6'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['raw honey', 'artisan', 'earthy', 'pure', 'gold reflection'],
    refImages: [],
    mockupConfig: {
      shape: 'jar',
      color: '#C9B896',
      scene: 'studio-light',
      logo: null,
      logoScale: 0.85,
      logoX: 0,
      logoY: -8,
      logoRot: 0,
      prodName: 'DAWANA',
      prodTag: 'RAW FOREST HONEY 350G',
      textFont: 'Space Grotesk',
      textColor: '#18181a',
      textSize: 15,
      textY: 34,
      texture: 'kraft-grain',
      textureOpacity: 0.25,
      materialStyle: 'glossy',
      windowEnabled: false,
      extraImages: [],
      extraTexts: []
    },
    sceneConfig: {
      items: [
        { id: 1, shape: 'jar', color: '#2F3B25' },
        { id: 2, shape: 'box', color: '#C9B896' },
        { id: 3, shape: 'paperbag', color: '#EDE6D6' }
      ],
      showLogo: true,
      scene: 'studio-light'
    },
    approvalNotes: 'Guideline visual, palet warna, dan mockup jar 350g disetujui klien tanpa catatan revisi mayor.',
    verifiedBy: 'Aldrien Andriansyah (Creative Director)',
    verifiedAt: '2026-11-01T15:00:00Z',
    slidesUrl: 'https://docs.google.com/presentation/d/19xwZc-KdbncqukEsPuP_0cXU0tgfAxIGAA7MAEU9qko/edit'
  },
  {
    id: 'proj_inovasi_02',
    briefNumber: 'OBEE-2026-002',
    clientName: 'CV Inovasi Snack Nusantara',
    brandName: 'Keripik Inovasi',
    packageName: 'Desain Kemasan & Content Feeds',
    category: 'Snack & Confectionery',
    status: 'waiting_client',
    creatorName: 'Febrina Putri K',
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-11-03T11:20:00Z',
    personality: {
      ekonomisMewah: 3,
      feminimMaskulin: 3,
      tradisionalModern: 5,
      simpleRumit: 2,
      monoFullcolor: 5,
      anakDewasa: 2,
      funSerius: 1
    },
    lookfeel: ['Fun', 'Playful', 'Dynamic', 'Bold', 'Fresh'],
    jenisLogo: 'Logotype Dinamis',
    bentukIcon: 'Geometris & Maskot Cabai Renyah',
    targetMarket: {
      economy: 'Menengah Atas',
      age: 'Remaja'
    },
    visualPhoto: {
      character: 'High Key',
      ratio: 'Story / Reels 9:16'
    },
    captionStyle: 'Santai, gaul, menggoda selera, banyak emoji pedas gurih.',
    notes: 'Kemasan standing zipper pouch aluminium foil matte dengan jendela produk transparan agar kerenyahan keripik terlihat langsung oleh konsumen.',
    palette: ['#FF5E36', '#FFAA00', '#2EC4B6', '#011627', '#FDFFFC'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['crispy', 'spicy', 'doypack', 'snack attack', 'modern crunch'],
    refImages: [],
    mockupConfig: {
      shape: 'zipperpouch',
      color: '#FF5E36',
      scene: 'studio-light',
      logo: null,
      logoScale: 0.9,
      logoX: 0,
      logoY: -15,
      logoRot: 0,
      prodName: 'INOVASI',
      prodTag: 'KERIPIK TEMPE CRISPY PEDAS DAUN JERUK',
      textFont: 'Space Grotesk',
      textColor: '#FDFFFC',
      textSize: 16,
      textY: 42,
      texture: 'none',
      textureOpacity: 0.35,
      materialStyle: 'matte',
      windowEnabled: true,
      extraImages: [],
      extraTexts: []
    },
    sceneConfig: {
      items: [
        { id: 1, shape: 'zipperpouch', color: '#FF5E36' },
        { id: 2, shape: 'standpouch', color: '#FFAA00' },
        { id: 3, shape: 'flowbag', color: '#2EC4B6' }
      ],
      showLogo: true,
      scene: 'studio-light'
    }
  },
  {
    id: 'proj_botanica_03',
    briefNumber: 'OBEE-2026-003',
    clientName: 'Botanica Skincare Lab',
    brandName: 'Glow Botanicals',
    packageName: 'Full Brand Identity & Packaging Lineup',
    category: 'Skincare & Beauty',
    status: 'review_internal',
    creatorName: 'Lalu Mahendra',
    createdAt: '2026-10-28T13:45:00Z',
    updatedAt: '2026-11-04T07:10:00Z',
    personality: {
      ekonomisMewah: 5,
      feminimMaskulin: 2,
      tradisionalModern: 5,
      simpleRumit: 1,
      monoFullcolor: 1,
      anakDewasa: 4,
      funSerius: 4
    },
    lookfeel: ['Timeless', 'Minimalist', 'Clean', 'Modern', 'Elegant'],
    jenisLogo: 'Logotype Clean Minimalis',
    bentukIcon: 'Inisial / Monogram Presisi',
    targetMarket: {
      economy: 'Premium / Luxury',
      age: 'Dewasa'
    },
    visualPhoto: {
      character: 'Clean Minimalist',
      ratio: 'Square 1:1'
    },
    captionStyle: 'Informatif dermatologis, menenangkan, elegan.',
    notes: 'Kombinasi botol dropper kaca matte dan tube pembersih wajah. Warna dominan off-white, emas sampanye, dan abu arang.',
    palette: ['#141414', '#5C564C', '#8A8378', '#C9A24B', '#F5F1E8'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['clean beauty', 'clinical', 'minimalism', 'glass dropper', 'calm'],
    refImages: [],
    mockupConfig: {
      shape: 'bottle',
      color: '#F5F1E8',
      scene: 'studio-dark',
      logo: null,
      logoScale: 0.75,
      logoX: 0,
      logoY: -10,
      logoRot: 0,
      prodName: 'BOTANICALS',
      prodTag: 'NIACINAMIDE 10% RADIANCE SERUM 30ML',
      textFont: 'Space Grotesk',
      textColor: '#141414',
      textSize: 13,
      textY: 36,
      texture: 'linen',
      textureOpacity: 0.2,
      materialStyle: 'matte',
      windowEnabled: false,
      extraImages: [],
      extraTexts: []
    },
    sceneConfig: {
      items: [
        { id: 1, shape: 'bottle', color: '#F5F1E8' },
        { id: 2, shape: 'tube', color: '#8A8378' },
        { id: 3, shape: 'box', color: '#141414' }
      ],
      showLogo: true,
      scene: 'studio-dark'
    }
  }
];

export const DESIGN_PRESETS = PRESETS;

