"use client";
import { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import TabelTandaWaktu from "@/components/common/tabel/TabelLamaWaktu";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tambahDataTimeSignature } from "@/lib/api/time-signature/time-signature-insert/router";
import { tambahDataTimeSignatureExcel } from "@/lib/api/time-signature/time-signature-insert-excel/router";

export default function TandaWaktuPage() {
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
      const selectedFile = e.target.files[0];

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

      const response = await tambahDataTimeSignature({
        user_id,
        name,
        date: tanggal,
        file_base64: fileBase64,
      });
      console.log(response);
      toast.success("Data tanda waktu berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error) {
      toast.error(
        (error as Error).message || "Gagal menambahkan data tanda waktu"
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
      const response = await tambahDataTimeSignatureExcel(user_id, fileBase64);
      console.log("Response API otomatis:", response);
      toast.success("Data tanda waktu dari file berhasil ditambahkan");
      setIsOpenModal(false);
      resetForm();
      handleReload();
    } catch (error) {
      console.error("Error submit otomatis:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan data dari file";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="p-4 space-y-4 bg-[#f5f5f7] text-gray-800">
        <ToastContainer />
        <TabelTandaWaktu reload={reload} />
        <Modal
          title="Tambah Data Tanda Waktu"
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
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

          {/* Form Manual */}
          {inputType === "manual" && (
            <div className="space-y-4 mt-6 px-6">
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
              <div>
                <label className="mb-1 text-sm font-semibold text-gray-700">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm border rounded px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Form Otomatis */}
          {inputType === "otomatis" && (
            <div className="space-y-4 mt-6 px-6">
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
                <strong className="text-red-800">tanggal</strong> dan{" "}
                <strong className="text-red-800">nilai</strong>
              </p>
            </div>
          )}

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
