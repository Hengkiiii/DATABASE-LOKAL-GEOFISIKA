import React from "react";
import { CardStatistikGempaProps } from "@/interface/common/CardStatistikGempaProps";

// Komponen untuk menampilkan kartu statistik gempa
export default function CardStatistik({
  title, // Judul statistik (misal: "Total Gempa")
  count, // Nilai statistik (misal: 120)
  description, // Deskripsi tambahan di bawah angka (misal: "dalam 1 bulan terakhir")
  badge, // Lencana kecil di pojok kanan atas (opsional)
  color = "text-blue-600", // Warna angka utama, default biru
}: CardStatistikGempaProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 relative">
      {/* Menampilkan badge jika tersedia */}
      {badge && (
        <span className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
          {badge}
        </span>
      )}

      {/* Judul statistik */}
      <h2 className="text-gray-500 font-medium">{title}</h2>

      {/* Angka utama statistik dengan warna dinamis */}
      <p className={`text-4xl font-bold ${color}`}>{count}</p>

      {/* Deskripsi tambahan */}
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
