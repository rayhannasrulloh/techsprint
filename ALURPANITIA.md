# Tata Cara & Alur Administrasi Panitia (3IN1 Tech Sprint 2026)

Dokumen ini berfungsi sebagai buku pedoman alur kerja *(Standard Operating Procedure)* untuk divisi panitia internal (terutama Admin, Humas/PR, dan Acara) dalam menggunakan *Admin Panel System* dari website pendaftaran.

---

## TAHAP 1: Akses Sistem Rahasia Panitia

Seluruh pengontrolan sistem bermuara pada gerbang rahasia **Admin Secret Panel**. Pastikan panitia tidak menyebarluaskan tautan dan cara kerja panel ini kepada peserta biasa.

1. Buka *browser* (direkomendasikan dalam mode Desktop/PC untuk visibilitas maksimal).
2. Navigasikan ke alamat URL rahasia: `[domain]/admin-secret-panel`.
3. Akan muncul gerbang *Login* khusus administrator. Masukkan kredensial **Email & Kata Sandi Administrator** yang sebelumnya sudah disetujui / didaftarkan pada _database_ internal Supabase di dalam tabel `admin_profiles`.
4. Jika kredensial terdeteksi benar, panitia akan dilempar masuk ke laman *Ringkasan Dashboard Admin*. Laman ini memuat rekap total metrik peserta secara _real-time_.

---

## TAHAP 2: Eksekusi Validasi Administrasi Peserta (Menu `Participants`)

Tugas paling fundamental kepanitiaan di minggu-minggu pembukaan pendaftaran adalah memverifikasi semua data pendaftar valid secara uang (bukti lunas) dan tata tertib (_follow_ akun, twibbon).

1. Pada navigasi sayap panel admin, beralihlah ke tab **Participants / Peserta**.
2. Di tabel atau daftar yang ada, cari tim-tim yang indikator statusnya masih **`pending`** (kuning).
3. **Lakukan Pemeriksaan Manual:**
   - Klik atau inspeksi data perwakilan tim tersebut.
   - Buka tautan (*link* biru) dari berkas asuransi yang mereka unggah: **Bukti Pembayaran**, **ID Card Gabungan**, **Bukti Follow IG**, **Twibbon**, dan **Story IG**.
4. **Memberi Keputusan:**
   - Apabila mutasi dari QRIS a.n CHIBI MARUKO-CHAN tervalidasi dan persyaratan gambar sesuai dengan format: *Klik tombol/opsi ubah status dan ganti menjadi* **`Approved`** (hijau/Diterima). 
   - Bila bukti memanipulasi identitas, bukti bodong, atau transfer palsu: *Silakan tolak registrasinya dengan mengubah status ke* **`Rejected`** (merah/Ditolak).
5. Data yang telah dialihkan profilnya menjadi _Approved_ memastikan bahwa tim mereka mendapat izin integrasi resmi untuk menatap laman *Dashboard Peserta* pasca-login.

---

## TAHAP 3: Publikasi Pesan & Pengumuman Massal (Menu `Announcements`)

Fitur krusial bagi divisi Acara dan Humas untuk memberitakan _update_ wajib tanpa harus menghubungi masing-masing ketua (seperti Link WhatsApp Grup, Link Server Discord, dsb).

1. Bergeser ke tab navigasi **Announcements / Pengumuman**.
2. Buat entitas pengumuman baru berisi "Judul" dan "Isi Teks".
3. Tulis arahan yang komprehensif, logis, dan rapih. (Contoh: "Batas Waktu Pengumpulan Karya" atau "Link Masuk Discord Untuk TM").
4. Setelah diterbitkan (*published*), pesan ini seketika menyembul dan tayang pada dinding _Dashboard Peserta_ ketika peserta melakukan rutinitas *login*.

---

## TAHAP 4: Meninjau Aspirasi & Pertanyaan Klien (Menu `Inbox`)

Untuk menanggapi pendaftar yang kesulitan dan bertanya melalui portal formulir kontak (*Hubungi Kami*).

1. Pindah tab menuju **Inbox / Pesan Masuk**.
2. Segala transmisi pesan masuk dari laman interaksi luaran *website* akan mengendap di sini.
3. Panitia (biasanya divisi Humas/PR) ditugaskan untuk menyortir _email_ dan nomor HP bersangkutan, lalu memandu kontak yang menghadapi musibah pendaftaran menggunakan saluran luar semacam WhatsApp Resmi Panitia atau Email Panitia.

---

## TAHAP 5: Periode Puncak Lomba (Technical Meeting & Eksekusi)

Setelah jalur pendaftaran ditutup (Pasca 26 April 2026), fungsi Admin Panel pada _website_ mulai melemah dan sentris dirotasikan seutuhnya pada wahana kolaborasi eskternal.

1. **6 Mei 2026 (Technical Meeting)** :
   Panitia me-*review* kehadiran (*presensi*) selingkup peserta. Segala tanya-jawab terfokus melalui _platform webinar_ dan Server Discord panitia.
2. **9 Mei – 10 Mei (The Sprint Phase)** :
   - Panitia memberi klakson waktu mulainya kompetisi persis pada 12.00 Siang.
   - Panitia bertugas bersiaga di panel komando Discord apabila peserta melaporkan kerusakan server submisi.
   - Di hari kedua saat fase Pitch tiba, panitia menerima seluruh kompilasi PDF/Video Prototipe dari *link* pengumpulan karya internal (Google Form pembantu) untuk kemudian disirkulasikan pada Panel Dewan Juri yang bertugas.
