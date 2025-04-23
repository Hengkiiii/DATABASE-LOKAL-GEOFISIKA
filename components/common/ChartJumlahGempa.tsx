"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartJumlahGempaProps } from "@/interface/common/ChartJumlahGempaProps";

export default function ChartJumlahGempa({ data }: ChartJumlahGempaProps) {
  // Mengambil daftar tahun unik dari data dan mengurutkannya
  const tahunList = Array.from(new Set(data.map((d) => d.tahun))).sort();

  // Menyimpan tahun terakhir sebagai default pilihan
  const [tahunDipilih, setTahunDipilih] = useState(
    tahunList[tahunList.length - 1]
  );

  // Menyaring data hanya untuk tahun yang dipilih
  const dataTahun = data.filter((d) => d.tahun === tahunDipilih);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      {/* Bagian header dengan judul dan dropdown untuk memilih tahun */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">
          Jumlah Gempa per Bulan
        </h2>
        <select
          value={tahunDipilih}
          onChange={(e) => setTahunDipilih(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {tahunList.map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>
      </div>

      {/* Container untuk menampilkan chart dengan ukuran responsif */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataTahun}>
          {/* Garis bantu pada grid chart */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Sumbu X menampilkan nama bulan */}
          <XAxis dataKey="bulan" />

          {/* Sumbu Y menampilkan jumlah gempa */}
          <YAxis />

          {/* Tooltip saat hover pada bar */}
          <Tooltip />

          {/* Legend atau keterangan pada chart */}
          <Legend />

          {/* Bar chart dengan warna biru */}
          <Bar dataKey="jumlah" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
