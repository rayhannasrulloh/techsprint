# 3IN1 Tech Sprint 2026 Website

Website platform untuk pendaftaran, kompetisi, dan manajemen peserta *3IN1 Tech Sprint 2026*. Dibangun dengan teknologi modern **Next.js 16 (App Router)**, **Tailwind CSS**, serta platform BaaS (Backend-as-a-Service) **Supabase**.

---

## 🚀 Cara Install & Menjalankan Project

### 1. Persiapan Awal (Prerequisites)
Pastikan Anda telah menginstal _tools_ berikut di komputer Anda:
- [Node.js](https://nodejs.org/en/) (Disarankan versi LTS atau v20+)
- `npm` (biasanya sudah terinstal bersama Node.js) atau `yarn` / `pnpm` / `bun`
- [Git](https://git-scm.com/)
- Akun [Supabase](https://supabase.com/) & [Resend](https://resend.com/) untuk mendapatkan *API Keys*.

### 2. Instalasi Project
1. Buka terminal/Command Prompt dan masuklah terlebih dahulu ke direktori yang Anda inginkan.
2. Lakukan _clone_ repositori menggunakan git (jika belum).
3. Masuk ke ruang lingkup proyek via terminal:
   ```bash
   cd techsprint
   ```
4. Instal semua dependensi _libraries_:
   ```bash
   npm install
   ```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat sebuah file baru bernama `.env.local` persis pada *root directory* (folder utama) proyek ini. Isi file tersebut dengan menyalin teks di bawah ini dan menggantikan isinya dengan *credentials* riil proyek Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]
RESEND_API_KEY=[YOUR_RESEND_API_KEY]
```
> **Peringatan PENTING:** Jangan pernah melakukan iterasi *(commit)* atau **mengunggah file `.env.local`** ke GitHub/public repository karena file ini mengandung rahasia vital server backend.

### 4. Menjalankan Server Development
Setelah semuanya tersetel, eksekusi perintah berikut:
```bash
npm run dev
```
Buka *browser* Anda dan pergilah ke [http://localhost:3000](http://localhost:3000). 
Selesai! Website proyek secara resmi berjalan bebas dalam mode *development*.

---

## 🛠️ Panduan Lengkap: Membuat REST API di Next.js App Router (Dengan Supabase)

Berbeda dengan proyek murni React, proyek Next.js memiliki Backend terintegrasi. Proyek kita menggunakan **Next.js App Router**, sehingga REST API dibangun secara spesifik di dalam lingkup direktori `app/api`.

Berikut merupakan panduan krusial dari hulu ke hilir untuk mendesain seonggok API untuk digunakan klien _frontend_.

### Langkah 1: Memahami Alur dan Struktur Folder Route
Setiap endpoint API mengikuti tata bahasa pemetaan _folder_ layaknya kerangka pada halaman biasa (*page.tsx*). Bedanya, nama file eksklusif untuk API harus diawetkan dengan **`route.ts`**.

Sebagai perumpamaan, kita hendak merancang REST API bernama `/api/peserta`:
1. Buat folder rekayasa bernama `peserta` di dalam ruang lingkup folder `app/api`.
2. Di dalam sana, sisipkan _file_ baru: `route.ts`.
*(Hierarki absolutnya menjadi mutlak begini: `app/api/peserta/route.ts`.)*

### Langkah 2: Menciptakan Endpoint `GET` (Mengambil Sekumpulan Data)
Terapkan fungsi bertendensi `GET` (huruf wajib dikapitalisasi) bila targetnya semata membaca entri riwayat tabel databasis. 
Tulis resep kode krusial ini dalam `route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Pastikan path impor merujuk eksak ke instansi supabase proyek.

export async function GET(request: Request) {
  try {
    // Aksi untuk melakukan kuari perolehan tabel 'participants' ke portal layanan Supabase
    const { data, error } = await supabase
      .from('participants')
      .select('*');

    // Mencegah dan menyampaikan error semisal tabel tidak dijumpai atau tak diizinkan
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Merespons balik pemohon dengan bungkusan JSON berisi data dan lampu hijau berstatus `200` (OK)
    return NextResponse.json(
      { message: "Data terambil sukses!", data: data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Musibah di lini internal", details: err.message },
      { status: 500 }
    );
  }
}
```

### Langkah 3: Berpindah Haluan Membuat Endpoint `POST` (Menerima Transmisi Data Rekam)
Serumpun di _file_ `route.ts` yang setaraf, Anda dibebaskan menyematkan fungsi `POST`. Kode krusialnya bertanggung jawab mengadopsi beban format dari si pengguna ke pangkalan data internal (*database*).

```typescript
export async function POST(request: Request) {
  try {
    // 1. Ekstrasi struktur balok data (JSON body) hasil unggahan Klien HTTP.
    const body = await request.json();
    const { nama, email, track } = body;

    // 2. Proteksi lapis primer guna mem-validasi isian (tidak boleh bolong)
    if (!nama || !email) {
      return NextResponse.json({ error: "Kolom Nama dan Email mutlak diisi." }, { status: 400 });
    }

    // 3. Tembakkan isian tersebut ke wadah databasis menggunakan klien autentik Supabase
    const { data, error } = await supabase
      .from('participants')
      .insert([{ nama, email, track }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Terbitkan rekam balasan berstatus 201 yang mengisyaratkan (Created/Tercipta) berhasil.
    return NextResponse.json(
      { message: "Registrasi individu sukses!", databaru: data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Skenario kiriman cacat atau format malfungsi." },
      { status: 400 }
    );
  }
}
```
> **Aturan Wajib:** Fungsi pemroses utama pantang diganti-namai. Harus taat huruf kapital identitas Method HTTP-nya (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

### Langkah 4: Panduan Eksperimen/Uji Coba (*Testing* API)

Untuk meneropong dan memverifikasi kesehatan jalan API Anda tidak usah susah-payah membangun wujud muka UI front-end terlebih dahulu. Anda diperkenankan mengeksplor _software_ komplementer layaknya **Postman**, **Insomnia**, atau peluasan VSCode berlabel **Thunder Client**.

**Untuk mengeksplorasi utilitas `GET`:**
1. Kondisikan _HTTP method selector_ menuju posisi `GET`.
2. Sematkan tujuan URL pada bilah alamat: `http://localhost:3000/api/peserta`
3. Hajar tombol eksekusi "Send". (Jika tabel `participants` valid dan konfigurasi tak melenceng, maka API bakal menyorongkan respons bertagar kode `200 OK` beriringan tatanan JSON rapi).

**Untuk mengeksplorasi pelontar Klien `POST`:**
1. Tentukan presisi _HTTP method_ bertanda `POST`.
2. Tetapkan URL pendaratan: `http://localhost:3000/api/peserta`
3. Migrasi ke _pane_ menu **Body** sentris, kemudian jatuhkan interaksi opsi pada **raw -> JSON**.
4. Isi gurat kosongnya menuruti payload prototipe ilustrasi ini:
   ```json
   {
       "nama": "Agus Salim",
       "email": "agus@bapel.com",
       "track": "UI/UX"
   }
   ```
5. Tekan pelatuk "Send". Jika nihil aral-melintang yang menghambat proses asinkronnya, antarmuka otomatis melaporkan *success message* dan lampu hijau bertitel *status `201 Created`*.
