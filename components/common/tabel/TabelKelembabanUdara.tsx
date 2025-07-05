import React, { useState, useRef, useEffect } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Pencil, Trash2, Printer, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import InputField from "@/components/common/InputField";
import ModalEditKelembaban from "@/components/common/modalEdit/ModalEditKelembabanUdara";
import ModalHapusKelembaban from "@/components/common/modalHapus/ModalHapusKelembabanUdara";
import { getAllHumidityAll } from "@/lib/api/humidity/getHumidityAll/router";
import { getHumidityByDate } from "@/lib/api/humidity/getHumidityByDate/router";
import { getHumidity } from "@/lib/api/humidity/getHumidity/router";
import { updateHumidity } from "@/lib/api/humidity/put/router";
import { deleteHumidity } from "@/lib/api/humidity/delete/router";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
interface HumidityData {
  id: string;
  tanggal: string;
  kelembabanPagi: number;
  kelembabanSiang: number;
  kelembabanSore: number;
  kelembabanRataRata: number;
}
interface ApiHumidityItem {
  id: string;
  date: string;
  humidity_07: number;
  humidity_13: number;
  humidity_18: number;
}
interface KelembabanProps {
  reload?: boolean;
}

export default function TabelKelembaban({ reload }: KelembabanProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const filterRef = useRef<HTMLDivElement>(null);
  const [humidityData, setHumidityData] = useState<HumidityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState<HumidityData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<HumidityData | null>(null);

  useEffect(() => {
    fetchAllData();
  }, [reload]);
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data: ApiHumidityItem[] = await getAllHumidityAll();
      const mapped: HumidityData[] = data.map((item) => {
        const pagi = Number(item.humidity_07) || 0;
        const siang = Number(item.humidity_13) || 0;
        const sore = Number(item.humidity_18) || 0;
        const rataRataRaw = (pagi + siang + sore) / 3;
        const rataRata = isNaN(rataRataRaw)
          ? 0
          : parseFloat(rataRataRaw.toFixed(2));
        return {
          id: item.id,
          tanggal: item.date,
          kelembabanPagi: pagi,
          kelembabanSiang: siang,
          kelembabanSore: sore,
          kelembabanRataRata: rataRata,
        };
      });
      setHumidityData(mapped);
    } catch {
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
      const data = await getHumidityByDate(startDate, endDate);
      const mapped = data.map((item: any) => {
        const pagi = item.humidity_07;
        const siang = item.humidity_13;
        const sore = item.humidity_18;
        const rataRataRaw = (pagi + siang + sore) / 3;
        const rataRata = isNaN(rataRataRaw)
          ? 0
          : parseFloat(rataRataRaw.toFixed(2));
        return {
          id: item.id,
          tanggal: item.date,
          kelembabanPagi: pagi,
          kelembabanSiang: siang,
          kelembabanSore: sore,
          kelembabanRataRata: rataRata,
        };
      });
      setHumidityData(mapped);
      sessionStorage.setItem("humidityData", JSON.stringify(mapped));
      setCurrentPage(1);
    } catch {
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
  const totalPages = Math.ceil(humidityData.length / itemsPerPage);
  const paginatedData = humidityData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laporan Data Kelembaban", 105, 15, { align: "center" });
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

    const tableData = humidityData.map((item, index) => [
      index + 1,
      item.tanggal,
      `${item.kelembabanPagi}%`,
      `${item.kelembabanSiang}%`,
      `${item.kelembabanSore}%`,
      isNaN(item.kelembabanRataRata) ? "-" : `${item.kelembabanRataRata}%`,
    ]);

    autoTable(doc, {
      head: [
        ["No.", "Tanggal", "07:00", "13:00", "18:00", "Rata-Rata Kelembaban"],
      ],
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
        ? `Laporan_Kelembaban_${startDate}_${endDate}.pdf`
        : "Laporan_Kelembaban_Semua_Data.pdf";
    doc.save(fileName);
  };

  const handleEditClick = async (data: HumidityData) => {
    try {
      const detail = await getHumidity(data.id);
      const mapped = {
        id: detail.id,
        tanggal: detail.tanggal,
        kelembabanPagi: detail.kelembabanPagi,
        kelembabanSiang: detail.kelembabanSiang,
        kelembabanSore: detail.kelembabanSore,
        kelembabanRataRata: detail.kelembabanRataRata,
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
      await updateHumidity(user_id, selectedData.id.toString(), {
        humidity_07: selectedData.kelembabanPagi,
        humidity_13: selectedData.kelembabanSiang,
        humidity_18: selectedData.kelembabanSore,
        date: selectedData.tanggal,
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
      await deleteHumidity(dataToDelete.id, user_id);
      toast.success("Data kelembaban berhasil dihapus!");
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
          <h2 className="text-2xl font-bold text-gray-800">
            Data Kelembaban Udara
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
                      sessionStorage.removeItem("humidityData");
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
                <th className="py-3 px-5 text-left">07:00</th>
                <th className="py-3 px-5 text-left">13:00</th>
                <th className="py-3 px-5 text-left">18:00</th>
                <th className="py-3 px-5 text-left">Rata-Rata Kelembaban</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Memuat data Kelembaban...
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
                    <td className="py-3 px-5">{item.kelembabanPagi}%</td>
                    <td className="py-3 px-5">{item.kelembabanSiang}%</td>
                    <td className="py-3 px-5">{item.kelembabanSore}%</td>
                    <td className="py-3 px-16">
                      {isNaN(item.kelembabanRataRata)
                        ? "-"
                        : item.kelembabanRataRata}
                      %
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
                  <td colSpan={7} className="text-center py-4 text-gray-500">
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
      <ModalEditKelembaban
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />
      <ModalHapusKelembaban
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
