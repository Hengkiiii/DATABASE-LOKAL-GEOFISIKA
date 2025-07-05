"use client";
import React, { useState } from "react";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelKelembabanUdara from "@/components/common/tabel/TabelKelembabanUdara";
import { useModal } from "@/context/ModalContext";
import { tambahDataKelembaban } from "@/lib/api/humidity/insert_manual/router";
import { tambahDataKelembabanExcel } from "@/lib/api/humidity/insert_excel/router";
import InputField from "@/components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KelembabanUdaraPage() {
    const { isOpenModal, setIsOpenModal } = useModal();

    const [inputType, setInputType] = useState("manual");
    const [tanggal, setTanggal] = useState("");
    const [jam07, setJam07] = useState("");
    const [jam13, setJam13] = useState("");
    const [jam18, setJam18] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileBase64, setFileBase64] = useState<string>("");
    const [reload, setReload] = useState(false);
    const handleReload = () => setReload(!reload);

    const resetForm = () => {
        setTanggal("");
        setJam07("");
        setJam13("");
        setJam18("");
        setFile(null);
        setFileBase64("");
        setInputType("manual");
    };

    // Fungsi untuk baca file dan convert ke base64
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
                console.error("User ID tidak ditemukan di sessionStorage");
                return;
            }
            await tambahDataKelembaban(
                user_id,
                parseFloat(jam07),
                parseFloat(jam13),
                parseFloat(jam18),
                tanggal
            );
            toast.success("Data kelembaban berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error) {
            console.error("Gagal menambahkan data kelembaban:", error);
            toast.error("Gagal menambahkan data kelembaban");
        }
    };

    const handleExcelSubmit = async () => {
        try {
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                console.error("User ID tidak ditemukan di sessionStorage");
                return;
            }
            if (!fileBase64) {
                toast.error("Silakan upload file terlebih dahulu");
                return;
            }
            await tambahDataKelembabanExcel(user_id, fileBase64);
            toast.success("Data kelembaban dari file berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error) {
            console.error(
                "Gagal menambahkan data kelembaban dari file:",
                error
            );
            toast.error("Gagal menambahkan data dari file");
        }
    };

    return (
        <>
            <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
                <TabelKelembabanUdara reload={reload} />
                <Modal
                    title="Tambah Data Kelembaban Udara"
                    isOpen={isOpenModal}
                    onClose={() => {
                        setIsOpenModal(false);
                        resetForm();
                    }}
                >
                    {/* Tab Pilihan Input */}
                    <div className="flex justify-center gap-8 px-6 pt-4">
                        <Button
                            type="button"
                            setOpenModal={() => setInputType("manual")}
                            buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold transition-all duration-300 ${
                                inputType === "manual"
                                    ? "text-sky-600 underline underline-offset-4"
                                    : "text-gray-500 hover:text-sky-500"
                            } cursor-pointer`}
                            text="Input Manual"
                        />
                        <Button
                            type="button"
                            setOpenModal={() => setInputType("otomatis")}
                            buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold transition-all duration-300 ${
                                inputType === "otomatis"
                                    ? "text-sky-600 underline underline-offset-4"
                                    : "text-gray-500 hover:text-sky-500"
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
                            label="Kelembaban 07.00"
                            type="number"
                            value={jam07}
                            onChange={(e) => setJam07(e.target.value)}
                        />
                        <InputField
                            label="Kelembaban 13.00"
                            type="number"
                            value={jam13}
                            onChange={(e) => setJam13(e.target.value)}
                        />
                        <InputField
                            label="Kelembaban 18.00"
                            type="number"
                            value={jam18}
                            onChange={(e) => setJam18(e.target.value)}
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
                                    tanggal
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">
                                    Jam 07:00
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">
                                    Jam 13:00
                                </strong>
                                , dan{" "}
                                <strong className="text-red-800">
                                    Jam 18:00
                                </strong>
                                .
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
                            buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md"
                        />
                        <Button
                            type="button"
                            icon={<FiSave size={18} />}
                            setOpenModal={
                                inputType === "manual"
                                    ? handleManualSubmit
                                    : handleExcelSubmit
                            }
                            buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md"
                        />
                    </div>
                </Modal>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                className="z-[9999]"
            />
        </>
    );
}
