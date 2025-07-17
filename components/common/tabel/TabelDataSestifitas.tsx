"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Printer, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import InputField from "@/components/common/InputField";
import ModalEditDataSestifitas from "@/components/common/modalEdit/ModalEditDataSensifitas";
import ModalHapusDataSestifitas from "@/components/common/modalHapus/ModalHapusDataSestifitas";
import { getAllDataMicrothermor } from "@/lib/api/microthermor/microthermor-get-all/router";
import { getDataMicrothermorById } from "@/lib/api/microthermor/microthermor-get/router";
import { deleteDataMicrothermor } from "@/lib/api/microthermor/microthermor-delete/router";
import { updateDataMicrothermor } from "@/lib/api/microthermor/microthermor-update/router";
import { getMicrothermorByTDOM } from "@/lib/api/microthermor/microthermor-get-by-TDOM/router";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getImageBase64 } from "@/constants/imageToBase64";
import "react-toastify/dist/ReactToastify.css";

interface SensifitasData {
  id: number;
  lat: string;
  long: string;
  Fo: string;
  Ao: string;
  Tdom: string;
  Kg: string;
}

interface MicrothermorResponse {
  id: number;
  latitude: string;
  longitude: string;
  FO: string;
  AO: string;
  TDOM: string;
  KG: string;
}
interface TabelSeismisitasProps {
  reload?: boolean;
}

