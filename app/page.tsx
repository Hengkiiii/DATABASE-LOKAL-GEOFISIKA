"use client";
import React, { useState } from "react";
import { useMedia } from "react-use";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import CardLogin from "@/components/auth/CardLogin";
import LogoBMKG from "@/components/common/LogoBMKG";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginUser } from "@/lib/api/auth/login/router";
import BackgroundLogin from "@/components/auth/BackgroundLogin";
import FloatingLabelForm from "@/components/common/FloatingLabelForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Inisialisasi router untuk navigasi
  // Mengambil preferensi dark mode dari sistem pengguna
  const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.warning("Email tidak valid. Harap gunakan format yang benar.");
      return;
    }
    if (!password) {
      toast.warning("Kata sandi tidak boleh kosong.");
      return;
    }
    try {
      const response = await loginUser(email, password);
      console.log("Login sukses:", response);
      sessionStorage.setItem("token", response.access_token);
      sessionStorage.setItem("user_id", response.user_id);
      sessionStorage.setItem("role", response.role);
      toast.success(response.message);

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Login gagal. Silakan coba lagi.";

      if (errorMsg.toLowerCase().includes("invalid")) {
        toast.warning("Email atau kata sandi salah. Silakan coba kembali.");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  return (
    <>
      <section className="font-[family-name:var(--font-lexend)] min-h-screen flex items-center justify-center">
        {/* Latar belakang login */}
        <BackgroundLogin>
          {/* Konten utama */}
          <div className="p-4 md:p-0">
            {/* Kartu login */}
            <CardLogin>
              <div className="flex flex-col gap-y-4 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg">
                {/* Logo BMKG */}
                <LogoBMKG />

                {/* Judul dan deskripsi */}
                <div className="flex flex-col gap-y-2">
                  <h1
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Selamat Datang
                  </h1>
                  <p
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-white/50" : "text-black/50"
                    }`}
                  >
                    Masuk untuk melanjutkan ke Database Lokal Geofisika
                  </p>
                </div>

                {/* Form login */}
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                  className="w-full mt-5 flex flex-col gap-6"
                >
                  {/* Input email */}
                  <FloatingLabelForm
                    type="email"
                    label="Email"
                    icon={<FaEnvelope />}
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {/* Input kata sandi */}
                  <FloatingLabelForm
                    type="password"
                    icon={<FaLock />}
                    label="Kata Sandi"
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* Tombol masuk */}
                  <Button
                    text="Masuk"
                    type="submit"
                    textStyle="font-semibold text-white"
                    buttonStyle="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 py-2 rounded-lg transition duration-200"
                  />
                </form>

                {/* Footer */}
                <footer className="text-xs text-gray-500 mt-4 text-center">
                  &copy; {new Date().getFullYear()} Bhinneka Dev – Berkarya
                  untuk Indonesia yang lebih baik.
                </footer>
              </div>
            </CardLogin>
          </div>
        </BackgroundLogin>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="z-[9999]"
      />
    </>
  );
}
