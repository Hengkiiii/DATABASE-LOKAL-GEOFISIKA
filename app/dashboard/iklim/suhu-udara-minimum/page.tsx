"use client";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelSuhuUdaraMinimum from "@/components/common/tabel/TabelSuhuUdaraMinimum";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import { tambahDataMinTemperatureExcel } from "@/lib/api/min-temperature/min-temperature-insert-excel/router";
import { tambahDataMinTemperature } from "@/lib/api/min-temperature/min-temperature-insert/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SuhuUdaraMaksimumPage() {
  const { isOpenModal, setIsOpenModal } = useModal();
  const [tanggal, setTanggal] = useState("");
  const [minTemperature, setMinTemperature] = useState("");
  const [inputType, setInputType] = useState("manual");
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [reload, setReload] = useState(false);
  const handleReload = () => setReload(!reload);

  const resetForm = () => {
    setTanggal("");
    setMinTemperature("");
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
        toast.error("User ID tidak ditemukan. Silakan login ulang.");
        return;
      }
      if (inputType === "manual") {
        if (!tanggal) {
          toast.warning("Tanggal harus diisi");
          return;
        }
        if (!minTemperature) {
          toast.warning("Suhu Udara Minimum harus diisi");
          return;
        }
        await tambahDataMinTemperature(user_id, minTemperature, tanggal);
        console.log("Data suhu udara minimum berhasil ditambahkan" + user_id);
        toast.success("Data suhu udara minimum hujan berhasil ditambahkan");
        setIsOpenModal(false);
        resetForm();
        handleReload();
      } else {
        if (!fileBase64) {
          toast.warning("Silakan upload file terlebih dahulu");
          return;
        }
        toast.info("Fitur upload file otomatis belum tersedia");
      }
    } catch (error) {
      toast.error("Gagal menambahkan data suhu udara minimum");
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
      await tambahDataMinTemperatureExcel(user_id, fileBase64);
      toast.success("Data suhu udara minimum dari file berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan data suhu udara minimum dari file";
      toast.error(message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
        <TabelSuhuUdaraMinimum reload={reload} />
        <Modal
          title="Tambah Data Suhu Udara Minimum"
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
            className={`space-y-4 mt-4 px-6 transition-all duration-500 ease-in-out ${
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
              label="Suhu Udara Maksimum (°C)"
              type="number"
              value={minTemperature}
              onChange={(e) => setMinTemperature(e.target.value)}
              extraContent={
                <p className="text-xs mt-1">
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-2 font-bold">
                    INFO
                  </span>
                  Masukkan suhu dalam satuan °C
                </p>
              }
            />
          </div>

          {/* Input Otomatis */}
          <div
            className={`space-y-4 mt-4 px-6 transition-all duration-500 ease-in-out ${
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
                  <strong className="text-red-800">tanggal</strong> dan{" "}
                  <strong className="text-red-800">suhu minimum</strong> setiap
                  hari.
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
