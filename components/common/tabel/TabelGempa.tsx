"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Printer, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import InputField from "@/components/common/InputField";
import ModalEditGempa from "@/components/common/modalEdit/ModalEditDataGempa";
import ModalHapusGempa from "@/components/common/modalHapus/ModalHapusDataGempa";
import { getEarthquakeAll } from "@/lib/api/earthquake/earthquake-get-all/router";
import { getEarthquake } from "@/lib/api/earthquake/earthquake-get/router";
import { deleteEarthquake } from "@/lib/api/earthquake/earthquake-delete/router";
import { updateEarthquake } from "@/lib/api/earthquake/earthquake-update/router";
import { getDataGempaByDate } from "@/lib/api/earthquake/earthquake-get-by-all-data/router";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface GempaData {
  id: number;
  dateTime: string;
  lintang: string;
  bujur: string;
  kedalaman: number;
  magnitudo: number;
  mmi: string | null;
  keterangan: string;
  observer: string;
}
interface TabelGempaProps {
  reload?: boolean;
}

export default function TabelGempa({ reload }: TabelGempaProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [magnitudeMin, setMagnitudeMin] = useState("");
  const [magnitudeMax, setMagnitudeMax] = useState("");
  const [depthMin, setDepthMin] = useState("");
  const [depthMax, setDepthMax] = useState("");
  const [longitudeMin, setLongitudeMin] = useState("");
  const [longitudeMax, setLongitudeMax] = useState("");
  const [latitudeMin, setLatitudeMin] = useState("");
  const [latitudeMax, setLatitudeMax] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mmiMin, setMmiMin] = useState("");
  const [mmiMax, setMmiMax] = useState("");
  const itemsPerPage = 7;
  const filterRef = useRef<HTMLDivElement>(null);
  const [gempaData, setGempaData] = useState<GempaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<GempaData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<GempaData | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getEarthquakeAll();
      const item = data.map((item: any) => {
        return {
          id: item.id,
          dateTime: item.date_time,
          lintang: item.latitude,
          bujur: item.longitude,
          kedalaman: item.depth,
          magnitudo: item.magnitude,
          mmi: item.mmi,
          keterangan: item.description,
          observer: item.observer_name,
        };
      });
      setGempaData(item);
    } catch (error) {
      toast.error("Gagal mengambil data gempa");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const isAnyFilterActive =
        startDate ||
        endDate ||
        magnitudeMin ||
        magnitudeMax ||
        depthMin ||
        depthMax ||
        latitudeMin ||
        latitudeMax ||
        longitudeMin ||
        longitudeMax ||
        mmiMin ||
        mmiMax;
      if (isAnyFilterActive) {
        if (mmiMin || mmiMax) {
          const validMMI = [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X",
          ];
          if (
            (mmiMin && !validMMI.includes(mmiMin.toUpperCase())) ||
            (mmiMax && !validMMI.includes(mmiMax.toUpperCase()))
          ) {
            toast.error("MMI harus menggunakan huruf Romawi antara I sampai X");
            return;
          }
        }
        const data = await getDataGempaByDate(
          startDate || "",
          endDate || "",
          magnitudeMin || "",
          magnitudeMax || "",
          depthMin || "",
          depthMax || "",
          latitudeMin || "",
          latitudeMax || "",
          longitudeMin || "",
          longitudeMax || "",
          mmiMin.toUpperCase() || "",
          mmiMax.toUpperCase() || ""
        );
        if (data.success) {
          const items = data.data.map((item: any) => ({
            id: item.id,
            dateTime: item.date_time || `${item.date} ${item.time}`,
            lintang: item.latitude,
            bujur: item.longitude,
            kedalaman: item.depth,
            magnitudo: item.magnitude,
            mmi: item.mmi,
            keterangan: item.description,
            observer: item.observer_name,
          }));
          setGempaData(items);
          sessionStorage.setItem("filteredGempaData", JSON.stringify(items));
        } else {
          toast.error(data.message || "Gagal memfilter data");
        }
      } else {
        await fetchAllData();
      }
    } catch (error) {
      toast.error((error as Error).message || "Gagal memfilter data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [reload]);

  const totalPages = Math.ceil(gempaData.length / itemsPerPage);
  const paginatedData = gempaData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laporan Data Gempa", 148.5, 15, { align: "center" });
    if (startDate && endDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Periode: ${startDate} hingga ${endDate}`, 148.5, 25, {
        align: "center",
      });
    }
    const currentDate = new Date().toLocaleDateString();
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${currentDate}`, 148.5, 30, { align: "center" });
    const tableData = gempaData.map((item, index) => [
      index + 1,
      new Date(item.dateTime).toLocaleString("id-ID"),
      item.lintang || "-",
      item.bujur || "-",
      item.kedalaman?.toString() || "-",
      item.magnitudo?.toString() || "-",
      item.mmi || "-",
      item.keterangan || "-",
      item.observer || "-",
    ]);
    autoTable(doc, {
      head: [
        [
          "No.",
          "Tanggal",
          "Lintang",
          "Bujur",
          "Kedalaman (km)",
          "Magnitudo",
          "MMI",
          "Keterangan",
          "Observer",
        ],
      ],
      body: tableData,
      startY: 40,
      margin: { left: 15, right: 15 },
      styles: {
        fontSize: 9,
        font: "helvetica",
        cellPadding: 3,
        overflow: "linebreak",
        valign: "middle",
        halign: "center",
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
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
        7: { cellWidth: 70 },
        8: { cellWidth: 30 },
      },
    });

    const fileName =
      startDate && endDate
        ? `Laporan_Data_Gempa_${startDate}_${endDate}.pdf`
        : "Laporan_Data_Gempa_Semua_Data.pdf";
    doc.save(fileName);
  };

  const handleEditClick = async (data: GempaData) => {
    try {
      const detail = await getEarthquake(data.id.toString());
      const item = {
        id: detail.id,
        dateTime: detail.waktu,
        lintang: detail.latitude,
        bujur: detail.longitude,
        kedalaman: detail.kedalaman,
        magnitudo: detail.magnitude,
        mmi: detail.mmi,
        keterangan: detail.deskripsi,
        observer: detail.observer_name,
      };
      setSelectedData(item);
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
      await updateEarthquake(user_id, selectedData.id.toString(), {
        date_time: selectedData.dateTime,
        latitude: selectedData.lintang,
        longitude: selectedData.bujur,
        depth: selectedData.kedalaman,
        magnitude: selectedData.magnitudo,
        mmi: selectedData.mmi,
        description: selectedData.keterangan,
        observer_name: selectedData.observer,
      });
      toast.success("Data berhasil diperbarui");
      setShowEditModal(false);
      setSelectedData(null);
      await fetchAllData();
    } catch (error) {
      toast.error("Gagal memperbarui data: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!dataToDelete) return;
    try {
      setLoading(true);
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID tidak ditemukan di sessionStorage.");
        return;
      }
      await deleteEarthquake(dataToDelete.id, user_id);
      toast.success("Data tekanan udara berhasil dihapus!");
      setShowDeleteModal(false);
      setDataToDelete(null);
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
    <>
      <Card style=" p-4 pb-4 space-y-4 shadow-xl rounded-2xl bg-white text-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Data Gempa</h2>
          <div className="relative flex gap-2">
            <Button
              icon={<Printer />}
              buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
              onClick={generatePDF}
            />
            <Button
              icon={<Funnel size={18} />}
              onClick={() => setShowFilter((prev) => !prev)}
              buttonStyle="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium shadow-md hover:scale-105 transition cursor-pointer"
            />
            {showFilter && (
              <div
                ref={filterRef}
                className="absolute right-0 top-12 z-50 bg-white border rounded-lg shadow-lg p-4 w-[520px] grid grid-cols-2 gap-4"
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
                <InputField
                  label="Magnitudo Min:"
                  type="number"
                  step="0.1"
                  value={magnitudeMin}
                  onChange={(e) => setMagnitudeMin(e.target.value)}
                />
                <InputField
                  label="Magnitudo Max:"
                  type="number"
                  step="0.1"
                  value={magnitudeMax}
                  onChange={(e) => setMagnitudeMax(e.target.value)}
                />
                <InputField
                  label="Kedalaman Min (km):"
                  type="number"
                  value={depthMin}
                  onChange={(e) => setDepthMin(e.target.value)}
                />
                <InputField
                  label="Kedalaman Max (km):"
                  type="number"
                  value={depthMax}
                  onChange={(e) => setDepthMax(e.target.value)}
                />
                <InputField
                  label="Bujur Minimum:"
                  type="number"
                  value={longitudeMin}
                  onChange={(e) => setLongitudeMin(e.target.value)}
                />
                <InputField
                  label="Bujur Maksimum:"
                  type="number"
                  value={longitudeMax}
                  onChange={(e) => setLongitudeMax(e.target.value)}
                />
                <InputField
                  label="Lintang Minimum:"
                  type="number"
                  value={latitudeMin}
                  onChange={(e) => setLatitudeMin(e.target.value)}
                />
                <InputField
                  label="Lintang Maksimum:"
                  type="number"
                  value={latitudeMax}
                  onChange={(e) => setLatitudeMax(e.target.value)}
                />
                <InputField
                  label="MMI Min:"
                  type="text"
                  value={mmiMin}
                  onChange={(e) => setMmiMin(e.target.value)}
                />
                <InputField
                  label="MMI Max:"
                  type="text"
                  value={mmiMax}
                  onChange={(e) => setMmiMax(e.target.value)}
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
                      sessionStorage.removeItem("filteredGempaData");
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
                <th className="py-3 px-5 text-left">Waktu</th>
                <th className="py-3 px-5 text-left">Lintang</th>
                <th className="py-3 px-5 text-left">Bujur</th>
                <th className="py-3 px-5 text-left">Kedalaman (km)</th>
                <th className="py-3 px-5 text-left">Magnitudo</th>
                <th className="py-3 px-5 text-left">MMI</th>
                <th className="py-3 px-5 text-left">Keterangan</th>
                <th className="py-3 px-5 text-left">Observer</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    Memuat data...
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
                    <td className="py-3 px-5">{item.dateTime}</td>
                    <td className="py-3 px-5">{item.lintang}</td>
                    <td className="py-3 px-5">{item.bujur}</td>
                    <td className="py-3 px-5">{item.kedalaman}</td>
                    <td className="py-3 px-5">{item.magnitudo}</td>
                    <td className="py-3 px-5">{item.mmi || "-"}</td>
                    <td className="py-3 px-5">{item.keterangan}</td>
                    <td className="py-3 px-5">{item.observer}</td>
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
                  <td colSpan={10} className="text-center py-4 text-gray-500">
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
      <ModalEditGempa
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />
      <ModalHapusGempa
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
