"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMedia } from "react-use";
import Card from "@/components/common/Card";
import CardStatistik from "@/components/common/CardStatistikGempa";
import ChartJumlahGempa from "@/components/common/ChartJumlahGempa";

export default function Dashboard() {
  const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div
      className={`p-6 space-y-4 min-h-screen transition-colors ${
        isDarkMode ? "bg-[#18171F] text-gray-100" : "bg-[#f5f5f7] text-gray-800"
      }`}
    >
      {/* Kartu-kartu data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardStatistik
          title="Total Gempa"
          badge="Semua Data"
          color="text-blue-600"
          description="Total seluruh gempa yang tercatat"
          filterType="all"
        />

        <CardStatistik
          title="Gempa Tahun Ini"
          badge="Tahun Ini"
          color="text-red-600"
          description="Gempa yang terjadi tahun ini"
          filterType="year"
        />
        <CardStatistik
          title="Gempa Bulan Ini"
          badge="Bulan Ini"
          color="text-yellow-600"
          description="Gempa yang terjadi bulan ini"
          filterType="month"
        />
        <CardStatistik
          title="Gempa Hari Ini"
          badge="Hari Ini"
          color="text-green-600"
          description="Gempa yang terjadi hari ini"
          filterType="today"
        />
      </div>
      {/* Grafik Gempa dengan Filter Tahun */}
      <ChartJumlahGempa />

      {/* Info Gempa Terakhir */}
      <Card
        style={`mt-6 p-4 text-sm ${
          isDarkMode ? "bg-[#232136] text-gray-100" : "text-gray-800"
        }`}
      >
        <span className="text-red-600 font-semibold">Gempa Terakhir</span>:
        2025-04-15 02:58:45 | 237 km BaratDaya MUKOMUKO-BENGKULU{" "}
        <span className="italic">(-4.48, 100.15)</span> | Kedalaman 10 KM |
        Magnitudo 3.9 SR | MMI -
      </Card>
    </div>
  );
}
