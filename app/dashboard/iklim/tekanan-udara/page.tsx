"use client";
import { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelTekananUdara from "@/components/common/tabel/TabelTekananUdara";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tambahDataAirPressure } from "@/lib/api/air-pressure/air-pressure-insert/router";
import { tambahDataTekananUdaraExcel } from "@/lib/api/air-pressure/air-pressure-insert-excel/router";

export default function TekananUdaraPage() {
    const { isOpenModal, setIsOpenModal } = useModal();
    const [tanggal, setTanggal] = useState("");
    const [tekanan07, setTekanan07] = useState("");
    const [tekanan13, setTekanan13] = useState("");
    const [tekanan18, setTekanan18] = useState("");
    const [inputType, setInputType] = useState("manual");
    const [file, setFile] = useState<File | null>(null);
    const [fileBase64, setFileBase64] = useState("");
    const [reload, setReload] = useState(false);
    const handleReload = () => setReload(!reload);

    const resetForm = () => {
        setTanggal("");
        setTekanan07("");
        setTekanan13("");
        setTekanan18("");
        setFile(null);
        setFileBase64("");
        setInputType("manual");
    };

    // Convert file ke base64 untuk upload otomatis
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    const base64String = reader.result.split(",")[1];
                    setFileBase64(base64String);
                }
            };
            reader.onerror = (error) => {
                console.error("Error membaca file:", error);
                toast.error("Gagal membaca file");
            };
        }
    };

    const handleManualSubmit = async () => {
        try {
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan, silakan login ulang");
                return;
            }

            if (!tanggal || !tekanan07 || !tekanan13 || !tekanan18) {
                toast.error("Harap isi semua field");
                return;
            }
            const tekanan07Num = Number(tekanan07);
            const tekanan13Num = Number(tekanan13);
            const tekanan18Num = Number(tekanan18);
            const totalAirPressure =
                (tekanan07Num + tekanan13Num + tekanan18Num) / 3;
            await tambahDataAirPressure(
                user_id,
                totalAirPressure,
                tekanan07Num,
                tekanan13Num,
                tekanan18Num,
                tanggal
            );

            toast.success("Data tekanan udara berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error) {
            console.error("Gagal menambahkan data tekanan udara:", error);
            toast.error("Gagal menambahkan data tekanan udara");
        }
    };

    const handleExcelSubmit = async () => {
        try {
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan, silakan login ulang");
                return;
            }
            if (!fileBase64) {
                toast.error("Silakan upload file terlebih dahulu");
                return;
            }

            await tambahDataTekananUdaraExcel(user_id, fileBase64);
            toast.success("Data tekanan udara dari file berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error) {
            console.error(
                "Gagal menambahkan data tekanan udara dari file:",
                error
            );
            toast.error("Gagal menambahkan data dari file");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
                <TabelTekananUdara reload={reload} />
                <Modal
                    title="Tambah Data Tekanan Udara"
                    isOpen={isOpenModal}
                    onClose={() => {
                        setIsOpenModal(false);
                        resetForm();
                    }}
                >
                    {/* Tabs Jenis Input */}
                    <div className="flex justify-center gap-8 px-6 pt-4">
                        <Button
                            type="button"
                            setOpenModal={() => setInputType("manual")}
                            buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold transition-all duration-300 ${
                                inputType === "manual"
                                    ? "text-teal-600 underline underline-offset-4"
                                    : "text-gray-500 hover:text-teal-500"
                            } cursor-pointer`}
                            text="Input Manual"
                        />
                        <Button
                            type="button"
                            setOpenModal={() => setInputType("otomatis")}
                            buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold transition-all duration-300 ${
                                inputType === "otomatis"
                                    ? "text-teal-600 underline underline-offset-4"
                                    : "text-gray-500 hover:text-teal-500"
                            } cursor-pointer`}
                            text="Input Otomatis"
                        />
                    </div>

                    {/* Input Manual */}
                    <div
                        className={`space-y-4 mt-6 px-6 transition-all duration-500 ease-in-out ${
                            inputType === "manual"
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2 pointer-events-none absolute"
                        }`}
                    >
                        <InputField
                            label="Tanggal"
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                        />
                        <InputField
                            label="Tekanan Udara 07:00 (hPa)"
                            type="number"
                            value={tekanan07}
                            onChange={(e) => setTekanan07(e.target.value)}
                        />
                        <InputField
                            label="Tekanan Udara 13:00 (hPa)"
                            type="number"
                            value={tekanan13}
                            onChange={(e) => setTekanan13(e.target.value)}
                        />
                        <InputField
                            label="Tekanan Udara 18:00 (hPa)"
                            type="number"
                            value={tekanan18}
                            onChange={(e) => setTekanan18(e.target.value)}
                        />
                    </div>

                    {/* Input Otomatis */}
                    <div
                        className={`space-y-4 mt-6 px-6 transition-all duration-500 ease-in-out ${
                            inputType === "otomatis"
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2 pointer-events-none absolute"
                        }`}
                    >
                        <div>
                            <label className="mb-1 text-sm font-semibold text-gray-700">
                                Upload File
                            </label>

                            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-100 transition">
                                <FiUpload size={16} />
                                <label className="cursor-pointer">
                                    <span
                                        className="truncate max-w-[150px]"
                                        title={file?.name}
                                    >
                                        {file
                                            ? file.name
                                            : "Upload File (.csv / .xlsx)"}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-black mt-2">
                                Format file harus berisi{" "}
                                <strong className="text-red-800">
                                    Jam 07:00
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">
                                    Jam 13:00
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">
                                    Jam 18:00
                                </strong>
                                , dan{" "}
                                <strong className="text-red-800">
                                    tanggal
                                </strong>
                                . Tekanan udara akan dihitung otomatis
                                berdasarkan waktu pengamatan harian.
                            </p>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-3 mt-6 px-6 pb-4">
                        <Button
                            type="button"
                            icon={<FiXCircle size={18} />}
                            setOpenModal={() => {
                                setIsOpenModal(false);
                                resetForm();
                            }}
                            buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                        />
                        <Button
                            type="button"
                            icon={<FiSave size={18} />}
                            setOpenModal={
                                inputType === "manual"
                                    ? handleManualSubmit
                                    : handleExcelSubmit
                            }
                            buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                        />
                    </div>
                </Modal>
            </div>
        </>
    );
}
