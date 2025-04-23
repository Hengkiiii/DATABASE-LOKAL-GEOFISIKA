import React from "react";
import TabelPenguapan from "@/components/common/TabelPenguapan";
import { dataPenguapan } from "@/constants/DataPenguapan";
import { Info } from "lucide-react";

export default function PenguapanPage() {
  return (
    <div className="p-6 space-y-4">
      {/* Info tambahan Data Terakhir */}
      <div className="p-4 rounded-lg bg-blue-100 text-blue-700 text-sm flex items-center gap-2">
        <Info size={20} />
        <span className="font-semibold">Informasi Penguapan Terakhir</span>:
        2023-09 | Total Penguapan: 6.0 mm
      </div>

      {/* Data Penguapan */}
      <TabelPenguapan dataPenguapan={dataPenguapan} />
    </div>
  );
}
