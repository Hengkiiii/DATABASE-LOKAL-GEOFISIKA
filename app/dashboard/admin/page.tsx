"use client";
import React, { useState } from "react";
//COMPONENTS
import { FiSave, FiXCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useModal } from "@/context/ModalContext";
import TabelAdmin from "@/components/common/tabel/TabelAdmin";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
//API
import { registerUser } from "@/lib/api/auth/register/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPage() {
  const { isOpenModal, setIsOpenModal } = useModal();

  const [email, setEmail] = useState("");
  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [fotoBase64, setFotoBase64] = useState("");

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFotoBase64(reader.result);
        } else {
          toast.error("❌ Gagal membaca file gambar");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEmail("");
    setNamaDepan("");
    setNamaBelakang("");
    setFotoBase64("");
    setRole("");
    setPassword("");
  };

  const handleSubmit = async () => {
    if (
      !email ||
      !namaDepan ||
      !namaBelakang ||
      !fotoBase64 ||
      !role ||
      !password
    ) {
      toast.warn("⚠️ Semua kolom wajib diisi!");
      return;
    }

    try {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        toast.error("❌ User ID tidak ditemukan. Silakan login ulang.");
        return;
      }

      const response = await registerUser(
        user_id,
        email,
        namaDepan,
        namaBelakang,
        fotoBase64,
        role,
        password
      );
      toast.success(`${response.message}`);
      setIsOpenModal(false);
      resetForm();
    } catch (error: any) {
      if (error.message.includes("User already registered")) {
        toast.error("❌ Email sudah terdaftar. Gunakan email lain.");
      } else {
        toast.error(`❌ ${error.message}`);
      }
      console.error("Gagal mendaftarkan admin:", error.message);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Admin</h1>
      </div>

      <TabelAdmin />

      <Modal
        title="Tambah Admin"
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          resetForm();
        }}
      >
        <div className="space-y-4 px-6 pt-4">
          <InputField
            label="Email"
            type="email"
            value={email}
            placeholder="admin@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Nama Depan"
            type="text"
            value={namaDepan}
            placeholder="Nama Depan"
            onChange={(e) => setNamaDepan(e.target.value)}
          />
          <InputField
            label="Nama Belakang"
            type="text"
            value={namaBelakang}
            placeholder="Nama Belakang"
            onChange={(e) => setNamaBelakang(e.target.value)}
          />

          {/* Input file foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Profil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          {/* Dropdown role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full  rounded-md border border-gray-300 px-2 py-2 text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 appearance-none"
            >
              <option value="" disabled>
                Pilih Role
              </option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
          </div>

          {/* Password dengan icon show/hide */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              buttonStyle="absolute top-[35px] right-3 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </Button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 px-6 pb-4">
          <Button
            type="button"
            icon={<FiXCircle size={18} />}
            onClick={() => {
              setIsOpenModal(false);
              resetForm();
            }}
            buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md"
          />
          <Button
            type="button"
            icon={<FiSave size={18} />}
            onClick={handleSubmit}
            buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md"
          />
        </div>
      </Modal>
    </div>
  );
}
