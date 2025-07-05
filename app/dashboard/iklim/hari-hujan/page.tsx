"use client";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelHariHujan from "@/components/common/tabel/TabelHariHujan";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import { tambahDataHariHujan } from "@/lib/api/rainy-days/rainy-days-insert/router";
import { tambahDataHariHujanExcel } from "@/lib/api/rainy-days/rainy-days-insert-excel/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HariHujanPage() {
  const { isOpenModal, setIsOpenModal } = useModal();
  const [tanggal, setTanggal] = useState("");
  const [hariHujan, setHariHujan] = useState("");
  const [inputType, setInputType] = useState("manual");
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [reload, setReload] = useState(false);
  const handleReload = () => setReload(!reload);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setTanggal(dateValue);
    setHariHujan("");
  };

  const resetForm = () => {
    setTanggal("");
    setHariHujan("");
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
      if (!tanggal) {
        toast.warning("Tanggal harus diisi");
        return;
      }
      if (!hariHujan) {
        toast.warning("Hari hujan tidak valid");
        return;
      }
      await tambahDataHariHujan(user_id, hariHujan, tanggal);
      toast.success("Data hari hujan berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error) {
      toast.error("Gagal menambahkan data hari hujan");
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
      await tambahDataHariHujanExcel(user_id, fileBase64);
      toast.success("Data hari hujan dari file berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan data hari hujan dari file";
      toast.error(message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
        <TabelHariHujan reload={reload} />
        <Modal
          title="Tambah Data Hujan"
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
              buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold ${
                inputType === "manual"
                  ? "text-teal-600 underline underline-offset-4"
                  : "text-gray-500 hover:text-teal-500"
              } cursor-pointer`}
              text="Input Manual"
            />
            <Button
              type="button"
              setOpenModal={() => setInputType("otomatis")}
              buttonStyle={`bg-transparent shadow-none px-0 py-0 text-sm font-semibold ${
                inputType === "otomatis"
                  ? "text-teal-600 underline underline-offset-4"
                  : "text-gray-500 hover:text-teal-500"
              } cursor-pointer`}
              text="Input Otomatis"
            />
          </div>
          <div
            className={`space-y-4 mt-6 px-6 ${
              inputType === "manual"
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none absolute"
            } transition-all duration-500 ease-in-out`}
          >
            <InputField
              label="Tanggal"
              type="date"
              value={tanggal}
              onChange={handleDateChange}
            />
            <InputField
              label="Hari Hujan"
              type="text"
              value={hariHujan}
              onChange={(e) => setHariHujan(e.target.value)}
            />
          </div>
          <div
            className={`space-y-4 mt-6 px-6 ${
              inputType === "otomatis"
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none absolute"
            } transition-all duration-500 ease-in-out`}
          >
            <div>
              <label className="mb-1 text-sm font-semibold text-gray-700">
                Upload File
              </label>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-100 transition">
                <FiUpload size={16} />
                <span>{file ? file.name : "Upload File (.csv / .xlsx)"}</span>
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
                <strong className="text-red-800">jumlah hari hujan</strong>
              </p>
            </div>
          </div>
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
