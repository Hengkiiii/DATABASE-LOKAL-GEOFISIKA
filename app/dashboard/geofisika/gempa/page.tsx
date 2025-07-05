"use client";
import { useState } from "react";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import TabelGempa from "@/components/common/tabel/TabelGempa";
import { useModal } from "@/context/ModalContext";
import InputField from "@/components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tambahDataGempa } from "@/lib/api/earthquake/earthquake-insert/router";
import { tambahDataGempaExcel } from "@/lib/api/earthquake/earthquake-insert-excel/router";
import { tambahDataGempaDariTeks } from "@/lib/api/earthquake/earthquake-insert-parse/router";

export default function GempaPage() {
    const { isOpenModal, setIsOpenModal } = useModal();
    const [inputType, setInputType] = useState("manual");
    const [dateTime, setDateTime] = useState({
        date: "",
        time: "",
    });
    const [bujur, setBujur] = useState("");
    const [lintang, setLintang] = useState("");
    const [magnitude, setMagnitude] = useState("");
    const [kedalaman, setKedalaman] = useState("");
    const [mmi, setMmi] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [observer, setObserver] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileBase64, setFileBase64] = useState("");
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const handleReload = () => setReload(!reload);

    const resetForm = () => {
        setDateTime({
            date: "",
            time: "",
        });
        setBujur("");
        setLintang("");
        setMagnitude("");
        setKedalaman("");
        setMmi("");
        setKeterangan("");
        setObserver("");
        setFile(null);
        setFileBase64("");
        setInputText("");
    };

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
            reader.onerror = () => {
                toast.error("Gagal membaca file");
            };
        }
    };

    const handleManualSubmit = async () => {
        try {
            setIsLoading(true);
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan, silakan login ulang");
                return;
            }
            if (
                !dateTime.date ||
                !dateTime.time ||
                !lintang ||
                !bujur ||
                !kedalaman ||
                !magnitude
            ) {
                toast.error("Harap isi semua field wajib");
                return;
            }
            const formattedDateTime = `${dateTime.date}T${dateTime.time}:00+00:00`;
            await tambahDataGempa(
                user_id,
                formattedDateTime,
                mmi,
                keterangan,
                Number(kedalaman),
                Number(lintang),
                Number(bujur),
                Number(magnitude),
                observer
            );
            toast.success("Data gempa berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error: unknown) {
            console.error("Gagal menambahkan data gempa:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal menambahkan data gempa"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleExcelSubmit = async () => {
        try {
            setIsLoading(true);
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan, silakan login ulang");
                return;
            }
            if (!fileBase64) {
                toast.error("Silakan upload file terlebih dahulu");
                return;
            }
            const result = await tambahDataGempaExcel(user_id, fileBase64);
            if (result?.success) {
                toast.success("Data gempa dari file berhasil ditambahkan");
                setIsOpenModal(false);
                resetForm();
                handleReload();
            } else {
                toast.error(
                    result?.message || "Gagal menambahkan data dari file"
                );
            }
        } catch (error: unknown) {
            console.error("Gagal menambahkan data dari file:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal menambahkan data dari file"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleTextSubmit = async () => {
        try {
            setIsLoading(true);
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan, silakan login ulang");
                return;
            }
            if (!inputText.trim()) {
                toast.error("Silakan masukkan teks data gempa");
                return;
            }
            const response = await tambahDataGempaDariTeks(user_id, inputText);
            toast.success(
                `Berhasil menambahkan ${
                    response.data?.length || 0
                } data gempa dari teks`
            );
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error: unknown) {
            console.error("Gagal menambahkan data dari teks:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal menambahkan data dari teks"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        switch (inputType) {
            case "manual":
                return handleManualSubmit();
            case "otomatis":
                return handleExcelSubmit();
            case "text":
                return handleTextSubmit();
            default:
                toast.error("Jenis input tidak valid");
        }
    };

    return (
        <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
            <ToastContainer />
            <TabelGempa reload={reload} />
            <Modal
                title="Tambah Data Gempa"
                isOpen={isOpenModal}
                onClose={() => {
                    setIsOpenModal(false);
                    resetForm();
                }}
            >
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
                    <Button
                        type="button"
                        setOpenModal={() => setInputType("text")}
                        buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold transition-all duration-300 ${
                            inputType === "text"
                                ? "text-teal-600 underline underline-offset-4"
                                : "text-gray-500 hover:text-teal-500"
                        } cursor-pointer`}
                        text="Input Teks"
                    />
                </div>
                <div
                    className={`space-y-0.5 mt-2 px-4 transition-all duration-500 ease-in-out ${
                        inputType === "manual"
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2 pointer-events-none absolute"
                    }`}
                >
                    {inputType === "manual" && (
                        <>
                            <InputField
                                label="Waktu Kejadian*"
                                type="datetime-local"
                                step="1"
                                value={`${dateTime.date}T${dateTime.time}`}
                                onChange={(e) => {
                                    const [date, time] =
                                        e.target.value.split("T");
                                    setDateTime({
                                        date: date || "",
                                        time: time || "",
                                    });
                                }}
                            />

                            <InputField
                                label="Lintang*"
                                type="number"
                                value={lintang}
                                onChange={(e) => setLintang(e.target.value)}
                                placeholder="Contoh: -7.123"
                            />
                            <InputField
                                label="Bujur*"
                                type="number"
                                value={bujur}
                                onChange={(e) => setBujur(e.target.value)}
                                placeholder="Contoh: 110.123"
                            />
                            <InputField
                                label="Kedalaman (km)*"
                                type="number"
                                value={kedalaman}
                                onChange={(e) => setKedalaman(e.target.value)}
                            />
                            <InputField
                                label="Magnitude*"
                                type="number"
                                step="0.1"
                                value={magnitude}
                                onChange={(e) => setMagnitude(e.target.value)}
                            />
                            <InputField
                                label="MMI"
                                type="text"
                                value={mmi}
                                onChange={(e) => setMmi(e.target.value)}
                                placeholder="Skala MMI (opsional)"
                            />
                            <InputField
                                label="Keterangan"
                                type="text"
                                value={keterangan}
                                onChange={(e) => setKeterangan(e.target.value)}
                                placeholder="Keterangan tambahan (opsional)"
                            />
                            <InputField
                                label="Observer"
                                type="text"
                                value={observer}
                                onChange={(e) => setObserver(e.target.value)}
                                placeholder="Nama observer (opsional)"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                *Field wajib diisi
                            </p>
                        </>
                    )}
                </div>
                <div
                    className={`space-y-4 mt-6 px-6 transition-all duration-500 ease-in-out ${
                        inputType === "otomatis"
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2 pointer-events-none absolute"
                    }`}
                >
                    {inputType === "otomatis" && (
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
                                Format file harus berisi kolom{" "}
                                <strong className="text-red-800">
                                    date_time
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">
                                    latitude
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">
                                    longitude
                                </strong>
                                ,{" "}
                                <strong className="text-red-800">depth</strong>,
                                dan{" "}
                                <strong className="text-red-800">
                                    magnitude
                                </strong>
                                .
                            </p>
                        </div>
                    )}
                </div>
                <div
                    className={`space-y-4 mt-6 px-6 transition-all duration-500 ease-in-out ${
                        inputType === "text"
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2 pointer-events-none absolute"
                    }`}
                >
                    {inputType === "text" && (
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">
                                Input Teks
                            </label>
                            <textarea
                                rows={5}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Contoh format:
2023-09-01T12:30:00+00:00 -7.123 110.123 10 5.2 III-IV
2023-09-02T08:15:00+00:00 -7.456 110.456 15 4.8 II"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            ></textarea>
                            <p className="text-xs text-black mt-2">
                                Format:{" "}
                                <strong>
                                    date_time(YYYY-MM-DDTHH:MM:SS+00:00) Lintang
                                    Bujur Kedalaman Magnitude MMI
                                </strong>
                                <br />
                                Pisahkan setiap data gempa dengan baris baru
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-3 mt-6 px-6 pb-4">
                    <Button
                        type="button"
                        icon={<FiXCircle size={18} />}
                        setOpenModal={() => {
                            setIsOpenModal(false);
                            resetForm();
                        }}
                        buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        icon={<FiSave size={18} />}
                        setOpenModal={handleSubmit}
                        buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                        disabled={isLoading}
                    />
                </div>
            </Modal>
        </div>
    );
}
