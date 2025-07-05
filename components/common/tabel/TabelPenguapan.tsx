"use client";
import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Printer, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ModalEditPenguapan from "@/components/common/modalEdit/ModalEditPenguapan";
import ModalHapusPenguapan from "@/components/common/modalHapus/ModalHapusPenguapan";
import InputField from "@/components/common/InputField";
import { getEvaporationAll } from "@/lib/api/evaporation/evaporation-get-all/router";
import { getEvaporationByDate } from "@/lib/api/evaporation/evaporation-get-by-date/router";
import { getEvaporation } from "@/lib/api/evaporation/evaporation-get/router";
import { updateEvaporation } from "@/lib/api/evaporation/evaporation-update/router";
import { deleteEvaporation } from "@/lib/api/evaporation/evaporation-delete/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface PenguapanData {
  id: number;
  tanggal: string;
  penguapan: string;
}
interface ApiEvaporationItem {
  id: number;
  date: string;
  evaporation: string;
}

interface TabelPenguapanProps {
  reload?: boolean;
}

export default function TabelPenguapan({ reload }: TabelPenguapanProps) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [dataPenguapan, setDataPenguapan] = useState<PenguapanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<PenguapanData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<PenguapanData | null>(null);

  useEffect(() => {
    fetchAllData();
  }, [reload]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getEvaporationAll();
      const mapped = data.map((item: ApiEvaporationItem) => ({
        id: item.id,
        tanggal: item.date,
        penguapan: item.evaporation,
      }));
      setDataPenguapan(mapped);
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
      const data = await getEvaporationByDate(startDate, endDate);
      console.log("Data API:", data);
      const mapped = data.map((item: ApiEvaporationItem) => ({
        id: item.id,
        tanggal: item.date,
        penguapan: item.evaporation,
      }));
      setDataPenguapan(mapped);
      sessionStorage.setItem("evaporationData", JSON.stringify(mapped));
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laporan Data Penguapan", 105, 15, { align: "center" });
    if (startDate && endDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Periode: ${startDate} hingga ${endDate}`, 105, 25, {
        align: "center",
      });
    }
    const currentDate = new Date().toLocaleDateString();
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${currentDate}`, 105, 30, { align: "center" });
    const tableData = dataPenguapan.map((item, index) => [
      index + 1,
      item.tanggal,
      item.penguapan,
    ]);
    autoTable(doc, {
      head: [["No.", "Tanggal", "Penguapan (mm)"]],
      body: tableData,
      startY: 40,
      margin: { left: 30, right: 30 },
      styles: {
        cellPadding: 4,
        fontSize: 10,
        valign: "middle",
        halign: "center",
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
        font: "helvetica",
        fontStyle: "normal",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 11,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        font: "helvetica",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
    });
    const fileName =
      startDate && endDate
        ? `Laporan_Penguapan_${startDate}_${endDate}.pdf`
        : "Laporan_Penguapan_Semua_Data.pdf";
    doc.save(fileName);
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
  const totalPages = Math.ceil(dataPenguapan.length / itemsPerPage);
  const paginatedData = dataPenguapan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = async (id: string | number) => {
    try {
      const data = await getEvaporation(id);
      setSelectedData({
        id: data.id,
        tanggal: data.date,
        penguapan: data.evaporation,
      });
      setShowEditModal(true);
    } catch {
      toast.error("Gagal memuat data untuk diedit.");
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
      await updateEvaporation(user_id, selectedData.id.toString(), {
        date: selectedData.tanggal,
        evaporation: selectedData.penguapan,
      });
      toast.success("Data penguapan berhasil diupdate!");
      setShowEditModal(false);
      setSelectedData(null);
      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Gagal memperbarui data: " + error.message);
      } else {
        toast.error("Gagal memperbarui data: " + String(error));
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
      await deleteEvaporation(dataToDelete.id, user_id);
      toast.success("Data penguapan berhasil dihapus!");
      setShowDeleteModal(false);
      setDataToDelete(null);
      if (startDate && endDate) {
        await handleFilter();
      } else {
        await fetchAllData();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Gagal menghapus data: " + error.message);
      } else {
        toast.error("Gagal menghapus data: " + String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style=" p-4 pb-4 space-y-4 shadow-xl rounded-2xl bg-white text-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">Data Penguapan</h2>
          <div className="relative flex gap-2">
            <Button
              icon={<Printer />}
              onClick={generatePDF}
              buttonStyle="px-4 py-2 rounded-xl font-medium shadow-md hover:scale-105 transition cursor-pointer bg-gray-100 text-gray-700"
            />
            <Button
              icon={<Funnel size={18} />}
              onClick={() => setShowFilter((prev) => !prev)}
              buttonStyle="px-4 py-2 rounded-xl font-medium shadow-md hover:scale-105 transition cursor-pointer bg-gray-100 text-gray-700"
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
                      sessionStorage.removeItem("evaporationData");
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
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-5 text-left">No.</th>
                <th className="py-3 px-5 text-left">Tanggal</th>
                <th className="py-3 px-5 text-left">Penguapan (mm)</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Memuat data penguapan...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-teal-50 transition`}
                  >
                    <td className="py-3 px-5">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-5">{item.tanggal}</td>
                    <td className="py-3 px-5">{item.penguapan}</td>
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
                  <td colSpan={4} className="text-center py-4 text-gray-500">
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
      <ModalEditPenguapan
        show={showEditModal}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={(data) => setSelectedData(data)}
      />
      <ModalHapusPenguapan
        show={showDeleteModal}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
