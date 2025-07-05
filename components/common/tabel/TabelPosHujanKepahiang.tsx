"use client";
import React from "react";
import { Folder, X } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function DataKepahiang() {
  const router = useRouter();

  return (
    <Card style="bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl mt-6 ml-6 mr-6 relative">
      {/* Tombol Kembali (X) */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition"
        aria-label="Kembali"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <h2 className="text-xl font-bold text-gray-800 pr-6">
        Pos Hujan - Kepahiang (73)
      </h2>

      <div className="space-y-3">
        {/* Data Kabawetan */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/kepahiang/kebawetan")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Kabawetan <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Keban Agung */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/kepahiang/keban-agung")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Keban Agung <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Kelobak */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/kepahiang/kelobak")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Kelobak <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Muara Kemumu */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/kepahiang/muara-kemumu")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Muara Kemumu <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data PLTA Musi */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/kepahiang/plta-musi")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            PLTA Musi <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Seberang Musi */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/kepahiang/sebrang-musi")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Seberang Musi <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Tebat Karai */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/kepahiang/tebat-karai")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Tebat Karai <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Ujan Mas */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/kepahiang/ujan-mas")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Ujan Mas <span className="text-gray-600">(10)</span>
          </span>
        </Button>
      </div>
    </Card>
  );
}
