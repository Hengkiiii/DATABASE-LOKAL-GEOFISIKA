// ✅ file: app/dashboard/geofisika/peta/page.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";

// 🧠 Dynamic import component peta dan disable SSR
const GempaMap = dynamic(() => import("@/components/common/GempaMap"), {
  ssr: false,
});

export default function Page() {
  return <GempaMap />;
}
