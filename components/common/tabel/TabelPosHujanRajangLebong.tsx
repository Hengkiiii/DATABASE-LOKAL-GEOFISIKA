"use client";
import React from "react";
import { Folder, X } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function DataRajangLebong() {
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
        Pos Hujan - Rajang Lebong (90)
      </h2>

      <div className="space-y-3">
        {/* Data Kabawetan */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/air-bening")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Air Bening <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Keban Agung */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/air-pikat")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Air Pikat <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Kelobak */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/bengko")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Bengko <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Muara Kemumu */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/bukit-kaba")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Bukit Kaba <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data PLTA Musi */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/curup")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Curup <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Seberang Musi */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/curup-bipp")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Curup BIPP<span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Tebat Karai */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/mojorejo")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Mojorejo <span className="text-gray-600">(9)</span>
          </span>
        </Button>

        {/* Data Ujan Mas */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push(
              "/dashboard/pos-hujan/rajang-lebong/padang-ulak-tanding"
            )
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Padang Ulak Tanding <span className="text-gray-600">(10)</span>
          </span>
        </Button>
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/pal-8")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Pal 8 <span className="text-gray-600">(10)</span>
          </span>
        </Button>
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/pt-argo")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            PT Argo Th Bukit Daun <span className="text-gray-600">(10)</span>
          </span>
        </Button>
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer hover:bg-gray-50"
          onClick={() =>
            router.push("/dashboard/pos-hujan/rajang-lebong/stiper")
          }
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            STIPER <span className="text-gray-600">(10)</span>
          </span>
        </Button>
      </div>
    </Card>
  );
}
