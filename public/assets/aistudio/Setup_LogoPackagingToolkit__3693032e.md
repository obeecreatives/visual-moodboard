# Setup Integrasi Google Sheets & Apps Script

Panduan ini menghubungkan **Index[LogoPackagingToolkit].html** ke Google Sheets, supaya:

1. Setiap Brief Produk yang diisi bisa **diarsipkan otomatis** ke satu spreadsheet (riwayat semua client/project).
2. Tombol **"PDF via Apps Script"** bisa membuat guideline dalam bentuk **Google Slides** (otomatis, editable) lalu mengekspornya jadi PDF — sebagai alternatif yang lebih stabil dari export PDF berbasis browser, karena tidak bergantung pada library CDN eksternal sama sekali.

Estimasi waktu setup: **5–10 menit**, sekali saja per akun Google.

---

## Langkah 1 — Buat Google Sheet baru

1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru.
2. Beri nama, misalnya **"obeecreatives — Brief Archive"**.
3. Biarkan sheet kosong — script di langkah berikutnya akan membuat tab `Briefs` beserta header kolomnya secara otomatis saat pertama kali dipakai.

## Langkah 2 — Buka editor Apps Script

1. Di spreadsheet tadi, klik menu **Extensions (Ekstensi) → Apps Script**.
2. Akan terbuka tab baru berisi editor kode dengan file default bernama `Code.gs` (nama bawaan dari Google) yang isinya kosong/`myFunction(){}`.

## Langkah 3 — Rename file & tempel kode backend

1. Di sidebar kiri editor Apps Script, klik titik tiga (⋮) di sebelah nama file `Code.gs` → **Rename** → ganti jadi `Code[LogoPackagingToolkit]` (ekstensi `.gs` otomatis mengikuti). Ini supaya tidak tertukar kalau Anda mengelola beberapa web app lain di akun Google yang sama.
2. Hapus semua isi default file tersebut.
3. Buka file **`Code[LogoPackagingToolkit].gs`** yang saya sertakan terpisah, copy seluruh isinya.
4. Paste ke editor Apps Script tadi.
5. Klik ikon **Save (💾)** atau `Ctrl/Cmd+S`. Beri nama project jika diminta, misalnya **"Code[LogoPackagingToolkit]"** juga — biar konsisten di daftar project Apps Script Anda.

## Langkah 4 — Uji manual di editor (opsional, tapi sangat disarankan)

Sebelum deploy sebagai Web App, coba dulu langsung dari editor Apps Script — ini tidak perlu URL/deploy sama sekali, dan kalau ada masalah otorisasi, akan lebih mudah dideteksi di sini.

1. Di toolbar editor Apps Script, ada dropdown pemilih fungsi (biasanya bertuliskan nama fungsi, letaknya di sebelah tombol **Run ▶**). Pilih **`testArchiveBrief`**.
2. Klik **Run ▶**.
3. Run pertama kali akan memicu prompt otorisasi ("Authorization required") — klik **Review permissions**, pilih akun Google Anda, kalau muncul peringatan "Google hasn't verified this app" klik **Advanced → Go to [nama project] (unsafe)** (wajar, ini script pribadi buatan sendiri), lalu **Allow**.
4. Buka tab **Execution log** di bagian bawah editor — kalau berhasil akan muncul pesan `✓ Sheet "Briefs" berhasil dibuat/ditulis...`.
5. Buka kembali spreadsheet Anda — tab `Briefs` sekarang harus sudah muncul berisi 1 baris data uji coba (boleh dihapus manual kapan saja).
6. (Opsional) Ulangi dengan fungsi **`testGeneratePdf`** untuk menguji pembuatan Slides+PDF — cek Execution log untuk link Slides yang dihasilkan, lalu buka Google Drive Anda untuk melihat filenya.

> Kalau langkah ini berhasil, berarti seluruh logic backend (Sheets, Slides, Drive) sudah pasti berfungsi — sisanya di Langkah 5 & 6 hanya soal menyambungkan URL Web App ke tool HTML.

## Langkah 5 — Deploy sebagai Web App

1. Klik tombol **Deploy** (kanan atas) → **New deployment**.
2. Klik ikon gear ⚙️ di sebelah "Select type" → pilih **Web app**.
3. Isi konfigurasi:
   - **Description**: bebas, misalnya "v1"
   - **Execute as**: **Me** (akun Google Anda)
   - **Who has access**: **Anyone**
   > Catatan keamanan: opsi "Anyone" membuat endpoint bisa dipanggil siapa pun yang tahu URL-nya (URL-nya sendiri acak/panjang, sulit ditebak). Jangan bagikan URL Web App ini secara publik. Ini pilihan paling praktis karena permintaan dari file HTML (fetch) tidak bisa melalui alur login Google secara otomatis.
