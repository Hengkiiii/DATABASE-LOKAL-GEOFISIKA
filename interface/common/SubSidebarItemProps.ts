// SidebarItemProps.ts
import { ReactNode } from "react";

export interface SubSidebarItemProps {
    route: any; // Rute halaman yang akan diarahkan
    label: string; // Teks label yang ditampilkan
    index: number; // Indeks item
    icon: ReactNode; // Nama ikon (bisa untuk komponen ikon atau path)
    active?: boolean; // Menandakan apakah item ini aktif
    collapsed: boolean; // Menandakan apakah sidebar sedang collapsed
}
