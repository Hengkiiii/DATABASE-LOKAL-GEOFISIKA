// ButtonProps.ts
import { ReactNode } from "react";

export interface ButtonProps {
  text?: string; // Teks yang akan ditampilkan di tombol
  route?: any; // Objek router untuk navigasi
  setOpenModal?: () => void; // Fungsi untuk membuka modal
  textStyle?: string; // Gaya teks tombol (opsional)
  buttonStyle?: string; // Gaya tombol (opsional)
  type?: "button" | "submit" | "reset"; // Tipe tombol (opsional)
  icon?: ReactNode; // Icon yang akan ditampilkan di tombol (opsional)
  onClick?: () => void; // Fungsi yang akan dipanggil saat tombol diklik (opsional)
  children?: ReactNode; // Konten anak yang akan ditampilkan di dalam tombol (opsional)
  disabled?: boolean; // Menentukan apakah tombol dinonaktifkan (opsional)
  title?: string; // Judul tooltip yang akan ditampilkan saat hover (opsional)
}
