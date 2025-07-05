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
import autoTable from "jspdf-autotable";

interface TabelHariHujan {
    id: string;
    date: string;
    rainyDay: string;
}
interface TabelHariHujanProps {
    reload?: boolean;
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
    const [selectedData, setSelectedData] = useState<TabelHariHujan | null>(
        null
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<TabelHariHujan | null>(
        null
    );

    useEffect(() => {
        fetchAllData();
    }, [reload]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const data = await getRainyDaysAll();
            const mapped = data.map((item: any) => ({
                id: item.id,
                date: item.date,
                rainyDay: item.rainy_day,
            }));
            setDataHariHujan(mapped);
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
            const data = await getRainyDaysByDate(startDate, endDate);
            const mapped = data.map((item: any) => ({
                id: item.id,
                date: item.date,
                rainyDay: item.rainyDay,
            }));
            setDataHariHujan(mapped);
            sessionStorage.setItem("rainyDaysData", JSON.stringify(mapped));
            setShowFilter(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(e.target as Node)
            ) {
                setShowFilter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const totalPages = Math.ceil(dataHariHujan.length / itemsPerPage);
    const paginatedData = dataHariHujan.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Laporan Data Hari Hujan", 105, 15, { align: "center" });
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

        const tableData = dataHariHujan.map((item, index) => [
            index + 1,
            item.date,
            item.rainyDay,
        ]);

        autoTable(doc, {
            head: [["No.", "Tanggal", "Hari Hujan"]],
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
                ? `Laporan_Hari_Hujan_${startDate}_${endDate}.pdf`
                : "Laporan_Hari_Hujan_Semua_Data.pdf";
        doc.save(fileName);
    };

    const handleEditClick = async (id: string) => {
        try {
            const item = await getRainyDay(id);
            const mapped = {
                id: item.id,
                date: item.date,
                rainyDay: item.rainyDay,
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
            toast.error("User ID tidak ditemukan");
            return;
        }
        try {
            setLoading(true);
            await updateRainyDay(selectedData.id.toString(), user_id, {
                date: selectedData.date,
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
                    <h2 className="text-2xl font-bold">Data Hari Hujan</h2>
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
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
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
                                            sessionStorage.removeItem(
                                                "rainyDaysData"
                                            );
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
                                <th className="py-3 px-5 text-left">
                                    Hari Hujan
                                </th>
                                <th className="py-3 px-5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        Memuat data hari hujan...
                                    </td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        } hover:bg-teal-50 transition`}
                                    >
                                        <td className="py-3 px-5">
                                            {(currentPage - 1) * itemsPerPage +
                                                index +
                                                1}
                                        </td>
                                        <td className="py-3 px-5">
                                            {item.date}
                                        </td>
                                        <td className="py-3 px-5">
                                            {item.rainyDay}
                                        </td>
                                        <td className="py-3 px-5">
                                            <div className="flex justify-center gap-3">
                                                <Button
                                                    icon={<Pencil />}
                                                    buttonStyle="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm shadow-md hover:scale-105 transition cursor-pointer"
                                                    onClick={() =>
                                                        handleEditClick(item.id)
                                                    }
                                                />
                                                <Button
                                                    icon={<Trash2 />}
                                                    onClick={() => {
                                                        setDataToDelete(item);
                                                        setShowDeleteModal(
                                                            true
                                                        );
                                                    }}
                                                    buttonStyle="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow-md hover:scale-105 transition cursor-pointer"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center gap-4 ">
                    <Button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
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
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
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
