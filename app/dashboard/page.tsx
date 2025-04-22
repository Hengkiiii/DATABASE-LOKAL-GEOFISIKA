"use client";
import React from "react";
import CardStatistik from "@/components/common/CardStatistikGempa";
import { dataJumlahGempa } from "@/constants/DataJumlahGempa";
import ChartJumlahGempa from "@/components/common/ChartJumlahGempa";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4">
      {/* Notifikasi selamat datang */}
      <div className="bg-blue-100 border border-blue-300 text-blue-700 p-4 rounded">
        Selamat datang di halaman Dashboard BMKG Stasiun Geofisika Kepahiang.
      </div>

      {/* Kartu-kartu data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardStatistik
          title="Gempa"
          count="15,127"
          description="Semua Data Gempa"
          badge="Semua Data"
        />
        <CardStatistik
          title="Gempa"
          count="331"
          description="Gempa yang terjadi Tahun ini"
          badge="Tahun Ini"
          color="text-blue-500"
        />
        <CardStatistik
          title="Gempa"
          count="45"
          description="Gempa yang terjadi Bulan ini"
          badge="Bulan Ini"
          color="text-blue-500"
        />
        <CardStatistik
          title="Gempa"
          count="3"
          description="Gempa yang terjadi Hari ini"
          badge="Hari Ini"
          color="text-blue-500"
        />
      </div>

      {/* Info Gempa Terakhir dalam bentuk baris panjang */}
      <div className="mt-6 p-4 rounded bg-gray-50 text-gray-800 text-sm">
        <span className="text-red-600 font-semibold">Gempa Terakhir</span>:
        2025-04-15 02:58:45 | 237 km BaratDaya MUKOMUKO-BENGKULU{" "}
        <span className="italic">(-4.48, 100.15)</span> | Kedalaman 10 KM |
        Magnitudo 3.9 SR | MMI -
      </div>

      {/* Panggil Grafik Jumlah Gempa */}
      <ChartJumlahGempa data={dataJumlahGempa} />
    </div>
  );
}
