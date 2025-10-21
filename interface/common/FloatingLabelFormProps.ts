// FloatingLabelFormProps.ts
import { ReactNode, ChangeEvent } from "react";

export interface FloatingLabelFormProps {
  type: string; // Tipe input (misalnya 'text', 'password', 'email', dll)
  label: string; // Label untuk input
  icon?: ReactNode; // Ikon opsional untuk input (misalnya, ikon di sebelah kiri input)
  placeholder?: string; // Placeholder opsional untuk input
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Fungsi untuk mengubah nilai input
  value: string; // Nilai input
  className?: string; // Kelas tambahan untuk elemen input
  darkMode?: boolean; // Mode gelap (opsional)
  accept?: string; // Tipe file yang diterima (misalnya, untuk input file)
  extraContent?: React.ReactNode;
  min?: number;
  max?: number;
  step?: string;
}
