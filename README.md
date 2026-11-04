# obeecreatives — Logo & Packaging Toolkit (Visual Brief & Mockup OS)

A modern, production-grade creative web application built for **obeecreatives** (`obeecreatives.com`) — a premier creative agency specializing in photography, videography, graphic design, and social media management.

## 🚀 Key Features

- **Visual Brief Builder**: Comprehensive brief creation for brand identity, packaging dimensions, materials (Corrugated, Kraft, Duplex, Ivory, Rigid Box, Pouches, Bottles, Cans), visual styles, color palettes, and finishing specs (Foil Stamping, Emboss/Deboss, Spot UV, Matte/Gloss Lamination).
- **Interactive 3D / Live Packaging Mockup Studio**: Real-time 3D & isometric canvas previewing boxes, labels, cylinders, pouches, pouches with lighting, finishes, and dynamic logo application.
- **Client & Creative Workspace**: Role-Based Access Control (RBAC) supporting Developer/Site Engineer, Bendahara Utama, Admin, and Client/User views.
- **Headless Google Apps Script (GAS) Sync**:
  - Offline-first cache architecture via `localStorage` with instant (0.01s) loading.
  - Silent background synchronization & live pinging to standalone Google Apps Script REST Web App.
  - Linked to master Google Spreadsheet: `19xwZc-KdbncqukEsPuP_0cXU0tgfAxIGAA7MAEU9qko`.
- **Dark & Light Executive Mode**: Toggle between obeecreatives dark slate styling (`bg-slate-900`) and ultra-clean light mode (`bg-slate-50`).
- **Interactive Production Kanban & Checklist**: Track briefs from "New Idea", "Visual Briefing", "Packaging Mockup", "Client Review", "Print Prep", to "Production Ready".

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Motion
- **Icons**: Lucide React
- **Hosting & Deployment**: Vercel ready (`vercel.json`)
- **Backend / Database**: Headless Google Apps Script (GAS) Web App + Google Sheets

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

### Option 1: Via GitHub & Vercel Dashboard (Recommended)
1. Push this repository to your GitHub account (see instructions below).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Select your GitHub repository `obeecreatives-toolkit`.
5. Vercel will auto-detect the Vite framework and settings from `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your app will be live in ~30 seconds!

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🔗 Standalone Google Apps Script Integration

- **Spreadsheet ID**: `19xwZc-KdbncqukEsPuP_0cXU0tgfAxIGAA7MAEU9qko`
- **Active Web App Endpoint**:
  `https://script.google.com/macros/s/AKfycbzybLaMByw42W01XB9EbaiVx9qhMgHY7YsauRCKHlkCu-Zpfg86nANaqhixhfuTQ22B/exec`
- Configure or test endpoints directly in the app via the **Headless GAS Center** modal in the sidebar.
