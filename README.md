
---

# 🌍 DATABASE LOKAL GEOFISIKA

*Dashboard data geofisika lokal interaktif berbasis web — mendukung pemantauan & eksplorasi data stasiun BMKG.*

> Digunakan secara operasional oleh **BMKG Stasiun Geofisika Bengkulu** sejak 2025.

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdatabase-lokal-geofisika-theta.vercel.app%2F\&label=Demo\&up_color=green\&style=flat-square)](https://database-lokal-geofisika-theta.vercel.app/)
[![Stars](https://img.shields.io/github/stars/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA?style=flat-square)](https://github.com/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA/stargazers)
[![Forks](https://img.shields.io/github/forks/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA?style=flat-square)](https://github.com/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA/network)
[![Last Commit](https://img.shields.io/github/last-commit/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA?style=flat-square)](https://github.com/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA/commits/main)

![Platform](https://img.shields.io/badge/platform-Web-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/built%20with-Next.js-000000?logo=nextdotjs\&style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white\&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript\&logoColor=white\&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwindcss\&logoColor=white\&style=flat-square)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-brightgreen?logo=leaflet\&logoColor=white\&style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel\&logoColor=white\&style=flat-square)

---

## 🌐 Demo <a id="demo"></a>

Coba langsung: **[https://database-lokal-geofisika-theta.vercel.app](https://database-lokal-geofisika-theta.vercel.app)** (hosted on Vercel)

---

## 🚀 Fitur <a id="fitur"></a>

| Modul                        | Deskripsi                                                      |
| ---------------------------- | -------------------------------------------------------------- |
| **Peta Interaktif**          | Pemetaan lokasi stasiun geofisika seluruh Indonesia            |
| **Filter Dinamis**           | Filter berdasarkan jenis stasiun: Seismik, Magnetik, Gravitasi |
| **Detail Stasiun**           | Klik marker untuk melihat metadata (kode, koordinat, status)   |
| **Antarmuka Ringan & Cepat** | Dibangun dengan Next.js + Tailwind untuk kecepatan maksimal    |
| **Mode Responsif**           | Tampilan optimal di desktop maupun mobile                      |
| **Mode Gelap/Terang**        | Dukungan UI Dark Mode otomatis                                 |

---

## ⚙️ Teknologi <a id="teknologi"></a>

| Layer           | Stack                                          |
| --------------- | ---------------------------------------------- |
| **Frontend**    | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Peta**        | Leaflet 1.9, React‑Leaflet 4                   |
| **Data**        | File statis JSON/GeoJSON atau REST API         |
| **CI & Deploy** | GitHub Actions, Vercel Edge Runtime            |

---

## 🛠️ Instalasi <a id="instalasi"></a>

```bash
# Klon repo
$ git clone https://github.com/BhinnekaDev/DATABASE-LOKAL-GEOFISIKA.git
$ cd DATABASE-LOKAL-GEOFISIKA

# Instal dependensi
$ npm install
```

Buat file **`.env.local`**:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.kamu.com/api
```

Jalankan mode development:

```bash
$ npm run dev
```

Akses **[http://localhost:3000](http://localhost:3000)**

---

## 🖥️ Penggunaan <a id="penggunaan"></a>

1. Pilih jenis stasiun dari dropdown (Seismik, Magnetik, Gravitasi).
2. Klik marker untuk melihat info metadata stasiun.
3. Navigasi dengan peta interaktif dan mini-map.
4. Ubah tema terang/gelap sesuai preferensi perangkat.

---

## 🔌 Struktur Data <a id="data"></a>

* **`/data/stations.json`** — Data utama stasiun (id, nama, lat/lon, jenis)
* **`/public/geojson/*.geojson`** — Layer tambahan (opsional)
* **API URL** — Diset melalui `NEXT_PUBLIC_API_BASE_URL`

---

## 🤝 Kontribusi <a id="kontribusi"></a>

1. Fork ➜ branch ➜ coding
2. Commit deskriptif dan rapi
3. Jalankan `npm run lint` sebelum PR
4. Submit Pull Request

---

## 📜 Lisensi <a id="lisensi"></a>

MIT © 2025 [Bhinneka Dev](https://github.com/BhinnekaDev)

---

<p align="center">
  <img alt="Cuplikan Dashboard" src="https://github.com/user-attachments/assets/238eb111-a465-46b4-bb4f-ac5df2cce9c4" width="80%" />
</p>

<p align="center"><sub>Bhinneka Developer © 2025</sub></p>

---
