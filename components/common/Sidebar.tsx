import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoCloud, IoRainy } from "react-icons/io5";
import LogoBMKG from "@/components/common/LogoBMKG";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineChevronLeft } from "react-icons/hi";
import SidebarItem from "@/components/common/SidebarItem";
import SubSidebarItem from "@/components/common/SubSidebarItem";
import { FaHome, FaGlobeAsia, FaSignOutAlt } from "react-icons/fa";

// komponen untuk menampilkan sidebar
export default function Sidebar() {
  const pathname = usePathname(); // Mendapatkan path saat ini untuk menentukan item sidebar yang aktif
  const [isClient, setIsClient] = useState(false); // Mengecek apakah aplikasi sedang berjalan di client-side
  const [collapsed, setCollapsed] = useState(false); // Status apakah sidebar dalam keadaan collapsed
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  ); // Index dropdown yang dibuka
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    router.push("/login"); // Arahkan kembali ke halaman login
  };

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
          <p className={`text-sm md:text-[1rem] font-bold text-[#f5f5f7]`}>
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
        {/* Item Dashboard */}
        {/* Sidebar item untuk Dashboard */}
        <SidebarItem
          index={0}
          label="Dashboard"
          route={"/dashboard"}
          collapsed={collapsed}
          active={pathname === "/dashboard"}
          icon={<FaHome className="w-5 h-5" />}
          title={collapsed ? "Dashboard" : undefined}
          openDropdownIndex={openDropdownIndex}
          setOpenDropdownIndex={setOpenDropdownIndex}
        />
        <SidebarItem
          index={1}
          label="Admin"
          title="Admin"
          route={"/dashboard/admin"}
          collapsed={collapsed}
          active={pathname === "/dashboard/admin"}
          icon={<MdAdminPanelSettings className="w-5 h-5" />}
          openDropdownIndex={openDropdownIndex}
          setOpenDropdownIndex={setOpenDropdownIndex}
        />
        {/* Item Iklim */}
        {/* Sidebar item untuk Iklim dengan dropdown */}
        <SidebarItem
          index={2}
          label="Iklim"
          title="Iklim"
          collapsed={collapsed}
          route={"/dashboard/iklim"}
          active={pathname.startsWith("/dashboard/iklim")}
          icon={<IoCloud className="w-5 h-5" />}
          openDropdownIndex={openDropdownIndex}
          setOpenDropdownIndex={setOpenDropdownIndex}
        >
          {/* Dropdown untuk Hari Hujan */}
          <SubSidebarItem
            index={1}
            label="Hari Hujan"
            collapsed={collapsed}
            route="/dashboard/iklim/hari-hujan"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/iklim/hari-hujan"}
          />
          {/* Dropdown untuk Penguapan */}
          <SubSidebarItem
            index={2}
            label="Penguapan"
            collapsed={collapsed}
            route="/dashboard/iklim/penguapan"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/iklim/penguapan"}
          />
          {/* Dropdown untuk Tekanan Udara */}
          <SubSidebarItem
            index={3}
            label="Tekanan Udara"
            collapsed={collapsed}
            route="/dashboard/iklim/tekanan-udara"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/iklim/tekanan-udara"}
          />
          {/* Dropdown untuk Intensitas Hujan */}
          <SubSidebarItem
            index={4}
            collapsed={collapsed}
            label="Intensitas Hujan"
            route="/dashboard/iklim/intensitas-hujan"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/iklim/intensitas-hujan"}
          />
          {/* Dropdown untuk Kelembaban Udara */}
          <SubSidebarItem
            index={5}
            collapsed={collapsed}
            label="Kelembaban Udara"
            icon={<span className="w-2 h-2" />}
            route="/dashboard/iklim/kelembaban-udara"
            active={pathname === "/dashboard/iklim/kelembaban-udara"}
          />
          {/* Dropdown untuk Suhu Udara Minimun */}
          <SubSidebarItem
            index={6}
            collapsed={collapsed}
            label="Suhu Udara Minimun"
            icon={<span className="w-2 h-2" />}
            route="/dashboard/iklim/suhu-udara-minimum"
            active={pathname === "/dashboard/iklim/suhu-udara-minimum"}
          />
          {/* Dropdown untuk Suhu Udara Rata Rata */}
          <SubSidebarItem
            index={7}
            collapsed={collapsed}
            label="Suhu Udara Rata Rata"
            icon={<span className="w-2 h-2" />}
            route="/dashboard/iklim/suhu-udara-rata-rata"
            active={pathname === "/dashboard/iklim/suhu-udara-rata-rata"}
          />
          {/* Dropdown untuk Suhu Udara Maksimum */}
          <SubSidebarItem
            index={8}
            collapsed={collapsed}
            label="Suhu Udara Maksimum"
            icon={<span className="w-2 h-2" />}
            route="/dashboard/iklim/suhu-udara-maksimum"
            active={pathname === "/dashboard/iklim/suhu-udara-maksimum"}
          />
          {/* Dropdown untuk Arah & Kecepatan Angin */}
          <SubSidebarItem
            index={9}
            collapsed={collapsed}
            label="Arah & Kecepatan Angin"
            icon={<span className="w-2 h-2" />}
            route="/dashboard/iklim/arah-kecepatan-angin"
            active={pathname === "/dashboard/iklim/arah-kecepatan-angin"}
          />
          {/* Dropdown untuk Lama Penyinaran Matahari */}
          <SubSidebarItem
            index={10}
            collapsed={collapsed}
            label="Lama Penyinaran Matahari"
            icon={<span className="w-2 h-2" />}
            route="/dashboard/iklim/lama-penyinaran-matahari"
            active={pathname === "/dashboard/iklim/lama-penyinaran-matahari"}
          />
        </SidebarItem>

        {/* Item Geofisika */}
        {/* Sidebar item untuk Geofisika dengan dropdown */}
        <SidebarItem
          index={3}
          label="Geofisika"
          title="Geofisika"
          collapsed={collapsed}
          route="/dashboard/geofisika"
          openDropdownIndex={openDropdownIndex}
          icon={<FaGlobeAsia className="w-5 h-5" />}
          setOpenDropdownIndex={setOpenDropdownIndex}
          active={pathname.startsWith("/dashboard/geofisika")}
        >
          {/* Dropdown untuk Petir */}
          <SubSidebarItem
            index={1}
            label="Petir"
            collapsed={collapsed}
            route="/dashboard/geofisika/petir/petir"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/geofisika/petir/petir"}
          />
          {/* Dropdown untuk Gempa */}
          <SubSidebarItem
            index={2}
            label="Gempa"
            collapsed={collapsed}
            route="/dashboard/geofisika/gempa"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/geofisika/gempa"}
          />
          {/* Dropdown untuk Tanda Waktu */}
          <SubSidebarItem
            index={3}
            label="Tanda Waktu"
            collapsed={collapsed}
            route="/dashboard/geofisika/tanda-waktu"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/geofisika/tanda-waktu"}
          />
          {/* Dropdown untuk Data Sestifitas */}
          <SubSidebarItem
            index={4}
            label="Data Peta"
            collapsed={collapsed}
            route="/dashboard/geofisika/data-sestifitas"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/geofisika/data-sestifitas"}
          />
          {/* Dropdown untuk Peta */}
          <SubSidebarItem
            index={5}
            label="Peta seismisitas"
            collapsed={collapsed}
            route="/dashboard/geofisika/peta"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/geofisika/peta"}
          />
          {/* Dropdown untuk Peta Sestifitas */}
          <SubSidebarItem
            index={6}
            label="Peta "
            collapsed={collapsed}
            route="/dashboard/geofisika/peta-sestifitas"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/geofisika/peta-sestifitas"}
          />
        </SidebarItem>

        {/* Item Pos Hujan */}
        {/* Sidebar item untuk Pos Hujan */}
        <SidebarItem
          index={4}
          label="Pos Hujan"
          collapsed={collapsed}
          route="/dashboard/pos-hujan"
          active={
            pathname === "/dashboard/pos-hujan" ||
            pathname === "/dashboard/pos-hujan/kepahiang" ||
            pathname === "/dashboard/pos-hujan/kepahiang/kebawetan" ||
            pathname === "/dashboard/pos-hujan/kepahiang/keban-agung" ||
            pathname === "/dashboard/pos-hujan/kepahiang/kelobak" ||
            pathname === "/dashboard/pos-hujan/kepahiang/muara-kemumu" ||
            pathname === "/dashboard/pos-hujan/kepahiang/plta-musi" ||
            pathname === "/dashboard/pos-hujan/kepahiang/sebrang-musi" ||
            pathname === "/dashboard/pos-hujan/kepahiang/tebat-karai" ||
            pathname === "/dashboard/pos-hujan/kepahiang/ujan-mas"
          }
          openDropdownIndex={openDropdownIndex}
          icon={<IoRainy className="w-5 h-5" />}
          title={collapsed ? "Pos Hujan" : undefined}
          setOpenDropdownIndex={setOpenDropdownIndex}
        />
        {/* Sidebar item untuk Aktifitas */}
        <SidebarItem
          index={5}
          label="Aktifitas"
          title="Aktifitas"
          collapsed={collapsed}
          route="/dashboard/aktifitas"
          openDropdownIndex={openDropdownIndex}
          icon={<FaGlobeAsia className="w-5 h-5" />}
          setOpenDropdownIndex={setOpenDropdownIndex}
          active={pathname.startsWith("/dashboard/aktifitas")}
        >
          {/* Dropdown untuk Petir */}
          <SubSidebarItem
            index={1}
            label="Riwayat Login"
            collapsed={collapsed}
            route="/dashboard/aktifitas/riwayat-login"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/aktifitas/riwayat-login"}
          />
          {/* Dropdown untuk Gempa */}
          <SubSidebarItem
            index={2}
            label="Riwayat Aktifitas"
            collapsed={collapsed}
            route="/dashboard/aktifitas/riwayat-aktifitas"
            icon={<span className="w-2 h-2" />}
            active={pathname === "/dashboard/aktifitas/riwayat-aktifitas"}
          />
        </SidebarItem>
      </nav>

      {/* Item Keluar */}
      {/* Sidebar item untuk logout */}
      <div className="p-4 border-t border-[#f5f5f7]">
        <SidebarItem
          index={5}
          route="/"
          label="Keluar"
          collapsed={collapsed}
          onClick={handleLogout}
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
