// app/hari-hujan/page.tsx

import React from "react";
import ChartHariHujan from "@/components/common/TabelHariHujan";
import { dataHariHujan } from "@/constants/DataHariHujan";

export default function HariHujanPage() {
  return (
    <div className="p-6 space-y-4">
      {/* Notifikasi Selamat Datang */}
      <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded">
        Selamat datang di halaman Statistik Hari Hujan BMKG Stasiun Geofisika
        Kepahiang.
      </div>

      {/* Info tambahan */}
      <div className="p-4 rounded bg-gray-50 text-gray-800 text-sm">
        <span className="text-green-600 font-semibold">Data Terakhir</span>:
        2023-09 | Jumlah Hari Hujan: 22 hari
      </div>

      {/* Grafik Hari Hujan */}
      <ChartHariHujan data={dataHariHujan} />
    </div>
  );
}
