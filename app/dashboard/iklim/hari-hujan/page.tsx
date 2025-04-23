import React from "react";
import TabelHariHujan from "@/components/common/TabelHariHujan";
import { dataHariHujan } from "@/constants/DataHariHujan";
import { Info } from "lucide-react"; // Jika menggunakan ikon

export default function HariHujanPage() {
  return (
    <div className="p-6 space-y-4">
      {/* Info tambahan Data Terakhir*/}
      <div className="p-4 rounded-lg bg-blue-100 text-blue-700 text-sm flex items-center gap-2">
        <Info size={20} />
        <span className="font-semibold">Data Terakhir</span>: 2023-09 | Jumlah
        Hari Hujan: 22 hari
      </div>

      {/* Data Hari Hujan */}
      <TabelHariHujan dataHariHujan={dataHariHujan} />
    </div>
  );
}
