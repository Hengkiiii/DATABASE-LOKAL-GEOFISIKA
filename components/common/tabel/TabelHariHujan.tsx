"use client";
import React, { useState, useRef, useEffect } from "react";
import { Printer, Pencil, Trash2, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import InputField from "@/components/common/InputField";
import ModalEditHariHujan from "@/components/common/modalEdit/ModalEditHariHujan";
import ModalHapus from "@/components/common/modalHapus/ModalHapusHariHujan";
import { getRainyDaysAll } from "@/lib/api/rainy-days/rainy-days-get-all/router";
import { getRainyDay } from "@/lib/api/rainy-days/rainy-days-get/router";
import { getRainyDaysByDate } from "@/lib/api/rainy-days/rainy-daysget-by-date/router";
import { deleteRainyDay } from "@/lib/api/rainy-days/rainy-days-delete/router";
import { updateRainyDay } from "@/lib/api/rainy-days/rainy-days-update/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { getImageBase64 } from "@/constants/imageToBase64";
import autoTable from "jspdf-autotable";

interface TabelHariHujan {
  id: number;
  date: string;
  rainyDay: string;
}
interface TabelHariHujanProps {
  reload?: boolean;
}
interface RainyDayAPIResponse {
  id: number;
  date: string;
  rainy_day: string;
}

export default function TableHariHujan({ reload }: TabelHariHujanProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const filterRef = useRef<HTMLDivElement>(null);
  const [dataHariHujan, setDataHariHujan] = useState<TabelHariHujan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<TabelHariHujan | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<TabelHariHujan | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [reload]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getRainyDaysAll();
      const mapped: TabelHariHujan[] = data.map(
        (item: RainyDayAPIResponse) => ({
          id: item.id,
          date: item.date,
          rainyDay: item.rainy_day,
        })
      );
      setDataHariHujan(mapped);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      toast.warning("Pilih periode mulai dan periode akhir");
      return;
    }
    try {
      setLoading(true);

      // Ubah startDate dan endDate jadi YYYY-MM-DD
      const start = `${startDate}-01`; // contoh: 2025-09 → 2025-09-01
      const end = new Date(
        parseInt(endDate.split("-")[0]), // tahun
        parseInt(endDate.split("-")[1]), // bulan (1-12)
        0 // hari ke-0 = hari terakhir bulan sebelumnya
      )
        .toISOString()
        .slice(0, 10); // hasil 2025-10-31

      const data = await getRainyDaysByDate(start, end);

      const mapped: TabelHariHujan[] = data.map(
        (item: RainyDayAPIResponse) => ({
          id: item.id,
          date: item.date,
          rainyDay: item.rainy_day,
        })
      );

      setDataHariHujan(mapped);
      sessionStorage.setItem("rainyDaysData", JSON.stringify(mapped));
      setShowFilter(false);
    } catch {
      toast.error("Gagal memuat data untuk difilter");
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
  const totalPages = Math.ceil(dataHariHujan.length / itemsPerPage);
  const paginatedData = dataHariHujan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const logoBase64 = await getImageBase64("/LogoBMKG.png");
    doc.addImage(logoBase64, "PNG", 0, 10, 40, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA", 105, 16, {
      align: "center",
    });

    doc.setFontSize(13);
    doc.text("STASIUN GEOFISIKA KLAS III KEPAHIANG BENGKULU", 105, 23, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "Jl. Pembangunan No. 156 Pasar Ujung Kepahiang - Bengkulu  Telp: (0732)391267",
      105,
      29,
      { align: "center" }
    );
    doc.text(
      "Fax: (0732)391600 / (0732)391578  Kode Pos 39172  E-Mail : stageof.kepahiang@bmkg.go.id",
      105,
      34,
      { align: "center" }
    );
    doc.setLineWidth(0.8);
    doc.line(0, 38, 220, 38);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Laporan Data Hari Hujan", 105, 48, { align: "center" });
    if (startDate && endDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(
        `Periode: ${formatDate(startDate)} hingga ${formatDate(endDate)}`,
        105,
        55,
        {
          align: "center",
        }
      );
    }

    const currentDate = new Date().toLocaleDateString("id-ID");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${currentDate}`, 105, 61, { align: "center" });
    const tableData = dataHariHujan.map((item, index) => [
      index + 1,
      formatDate(item.date),
      item.rainyDay,
    ]);
    autoTable(doc, {
      head: [["No.", "Bulan", "Hari Hujan"]],
      body: tableData,
      startY: 68,
      margin: { left: 15, right: 15 },
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: "middle",
        halign: "center",
        font: "helvetica",
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 10,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });

    const fileName =
      startDate && endDate
        ? `Laporan_Hari_Hujan_${startDate}_${endDate}.pdf`
        : "Laporan_Hari_Hujan_Semua_Data.pdf";

    doc.save(fileName);
  };

  const exportToExcel = () => {
    const worksheetData = dataHariHujan.map((item, index) => ({
      No: index + 1,
      Bulan: formatDate(item.date), // ✅ Bulan + Tahun
      "Hari Hujan": item.rainyDay,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Hari Hujan");

    const fileName =
      startDate && endDate
        ? `Laporan_Hari_Hujan_${startDate}_${endDate}.xlsx`
        : "Laporan_Hari_Hujan_Semua_Data.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  const handleEditClick = async (id: string) => {
    try {
      const item = await getRainyDay(id);
      const mapped = {
        id: item.id,
        date: item.date.slice(0, 7), // ambil hanya "YYYY-MM"
        rainyDay: item.rainyDay,
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
      toast.error("User ID tidak ditemukan");
      return;
    }

    try {
      setLoading(true);

      // Pastikan format date = YYYY-MM-DD
      const normalizedDate =
        selectedData.date.length === 7
          ? `${selectedData.date}-01`
          : selectedData.date;

      await updateRainyDay(selectedData.id.toString(), user_id, {
        date: normalizedDate,
        rainy_day: selectedData.rainyDay,
      });

      toast.success("Data berhasil diupdate!");
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
        toast.error("Terjadi kesalahan saat memperbarui data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!dataToDelete) return;
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      toast.error("User ID tidak ditemukan");
      return;
    }
    try {
      setLoading(true);
      await deleteRainyDay(dataToDelete.id.toString(), user_id);
      toast.success("Data berhasil dihapus!");
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
        toast.error("Terjadi kesalahan saat menghapus data");
      }
    }
  };
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  return (
    <>
      <Card style=" p-4 pb-4 space-y-4 shadow-xl rounded-2xl bg-white text-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">Data Hari Hujan</h2>
          <div className="relative flex gap-2">
            <Button
              icon={<Printer />}
              buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
              onClick={() => setShowExportOptions((prev) => !prev)}
            />
            {showExportOptions && (
              <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg w-40 z-50">
                <button
                  onClick={() => {
                    generatePDF();
                    setShowExportOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-t-lg cursor-pointer hover:bg-gray-100"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    exportToExcel();
                    setShowExportOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-b-lg cursor-pointer hover:bg-gray-100"
                >
                  Download Excel
                </button>
              </div>
            )}
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
                  label="Dari Periode:"
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <InputField
                  label="Sampai Periode:"
                  type="month"
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
                      sessionStorage.removeItem("rainyDaysData");
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
                <th className="py-3 px-5 text-left">Bulan</th>
                <th className="py-3 px-5 text-left">Hari Hujan</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Memuat data hari hujan...
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
                    <td className="py-3 px-5">{formatDate(item.date)}</td>
                    <td className="py-3 px-5">{item.rainyDay}</td>
                    <td className="py-3 px-5">
                      <div className="flex justify-center gap-3">
                        <Button
                          icon={<Pencil />}
                          buttonStyle="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm shadow-md hover:scale-105 transition cursor-pointer"
                          onClick={() => handleEditClick(item.id.toString())}
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
      <ModalEditHariHujan
        show={showEditModal}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />
      <ModalHapus
        show={showDeleteModal}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
