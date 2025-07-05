// useAutoOpenDropdownProps
import { Dispatch, SetStateAction } from "react";

export interface useAutoOpenDropdownProps {
    index: number; // Indeks item
    collapsed: boolean; // Apakah sidebar ini dalam keadaan collapsed
    active: boolean | undefined; // Apakah item ini aktif
    openDropdownIndex: number | null; // Indeks dropdown yang sedang terbuka
    setOpenDropdownIndex: Dispatch<SetStateAction<number | null>>; // Fungsi untuk membuka dropdown
}
