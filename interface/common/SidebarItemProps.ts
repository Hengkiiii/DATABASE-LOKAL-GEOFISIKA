// SidebarItemProps.ts
import { ReactNode, ReactElement, Dispatch, SetStateAction } from "react";

export interface SidebarItemProps {
    route: any; // Rute halaman yang akan diarahkan
    label: string; // Teks label yang ditampilkan
    index: number; // Indeks item
    title?: string; // Teks title yang ditampilkan
    icon: ReactNode; // Nama ikon (bisa untuk komponen ikon atau path)
    active?: boolean; // Menandakan apakah item ini aktif
    collapsed: boolean; // Menandakan apakah sidebar sedang collapsed
    openDropdownIndex: number | null; // Indeks dropdown yang terbuka
    setOpenDropdownIndex: Dispatch<SetStateAction<number | null>>; // Fungsi untuk mengatur index dropdown
    children?:
        | ReactElement<SidebarItemProps>[]
        | ReactElement<SidebarItemProps>; // Menandakan apakah item ini memiliki anak
}
