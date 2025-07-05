"use client";
import React, { useEffect, useState } from "react";
import Aktifitas from "@/components/common/RiwayatAktifitas";

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "operator" | null>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("user_id");
    const storedRole = sessionStorage.getItem("role") as "admin" | "operator";

    if (storedUserId && storedRole) {
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  if (!userId || !role) {
    return <div className="p-4 text-gray-500">Memuat data pengguna...</div>;
  }

  return <Aktifitas userId={userId} role={role} />;
}
