import { PhotoShootConcept, StudioLight } from '../types';

export interface SurfacePreset {
  key: string;
  name: string;
  category: 'Stone' | 'Wood' | 'Textile' | 'Studio Synthetic';
  color: string;
  texturePattern: string;
  description: string;
}

export const SURFACE_PRESETS: SurfacePreset[] = [
  {
    key: 'travertine',
    name: 'Travertine Natural Stone',
    category: 'Stone',
    color: '#e2d7c5',
    texturePattern: 'radial-gradient(circle, #f0e6d6 10%, #d8caa4 90%)',
    description: 'Pori batu alami travertine, mewah untuk produk skincare, kosmetik, dan parfum.'
  },
  {
    key: 'raw_concrete',
    name: 'Raw Concrete Slate',
    category: 'Stone',
    color: '#94a3b8',
    texturePattern: 'radial-gradient(circle, #cbd5e1 15%, #64748b 85%)',
    description: 'Tekstur semen ekspos industrial modern, cocok untuk kemasan kopi, gadget, & grooming.'
  },
  {
    key: 'white_acrylic',
    name: 'Reflective White Acrylic',
    category: 'Studio Synthetic',
    color: '#ffffff',
    texturePattern: 'linear-gradient(135deg, #ffffff 40%, #f1f5f9 100%)',
    description: 'Permukaan putih mengkilap dengan pantulan halus untuk katalog e-commerce resmi.'
  },
  {
    key: 'dark_slate',
    name: 'Matte Obsidian Slate',
    category: 'Stone',
    color: '#1e293b',
    texturePattern: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    description: 'Batu slate gelap berkarakter moody, dramatis untuk madu, wine, jam tangan, & kopi specialty.'
  },
  {
    key: 'rustic_wood',
    name: 'Warm Rustic Teak Wood',
    category: 'Wood',
    color: '#854d0e',
    texturePattern: 'linear-gradient(90deg, #78350f 0%, #92400e 50%, #713f12 100%)',
    description: 'Serat kayu jati hangat alami, ideal untuk produk herbal alami, madu hutan, & camilan organik.'
  },
  {
    key: 'natural_linen',
    name: 'Unbleached Organic Linen',
    category: 'Textile',
    color: '#e7e0d3',
    texturePattern: 'radial-gradient(circle, #f5f0ea 20%, #dcd3c3 80%)',
    description: 'Kain linen berkerut lembut, memberikan kesan santai, estetik, dan rumahan.'
  },
  {
    key: 'terrazzo',
    name: 'Italian Terrazzo Tiles',
    category: 'Stone',
    color: '#f8fafc',
    texturePattern: 'radial-gradient(#e2e8f0 15%, transparent 16%), radial-gradient(#cbd5e1 15%, transparent 16%)',
    description: 'Batu teraso kontemporer warna-warni halus, sangat diminati untuk konten Instagram kekinian.'
  }
];

export const PROPS_CATEGORIES = [
  {
    category: 'Organic & Botanicals',
    items: ['Daun Eukaliptus Kering', 'Bunga Chamomile', 'Ranting Pinus', 'Biji Kopi Asli', 'Potongan Sarang Lebah (Honeycomb)', 'Irisan Lemon Kering', 'Batang Kayu Manis', 'Cabai & Rempah Kering']
  },
  {
    category: 'Studio Elements & Geometry',
    items: ['Arch Pedestal Geometris', 'Silinder Kayu Bertingkat', 'Balok Akrilik Bening (Prism)', 'Kaca Cermin Refleksi', 'Piring Keramik Kerajinan', 'Sendok Kayu Estetik', 'Gelas Sloki Vintage']
  },
  {
    category: 'Textures & Splashes',
    items: ['Water Droplets Sprayer (Embun)', 'Tetesan Madu / Cairan Kental', 'Percikan Air (Splash Action)', 'Bubuk Serbuk Tabur (Powder Smoke)', 'Cahaya Tirai Jendela (Shadow Gobo)', 'Asap Dupa Halus (Cinematic Haze)']
  },
  {
    category: 'Human Touch & Lifestyle',
    items: ['Tangan Model Menuangkan Produk', 'Tangan Model Memegang Kemasan', 'Pakaian Linen Earth-tone', 'Meja Sarapan Minimalis', 'Tote Bag Kanvas']
  }
];

