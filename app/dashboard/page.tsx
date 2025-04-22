// app/dashboard/page.tsx (atau halaman Dashboard-mu)
"use client";
import React from "react";
import CardStatistik from "@/components/common/CardStatistikGempa";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4">
      {/* Notifikasi selamat datang */}
      <div className="bg-blue-100 border border-blue-300 text-blue-700 p-4 rounded">
        Selamat datang di halaman Dashboard BMKG Stasiun Geofisika Kepahiang.
      </div>

      {/* Kartu-kartu data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          color="text-teal-500"
        />
        <CardStatistik
          title="Gempa"
          count="45"
          description="Gempa yang terjadi Bulan ini"
          badge="Bulan Ini"
          color="text-green-500"
        />
      </div>
    </div>
  );
}
