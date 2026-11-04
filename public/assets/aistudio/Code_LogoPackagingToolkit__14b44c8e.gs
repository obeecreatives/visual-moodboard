/**
 * obeecreatives — Packaging & Logo Builder — Backend (Google Apps Script)
 * ------------------------------------------------------------------------
 * Fungsi:
 *   1. archiveBrief  -> menyimpan 1 baris ringkasan Brief Produk ke Google Sheet
 *   2. generatePdf   -> membangun deck Google Slides dari data Brief + Moodboard
 *                       + gambar mockup/set kemasan, lalu export sebagai PDF
 *
 * CARA PAKAI: lihat file Setup[LogoPackagingToolkit].md yang menyertai file ini.
 *
 * KONVENSI FORMULA SPREADSHEET: jika suatu saat menambahkan formula ke Sheet
 * (mis. lewat setFormula()), JANGAN pakai separator koma (,) antar argumen.
 * Gunakan separator titik koma (;) — mengikuti locale Indonesia pada Google
 * Sheets, misalnya: =SUMIFS(A:A;B:B;"kriteria") bukan =SUMIFS(A:A,B:B,"kriteria").
 * Saat ini belum ada formula yang dipakai (semua data ditulis lewat appendRow
 * sebagai nilai mentah), tapi catatan ini berlaku untuk pengembangan berikutnya.
 * ------------------------------------------------------------------------
 */

const SHEET_NAME = 'Briefs';
const PROJECT_NAME = 'Logo & Packaging Toolkit';
const PROJECT_SLUG = 'LogoPackagingToolkit';
const FOOTER_TEXT = PROJECT_NAME + ' - All Rights Reserved . obeecreatives . Developed by Lalu Mahendra';
const PDF_FOOTER_TEXT = 'obeecreatives - All Rights Reserved';