export const LIGHTING_PRESET_TEMPLATES: { name: string; description: string; lights: StudioLight[] }[] = [
  {
    name: 'Commercial 3-Point Studio (Soft & Clean)',
    description: 'Standar emas komersial: Key light softbox di kiri 45°, fill light halus di kanan, dan rim light di belakang untuk memisahkan produk dari background.',
    lights: [
      { id: 'light-1', name: 'Key Light (Octabox 90cm)', type: 'key', x: 28, y: 35, angle: 135, power: 85, kelvin: 5500, modifier: 'Softbox Octa', active: true },
      { id: 'light-2', name: 'Fill Light (Diffused Box)', type: 'fill', x: 72, y: 38, angle: 225, power: 45, kelvin: 5500, modifier: 'Scrim Diffuser', active: true },
      { id: 'light-3', name: 'Rim / Hair Light', type: 'rim', x: 80, y: 78, angle: 315, power: 65, kelvin: 5600, modifier: 'Stripbox', active: true }
    ]
  },
  {
    name: 'Moody High-Contrast & Rim Glow (Luxury)',
    description: 'Pencahayaan dramatis gelap dengan rim light kuat di kedua sisi untuk menonjolkan siluet botol kaca atau jar, serta backlight halus.',
    lights: [
      { id: 'light-1', name: 'Key Rim Left (Stripbox)', type: 'rim', x: 18, y: 65, angle: 45, power: 90, kelvin: 4500, modifier: 'Stripbox', active: true },
      { id: 'light-2', name: 'Accent Rim Right (Stripbox)', type: 'rim', x: 82, y: 65, angle: 315, power: 80, kelvin: 4500, modifier: 'Stripbox', active: true },
      { id: 'light-3', name: 'Soft Gradient Backlight', type: 'back', x: 50, y: 88, angle: 180, power: 35, kelvin: 3200, modifier: 'Hard Reflector', active: true }
    ]
  },
  {
    name: 'Flat Lay Top-Down (Bright & Even)',
    description: 'Pencahayaan merata bebas bayangan kasar untuk foto flat lay 90° dengan dua softbox besar di sisi kiri dan kanan.',
    lights: [
      { id: 'light-1', name: 'Main Overhead Softbox', type: 'key', x: 30, y: 25, angle: 120, power: 80, kelvin: 5500, modifier: 'Softbox Octa', active: true },
      { id: 'light-2', name: 'Secondary Balancing Box', type: 'fill', x: 70, y: 25, angle: 240, power: 75, kelvin: 5500, modifier: 'Softbox Octa', active: true }
    ]
  },
  {
    name: 'Golden Hour Sunbeam & Window Shadow',
    description: 'Nuansa cahaya alami sore hari hangat dari satu arah keras dengan pola bayangan jendela (*gobo effect*).',
    lights: [
      { id: 'light-1', name: 'Warm Sun Strobe (Gobo)', type: 'key', x: 20, y: 20, angle: 135, power: 95, kelvin: 3800, modifier: 'Hard Reflector', active: true },
      { id: 'light-2', name: 'White Foamcore Reflector', type: 'bounce', x: 80, y: 70, angle: 315, power: 30, kelvin: 4500, modifier: 'White Foamcore', active: true }
    ]
  }
];

