"use client";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import InputField from "@/components/common/InputField";
import TabelDataPetirCSV from "@/components/common/tabel/tabelPetir/TabelDataPetirCSV";
import { useModal } from "@/context/ModalContext";
import { FiSave, FiXCircle, FiUpload } from "react-icons/fi";
import { tambahDataPetir } from "@/lib/api/lightning/lightning-insert/router";
import { tambahDataPetirExcel } from "@/lib/api/lightning/lightning-insert-excel/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const { isOpenModal, setIsOpenModal } = useModal();
  const [inputType, setInputType] = useState("manual");
  const [tanggal, setTanggal] = useState("");
  const [nama, setNama] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        toast.error("User ID tidak ditemukan. Silakan login ulang.");
        return;
      }

      if (inputType === "manual") {
        if (!tanggal || !nama) {
          toast.warning("Nama dan Tanggal harus diisi");
          return;
        }

        let fileBase64 = "";
        if (file) {
          if (file.size > 4 * 1024 * 1024) {
            toast.warning("Ukuran file tidak boleh lebih dari 4MB");
            return;
          }
          fileBase64 = await convertFileToBase64(file);
        }

        const formattedDate = new Date(tanggal).toISOString().split("T")[0];

        const result = await tambahDataPetir(
          user_id,
          nama,
          formattedDate,
          fileBase64,
          "petir Csv"
        );

        if (result) {
          toast.success("Data petir berhasil ditambahkan (manual)");
          setIsOpenModal(false);
          resetForm();
        } else {
          toast.error("Gagal menambahkan data petir (manual)");
        }
      } else {
        if (!file) {
          toast.warning("Silakan upload file terlebih dahulu");
          return;
        }

        if (file.size > 4 * 1024 * 1024) {
          toast.warning("Ukuran file tidak boleh lebih dari 4MB");
          return;
        }

        const fileBase64 = await convertFileToBase64(file);

        const result = await tambahDataPetirExcel(
          user_id,
          "petir Csv",
          fileBase64
        );

        if (result?.success) {
          toast.success("Data petir berhasil diupload dari file Excel");
          setIsOpenModal(false);
          resetForm();
        } else {
          toast.error("Gagal menambahkan data petir dari file");
        }
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data petir"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(new Error("Gagal konversi file ke base64"));
      };
      reader.readAsDataURL(file);
    });
  };

  const resetForm = () => {
    setTanggal("");
    setNama("");
    setFile(null);
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 space-y-4">
        <TabelDataPetirCSV />

        <Modal
          title="Tambah Data Petir"
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
        >
          {/* Tabs */}
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
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
                <InputField
                  label="File"
                  value={file ? file.name : ""}
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
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-black mt-2">
                  Format file harus berisi{" "}
                  <strong className="text-red-800">Lokasi</strong> dan{" "}
                  <strong className="text-red-800">Tanggal</strong>. Data petir
                  akan diproses otomatis berdasarkan file yang diupload.
                </p>
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3 mt-6 px-6 pb-4">
            <Button
              type="button"
              icon={<FiXCircle size={18} />}
              onClick={() => setIsOpenModal(false)}
              buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
              disabled={isLoading}
            />
            <Button
              type="button"
              icon={<FiSave size={18} />}
              onClick={handleSave}
              buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
              disabled={isLoading}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
