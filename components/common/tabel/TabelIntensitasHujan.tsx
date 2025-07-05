"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Download, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ModalEditIntensitasHujan from "@/components/common/modalEdit/ModalEditIntesitasHujan";
import ModalHapusIntensitasHujan from "@/components/common/modalHapus/ModalHapusIntensitasHujan";
import InputField from "@/components/common/InputField";
import { getAllDataRainIntensity } from "@/lib/api/rain-intensity/rain-intensity-get-all/router";
import { updateDataRainIntensity } from "@/lib/api/rain-intensity/rain-intensity-update/router";
import { hapusDataRainIntensity } from "@/lib/api/rain-intensity/rain-intensity-delete/router";
import { getDataRainIntensityByDate } from "@/lib/api/rain-intensity/rain-intensity-get-all-by-date/router";
import { getDataRainIntensity } from "@/lib/api/rain-intensity/rain-intensity-get/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TableIntensitasHujan {
  id: number;
  name: string;
  tanggal: string;
  file_base64: string;
}
interface TableIntensitasHujanProps {
  reload?: boolean;
}

export default function TableIntensitasHujan({
  reload,
}: TableIntensitasHujanProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const filterRef = useRef<HTMLDivElement>(null);
  const [dataIntensitasHujan, setDataIntensitasHujan] = useState<
    TableIntensitasHujan[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<TableIntensitasHujan | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<TableIntensitasHujan | null>(
    null
  );

  useEffect(() => {
    fetchAllData();
  }, [reload]);
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getAllDataRainIntensity();
      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        tanggal: item.date,
        file_base64: item.file_base64,
      }));
      setDataIntensitasHujan(mapped);
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
      const data = await getDataRainIntensityByDate(startDate, endDate);
      console.log("Data API:", data);
      const mapped = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        tanggal: item.date,
        file_base64: item.file_base64,
      }));
      console.log("Data mapped:", mapped);
      setDataIntensitasHujan(mapped);
      sessionStorage.setItem("rainIntensityData", JSON.stringify(mapped));
      setCurrentPage(1);
    } catch (error) {
      console.error("Gagal filter data:", error);
      toast.error("Gagal memfilter data berdasarkan tanggal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(dataIntensitasHujan.length / itemsPerPage);
  const paginatedData = dataIntensitasHujan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = async (id: number) => {
    try {
      const item = await getDataRainIntensity(id);
      const mapped = {
        id: item.id,
        name: item.name,
        tanggal: item.date,
        file_base64: item.file_base64,
      };

      setSelectedData(mapped);
      setShowEditModal(true);
    } catch (error) {
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
      await updateDataRainIntensity(selectedData.id.toString(), user_id, {
        name: selectedData.name,
        date: selectedData.tanggal,
        file_base64: selectedData.file_base64,
      });
      toast.success("Data intensitas hujan berhasil diupdate!");
      setShowEditModal(false);
      setSelectedData(null);
      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (error: any) {
      toast.error("Gagal memperbarui data: " + error.message);
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
      await hapusDataRainIntensity(dataToDelete.id.toString(), user_id);
      toast.success("Data intensitas hujan berhasil dihapus!");
      setShowDeleteModal(false);
      setDataToDelete(null);
      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (error: any) {
      toast.error("Gagal menghapus data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style=" p-4 pb-4 space-y-4 shadow-xl rounded-2xl bg-white text-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Data Intensitas Hujan
          </h2>
          <div className="relative flex gap-2">
            <Button
              icon={<Funnel size={18} />}
              onClick={() => setShowFilter((prev) => !prev)}
              buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
            />
            {showFilter && (
              <div
                ref={filterRef}
                className="absolute right-0 top-12 z-50 border border-gray-200 rounded-lg shadow-lg p-4 w-64 bg-white space-y-3"
              >
                <InputField
                  label="Dari Tanggal:"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <InputField
                  label="Sampai Tanggal:"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <div className="flex justify-between gap-2 pt-2">
                  <Button
                    title="Terapkan"
                    onClick={handleFilter}
                    buttonStyle="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                  />
                  <Button
                    title="Reset"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      sessionStorage.removeItem("rainIntensityData");
                      fetchAllData();
                      setShowFilter(false);
                    }}
                    buttonStyle="flex-1 px-3 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg shadow"
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
              {paginatedData.length > 0 ? (
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
        <div className="flex justify-center items-center gap-4 ">
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
      </Card>
      <ModalEditIntensitasHujan
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />

      <ModalHapusIntensitasHujan
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
