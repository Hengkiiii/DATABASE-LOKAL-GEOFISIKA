"use client";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelSuhuUdaraRataRata from "@/components/common/tabel/TabelSuhuUdaraRataRata";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import { tambahDataAverageTemperature } from "@/lib/api/average-temperature/average-temperature-insert/router";
import { tambahDataAverageTemperatureExcel } from "@/lib/api/average-temperature/average-temperature-insert-excel/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SuhuUdaraRataRataPage() {
  const { isOpenModal, setIsOpenModal } = useModal();
  const [inputType, setInputType] = useState("manual");
  const [tanggal, setTanggal] = useState("");
  const [jam07, setJam07] = useState("");
  const [jam13, setJam13] = useState("");
  const [jam18, setJam18] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
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
      if (!tanggal || !jam07 || !jam13 || !jam18) {
        toast.error("Harap isi semua field");
        return;
      }
      const tekanan07Num = Number(jam07);
      const tekanan13Num = Number(jam13);
      const tekanan18Num = Number(jam18);
      const totalPressure = (tekanan07Num + tekanan13Num + tekanan18Num) / 3;
      await tambahDataAverageTemperature(
        user_id,
        totalPressure,
        tekanan07Num,
        tekanan13Num,
        tekanan18Num,
        tanggal
      );
      toast.success("Data suhu udara rata-rata berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error) {
      toast.error("Gagal menambahkan data suhu udara rata-rata");
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
      await tambahDataAverageTemperatureExcel(user_id, fileBase64);
      toast.success("Data suhu udara rata-rata dari file berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error) {
      console.error(
        "Gagal menambahkan data suhu udara rata-rata dari file:",
        error
      );
      toast.error("Gagal menambahkan data dari file");
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
        <TabelSuhuUdaraRataRata reload={reload} />
        <Modal
          title="Tambah Data Suhu Udara Rata-rata"
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
              label="Suhu 07.00 (°C)"
              type="number"
              value={jam07}
              onChange={(e) => setJam07(e.target.value)}
            />

            <InputField
              label="Suhu 13.00 (°C)"
              type="number"
              value={jam13}
              onChange={(e) => setJam13(e.target.value)}
            />

            <InputField
              label="Suhu 18.00 (°C)"
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
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-black mt-2">
                  Format file harus berisi{" "}
                  <strong className="text-red-800">tanggal</strong>,{" "}
                  <strong className="text-red-800">Suhu 07:00</strong>,{" "}
                  <strong className="text-red-800">Suhu 13:00</strong>, dan{" "}
                  <strong className="text-red-800">Suhu 18:00</strong>. Nilai
                  rata-rata akan dihitung otomatis dari data harian.
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
                inputType === "manual" ? handleManualSubmit : handleExcelSubmit
              }
              buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