/* ============================== ROUTER ============================== */

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    let result;
    if (action === 'archiveBrief') {
      result = archiveBrief_(body.data);
    } else if (action === 'generatePdf') {
      result = generateGuidelinePdf_(body.data);
    } else {
      throw new Error('Aksi tidak dikenali: ' + action);
    }
    return jsonResponse_({ ok: true, result: result });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * doGet menyajikan UI lengkap tool (file HTML "Index[LogoPackagingToolkit]"
 * yang harus ada di project Apps Script ini — lihat Setup[LogoPackagingToolkit].md).
 * Halaman ini otomatis mendapat objek `google.script.run` dari Apps Script,
 * dipakai oleh tool untuk memanggil gasArchiveBrief_/gasGeneratePdf_ langsung
 * tanpa perlu URL Web App manual atau fetch()/CORS sama sekali.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index[LogoPackagingToolkit]')
    .setTitle(PROJECT_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================== RPC UNTUK google.script.run ==============================
 * Dipanggil langsung dari client (lihat Index[LogoPackagingToolkit].html) saat tool
 * dibuka lewat Web App URL Apps Script ini. PENTING: nama fungsi di sini SENGAJA
 * TIDAK diakhiri underscore — di Apps Script, fungsi yang diakhiri underscore
 * dianggap privat dan otomatis TIDAK bisa dipanggil lewat google.script.run.
 * Nama fungsi harus persis sama dengan yang dipanggil di client:
 * google.script.run.gasArchiveBrief(data) / .gasGeneratePdf(data)
 * ============================================================================================ */
function gasArchiveBrief(data) {
  return archiveBrief_(data);
}
function gasGeneratePdf(data) {
  return generateGuidelinePdf_(data);
}

/* ============================== ARCHIVE KE SHEET ============================== */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Nama Produk',
      'Ekonomis-Mewah', 'Feminim-Maskulin', 'Tradisional-Modern', 'Simple-Rumit',
      'Monochrome-FullColor', 'Anak-Dewasa', 'Fun-Serius',
      'Logo Look & Feel', 'Jenis Logo', 'Bentuk Icon',
      'Kelas Ekonomi', 'Usia', 'Karakter Foto', 'Rasio Gambar',
      'Gaya Caption', 'Catatan', 'Palet Warna', 'Font Utama', 'Font Alternatif'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function archiveBrief_(data) {
  const sheet = getSheet_();
  const p = data.personality || {};
  sheet.appendRow([
    new Date(),
    data.productName || '',
    p.ekonomisMewah, p.feminimMaskulin, p.tradisionalModern, p.simpleRumit,
    p.monoFullcolor, p.anakDewasa, p.funSerius,
    (data.lookfeel || []).join(', '),
    data.jenisLogo || '', data.bentukIcon || '',
    data.kelasEkonomi || '', data.usia || '',
    data.karakterFoto || '', data.rasioGambar || '',
    data.gayaCaption || '', data.catatan || '',
    (data.palette || []).join(', '),
    data.fontDisplay || '', data.fontBody || ''
  ]);
  return { row: sheet.getLastRow() };
}

/* ============================== GENERATE PDF (VIA SLIDES) ============================== */

function generateGuidelinePdf_(data) {
  const brief = data.brief || {};
  const productSlug = sanitizeFileName_(brief.productName || 'Produk').replace(/\s+/g, '');
  const deckName = PROJECT_NAME + ' Guideline - ' + (brief.productName || 'Produk') + ' - ' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

  const deck = SlidesApp.create(deckName);
  const pageW = deck.getPageWidth();
  const pageH = deck.getPageHeight();
  const ctx = { pageW: pageW, pageH: pageH };

  const slides = deck.getSlides();
  buildCoverSlide_(slides[0], data, ctx);
  addFooter_(slides[0], ctx, true);

  const briefSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  buildBriefSlide_(briefSlide, data, ctx); addFooter_(briefSlide, ctx, false);

  const moodSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  buildMoodboardSlide_(moodSlide, data, ctx); addFooter_(moodSlide, ctx, false);

  if (data.mockupImageBase64) {
    const s = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    buildImageSlide_(s, 'Mockup Kemasan', data.mockupImageBase64, ctx); addFooter_(s, ctx, false);
  }
  if (data.sceneImageBase64) {
    const s = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    buildImageSlide_(s, 'Set Kemasan', data.sceneImageBase64, ctx); addFooter_(s, ctx, false);
  }

  deck.saveAndClose();

  const fileId = deck.getId();
  const pdfBlob = DriveApp.getFileById(fileId).getAs('application/pdf');
  const base64 = Utilities.base64Encode(pdfBlob.getBytes());

  return {
    pdfBase64: base64,
    fileName: PROJECT_SLUG + '-Guideline-' + productSlug + '.pdf',
    slidesUrl: 'https://docs.google.com/presentation/d/' + fileId + '/edit'
  };
}

/** Tambahkan footer wajib "obeecreatives - All Rights Reserved" di setiap slide hasil export. */
function addFooter_(slide, ctx, onDarkBg) {
  const footer = slide.insertTextBox(PDF_FOOTER_TEXT, 30, ctx.pageH - 26, ctx.pageW - 60, 16);
  styleText_(footer, 8, onDarkBg ? 'AAAAAA' : '999999', false, 'CENTER');
}

function sanitizeFileName_(name) {
  return name.replace(/[^a-zA-Z0-9\-_. ]/g, '').trim();
}

/* ---------- slide builders ---------- */

function buildCoverSlide_(slide, data, ctx) {
  slide.getShapes().forEach(function (sh) { sh.remove(); });
  slide.getBackground().setSolidFill('0D0D0D');

  const title = slide.insertTextBox('VISUAL IDENTITY & PACKAGING GUIDELINE', 40, ctx.pageH / 2 - 60, ctx.pageW - 80, 60);
  styleText_(title, 24, 'FFFFFF', true, 'CENTER');

  const sub = slide.insertTextBox((data.brief && data.brief.productName) || 'Nama Produk', 40, ctx.pageH / 2 + 4, ctx.pageW - 80, 34);
  styleText_(sub, 16, 'FFFFFF', false, 'CENTER');

  const meta = slide.insertTextBox(
    'obeecreatives · ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMMM yyyy'),
    40, ctx.pageH / 2 + 44, ctx.pageW - 80, 24
  );
  styleText_(meta, 10, 'AAAAAA', false, 'CENTER');
}