export const INITIAL_SHOOT_CONCEPTS: PhotoShootConcept[] = [
  {
    id: 'shoot-dawana-01',
    briefId: 'brief-01',
    title: 'Dawana Herbal Honey — Commercial & Instagram Launch',
    clientName: 'Dawana Herbal Indonesia',
    brandName: 'Dawana Honey',
    campaignType: 'Hybrid Commercial & Social',
    themeMood: 'Earthy Warm & Organic Nature',
    surfaceKey: 'rustic_wood',
    customSurfaceName: 'Rustic Teak & Stone Slab',
    selectedProps: ['Potongan Sarang Lebah (Honeycomb)', 'Daun Eukaliptus Kering', 'Water Droplets Sprayer (Embun)', 'Tetesan Madu / Cairan Kental', 'Sendok Kayu Estetik'],
    palette: ['#F59E0B', '#78350F', '#FEF3C7', '#1E293B', '#10B981'],
    cameraSettings: {
      lens: '100mm f/2.8 Macro Lens',
      shutter: '1/160s',
      aperture: 'f/5.6',
      iso: 'ISO 100'
    },
    lights: [
      { id: 'l1', name: 'Main Softbox Octa (Key)', type: 'key', x: 30, y: 30, angle: 135, power: 85, kelvin: 5200, modifier: 'Softbox Octa', active: true },
      { id: 'l2', name: 'Fill Diffuser Screen (Right)', type: 'fill', x: 75, y: 35, angle: 225, power: 40, kelvin: 5200, modifier: 'Scrim Diffuser', active: true },
      { id: 'l3', name: 'Honey Glow Backlight (Rim)', type: 'rim', x: 70, y: 80, angle: 315, power: 75, kelvin: 3800, modifier: 'Stripbox', active: true }
    ],
    shots: [
      {
        id: 's1',
        title: 'Hero Packshot Jar Kemasan Tunggal',
        format: '4:5',
        angle: 'Hero 45°',
        platform: 'Instagram Feed',
        propNotes: 'Jar madu berada di atas tatakan kayu jati, dengan sendok madu di samping meneteskan madu segar.',
        lightingNotes: 'Backlight rim menembus jar kaca agar warna kuning madu bersinar keemasan.',
        status: 'Approved'
      },
      {
        id: 's2',
        title: 'Flat Lay Bahan Alami & Honeycomb',
        format: '1:1',
        angle: 'Flat Lay 90°',
        platform: 'Instagram Feed',
        propNotes: 'Potongan sarang lebah asli, bunga liar kering, dan tutup jar dengan segel foil emas.',
        lightingNotes: 'Cahaya merata seimbang kiri-kanan tanpa bayangan gelap tajam.',
        status: 'Tested'
      },
      {
        id: 's3',
        title: 'Reels Video: Slow-Motion Pouring Action',
        format: '9:16',
        angle: 'Hero 45°',
        platform: 'Instagram Reels / TikTok',
        propNotes: 'Tangan model menuangkan madu kental dari kayu pengaduk madu ke bibir jar kemasan.',
        lightingNotes: 'High-speed continuous LED 5600K 120fps flicker-free.',
        status: 'Planned'
      },
      {
        id: 's4',
        title: 'Macro Label & Gold Foil Texture',
        format: '1:1',
        angle: 'Macro Detail',
        platform: 'E-Commerce Catalog',
        propNotes: 'Fokus ketajaman ekstrem pada logo Dawana bertekstur emboss foil emas di kertas textured.',
        lightingNotes: 'Specular highlight lembut pada kontur foil.',
        status: 'Completed'
      },
      {
        id: 's5',
        title: 'Website Header Lifestyle Banner',
        format: '16:9',
        angle: 'Eye Level 0°',
        platform: 'Website Hero Banner',
        propNotes: 'Suasana sarapan pagi, roti panggang di piring keramik, toples madu Dawana, cahaya pagi masuk jendela.',
        lightingNotes: 'Gobo shadow tirai jendela samping dengan warna hangat 4200K.',
        status: 'Planned'
      }
    ],
    colorGradingNotes: 'Tone hangat bernuansa madu alami (warm golden undertones), kontras sedang, blacks lifted sedikit untuk feel organik dan editorial.',
    callSheetDate: '2026-11-12',
    callSheetLocation: 'obeecreatives Studio A (Daylight & Strobe Room)',
    photographerName: 'Lalu Mahendra (obeecreatives)',
    stylistName: 'Adissa Rifdah Aulia',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'shoot-keripik-02',
    briefId: 'brief-02',
    title: 'Keripik Inovasi CRM — Pop Color & Crunch Action',
    clientName: 'Keripik Inovasi Nusantara',
    brandName: 'Keripik Inovasi',
    campaignType: 'Social Media Feeds',
    themeMood: 'Vibrant Pop Commercial Crunch',
    surfaceKey: 'terrazzo',
    customSurfaceName: 'Vibrant Matte Surface & Terrazzo',
    selectedProps: ['Percikan Air (Splash Action)', 'Bubuk Serbuk Tabur (Powder Smoke)', 'Cabai & Rempah Kering', 'Balok Akrilik Bening (Prism)'],
    palette: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#1E293B'],
    cameraSettings: {
      lens: '50mm f/1.8 Prime Lens',
      shutter: '1/250s High Speed',
      aperture: 'f/8.0 Sharp',
      iso: 'ISO 100'
    },
    lights: [
      { id: 'l1', name: 'Main Key Light Strobe', type: 'key', x: 25, y: 35, angle: 120, power: 90, kelvin: 5600, modifier: 'Beauty Dish', active: true },
      { id: 'l2', name: 'Fill Card Right', type: 'fill', x: 75, y: 35, angle: 240, power: 50, kelvin: 5600, modifier: 'White Foamcore', active: true },
      { id: 'l3', name: 'Background Rim Light', type: 'back', x: 50, y: 85, angle: 180, power: 70, kelvin: 5600, modifier: 'Hard Reflector', active: true }
    ],
    shots: [
      {
        id: 's201',
        title: 'Kemasan Standpouch & Keripik Terbang (Levitation)',
        format: '4:5',
        angle: 'Dynamic Splash/Action',
        platform: 'Instagram Feed',
        propNotes: 'Pouch kemasan di tengah dengan keripik melayang di sekelilingnya dengan butiran bumbu cabai.',
        lightingNotes: 'High-speed flash sync untuk membekukan gerakan keripik melayang.',
        status: 'Planned'
      },
      {
        id: 's202',
        title: 'Reels: Sound of Crunch Unboxing',
        format: '9:16',
        angle: 'Hero 45°',
        platform: 'Instagram Reels / TikTok',
        propNotes: 'Buka zipper pouch, kamera mendekat, suara kriuk crispy yang renyah.',
        lightingNotes: 'Lampu LED continuous terang tanpa kedip.',
        status: 'Planned'
      }
    ],
    colorGradingNotes: 'Warna berani, saturasi tinggi pada warna merah dan kuning, kontras tajam untuk menarik perhatian di timeline medsos.',
    callSheetDate: '2026-11-18',
    callSheetLocation: 'obeecreatives Studio B (Color Stage)',
    photographerName: 'Aldrien Andriansyah',
    stylistName: 'Febrina Putri K',
    updatedAt: new Date().toISOString()
  }
];
