"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Funnel, Printer } from "lucide-react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import InputField from "@/components/common/InputField";
import ModalEditLamaPenyinaran from "@/components/common/modalEdit/ModalEditLamaPenyinaranMatahari";
import ModalHapusLamaPenyinaran from "@/components/common/modalHapus/ModalHapusLamaPenyinaran";
import { getSunshineDuration } from "@/lib/api/Sunshine-duration/sunshine-duration-get/router";
import { updateSunshineDuration } from "@/lib/api/Sunshine-duration/sunshine-duration-update/router";
import { deleteSunshineDuration } from "@/lib/api/Sunshine-duration/sunshine-duration-delete/router";
import { getSunshineDurationAll } from "@/lib/api/Sunshine-duration/sunshine-duration-get-all/router";
import { getSunshineDurationByDate } from "@/lib/api/Sunshine-duration/sunshine-duration-get-by-date/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface TabelLamaPenyinaran {
  id: number;
  date: number;
  sunshine_duration: string;
}
interface TabelLamaPenyinaranProps {
  reload?: boolean;
}

export default function TabelLamaPenyinaran({
  reload,
}: TabelLamaPenyinaranProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const filterRef = useRef<HTMLDivElement>(null);
  const [dataLamaPenyinaran, setDataLamaPenyinaran] = useState<
    TabelLamaPenyinaran[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<TabelLamaPenyinaran | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<TabelLamaPenyinaran | null>(
    null
  );

  useEffect(() => {
    fetchAllData();
  }, [reload]);
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getSunshineDurationAll();
      const mapped = data.map((item: any) => ({
        id: item.id,
        date: item.date,
        sunshine_duration: item.sunshine_duration,
      }));
      setDataLamaPenyinaran(mapped);
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
      const data = await getSunshineDurationByDate(startDate, endDate);
      console.log("Data API:", data);
      const mapped = data.map((item: any) => ({
        id: item.id,
        date: item.date,
        sunshine_duration: item.sunshine_duration,
      }));
      setDataLamaPenyinaran(mapped);
      sessionStorage.setItem("sunshineDurationData", JSON.stringify(mapped));
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

  const totalPages = Math.ceil(dataLamaPenyinaran.length / itemsPerPage);
  const paginatedData = dataLamaPenyinaran.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laporan Data Lama Penyinaran Matahari", 105, 15, {
      align: "center",
    });
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

    const tableData = dataLamaPenyinaran.map((item, index) => [
      index + 1,
      item.date,
      item.sunshine_duration,
    ]);

    autoTable(doc, {
      head: [["No.", "Tanggal", "Lama Penyinaran Matahari"]],
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
        ? `Laporan_Data_Lama_Penyinaran_${startDate}_${endDate}.pdf`
        : "Laporan_Data_Lama_Penyinaran_Semua_Data.pdf";
    doc.save(fileName);
  };
  const handleEditClick = async (id: number) => {
    try {
      const data = await getSunshineDuration(id);
      const mapped = {
        id: data.id,
        date: data.date,
        sunshine_duration: data.sunshineDuration,
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
      await updateSunshineDuration(selectedData.id.toString(), user_id, {
        date: selectedData.date,
        sunshine_duration: selectedData.sunshine_duration,
      });
      toast.success("Data suhu udara maksimum berhasil diupdate!");
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
      await deleteSunshineDuration(dataToDelete.id.toString(), user_id);
      toast.success("Data lama penyinaran berhasil dihapus!");
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
            Data Lama Penyinaran Matahari
          </h2>
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
                      sessionStorage.removeItem("sunshineDurationData");
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
                <th className="py-3 px-5 text-center">Lama Penyinaran (Jam)</th>
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
                    <td className="py-3 px-5">{item.date}</td>
                    <td className="py-3 px-5 text-center">
                      {item.sunshine_duration} jam
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
      <ModalEditLamaPenyinaran
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />
      <ModalHapusLamaPenyinaran
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
