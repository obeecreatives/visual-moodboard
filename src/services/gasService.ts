import { BriefProject, GasConfig } from '../types';

export const DEFAULT_SPREADSHEET_ID = '19xwZc-KdbncqukEsPuP_0cXU0tgfAxIGAA7MAEU9qko';
export const TARGET_SPREADSHEET_ID = DEFAULT_SPREADSHEET_ID;

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzybLaMByw42W01XB9EbaiVx9qhMgHY7YsauRCKHlkCu-Zpfg86nANaqhixhfuTQ22B/exec';

export const DEFAULT_GAS_CONFIG: GasConfig = {
  webAppUrl: DEFAULT_GAS_URL,
  spreadsheetId: DEFAULT_SPREADSHEET_ID,
  lastSyncTime: null,
  isConnected: true,
  autoSync: true
};

export const STORAGE_KEY_GAS_URL = 'obee_workspace_gas_url';
export const STORAGE_KEY_BRIEFS = 'obee_workspace_briefs_v2';
export const STORAGE_KEY_ACTIVE_PROJECT_ID = 'obee_workspace_active_id';
export const STORAGE_KEY_THEME = 'obee_workspace_theme';
export const STORAGE_KEY_SIDEBAR_COLLAPSED = 'obee_workspace_sidebar_collapsed';
export const STORAGE_KEY_ACTIVE_USER = 'obee_workspace_active_user';


export async function pingGasEndpoint(url: string): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const targetUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
    
    const res = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const latency = Math.round(performance.now() - start);

    if (res.ok) {
      return { ok: true, latency };
    } else {
      return { ok: false, latency, error: `HTTP ${res.status}: ${res.statusText}` };
    }
  } catch (err: unknown) {
    const latency = Math.round(performance.now() - start);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { ok: false, latency, error: errorMessage };
  }
}

export async function testGasPing(url: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const result = await pingGasEndpoint(url);
  return {
    success: result.ok,
    latencyMs: result.latency,
    message: result.ok ? `Koneksi aktif (${result.latency}ms)` : (result.error || 'Koneksi gagal')
  };
}

