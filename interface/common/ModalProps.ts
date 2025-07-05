import { ReactNode } from "react";

export interface ModalProps {
  title: string; // Judul modal
  isOpen: boolean; // Menentukan apakah modal terbuka
  children: ReactNode; // Konten dalam modal
  onClose: () => void; // Fungsi untuk menutup modal
  onOpen?: () => void; // Fungsi untuk membuka modal
  className?: string; // Kelas CSS tambahan
  // onChange bisa menerima key dan value dinamis
  onChange?: (key: string, value: any) => void;
}
