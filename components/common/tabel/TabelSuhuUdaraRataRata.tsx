import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Printer, Funnel } from "lucide-react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import InputField from "@/components/common/InputField";
import ModalEditSuhuUdaraRataRata from "@/components/common/modalEdit/ModalEditSuhuUdaraRataRata";
import ModalHapusSuhuUdaraRataRata from "@/components/common/modalHapus/ModalHapusSuhuUdaraRataRata";
import { getAverageTemperatureAll } from "@/lib/api/average-temperature/average-temperature-get-all/router";
import { getAverageTemperatureByDate } from "@/lib/api/average-temperature/average-temperature-get-by-date/router";
import { getAverageTemperature } from "@/lib/api/average-temperature/average-temperature-get/router";
import { updateAverageTemperature } from "@/lib/api/average-temperature/average-temperature-update/router";
import { deleteAverageTemperature } from "@/lib/api/average-temperature/average-temperature-delete/router";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface TabelSuhuUdaraRataRata {
  id: number;
  tanggal: string;
  temperaturPagi: number;
  temperatureSiang: number;
  temperatureSore: number;
  temperaturUdara: number;
}
interface TabelSuhuUdaraRataRataProps {
  reload?: boolean;
}
interface ApiAverageTemperature {
  id: number;
  date: string;
  avg_temperature_07: number;
  avg_temperature_13: number;
  avg_temperature_18: number;
}

export default function TabelSuhuUdaraRataRata({
  reload,
}: TabelSuhuUdaraRataRataProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const filterRef = useRef<HTMLDivElement>(null);
  const [averageTemperatureData, setAverageTemperatureData] = useState<
    TabelSuhuUdaraRataRata[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] =
    useState<TabelSuhuUdaraRataRata | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] =
    useState<TabelSuhuUdaraRataRata | null>(null);

  useEffect(() => {
    fetchAllData();
  }, [reload]);
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await getAverageTemperatureAll();
      const mapped = data.map((item: ApiAverageTemperature) => {
        const pagi = Number(item.avg_temperature_07) || 0;
        const siang = Number(item.avg_temperature_13) || 0;
        const sore = Number(item.avg_temperature_18) || 0;
        const rataRataRaw = (pagi + siang + sore) / 3;
        const rataRata = isNaN(rataRataRaw)
          ? 0
          : parseFloat(rataRataRaw.toFixed(2));
        return {
          id: item.id,
          tanggal: item.date,
          temperaturPagi: pagi,
          temperatureSiang: siang,
          temperatureSore: sore,
          temperaturUdara: rataRata,
        };
      });
      setAverageTemperatureData(mapped);
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
      const data = await getAverageTemperatureByDate(startDate, endDate);
      const mapped = data.map((item: ApiAverageTemperature) => {
        console.log("Item:", item);
        const pagi = item.avg_temperature_07;
        const siang = item.avg_temperature_13;
        const sore = item.avg_temperature_18;
        const rataRataRaw = (pagi + siang + sore) / 3;
        const rataRata = isNaN(rataRataRaw)
          ? 0
          : parseFloat(rataRataRaw.toFixed(2));
        return {
          id: item.id,
          date: item.date,
          temperaturPagi: pagi,
          temperatureSiang: siang,
          temperatureSore: sore,
          temperaturUdara: rataRata,
        };
      });
      setAverageTemperatureData(mapped);
      sessionStorage.setItem("averageTemperatureData", JSON.stringify(mapped));
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
  const totalPages = Math.ceil(averageTemperatureData.length / itemsPerPage);
  const paginatedData = averageTemperatureData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Laporan Data Suhu Udara Rata-Rata", 105, 15, { align: "center" });
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
    const tableData = averageTemperatureData.map((item, index) => [
      index + 1,
      item.tanggal,
      item.temperaturPagi.toFixed(2) + "°C",
      item.temperatureSiang.toFixed(2) + "°C",
      item.temperatureSore.toFixed(2) + "°C",
      item.temperaturUdara.toFixed(2) + "°C",
    ]);
    autoTable(doc, {
      head: [
        [
          "No.",
          "Tanggal",
          "Suhu Pagi",
          "Suhu Siang",
          "Suhu Sore",
          "Suhu Udara Rata-rata",
        ],
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
        ? `Laporan_Suhu_Udara_Rata-Rata_${startDate}_${endDate}.pdf`
        : "Laporan_Suhu_Udara_Rata-Rata_Semua_Data.pdf";
    doc.save(fileName);
  };

  const handleEditClick = async (data: TabelSuhuUdaraRataRata) => {
    try {
      const detail = await getAverageTemperature(data.id);
      const mapped = {
        id: detail.id,
        tanggal: detail.tanggal,
        temperaturPagi: detail.suhuUdaraPagi,
        temperatureSiang: detail.SuhuUdaraSiang,
        temperatureSore: detail.suhuUdaraSore,
        temperaturUdara: detail.suhuUdara,
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
      await updateAverageTemperature(user_id, selectedData.id.toString(), {
        avg_temperature_07: selectedData.temperaturPagi,
        avg_temperature_13: selectedData.temperatureSiang,
        avg_temperature_18: selectedData.temperatureSore,
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
      await deleteAverageTemperature(dataToDelete.id, user_id);
      toast.success("Data suhu rata-rata berhasil dihapus!");
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
            Data Suhu Udara Rata-rata
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
                      sessionStorage.removeItem("averageTemperatureData");
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
        <div className="overflow-x-auto" id="printable-table">
          <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-5 text-left">No.</th>
                <th className="py-3 px-5 text-left">Tanggal</th>
                <th className="py-3 px-5 text-center">07.00</th>
                <th className="py-3 px-5 text-center">13.00</th>
                <th className="py-3 px-5 text-center">18.00</th>
                <th className="py-3 px-5 text-center">Suhu Udara Rata-rata</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
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
                    <td className="py-3 px-5">{item.tanggal}</td>
                    <td className="py-3 px-5 text-center">
                      {item.temperaturPagi}°C
                    </td>
                    <td className="py-3 px-5 text-center">
                      {item.temperatureSiang}°C
                    </td>
                    <td className="py-3 px-5 text-center">
                      {item.temperatureSore}°C
                    </td>
                    <td className="py-3 px-5 text-center">
                      {(
                        (item.temperaturPagi +
                          item.temperatureSiang +
                          item.temperatureSore) /
                        3
                      ).toFixed(2)}
                      °C
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
      <ModalEditSuhuUdaraRataRata
        show={showEditModal}
        isDarkMode={false}
        data={selectedData}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        setData={setSelectedData}
      />
      <ModalHapusSuhuUdaraRataRata
        show={showDeleteModal}
        isDarkMode={false}
        data={dataToDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </>
  );
}