4. Klik **Deploy**.
5. Kalau Langkah 4 sudah dilakukan, otorisasi biasanya sudah beres duluan — kalau belum, Google akan meminta otorisasi lagi di sini, ikuti prompt yang sama seperti Langkah 4.
6. Setelah deploy selesai, akan muncul **Web app URL** — bentuknya seperti:
   ```
   https://script.google.com/macros/s/AKfycb........................./exec
   ```
   **Copy URL ini.**

   > Catatan: membuka Web App URL ini langsung di tab browser (seperti method `doGet`) hanya akan menampilkan 1 baris teks status ("... backend is running ..."). Itu **normal** — artinya endpoint-nya hidup, bukan berarti ada yang salah. Endpoint ini didesain untuk dipanggil lewat `fetch()` dari tool HTML (method `doPost`), bukan dibuka manual di browser.

## Langkah 6 — Sambungkan ke toolkit

1. Buka **Index[LogoPackagingToolkit].html** di browser.
2. Ke tab **Brief Produk**, scroll ke kartu **"Integrasi Google Sheets & Apps Script"** (sidebar kanan, paling bawah).
3. Tempel Web App URL dari Langkah 5 ke kolom **"URL Web App Apps Script"**.
4. URL ini otomatis tersimpan di browser (localStorage) — tidak perlu diketik ulang tiap kali dibuka.

## Langkah 7 — Uji coba dari tool

- Isi beberapa field brief, lalu klik **"Kirim ke Sheets"** → cek kembali ke Google Sheet, harus muncul baris baru di tab `Briefs`.
- Klik **"PDF via Apps Script"** → tunggu beberapa detik (proses: capture mockup → kirim ke Apps Script → generate Slides → export PDF) → file PDF akan otomatis terunduh, plus muncul link untuk membuka versi Google Slides-nya (bisa diedit manual kalau ada yang mau disesuaikan sebelum dikirim ke client).

---

## Opsi B — Jadikan 1 Web App Utuh (UI + Backend Jadi Satu)

Secara default (Langkah 1–7 di atas), Web App URL Apps Script Anda **cuma backend** — kalau dibuka langsung di browser, cuma tampil 1 baris teks status. UI lengkap tool tetap ada di file `Index[LogoPackagingToolkit].html` terpisah, dibuka manual.

Kalau Anda mau **satu URL saja** yang langsung menampilkan UI lengkap (tidak perlu buka file HTML terpisah, dan tombol Sheets/PDF otomatis terhubung tanpa perlu isi URL manual), ikuti langkah tambahan ini. File `Code[LogoPackagingToolkit].gs` versi terbaru yang saya sertakan **sudah mendukung mode ini** — `doGet()` di dalamnya sudah diubah untuk menyajikan UI, bukan cuma teks status.

### Langkah B1 — Update kode backend ke versi terbaru

1. Buka editor Apps Script dari Sheet Anda (Extensions → Apps Script).
2. Ganti seluruh isi `Code[LogoPackagingToolkit].gs` dengan versi terbaru yang saya sertakan (sudah termasuk fungsi `gasArchiveBrief`, `gasGeneratePdf`, dan `doGet()` versi baru). Save.

### Langkah B2 — Tambahkan file HTML ke project Apps Script

1. Di sidebar kiri editor Apps Script, klik ikon **+** di sebelah "Files" → pilih **HTML**.
2. Beri nama persis: `Index[LogoPackagingToolkit]` (tanpa `.html` — Apps Script otomatis menambahkannya).
3. Hapus isi default (`<!DOCTYPE html>...`) yang otomatis muncul.
4. Buka file **`Index[LogoPackagingToolkit].html`** yang saya sertakan terpisah, copy **seluruh isinya** (dari `<!DOCTYPE html>` sampai `</html>` di baris paling akhir).
5. Paste ke file HTML yang baru dibuat di Apps Script tadi. Save.

### Langkah B3 — Deploy ulang

1. **Deploy → Manage deployments** → klik ikon pensil pada deployment aktif → ubah **Version** ke **New version** → **Deploy**.
   > Kalau belum pernah deploy sama sekali, ikuti Langkah 5 di atas (New deployment, tipe Web app, Execute as Me, Access Anyone).
2. Buka **Web App URL** yang sama seperti sebelumnya (persis, tidak berubah) di tab baru.
3. Sekarang harusnya langsung tampil **UI lengkap tool**, bukan teks status lagi.

