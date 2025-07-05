"use client";

import dynamic from "next/dynamic";
import React from "react";

// Impor dinamis tanpa SSR
const PetaRawanGempa = dynamic(
  () => import("@/components/common/PetaRawanGempa"),
  {
    ssr: false,
  }
);

export default function Page() {
  return <PetaRawanGempa />;
}