export default function TabelSeismisitas({ reload }: TabelSeismisitasProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [minTdom, setMinTdom] = useState("");
  const [maxTdom, setMaxTdom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filterRef = useRef<HTMLDivElement>(null);
  const [dataMicrothermor, setDataMicrothermor] = useState<SensifitasData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<SensifitasData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<SensifitasData | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const data = await getAllDataMicrothermor();
      const mapped = data.map((item) => ({
        id: item.id,
        lat: item.latitude,
        long: item.longitude,
        Fo: item.FO.toString(),
        Ao: item.AO.toString(),
        Tdom: item.TDOM.toString(),
        Kg: item.KG.toString(),
      }));

      setDataMicrothermor(mapped);
    } catch (error) {
      console.error("Gagal mengambil data semua:", error);
      toast.error("Gagal mengambil data semua");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [reload]);

  const fetchDataByTDOM = async () => {
    if (!minTdom || !maxTdom) {
      toast.warning("Masukkan nilai minimum dan maksimum TDOM");
      return;
    }

    try {
      setIsLoading(true);
      const data = await getMicrothermorByTDOM(minTdom, maxTdom);
      const mapped = data.map((item: MicrothermorResponse) => ({
        id: item.id,
        lat: item.latitude,
        long: item.longitude,
        Fo: item.FO,
        Ao: item.AO,
        Tdom: item.TDOM,
        Kg: item.KG,
      }));
      setDataMicrothermor(mapped);
      sessionStorage.setItem(
        "filteredMicrothermorData",
        JSON.stringify({
          data: mapped,
          filter: { minTdom, maxTdom },
        })
      );
      toast.success(`Data dengan TDOM ${minTdom}-${maxTdom} ditemukan`);
    } catch (error: unknown) {
      console.error("Gagal mengambil data:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data berdasarkan TDOM";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setShowFilter(false);
    }
  };
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
    doc.text("Laporan Data Peta Rawan Gempa (TDOM)", 105, 48, {
      align: "center",
    });

    if (minTdom && maxTdom) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Filter TDOM: ${minTdom} - ${maxTdom}`, 105, 55, {
        align: "center",
      });
    }

    const currentDate = new Date().toLocaleDateString("id-ID");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${currentDate}`, 105, 61, { align: "center" });

    const tableData = dataMicrothermor.map((item, index) => [
      index + 1,
      item.lat,
      item.long,
      item.Fo,
      item.Ao,
      item.Tdom,
      item.Kg,
    ]);

    autoTable(doc, {
      head: [
        [
          "No",
          "Latitude",
          "Longitude",
          "F0 (Hz)",
          "Ao (mm/s)",
          "Tdom (s)",
          "Kg",
        ],
      ],
      body: tableData,
      startY: 68,
      margin: { left: 10, right: 10 },
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
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });

    const fileName =
      minTdom && maxTdom
        ? `Laporan_Seismisitas_TDOM_${minTdom}_${maxTdom}.pdf`
        : "Laporan_Seismisitas_Semua_Data.pdf";

    doc.save(fileName);
  };
  const exportToExcel = () => {
    const worksheetData = dataMicrothermor.map((item, index) => ({
      No: index + 1,
      Latitude: item.lat,
      Longitude: item.long,
      "F0 (Hz)": item.Fo,
      "Ao (mm/s)": item.Ao,
      "Tdom (s)": item.Tdom,
      Kg: item.Kg,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Seismisitas");

    const fileName =
      minTdom && maxTdom
        ? `Laporan_Seismisitas_TDOM_${minTdom}_${maxTdom}.xlsx`
        : "Laporan_Seismisitas_Semua_Data.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    const savedFilter = sessionStorage.getItem("filteredMicrothermorData");
    if (savedFilter) {
      const { data, filter } = JSON.parse(savedFilter);
      setDataMicrothermor(data);
      setMinTdom(filter.minTdom);
      setMaxTdom(filter.maxTdom);
    } else {
      const savedData = sessionStorage.getItem("microthermorData");
      if (savedData) {
        setDataMicrothermor(JSON.parse(savedData));
      } else {
        fetchAllData();
      }
    }
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

  const totalPages = Math.ceil(dataMicrothermor.length / itemsPerPage);
  const paginatedData = dataMicrothermor.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = async (id: number) => {
    try {
      const item = await getDataMicrothermorById(id.toString());
      const mapped = {
        id: item.id,
        lat: item.latitude,
        long: item.longitude,
        Fo: item.FO,
        Ao: item.AO,
        Tdom: item.TDOM,
        Kg: item.KG,
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
      setIsLoading(true);
      await updateDataMicrothermor(selectedData.id.toString(), user_id, {
        latitude: selectedData.lat,
        longitude: selectedData.long,
        FO: selectedData.Fo,
        AO: selectedData.Ao,
        TDOM: selectedData.Tdom,
        KG: selectedData.Kg,
      });
      toast.success("Data microthermor berhasil diupdate!");
      setShowEditModal(false);
      setSelectedData(null);
      await fetchAllData();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui data";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      await deleteDataMicrothermor(dataToDelete.id.toString(), user_id);
      toast.success("Data microthermor berhasil dihapus!");
      setShowDeleteModal(false);
      setDataToDelete(null);
      await fetchAllData();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal menghapus data";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilter = async () => {
    await fetchAllData();
    setMinTdom("");
    setMaxTdom("");
    sessionStorage.removeItem("filteredMicrothermorData");
  };

  return (
    <Card style="relative bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Data Peta Rawan Gempa
        </h2>
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
            buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
          />
          {showFilter && (
            <div
              ref={filterRef}
              className="absolute right-0 top-12 z-50 bg-white border rounded-lg shadow-lg p-4 w-64 space-y-3"
            >
              <InputField
                label="TDOM Minimum:"
                type="number"
                value={minTdom}
                onChange={(e) => setMinTdom(e.target.value)}
              />
              <InputField
                label="TDOM Maksimum:"
                type="number"
                value={maxTdom}
                onChange={(e) => setMaxTdom(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={fetchDataByTDOM}
                  buttonStyle="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-md hover:scale-105 transition cursor-pointer"
                  title="Terapkan"
                />
                <Button
                  onClick={handleResetFilter}
                  buttonStyle="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium shadow-md hover:scale-105 transition cursor-pointer"
                  title="Reset"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">
            Sedang memuat data...
          </p>
        ) : (
          <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-5 text-left">No.</th>
                <th className="py-3 px-5 text-left">Latitude</th>
                <th className="py-3 px-5 text-left">Longitude</th>
                <th className="py-3 px-5 text-left">F0 (Hz)</th>
                <th className="py-3 px-5 text-left">Ao (mm/s)</th>
                <th className="py-3 px-5 text-left">Tdom (s)</th>
                <th className="py-3 px-5 text-left">Kg</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
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
                    <td className="py-3 px-5">{item.lat}</td>
                    <td className="py-3 px-5">{item.long}</td>
                    <td className="py-3 px-5">{item.Fo}</td>
                    <td className="py-3 px-5">{item.Ao}</td>
                    <td className="py-3 px-5">{item.Tdom}</td>
                    <td className="py-3 px-5">{item.Kg}</td>
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
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
      <ModalEditDataSestifitas
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />

      {/* Modal Hapus */}
      <ModalHapusDataSestifitas
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </Card>
  );
}
