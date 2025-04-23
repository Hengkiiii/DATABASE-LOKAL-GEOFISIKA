import React from "react";
import TabelHariHujan from "@/components/common/TabelHariHujan";
import { dataHariHujan } from "@/constants/DataHariHujan";

export default function HariHujanPage() {
  return (
    <div className="p-6 space-y-4">
      {/* Info tambahan Data Terakhir*/}
      <div className="p-4 rounded bg-gray-50 text-gray-800 text-sm">
        <span className="text-green-600 font-semibold">Data Terakhir</span>:
        2023-09 | Jumlah Hari Hujan: 22 hari
      </div>

      {/* Grafik Hari Hujan */}
      <TabelHariHujan data={dataHariHujan} />
    </div>
  );
}
