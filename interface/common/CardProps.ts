// CardProps.ts
import { ReactNode } from "react";

export interface CardProps {
  style?: String; // Kelas CSS tambahan
  children: ReactNode; // Konten dalam kartu
  className?: String; // Kelas CSS tambahan
}
