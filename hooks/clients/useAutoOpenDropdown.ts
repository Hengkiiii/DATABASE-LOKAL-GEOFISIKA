import { useEffect, useRef, useState } from "react";
import { useAutoOpenDropdownProps } from "@/interface/common/useAutoOpenDropdownProps";

// Hook untuk mengatur dropdown yang membuka otomatis
export function useAutoOpenDropdown({
  index,
  active,
  collapsed,
  openDropdownIndex,
  setOpenDropdownIndex,
}: useAutoOpenDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref untuk dropdown

  // Effect untuk mengatur index dropdown yang terbuka
  useEffect(() => {
    if (index !== 0 && index !== 3) {
      // Kecualikan index 0 dan 3
      if (active && !collapsed) {
        // Buka dropdown jika aktif
      }
    }
  }, [active, collapsed, index, setOpenDropdownIndex, openDropdownIndex]);

  return { dropdownRef }; // Kembalikan ref dan lebar konten
}
