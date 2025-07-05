"use client";

import React from "react";
import dynamic from "next/dynamic";

const GempaMap = dynamic(() => import("@/components/common/GempaMap"), {
  ssr: false,
});

export default function Page() {
  return <GempaMap />;
}
