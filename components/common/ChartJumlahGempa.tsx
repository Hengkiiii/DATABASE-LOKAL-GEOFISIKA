"use client";
import React from "react";
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
import { ChartJumlahGempaProps } from "./ChartJumlahGempaProps";

export default function ChartJumlahGempa({ data }: ChartJumlahGempaProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-center text-gray-700 font-semibold mb-4">
        Jumlah Gempa yang terjadi Sepanjang Tahun 2025
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" />
          <YAxis
            label={{
              value: "Jumlah Gempa",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="jumlah" fill="#ff5722" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