function buildBriefSlide_(slide, data, ctx) {
  const b = data.brief || {};
  const p = b.personality || {};
  const marginX = 30;
  const contentW = ctx.pageW - marginX * 2;
  let y = 24;

  const title = slide.insertTextBox('Brief Visual Identity', marginX, y, contentW, 28);
  styleText_(title, 18, '141312', true);
  y += 34;

  const pairs = [
    ['Ekonomis', 'Mewah', p.ekonomisMewah],
    ['Feminim', 'Maskulin', p.feminimMaskulin],
    ['Tradisional', 'Modern', p.tradisionalModern],
    ['Simple', 'Rumit', p.simpleRumit],
    ['Monochrome', 'Full Color', p.monoFullcolor],
    ['Anak', 'Dewasa', p.anakDewasa],
    ['Fun', 'Serius', p.funSerius]
  ];
  pairs.forEach(function (pair) {
    const val = pair[2] || 3;
    const line = pair[0] + '   ' + '●'.repeat(val) + '○'.repeat(5 - val) + '   ' + pair[1];
    const row = slide.insertTextBox(line, marginX, y, contentW, 16);
    styleText_(row, 10, '333333');
    y += 17;
  });
  y += 8;

  const lf = slide.insertTextBox('Logo Look & Feel: ' + (b.lookfeel || []).join(', '), marginX, y, contentW, 32);
  styleText_(lf, 10, '333333');
  y += 32;

  const other = slide.insertTextBox(
    'Jenis Logo: ' + (b.jenisLogo || '-') + '\n' +
    'Bentuk Icon: ' + (b.bentukIcon || '-') + '\n' +
    'Target Pasar: ' + (b.kelasEkonomi || '-') + ', ' + (b.usia || '-') + '\n' +
    'Gaya Visual: ' + (b.karakterFoto || '-') + ', ' + (b.rasioGambar || '-') + '\n' +
    'Gaya Caption: ' + (b.gayaCaption || '-') + '\n' +
    'Catatan: ' + (b.catatan || '-'),
    marginX, y, contentW, ctx.pageH - y - 20
  );
  styleText_(other, 10, '333333');
}

function buildMoodboardSlide_(slide, data, ctx) {
  const marginX = 30;
  const title = slide.insertTextBox('Moodboard', marginX, 24, ctx.pageW - marginX * 2, 28);
  styleText_(title, 18, '141312', true);

  let x = marginX;
  const swSize = 60;
  (data.palette || []).forEach(function (hex) {
    const rect = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x, 70, swSize, swSize);
    rect.getFill().setSolidFill(String(hex).replace('#', ''));
    rect.getBorder().setTransparent();
    const label = slide.insertTextBox(hex, x, 70 + swSize + 4, swSize, 14);
    styleText_(label, 8, '333333', false, 'CENTER');
    x += swSize + 10;
  });

  const font = slide.insertTextBox('Font: ' + (data.fontDisplay || '-') + ' / ' + (data.fontBody || '-'), marginX, 160, ctx.pageW - marginX * 2, 20);
  styleText_(font, 11, '333333');

  const kw = slide.insertTextBox('Kata Kunci Mood: ' + (data.keywords || []).join(', '), marginX, 184, ctx.pageW - marginX * 2, 40);
  styleText_(kw, 11, '333333');
}