export async function archiveBriefToGas(
  url: string, 
  brief: BriefProject
): Promise<{ ok: boolean; success: boolean; message: string; row?: number; error?: string }> {
  try {
    const payload = {
      action: 'archiveBrief',
      data: {
        briefId: brief.briefNumber,
        id: brief.id,
        clientName: brief.clientName,
        brandName: brief.brandName,
        packageName: brief.packageName,
        category: brief.category,
        status: brief.status,
        creatorName: brief.creatorName,
        createdAt: brief.createdAt,
        updatedAt: brief.updatedAt,
        personality: brief.personality,
        lookfeel: brief.lookfeel,
        jenisLogo: brief.jenisLogo,
        bentukIcon: brief.bentukIcon,
        targetMarket: brief.targetMarket,
        visualPhoto: brief.visualPhoto,
        captionStyle: brief.captionStyle,
        notes: brief.notes,
        palette: brief.palette,
        fontDisplay: brief.fontDisplay,
        fontBody: brief.fontBody,
        keywords: brief.keywords,
        approvalNotes: brief.approvalNotes || '',
        verifiedBy: brief.verifiedBy || '',
        mockupConfig: {
          shape: brief.mockupConfig.shape,
          color: brief.mockupConfig.color,
          scene: brief.mockupConfig.scene,
          materialStyle: brief.mockupConfig.materialStyle,
          texture: brief.mockupConfig.texture,
          prodName: brief.mockupConfig.prodName,
          prodTag: brief.mockupConfig.prodTag
        }
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    const isOk = json.ok ?? true;
    return {
      ok: isOk,
      success: isOk,
      row: json.result?.row,
      message: isOk 
        ? `✓ Brief ${brief.briefNumber} berhasil disinkronkan ke Spreadsheet ID: ${DEFAULT_SPREADSHEET_ID}` 
        : (json.error || 'Gagal menyimpan ke Google Sheets'),
      error: json.error
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { 
      ok: false, 
      success: false, 
      message: `Gagal sinkronisasi: ${errorMsg}`, 
      error: errorMsg 
    };
  }
}

export async function updateBriefStatusGas(
  url: string, 
  briefId: string, 
  status: string, 
  verifiedBy: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const payload = {
      action: 'updateStatus',
      data: {
        briefId,
        status,
        verifiedBy,
        verifiedAt: new Date().toISOString()
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return await res.json();
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function updateBriefStatusInGas(
  url: string,
  briefId: string,
  status: string,
  notes: string = '',
  verifiedBy: string = ''
): Promise<boolean> {
  const res = await updateBriefStatusGas(url, briefId, status, verifiedBy || notes);
  return res.ok;
}

export async function generatePdfViaGas(
  url: string, 
  brief: BriefProject, 
  mockupImageBase64?: string | null, 
  sceneImageBase64?: string | null
): Promise<{ ok: boolean; result?: { pdfBase64: string; fileName: string; slidesUrl: string }; error?: string }> {
  try {
    const payload = {
      action: 'generatePdf',
      data: {
        brief: {
          productName: brief.brandName || brief.clientName,
          personality: brief.personality,
          lookfeel: brief.lookfeel,
          jenisLogo: brief.jenisLogo,
          bentukIcon: brief.bentukIcon,
          kelasEkonomi: brief.targetMarket.economy,
          usia: brief.targetMarket.age,
          karakterFoto: brief.visualPhoto.character,
          rasioGambar: brief.visualPhoto.ratio,
          gayaCaption: brief.captionStyle,
          catatan: brief.notes
        },
        palette: brief.palette,
        fontDisplay: brief.fontDisplay,
        fontBody: brief.fontBody,
        keywords: brief.keywords,
        mockupImageBase64: mockupImageBase64 || null,
        sceneImageBase64: sceneImageBase64 || null
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    return json;
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function getStandaloneAppsScriptCode(spreadsheetId: string = DEFAULT_SPREADSHEET_ID): string {
  return `/**
 * ============================================================================
 * obeecreatives — Logo & Packaging Toolkit — Standalone REST Backend
 * ============================================================================
 * Dibuat khusus untuk arsitektur Standalone Apps Script (script.google.com).
 * Terhubung ke Spreadsheet target secara presisi tanpa ketergantungan container.
 *
 * SPREADSHEET ID : ${spreadsheetId}
 * TAB NAME       : Briefs
 * FOLDER DRIVE   : obeecreatives / Packaging Guidelines
 * DEVELOPED BY   : Lalu Mahendra & obeecreatives Engineering
 * ============================================================================
 */

const SPREADSHEET_ID = '${spreadsheetId}';
const SHEET_NAME = 'Briefs';
const PROJECT_NAME = 'obeecreatives — Logo & Packaging Toolkit';
const DRIVE_FOLDER_NAME = 'obeecreatives — Packaging Guidelines';
const PDF_FOOTER_TEXT = 'obeecreatives — All Rights Reserved';

/* ============================== REST API ROUTER ============================== */

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    
    if (action === 'ping') {
      return jsonResponse_({
        ok: true,
        status: 'online',
        timestamp: new Date().toISOString(),
        spreadsheetId: SPREADSHEET_ID,
        service: PROJECT_NAME
      });
    }

    if (action === 'getBriefs') {
      const sheet = getSheet_();
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return jsonResponse_({ ok: true, briefs: [] });
      }
      const headers = data[0];
      const rows = data.slice(1);
      const briefs = rows.map(function(row) {
        var obj = {};
        headers.forEach(function(h, idx) {
          obj[h] = row[idx];
        });
        return obj;
      });
      return jsonResponse_({ ok: true, briefs: briefs });
    }

    return jsonResponse_({ ok: false, error: 'Aksi GET tidak dikenali: ' + action });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); // Mencegah race condition antar desainer/staf
    
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var result;

    if (action === 'archiveBrief') {
      result = archiveBrief_(body.data);
    } else if (action === 'updateStatus') {
      result = updateStatus_(body.data);
    } else if (action === 'generatePdf') {
      result = generateGuidelinePdf_(body.data);
    } else {
      throw new Error('Aksi POST tidak dikenali: ' + action);
    }

    return jsonResponse_({ ok: true, result: result });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================== GOOGLE SHEETS ACCESS ============================== */

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Brief_ID',
      'Timestamp',
      'Nama_Klien',
      'Nama_Brand',
      'Paket_Layanan',
      'Kategori',
      'Status_Approval',
      'PIC_Creator',
      'Ekonomis_Mewah',
      'Feminim_Maskulin',
      'Tradisional_Modern',
      'Simple_Rumit',
      'Mono_FullColor',
      'Anak_Dewasa',
      'Fun_Serius',
      'Logo_Look_Feel',
      'Jenis_Logo',
      'Bentuk_Icon',
      'Target_Ekonomi',
      'Target_Usia',
      'Karakter_Foto',
      'Rasio_Foto',
      'Gaya_Caption',
      'Catatan',
      'Palet_Hex',
      'Font_Utama',
      'Font_Alternatif',
      'Bentuk_Kemasan',
      'Warna_Bahan',
      'Catatan_Approval',
      'Diverifikasi_Oleh'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 31).setFontWeight('bold').setBackground('#0D0D0D').setFontColor('#FFFFFF');
  }
  return sheet;
}

function archiveBrief_(data) {
  var sheet = getSheet_();
  var p = data.personality || {};
  var t = data.targetMarket || {};
  var v = data.visualPhoto || {};
  var m = data.mockupConfig || {};
  var briefId = data.briefId || ('OBEE-' + new Date().getFullYear() + '-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMdd-HHmm'));

  var allData = sheet.getDataRange().getValues();
  var existingRow = -1;
  for (var i = 1; i < allData.length; i++) {
    if (String(allData[i][0]) === String(briefId)) {
      existingRow = i + 1;
      break;
    }
  }

  var rowValues = [
    briefId,
    new Date(),
    data.clientName || '',
    data.brandName || '',
    data.packageName || '',
    data.category || '',
    data.status || 'draft',
    data.creatorName || '',
    p.ekonomisMewah || 3,
    p.feminimMaskulin || 3,
    p.tradisionalModern || 3,
    p.simpleRumit || 3,
    p.monoFullcolor || 3,
    p.anakDewasa || 3,
    p.funSerius || 3,
    (data.lookfeel || []).join(', '),
    data.jenisLogo || '',
    data.bentukIcon || '',
    t.economy || '',
    t.age || '',
    v.character || '',
    v.ratio || '',
    data.captionStyle || '',
    data.notes || '',
    (data.palette || []).join(', '),
    data.fontDisplay || '',
    data.fontBody || '',
    m.shape || '',
    m.color || '',
    data.approvalNotes || '',
    data.verifiedBy || ''
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    return { briefId: briefId, row: existingRow, updated: true };
  } else {
    sheet.appendRow(rowValues);
    return { briefId: briefId, row: sheet.getLastRow(), updated: false };
  }
}

function updateStatus_(data) {
  var sheet = getSheet_();
  var briefId = String(data.briefId);
  var allData = sheet.getDataRange().getValues();
  
  for (var i = 1; i < allData.length; i++) {
    if (String(allData[i][0]) === briefId) {
      sheet.getRange(i + 1, 7).setValue(data.status);
      if (data.verifiedBy) sheet.getRange(i + 1, 31).setValue(data.verifiedBy);
      return { success: true, row: i + 1, status: data.status };
    }
  }
  throw new Error('Brief ID tidak ditemukan di sheet: ' + briefId);
}

/* ============================== GOOGLE DRIVE & SLIDES ============================== */

function getTargetDriveFolder_() {
  var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function generateGuidelinePdf_(data) {
  var brief = data.brief || {};
  var productName = (brief.productName || 'Brand').replace(/[^a-zA-Z0-9 ]/g, '').trim();
  var deckName = 'obeecreatives — ' + productName + ' Visual Guideline (' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm') + ')';

  var folder = getTargetDriveFolder_();
  var deck = SlidesApp.create(deckName);
  var fileId = deck.getId();

  var driveFile = DriveApp.getFileById(fileId);
  folder.addFile(driveFile);
  DriveApp.getRootFolder().removeFile(driveFile);

  var pageW = deck.getPageWidth();
  var pageH = deck.getPageHeight();
  var ctx = { pageW: pageW, pageH: pageH };

  var slides = deck.getSlides();
  buildCoverSlide_(slides[0], data, ctx);
  addFooter_(slides[0], ctx, true);

  var briefSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  buildBriefSlide_(briefSlide, data, ctx);
  addFooter_(briefSlide, ctx, false);

  var moodSlide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  buildMoodboardSlide_(moodSlide, data, ctx);
  addFooter_(moodSlide, ctx, false);

  if (data.mockupImageBase64) {
    var s = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    buildImageSlide_(s, 'Mockup Kemasan 3D Realistis', data.mockupImageBase64, ctx);
    addFooter_(s, ctx, false);
  }

  if (data.sceneImageBase64) {
    var s2 = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
    buildImageSlide_(s2, 'Set Kemasan (Product Lineup)', data.sceneImageBase64, ctx);
    addFooter_(s2, ctx, false);
  }

  deck.saveAndClose();

  var pdfBlob = DriveApp.getFileById(fileId).getAs('application/pdf');
  var pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());

  return {
    pdfBase64: pdfBase64,
    fileName: 'obeecreatives-Guideline-' + productName.replace(/\\s+/g, '-') + '.pdf',
    slidesUrl: 'https://docs.google.com/presentation/d/' + fileId + '/edit'
  };
}

function addFooter_(slide, ctx, onDark) {
  var footer = slide.insertTextBox(PDF_FOOTER_TEXT, 30, ctx.pageH - 26, ctx.pageW - 60, 16);
  var tr = footer.getText();
  tr.getTextStyle().setFontSize(8).setForegroundColor(onDark ? 'AAAAAA' : '888888').setFontFamily('Arial');
  tr.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
}

function buildCoverSlide_(slide, data, ctx) {
  slide.getShapes().forEach(function(sh) { sh.remove(); });
  slide.getBackground().setSolidFill('0D0D0D');

  var tag = slide.insertTextBox('OBEECREATIVES • CREATIVE AGENCY OS', 40, ctx.pageH / 2 - 80, ctx.pageW - 80, 24);
  var tagText = tag.getText();
  tagText.getTextStyle().setFontSize(10).setForegroundColor('E31E2B').setBold(true).setFontFamily('Arial');
  tagText.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var title = slide.insertTextBox('VISUAL IDENTITY & PACKAGING GUIDELINE', 40, ctx.pageH / 2 - 50, ctx.pageW - 80, 50);
  var trTitle = title.getText();
  trTitle.getTextStyle().setFontSize(22).setForegroundColor('FFFFFF').setBold(true).setFontFamily('Arial');
  trTitle.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var sub = slide.insertTextBox((data.brief && data.brief.productName) || 'Nama Brand', 40, ctx.pageH / 2 + 6, ctx.pageW - 80, 30);
  var trSub = sub.getText();
  trSub.getTextStyle().setFontSize(15).setForegroundColor('FFFFFF').setFontFamily('Arial');
  trSub.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var meta = slide.insertTextBox('Disusun oleh obeecreatives • ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMMM yyyy'), 40, ctx.pageH / 2 + 40, ctx.pageW - 80, 20);
  var trMeta = meta.getText();
  trMeta.getTextStyle().setFontSize(9).setForegroundColor('888888').setFontFamily('Arial');
  trMeta.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
}

function buildBriefSlide_(slide, data, ctx) {
  var b = data.brief || {};
  var p = b.personality || {};
  var marginX = 40;
  var contentW = ctx.pageW - marginX * 2;
  var y = 30;

  var title = slide.insertTextBox('Brief Visual Identity & Brand Personality', marginX, y, contentW, 28);
  title.getText().getTextStyle().setFontSize(18).setForegroundColor('141312').setBold(true).setFontFamily('Arial');
  y += 36;

  var pairs = [
    ['Ekonomis', 'Mewah', p.ekonomisMewah],
    ['Feminim', 'Maskulin', p.feminimMaskulin],
    ['Tradisional', 'Modern', p.tradisionalModern],
    ['Simple', 'Rumit', p.simpleRumit],
    ['Monochrome', 'Full Color', p.monoFullcolor],
    ['Anak', 'Dewasa', p.anakDewasa],
    ['Fun', 'Serius', p.funSerius]
  ];

  pairs.forEach(function(pair) {
    var val = pair[2] || 3;
    var line = pair[0] + '   ' + '●'.repeat(val) + '○'.repeat(5 - val) + '   ' + pair[1];
    var row = slide.insertTextBox(line, marginX, y, contentW, 16);
    row.getText().getTextStyle().setFontSize(10).setForegroundColor('333333').setFontFamily('Arial');
    y += 18;
  });

  y += 10;
  var other = slide.insertTextBox(
    'Logo Look & Feel: ' + (b.lookfeel || []).join(', ') + '\\n' +
    'Jenis Logo: ' + (b.jenisLogo || '-') + ' | Bentuk Icon: ' + (b.bentukIcon || '-') + '\\n' +
    'Target Pasar: ' + (b.kelasEkonomi || '-') + ', Usia: ' + (b.usia || '-') + '\\n' +
    'Acuan Fotografi: ' + (b.karakterFoto || '-') + ' | Rasio: ' + (b.rasioGambar || '-') + '\\n' +
    'Gaya Caption: ' + (b.gayaCaption || '-') + '\\n' +
    'Catatan Khusus: ' + (b.catatan || '-'),
    marginX, y, contentW, ctx.pageH - y - 35
  );
  other.getText().getTextStyle().setFontSize(9.5).setForegroundColor('333333').setFontFamily('Arial');
}

function buildMoodboardSlide_(slide, data, ctx) {
  var marginX = 40;
  var title = slide.insertTextBox('Moodboard & Palet Warna', marginX, 30, ctx.pageW - marginX * 2, 28);
  title.getText().getTextStyle().setFontSize(18).setForegroundColor('141312').setBold(true).setFontFamily('Arial');

  var x = marginX;
  var swSize = 56;
  (data.palette || []).forEach(function(hex) {
    var rect = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x, 75, swSize, swSize);
    rect.getFill().setSolidFill(String(hex).replace('#', ''));
    rect.getBorder().setTransparent();
    var label = slide.insertTextBox(hex, x, 75 + swSize + 4, swSize, 14);
    var t = label.getText();
    t.getTextStyle().setFontSize(8).setForegroundColor('444444').setFontFamily('Arial');
    t.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    x += swSize + 12;
  });

  var font = slide.insertTextBox('Tipografi: ' + (data.fontDisplay || '-') + ' (Display) / ' + (data.fontBody || '-') + ' (Body)', marginX, 165, ctx.pageW - marginX * 2, 20);
  font.getText().getTextStyle().setFontSize(11).setForegroundColor('333333').setFontFamily('Arial');

  var kw = slide.insertTextBox('Kata Kunci Mood: ' + (data.keywords || []).join(', '), marginX, 190, ctx.pageW - marginX * 2, 40);
  kw.getText().getTextStyle().setFontSize(11).setForegroundColor('333333').setFontFamily('Arial');
}

function buildImageSlide_(slide, titleText, base64png, ctx) {
  var marginX = 40;
  var t = slide.insertTextBox(titleText, marginX, 24, ctx.pageW - marginX * 2, 28);
  t.getText().getTextStyle().setFontSize(18).setForegroundColor('141312').setBold(true).setFontFamily('Arial');

  var raw = String(base64png).split(',').pop();
  var bytes = Utilities.base64Decode(raw);
  var blob = Utilities.newBlob(bytes, 'image/png', titleText + '.png');
  var img = slide.insertImage(blob);

  var maxW = ctx.pageW - marginX * 2;
  var maxH = ctx.pageH - 95;
  var ratio = Math.min(maxW / img.getWidth(), maxH / img.getHeight(), 1);
  var w = img.getWidth() * ratio;
  var h = img.getHeight() * ratio;
  img.setWidth(w).setHeight(h);
  img.setLeft((ctx.pageW - w) / 2).setTop(75);
}
`;
}

export const STANDALONE_GAS_SCRIPT_TEMPLATE = getStandaloneAppsScriptCode(DEFAULT_SPREADSHEET_ID);
