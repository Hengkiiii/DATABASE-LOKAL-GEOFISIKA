"use client";
import React from "react";
import { Folder, X } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function DataLebong() {
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
        Pos Hujan - Lebong (73)
      </h2>

      <div className="space-y-3">
        {/* Data Kabawetan */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/bungin")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Bungin <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Keban Agung */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/gunung-alam")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Gunung Alam <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Kelobak */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/lemeu")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Lemeu <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Muara Kemumu */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/muara-aman")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Muara Aman / Tunggang <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data PLTA Musi */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/lebong/pinang-blapis")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Pinang Blapis <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Seberang Musi */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/rimbo")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Rimbo Pangadang <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Tebat Karai */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/simelo-atas")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Simelo Atas <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Ujan Mas */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/sukabumi")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Sukabumi <span className="text-gray-600">(10)</span>
          </span>
        </Button>
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/tapos")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Tapos <span className="text-gray-600">(10)</span>
          </span>
        </Button>
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/dashboard/pos-hujan/lebong/tes")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Tes<span className="text-gray-600">(10)</span>
          </span>
        </Button>
      </div>
    </Card>
  );
}
