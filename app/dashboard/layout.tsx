"use client";

import { useMedia } from "react-use";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import { ModalProvider } from "@/context/ModalContext";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);

  return (
    <ModalProvider>
      <section
        className={`font-lexend flex ${
          isDarkMode ? "bg-[#18171F]" : "bg-[#f5f5f7]"
        }`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 overflow-y-auto scroll-custom">
            {children}
          </main>
          <Footer />
        </div>
      </section>
    </ModalProvider>
  );
}
