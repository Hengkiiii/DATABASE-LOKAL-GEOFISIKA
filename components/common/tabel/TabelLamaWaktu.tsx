"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Download, Funnel, Printer } from "lucide-react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import ModalEditTandaWaktu from "@/components/common/modalEdit/ModalEditLamaWaktu";
import ModalHapusTandaWaktu from "@/components/common/modalHapus/ModalHapusTandaWaktu";
import { getAllDataTimeSignature } from "@/lib/api/time-signature/time-signature-get-all/router";
import { updateDataTimeSignature } from "@/lib/api/time-signature/time-signature-update/router";
import { hapusDataTimeSignature } from "@/lib/api/time-signature/time-signature-delete/router";
import { getDataTimeSignatureByDate } from "@/lib/api/time-signature/time-signature-get-by-date/router";
import { getDataTimeSignatureById } from "@/lib/api/time-signature/time-signature-get/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TabelLamaWaktu {
  id: number;
  name: string;
  tanggal: string;
  file_base64: string;
}
interface ApiTimeSignatureItem {
  id: number;
  name: string;
  date: string;
  file_base64: string;
}

export default function TableTandaWaktu() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filterRef = useRef<HTMLDivElement>(null);
  const [dataLamaWaktu, setDataLamaWaktu] = useState<TabelLamaWaktu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<TabelLamaWaktu | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<TabelLamaWaktu | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getAllDataTimeSignature();
      const mapped = data.map((item: ApiTimeSignatureItem) => ({
        id: item.id,
        name: item.name,
        tanggal: item.date,
        file_base64: item.file_base64,
      }));
      setDataLamaWaktu(mapped);
    } catch (error) {
      console.error("Gagal mengambil data semua:", error);
      toast.error("Gagal mengambil data semua");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      toast.warning("Pilih tanggal mulai dan tanggal akhir");
      return;
    }

    try {
      setLoading(true);
      const data = await getDataTimeSignatureByDate(startDate, endDate);
      console.log("Data API:", data);
      const mapped = data.map((item: ApiTimeSignatureItem) => ({
        id: item.id,
        name: item.name,
        tanggal: item.date,
        file_base64: item.file_base64,
      }));
      console.log("Data mapped:", mapped);
      setDataLamaWaktu(mapped);
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
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const totalPages = Math.ceil(dataLamaWaktu.length / itemsPerPage);
  const paginatedData = dataLamaWaktu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = async (id: number) => {
    try {
      const item = await getDataTimeSignatureById(id);
      const mapped = {
        id: item.id,
        name: item.name,
        tanggal: item.date,
        file_base64: item.file_base64,
      };

      setSelectedData(mapped);
      setShowEditModal(true);
    } catch {
      toast.error("Gagal memuat data untuk diedit");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedData) return;
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      toast.error("User ID tidak ditemukan di sessionStorage.");
      return;
    }
    try {
      setLoading(true);
      await updateDataTimeSignature(selectedData.id.toString(), user_id, {
        name: selectedData.name,
        date: selectedData.tanggal,
        file_base64: selectedData.file_base64,
      });
      toast.success("Data Tanda Waktu berhasil diupdate!");
      setShowEditModal(false);
      setSelectedData(null);
      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      if (error instanceof Error) {
        toast.error("Gagal memperbarui data: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!dataToDelete) return;

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      toast.error("User ID tidak ditemukan di sessionStorage.");
      return;
    }

    try {
      setLoading(true);
      await hapusDataTimeSignature(dataToDelete.id.toString(), user_id);
      toast.success("Data Tanda Waktu berhasil dihapus!");
      setShowDeleteModal(false);
      setDataToDelete(null);
      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      if (error instanceof Error) {
        toast.error("Gagal menghapus data: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style="bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl mt-6 ml-6 mr-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Tanda Waktu</h2>
        <div className="flex flex-wrap gap-2 relative">
          <Button
            icon={<Printer />}
            buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition"
          />
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition"
            title="Filter Tanggal"
          >
            <Funnel size={18} />
          </button>
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
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded"
                />
              </div>
              <div className="flex flex-col text-sm">
                <label className="text-gray-600">Sampai Tanggal:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
                  Sedang memuat data...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-5">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-5">{item.tanggal}</td>
                  <td className="py-3 px-5">{item.name}</td>
                  <td className="py-3 px-5 text-center">
                    <a
                      href={item.file_base64}
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
                        buttonStyle="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm shadow-md hover:scale-105 transition cursor-pointer"
                        onClick={() => handleEditClick(item.id)}
                      />
                      <Button
                        icon={<Trash2 />}
                        onClick={() => {
                          setDataToDelete(item);
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
          disabled={currentPage === totalPages}
          buttonStyle={`flex items-center gap-2 text-sm font-medium transition ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-black"
          }`}
        >
          Next
          <MdArrowForwardIos size={18} className="mt-1" />
        </Button>
      </div>
      {/* Modal Edit */}
      <ModalEditTandaWaktu
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />

      {/* Modal Hapus */}
      <ModalHapusTandaWaktu
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </Card>
  );
}
