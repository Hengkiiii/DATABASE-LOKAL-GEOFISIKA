"use client";
import { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelIntensitasHujan from "@/components/common/tabel/TabelIntensitasHujan";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import { insertRainIntensity } from "@/lib/api/rain-intensity/rain-intensity-insert/router";
import { tambahDataRainIntensityExcel } from "@/lib/api/rain-intensity/rain-intensity-insert-excel/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IntensitasHujanPage() {
    const { isOpenModal, setIsOpenModal } = useModal();
    const [tanggal, setTanggal] = useState("");
    const [name, setName] = useState("");
    const [fileBase64, setFileBase64] = useState("");
    const [inputType, setInputType] = useState("manual");
    const [reload, setReload] = useState(false);
    const handleReload = () => setReload(!reload);

    const resetForm = () => {
        setTanggal("");
        setFileBase64("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
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
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan. Silakan login ulang.");
                return;
            }
            if (!tanggal) {
                toast.warning("Tanggal harus diisi");
                return;
            }
            await insertRainIntensity({
                user_id,
                name,
                date: tanggal,
                file_base64: fileBase64,
            });
            toast.success("Data intensitas hujan berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal menambahkan data intensitas hujan"
            );
        }
    };

    const handleSubmitOtomatis = async () => {
        try {
            const user_id = sessionStorage.getItem("user_id");
            if (!user_id) {
                toast.error("User ID tidak ditemukan. Silakan login ulang.");
                return;
            }
            if (!fileBase64) {
                toast.warning("Silakan upload file terlebih dahulu");
                return;
            }
            await tambahDataRainIntensityExcel(user_id, fileBase64);
            toast.success(
                "Data intensitas hujan dari file berhasil ditambahkan"
            );
            setIsOpenModal(false);
            resetForm();
            handleReload();
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Gagal menambahkan data dari file";
            toast.error(message);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="p-6 space-y-4">
                <TabelIntensitasHujan reload={reload} />
                <Modal
                    title="Tambah Data Intensitas Hujan"
                    isOpen={isOpenModal}
                    onClose={() => setIsOpenModal(false)}
                >
                    {/* Tabs Pilihan Input */}
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
                        {inputType === "manual" && (
                            <>
                                <InputField
                                    label="Tanggal"
                                    type="date"
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                />
                                <InputField
                                    label="Nama"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <InputField
                                    label="File"
                                    type="file"
                                    onChange={handleFileChange}
                                    extraContent={
                                        <p className="text-xs mt-1">
                                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-2 font-bold">
                                                EXT :
                                            </span>
                                            besar file ≤ 4MB
                                        </p>
                                    }
                                />
                            </>
                        )}
                    </div>

                    {/* Input Otomatis */}
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
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-100 transition">
                                    <FiUpload size={16} />
                                    <span>Upload File (.csv / .xlsx)</span>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-black mt-2">
                                    Format file harus berisi{" "}
                                    <strong className="text-red-800">
                                        Nama Stasiun
                                    </strong>{" "}
                                    dan{" "}
                                    <strong className="text-red-800">
                                        Tanggal
                                    </strong>
                                    . Nilai intensitas hujan akan dihitung
                                    secara otomatis berdasarkan data curah hujan
                                    per tanggal.
                                </p>
                            </div>
                        )}
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
                                    : handleSubmitOtomatis
                            }
                            buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md"
                        />
                    </div>
                </Modal>
            </div>
        </>
    );
}