### Langkah B4 — Cek koneksi otomatis

Di dalam UI yang terbuka lewat Web App URL ini, buka tab **Brief Produk** → scroll ke kartu **"Integrasi Google Sheets & Apps Script"**. Harus muncul kotak hijau bertuliskan **"✓ Berjalan sebagai Apps Script Web App — terhubung otomatis"**, dan kolom URL manual otomatis tersembunyi (tidak perlu diisi). Coba langsung klik "Kirim ke Sheets" atau "PDF via Apps Script" dari situ.

> File `Index[LogoPackagingToolkit].html` yang sama tetap bisa dibuka standalone (double-click di komputer) kapan saja — dia otomatis mendeteksi dari mana dia dibuka dan menyesuaikan (pakai `google.script.run` kalau lewat Web App URL Apps Script, pakai kolom URL manual kalau dibuka standalone). Jadi Anda tidak kehilangan opsi standalone sama sekali, cuma dapat tambahan cara akses baru.

---

## Opsi C — Hilangkan Banner "Aplikasi ini dibuat oleh pengguna Google Apps Script"

Kalau Web App URL (Opsi B) dibuka **langsung** lewat address bar, Google menampilkan banner abu-abu di bagian atas: *"Aplikasi ini dibuat oleh pengguna Google Apps Script"*. Banner ini dipasang Google di level di LUAR halaman kita, jadi tidak bisa dihilangkan lewat CSS/JS di dalam kode sendiri.

**Solusinya**: banner itu cuma muncul kalau browser menavigasi LANGSUNG ke URL `/exec`. Kalau URL itu di-*embed* lewat `<iframe>` di halaman lain yang di-host di domain terpisah, banner tidak muncul. Karena tool ini cuma **1 halaman** (4 tab yang Anda lihat itu ganti-ganti lewat JS di browser, bukan reload/route server terpisah), solusinya sederhana — cukup file wrapper + iframe, **tidak perlu** utak-atik navigasi internal.

### Langkah C1 — Update `Code[LogoPackagingToolkit].gs`

Ganti isi file dengan versi terbaru yang saya sertakan (sudah ditambah `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` di `doGet()` — ini yang mengizinkan halaman di-iframe-kan). Save, lalu **Deploy → Manage deployments → New version → Deploy** seperti biasa.

### Langkah C2 — Host file wrapper di GitHub Pages

File **`Wrapper[LogoPackagingToolkit].html`** yang saya sertakan sudah berisi URL Web App Anda (siap pakai, tidak perlu edit apa pun). Host di GitHub Pages (gratis, ±10 menit sekali setup):

