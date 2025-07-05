"use client";
import React from "react";
import { Folder } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function DataPetirList() {
  const router = useRouter();

  return (
    <Card style="bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl mt-6 ml-6 mr-6">
      <h2 className="text-xl font-bold text-gray-800">Data Petir (170)</h2>

      <div className="space-y-3">
        {/* Folder 1 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/geofisika/petir/dataPetirIKL")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            IKL <span className="text-gray-600">(35)</span>
          </span>
        </Button>

        {/* Folder 2 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/geofisika/petir/dataPetirKML")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            KML <span className="text-gray-600">(22)</span>
          </span>
        </Button>

        {/* Folder 3 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/geofisika/petir/dataPetirLDC")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            LDC <span className="text-gray-600">(18)</span>
          </span>
        </Button>

        {/* Folder 4 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() =>
            router.push("/dashboard/geofisika/petir/dataPetirSummaries")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Summaries <span className="text-gray-600">(29)</span>
          </span>
        </Button>

        {/* Folder 5 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/geofisika/petir/dataPetirCSV")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            CSV <span className="text-gray-600">(30)</span>
          </span>
        </Button>

        {/* Folder 6 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/geofisika/petir/dataPetirSRF")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            SRF <span className="text-gray-600">(36)</span>
          </span>
        </Button>
      </div>
    </Card>
  );
}
