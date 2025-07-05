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
      <h2 className="text-xl font-bold text-gray-800">Pos Hujan (243)</h2>

      <div className="space-y-3">
        {/* Folder 1 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/pos-hujan/kepahiang")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Kepahiang <span className="text-gray-600">(73)</span>
          </span>
        </Button>

        {/* Folder 2 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/pos-hujan/rajang-lebong")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Rajang Lebong <span className="text-gray-600">(90)</span>
          </span>
        </Button>

        {/* Folder 3 */}
        <Button
          type="button"
          buttonStyle="flex items-center gap-3 p-3 rounded-lg border border-gray-200 w-full text-left cursor-pointer"
          onClick={() => router.push("/dashboard/pos-hujan/lebong")}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-gray-800 font-medium">
            Lebong <span className="text-gray-600">(80)</span>
          </span>
        </Button>
      </div>
    </Card>
  );
}
