import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoRainy } from "react-icons/io5";
import LogoBMKG from "@/components/common/LogoBMKG";
import { HiOutlineChevronLeft } from "react-icons/hi";
import SidebarItem from "@/components/common/SidebarItem";
import { FaSignOutAlt } from "react-icons/fa";

// komponen untuk menampilkan sidebar
export default function SidebarCRUD() {
    const pathname = usePathname(); // Mendapatkan path saat ini untuk menentukan item sidebar yang aktif
    const [isClient, setIsClient] = useState(false); // Mengecek apakah aplikasi sedang berjalan di client-side
    const [collapsed, setCollapsed] = useState(false); // Status apakah sidebar dalam keadaan collapsed
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
        null
    ); // Index dropdown yang dibuka

    useEffect(() => {
        // Menandakan bahwa komponen telah dirender di sisi client
        setIsClient(true);

        // Cek apakah saat ini dalam tampilan mobile (lebar layar < 768px)
        const isMobile = window.innerWidth < 768;

        // Ambil status collapsed dari localStorage (jika ada)
        const savedState = localStorage.getItem("sidebarCollapsed");

        if (isMobile) {
            // Jika di mobile, sidebar otomatis collapsed
            setCollapsed(true);
            // Simpan status collapsed ke localStorage agar konsisten
            localStorage.setItem("sidebarCollapsed", "true");
        } else if (savedState !== null) {
            // Jika bukan mobile dan ada data di localStorage, gunakan data tersebut
            setCollapsed(savedState === "true");
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("sidebarCollapsed", String(collapsed)); // Menyimpan status collapse ke localStorage
        }
    }, [collapsed, isClient]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed); // Toggle status collapse ketika tombol di klik
    };

    if (!isClient) return null; // Menghindari render pada server

    return (
        <motion.aside
            initial={{ width: 64 }}
            animate={{
                width: collapsed ? 64 : openDropdownIndex !== null ? 312 : 256,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative h-screen bg-slate-800 flex flex-col shadow-lg"
        >
            {/* Bagian Header Sidebar */}
            {/* Menampilkan Logo BMKG dan judul "Database Geofisika" jika sidebar tidak collapsed */}
            <div
                className={`py-4 flex items-center justify-center border-b border-[#f5f7f5]" ${
                    collapsed
                        ? "flex justify-center px-0"
                        : "flex justify-between px-3 -ml-4"
                }`}
            >
                <LogoBMKG /> {/* Logo BMKG */}
                {!collapsed && (
                    <p
                        className={`text-sm md:text-[1rem] font-bold text-[#f5f5f7]`}
                    >
                        Database Geofisika
                    </p>
                )}
            </div>

            {/* Bagian Navigasi Sidebar */}
            <nav
                className={`flex-1 p-4 space-y-4 mt-4 ${
                    !collapsed &&
                    "overflow-y-auto max-h-[calc(100vh-180px)] scroll-custom"
                }`}
            >
                {/* Item Pos Hujan */}
                {/* Sidebar item untuk Pos Hujan */}
                <SidebarItem
                    index={3}
                    label="Pos Hujan"
                    collapsed={collapsed}
                    route="/dashboard/pos-hujan"
                    active={pathname === "/dashboard/pos-hujan"}
                    openDropdownIndex={openDropdownIndex}
                    icon={<IoRainy className="w-5 h-5" />}
                    title={collapsed ? "Pos Hujan" : undefined}
                    setOpenDropdownIndex={setOpenDropdownIndex}
                />
            </nav>

            {/* Item Keluar */}
            {/* Sidebar item untuk logout */}
            <div className="p-4 border-t border-[#f5f5f7]">
                <SidebarItem
                    index={4}
                    route="/"
                    label="Keluar"
                    collapsed={collapsed}
                    openDropdownIndex={openDropdownIndex}
                    title={collapsed ? "Keluar" : undefined}
                    icon={<FaSignOutAlt className="w-5 h-5" />}
                    setOpenDropdownIndex={setOpenDropdownIndex}
                />
            </div>

            {/* Ruang kosong di bagian bawah untuk memberi jarak */}
            <span className="p-4 border-t border-[#f5f5f7] mb-5" />

            {/* Tombol Collapse untuk menyembunyikan/menampilkan sidebar */}
            <button
                className={`absolute bottom-1 right-4 p-2 hover:cursor-pointer text-[#f5f5f7]`}
                onClick={toggleSidebar} // Toggle sidebar saat tombol diklik
            >
                <HiOutlineChevronLeft
                    className={`w-5 h-5 ${collapsed ? "rotate-180" : ""}`}
                />
            </button>
        </motion.aside>
    );
}
