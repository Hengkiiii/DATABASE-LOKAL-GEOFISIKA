"use client";
import React, { useState } from "react";
import { TableHariHujanProps } from "@/interface/common/TableHariHujanProp";
import { Pencil, Trash2, Plus, Search, Printer } from "lucide-react";

export default function TableHariHujan({ data }: TableHariHujanProps) {
  // State untuk menyimpan input pencarian
  const [search, setSearch] = useState("");

  // Melakukan filter data berdasarkan nilai pencarian pada kolom tanggal
  const filteredData = data.filter((item) =>
    item.tanggal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
      {/* Header dan tombol kontrol */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Hari Hujan</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* Tombol tambah */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:scale-105 transition transform">
            <Plus size={18} /> Tambah
          </button>

          {/* Input pencarian */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari tanggal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Tombol cetak */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl shadow-md hover:bg-gray-200 transition">
            <Printer size={18} /> Cetak
          </button>
        </div>
      </div>

      {/* Tabel data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-5 text-left">No.</th>
              <th className="py-3 px-5 text-left">Tanggal</th>
              <th className="py-3 px-5 text-left">Hari Hujan</th>
              <th className="py-3 px-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* Jika ada data hasil pencarian, tampilkan */}
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-5">{index + 1}</td>
                  <td className="py-3 px-5">{item.tanggal}</td>
                  <td className="py-3 px-5">{item.hariHujan}</td>
                  <td className="py-3 px-5">
                    <div className="flex justify-center gap-3">
                      {/* Tombol edit */}
                      <button className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg shadow-md transition transform hover:scale-105">
                        <Pencil size={16} />
                      </button>
                      {/* Tombol hapus */}
                      <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition transform hover:scale-105">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Jika tidak ada data, tampilkan pesan
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
