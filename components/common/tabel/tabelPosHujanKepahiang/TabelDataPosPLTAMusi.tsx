"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Download, Funnel, X } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import ModalEditPosHujan from "@/components/common/modalEdit/ModalEditPosHujan";
import ModalHapusPosHujan from "@/components/common/modalHapus/ModalHapusPosHujan";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { getDataPosHujanByCityVillage } from "@/lib/api/rain-gauge/rain-gauge-get-by-city-village/router";
import { deleteDataPosHujan } from "@/lib/api/rain-gauge/rain-gauge-delete/router";
import { getDataPosHujanByDate } from "@/lib/api/rain-gauge/rain-gauge-get-by-date/router";
import { getDataPosHujanById } from "@/lib/api/rain-gauge/rain-gauge-get-by-id/router";
import { updateRainGauge } from "@/lib/api/rain-gauge/rain-gauge-update/router";

interface PosHujan {
  id: number;
  date: string;
  name: string;
  file_url: string;
  city?: string;
  fileBase64: string;
  village?: string;
}

export default function TabelDataPosKebawetan() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filterRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<PosHujan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedData, setSelectedData] = useState<PosHujan | null>(null);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await getDataPosHujanByCityVillage(
        "Kepahiang",
        "PLTA Musi"
      );

      if (response && response.success && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
        toast.warning("Format data tidak valid");
      }
    } catch (error) {
      console.error("Gagal fetch data pos hujan:", error);
      toast.error("Gagal memuat data pos hujan");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by date
  const handleFilter = async () => {
    if (!startDate || !endDate) {
      toast.warning("Pilih tanggal mulai dan tanggal akhir");
      return;
    }

    try {
      setLoading(true);
      const response = await getDataPosHujanByDate(
        startDate,
        endDate,
        "Kepahiang",
        "PLTA Musi"
      );

      if (response && response.success && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
        toast.warning("Format data filter tidak valid");
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Gagal filter data:", error);
      toast.error("Gagal memfilter data berdasarkan tanggal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleFilter();
    } else if (!startDate && !endDate) {
      fetchAllData();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Edit handler
  const handleEditClick = async (item: PosHujan) => {
    try {
      if (!item.city || !item.village) {
        toast.error("Data kota atau desa tidak lengkap");
        return;
      }

      const details = await getDataPosHujanById(
        item.id.toString(),
        item.city,
        item.village
      );

      if (!details || details.length === 0) {
        toast.error("Data tidak ditemukan");
        return;
      }

      // Pilih objek yang sesuai dengan item.id dari array hasil response
      const detail = details.find((d: PosHujan) => d.id === item.id);

      if (!detail) {
        toast.error("Data detail tidak ditemukan");
        return;
      }

      setSelectedData(detail);
      setShowEditModal(true);
    } catch (error) {
      toast.error("Gagal memuat data untuk diedit");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedData) {
      console.log("handleSaveEdit: selectedData kosong");
      return;
    }

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      toast.error("User ID tidak ditemukan di sessionStorage.");
      console.error(
        "handleSaveEdit: user_id tidak ditemukan di sessionStorage"
      );
      return;
    }

    console.log("handleSaveEdit: mulai update data", {
      user_id,
      id: selectedData.id,
      dataUpdate: {
        date: selectedData.date,
        name: selectedData.name,
        file_url: selectedData.file_url,
        city: selectedData.city || "Kepahiang",
        village: selectedData.village || "PLTA Musi",
      },
    });

    try {
      setLoading(true);
      await updateRainGauge(selectedData.id.toString(), user_id, {
        date: selectedData.date,
        name: selectedData.name,
        file_url: selectedData.file_url,
        city: selectedData.city || "Kepahiang",
        village: selectedData.village || "PLTA Musi",
      });
      toast.success("Data berhasil diperbarui");
      setShowEditModal(false);
      setSelectedData(null);
      await fetchAllData();
    } catch (error) {
      console.error("handleSaveEdit: error saat update", error);
      toast.error("Gagal memperbarui data: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selectedData) return;
    try {
      setLoading(true);
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID tidak ditemukan di sessionStorage.");
        return;
      }
      await deleteDataPosHujan(selectedData.id, user_id);
      toast.success("Data pos hujan berhasil dihapus!");
      setShowDeleteModal(false);
      setSelectedData(null);

      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (err) {
      toast.error("Gagal menghapus data: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style="relative bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Pos Hujan - Kepahiang - PLTA Musi
        </h2>
        <div className="flex items-center gap-2">
          <Button
            icon={<Funnel size={18} />}
            onClick={() => setShowFilter((prev) => !prev)}
            buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
            title="Filter Tanggal"
          />
          <Button
            icon={<X size={17} />}
            onClick={() => router.back()}
            buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
            aria-label="Kembali"
          ></Button>

          {showFilter && (
            <div
              ref={filterRef}
              className="absolute right-0 top-12 z-50 bg-white border rounded-lg shadow-lg p-4 w-64 space-y-3"
            >
              <div className="flex flex-col text-sm">
                <label className="text-gray-600">Dari Tanggal:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border rounded"
                />
              </div>
              <div className="flex flex-col text-sm">
                <label className="text-gray-600">Sampai Tanggal:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-5 text-left">No.</th>
              <th className="py-3 px-5 text-left">Tanggal</th>
              <th className="py-3 px-5 text-left">Nama</th>
              <th className="py-3 px-5 text-center w-24">Unduh</th>
              <th className="py-3 px-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-5">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-5">{item.date}</td>
                  <td className="py-3 px-5">{item.name}</td>
                  <td className="py-3 px-5 text-center">
                    <a
                      href={item.file_url}
                      download
                      className="inline-flex items-center justify-center w-full h-full text-blue-600 hover:underline"
                    >
                      <Download size={20} />
                    </a>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex justify-center gap-3">
                      <Button
                        icon={<Pencil />}
                        onClick={() => handleEditClick(item)}
                        buttonStyle="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm shadow-md hover:scale-105 transition cursor-pointer"
                      />
                      <Button
                        icon={<Trash2 />}
                        onClick={() => {
                          setSelectedData(item);
                          setShowDeleteModal(true);
                        }}
                        buttonStyle="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow-md hover:scale-105 transition cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 pt-6">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          buttonStyle={`flex items-center gap-2 text-sm font-medium transition ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-black"
          }`}
          icon={<MdArrowBackIosNew size={18} className="mt-1" />}
        >
          Back
        </Button>

        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-medium shadow">
          {currentPage}
        </span>

        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          buttonStyle={`flex items-center gap-2 text-sm font-medium transition ${
            currentPage === totalPages || totalPages === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-black"
          }`}
          icon={<MdArrowForwardIos size={18} className="mt-1" />}
        >
          Next
        </Button>
      </div>

      {/* Modals */}
      <ModalEditPosHujan
        show={showEditModal}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        isDarkMode={false}
        setData={setSelectedData}
      />

      <ModalHapusPosHujan
        show={showDeleteModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </Card>
  );
}
