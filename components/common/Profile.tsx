"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import {
  Mail,
  User,
  Pencil,
  Trash2,
  Save,
  Undo,
  CalendarCheck2,
  ShieldCheck,
} from "lucide-react";
import { getAdmin } from "@/lib/api/admin/admin-get/router";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const user_Id = sessionStorage.getItem("user_id");
        if (!user_Id) {
          setError("User ID tidak ditemukan di session.");
          setLoading(false);
          return;
        }

        const admin = await getAdmin(user_Id);

        setFormData({
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          role: admin.role,
        });
        setPhotoUrl(admin.photoUrl || "https://i.pravatar.cc/300");
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload(); // muat ulang untuk ambil ulang data asli
  };

  const handleSave = () => {
    console.log("Data disimpan:", formData);
    setIsEditing(false);
    // Implementasikan update ke backend bila diperlukan
  };

  if (loading) return <div className="text-center py-10">Memuat profil...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="flex justify-center items-center py-10 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-100 transition-all duration-500">
      <Card style="relative w-full max-w-5xl bg-white p-18 shadow-2xl rounded-3xl flex items-center gap-12 transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] border border-indigo-100">
        {/* Tombol Edit & Hapus atau Simpan & Batal */}
        <div className="absolute top-6 right-6 flex gap-4 z-10">
          {isEditing ? (
            <>
              <Button
                icon={<Save className="w-4 h-4" />}
                text="Simpan"
                buttonStyle="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full shadow text-sm font-medium"
                onClick={handleSave}
              />
              <Button
                icon={<Undo className="w-4 h-4" />}
                text="Batal"
                buttonStyle="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full shadow text-sm font-medium"
                onClick={handleCancel}
              />
            </>
          ) : (
            <>
              <Button
                icon={<Pencil className="w-4 h-4" />}
                text="Edit"
                buttonStyle="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full shadow text-sm font-medium"
                onClick={() => setIsEditing(true)}
              />
              <Button
                icon={<Trash2 className="w-4 h-4" />}
                text="Hapus"
                buttonStyle="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full shadow text-sm font-medium"
                onClick={() => console.log("Hapus diklik")}
              />
            </>
          )}
        </div>

        {/* Gambar Profil */}
        <div className="relative group">
          <img
            src={photoUrl}
            alt={formData.name || "Foto Profil"}
            className="w-60 h-60 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-indigo-100 transition duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-indigo-100 p-2 rounded-full shadow-md border border-indigo-200">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Garis Vertikal */}
        <div className="w-px h-56 bg-gradient-to-b from-indigo-200 via-gray-300 to-indigo-200"></div>

        {/* Info Profil */}
        <div className="flex flex-col justify-center w-full max-w-md">
          {isEditing ? (
            <form className="space-y-5">
              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-semibold text-gray-700">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    placeholder="Nama Lengkap"
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* Role */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-semibold text-gray-700">
                  Peran
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-base text-indigo-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    placeholder="Peran"
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-base text-black font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    placeholder="Email"
                    autoComplete="off"
                    type="email"
                  />
                </div>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight flex items-center gap-2">
                <User className="w-8 h-8 text-indigo-400" />
                {formData.name}
              </h3>
              <p className="text-xl text-indigo-600 font-semibold flex items-center gap-2 mb-2">
                <span className="bg-indigo-100 p-1.5 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </span>
                {formData.role}
              </p>
              <p className="text-xl text-gray-500 flex items-center gap-2">
                <span className="bg-gray-200 p-1.5 rounded-full">
                  <Mail className="w-5 h-5 text-gray-600" />
                </span>
                {formData.email}
              </p>

              <div className="mt-6 flex gap-4">
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg shadow text-indigo-700 text-sm">
                  <CalendarCheck2 className="w-4 h-4" />
                  Terakhir update:{" "}
                  <span className="font-semibold">Mei 2025</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg shadow text-green-700 text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Status: <span className="font-semibold">Aktif</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
