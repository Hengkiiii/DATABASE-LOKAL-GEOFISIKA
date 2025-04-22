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
  const tahunList = Array.from(new Set(data.map((d) => d.tahun))).sort();
  const [tahunDipilih, setTahunDipilih] = useState(
    tahunList[tahunList.length - 1]
  );

  const dataTahun = data.filter((d) => d.tahun === tahunDipilih);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
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

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataTahun}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="jumlah" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