function buildImageSlide_(slide, title, base64png, ctx) {
  const marginX = 30;
  const t = slide.insertTextBox(title, marginX, 20, ctx.pageW - marginX * 2, 28);
  styleText_(t, 18, '141312', true);

  const raw = String(base64png).split(',').pop(); // buang prefix "data:image/png;base64,"
  const bytes = Utilities.base64Decode(raw);
  const blob = Utilities.newBlob(bytes, 'image/png', title + '.png');
  const img = slide.insertImage(blob);

  const maxW = ctx.pageW - marginX * 2;
  const maxH = ctx.pageH - 90;
  const ratio = Math.min(maxW / img.getWidth(), maxH / img.getHeight(), 1);
  const w = img.getWidth() * ratio, h = img.getHeight() * ratio;
  img.setWidth(w).setHeight(h);
  img.setLeft((ctx.pageW - w) / 2).setTop(70);
}

function styleText_(textBox, size, colorHex, bold, align) {
  const tr = textBox.getText();
  tr.getTextStyle().setFontSize(size).setForegroundColor(colorHex).setBold(!!bold).setFontFamily('Arial');
  if (align === 'CENTER') {
    tr.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }
}

/* ============================== FUNGSI UJI MANUAL ==============================
 * Dijalankan langsung dari editor Apps Script (bukan lewat Web App URL), berguna
 * untuk memastikan sheet "Briefs" & pembuatan Slides/PDF berfungsi SEBELUM
 * mencoba dari tool HTML. Cara pakai:
 *   1. Pilih nama fungsi (testArchiveBrief / testGeneratePdf) dari dropdown
 *      fungsi di toolbar editor Apps Script.
 *   2. Klik Run ▶. Kalau ini run pertama, Google akan minta otorisasi izin
 *      akses Sheets/Slides/Drive — klik Allow/Izinkan.
 *   3. Buka tab "Execution log" di bawah editor untuk lihat hasilnya.
 * ================================================================================ */

function testArchiveBrief() {
  const result = archiveBrief_({
    productName: 'Contoh Produk (Uji Coba)',
    personality: { ekonomisMewah: 3, feminimMaskulin: 3, tradisionalModern: 4, simpleRumit: 2, monoFullcolor: 3, anakDewasa: 4, funSerius: 2 },
    lookfeel: ['Modern', 'Fresh', 'Timeless'],
    jenisLogo: 'Kombinasi Logogram+Logotype',
    bentukIcon: 'Geometris',
    kelasEkonomi: 'Menengah Atas',
    usia: 'Dewasa',
    karakterFoto: 'Normal',
    rasioGambar: 'Square 1:1',
    gayaCaption: 'Santai, hangat',
    catatan: 'Ini baris hasil uji manual dari editor Apps Script — boleh dihapus.',
    palette: ['#2F3B25', '#6B7A4A', '#8C5E3C', '#C9B896', '#EDE6D6'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter'
  });
  Logger.log('✓ Sheet "Briefs" berhasil dibuat/ditulis. Baris baru di baris ke-' + result.row + '. Cek spreadsheet Anda.');
}

function testGeneratePdf() {
  const result = generateGuidelinePdf_({
    brief: {
      productName: 'Contoh Produk (Uji Coba)',
      personality: { ekonomisMewah: 3, feminimMaskulin: 3, tradisionalModern: 4, simpleRumit: 2, monoFullcolor: 3, anakDewasa: 4, funSerius: 2 },
      lookfeel: ['Modern', 'Fresh'],
      jenisLogo: 'Kombinasi Logogram+Logotype',
      bentukIcon: 'Geometris',
      kelasEkonomi: 'Menengah Atas',
      usia: 'Dewasa',
      karakterFoto: 'Normal',
      rasioGambar: 'Square 1:1',
      gayaCaption: 'Santai',
      catatan: 'Uji coba manual — file Slides & PDF ini boleh dihapus dari Drive.'
    },
    palette: ['#2F3B25', '#6B7A4A', '#8C5E3C', '#C9B896', '#EDE6D6'],
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
    keywords: ['organik', 'earthy'],
    mockupImageBase64: null,
    sceneImageBase64: null
  });
  Logger.log('✓ PDF berhasil dibuat: ' + result.fileName);
  Logger.log('✓ Buka versi Slides-nya di: ' + result.slidesUrl);
}