1. Buat akun di [github.com](https://github.com) kalau belum punya.
2. Klik **+** di pojok kanan atas → **New repository**. Beri nama bebas, centang **Public** → **Create repository**.
3. **Add file → Upload files** → unggah `Wrapper[LogoPackagingToolkit].html`.
4. File itu **wajib** bernama persis `index.html` di repo (bukan nama aslinya) — kalau opsi rename tidak muncul saat upload: upload dulu apa adanya → klik file itu di repo → ikon pensil ✏️ **Edit** → ubah nama file di kotak nama bagian atas editor jadi `index.html` → **Commit changes**.
5. Tab **Settings** repo → menu kiri **Pages** → bagian **Branch**, pilih `main`, folder `/ (root)` → **Save**.
6. Tunggu ±1 menit, refresh **Settings → Pages** — akan muncul URL: `https://[usernamekamu].github.io/[namarepo]/`. Itu URL wrapper Anda, bebas banner.

> ⚠️ Jangan pakai Google Sites untuk ini — fitur "Sematkan kode"-nya sering error 401 untuk akun Gmail pribadi. GitHub Pages jauh lebih stabil untuk kasus ini.

### Langkah C3 — Bagikan URL wrapper (GitHub Pages), bukan URL `/exec` mentah

URL `/exec` asli tetap berfungsi seperti biasa (banner boleh muncul di situ, itu wajar/fallback untuk akses langsung developer). Yang dibagikan ke pengguna akhir adalah URL **GitHub Pages**-nya.

> 💡 Kalau kode Apps Script diperbarui (redeploy versi baru), file wrapper di GitHub **tidak perlu diupload ulang** — dia cuma memuat Web App secara live lewat iframe, otomatis ikut versi terbaru.

### Checklist testing Opsi C

- [ ] Buka URL wrapper (GitHub Pages) — tool muncul tanpa banner.
- [ ] Buka URL `/exec` langsung — banner boleh muncul di sini, itu normal.
- [ ] Test dari HP — pastikan bagian paling bawah halaman (footer, tombol) tidak ketutup saat address bar browser HP menyembul/menyusut.
- [ ] Test dari tab Incognito — pastikan bisa akses tanpa error 401/izin.
- [ ] Coba "Kirim ke Sheets" / "PDF via Apps Script" dari dalam wrapper — pastikan `google.script.run` tetap berfungsi di dalam iframe.

---

## Update kode di kemudian hari

Kalau saya (atau Anda) mengubah isi `Code[LogoPackagingToolkit].gs` **atau** `Index[LogoPackagingToolkit].html` (kalau pakai Opsi B) di masa depan:

1. Buka lagi editor Apps Script dari Sheet yang sama.
2. Ganti isi file terkait dengan versi baru, Save.
3. **Deploy → Manage deployments** → klik ikon pensil pada deployment aktif → ubah **Version** ke **New version** → **Deploy**.
   > Penting: kalau hanya save kode tanpa membuat "New version" lewat Manage Deployments, Web App URL yang sudah dipakai **tidak akan otomatis memakai kode terbaru**.
   > Kalau pakai Opsi C (wrapper), tidak ada langkah tambahan — wrapper otomatis ikut versi terbaru karena cuma iframe.

## Troubleshooting

| Masalah | Kemungkinan penyebab |
|---|---|
| Buka Web App URL cuma tampil 1 baris teks, bukan UI tool | Wajar kalau belum ikuti **Opsi B** — itu artinya masih mode backend-saja. Ikuti Langkah B1–B3 di atas kalau mau UI langsung tampil di URL tersebut. |
| Spreadsheet masih kosong padahal Web App URL sudah jalan (halaman `doGet` muncul normal) | **Ini normal, bukan error.** Tab `Briefs` baru dibuat otomatis saat pertama kali ada data masuk lewat `doPost`/RPC — deploy saja tidak memicu itu. Jalankan `testArchiveBrief` (Langkah 4) atau klik "Kirim ke Sheets" di tool untuk memicunya. |
| Status "Gagal mengirim. Cek URL Web App..." | URL salah/belum di-deploy, atau access bukan "Anyone" (hanya relevan kalau TIDAK pakai Opsi B) |
| Klik "PDF via Apps Script" lama/tidak selesai | Deployment belum diotorisasi penuh — jalankan `testGeneratePdf` dulu dari editor (Langkah 4) untuk memicu prompt otorisasi di tempat yang lebih mudah dipantau |
| Perubahan kode tidak berefek | Lupa membuat "New version" di Manage Deployments (lihat bagian di atas) |
| Warna di Slides tidak sama persis dengan di tool | Wajar — swatch warna di Slides dibuat native (bukan screenshot), jadi hasilnya solid & tajam, bukan re-capture dari layar |
| Ingin data lebih rapi per client | Bisa duplikat Google Sheet ini per client/project, masing-masing dengan Web App URL sendiri |
| Banner "Aplikasi ini dibuat oleh pengguna Google Apps Script" masih muncul | Anda membuka URL `/exec` langsung, bukan URL wrapper (GitHub Pages). Itu wajar untuk akses langsung — bagikan URL wrapper (Opsi C) ke pengguna akhir, bukan URL `/exec` |
| Wrapper GitHub Pages tampil kosong/blank | Cek nama file di repo harus persis `index.html` (bukan `Wrapper[LogoPackagingToolkit].html`), dan pastikan `doGet()` di `Code.gs` sudah punya `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` — tanpa ini iframe diblokir Google |

---

## Kenapa PDF via Apps Script lebih stabil dari tombol "Export Panduan PDF" biasa?

Tombol **"Export Panduan PDF"** di topbar berjalan sepenuhnya di browser, memakai library eksternal (`html2canvas` + `jsPDF`) yang di-load dari CDN. Ini bekerja baik di browser biasa, tapi bisa gagal di lingkungan sandbox tertentu (mis. preview di dalam chat AI) yang memblokir mekanisme unduhan library tersebut.

Jalur **"PDF via Apps Script"** memindahkan sebagian besar proses ke server Google: Brief & Moodboard dibangun **native** di Google Slides (teks & kotak warna asli, bukan gambar hasil screenshot), sehingga hasilnya lebih tajam dan tidak bergantung pada CDN eksternal sama sekali — hanya bagian mockup kemasan (yang berupa SVG kompleks) yang tetap dikirim sebagai gambar dari browser.
