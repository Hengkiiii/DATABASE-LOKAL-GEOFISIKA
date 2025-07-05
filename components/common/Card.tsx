import React from "react";
import { CardProps } from "@/interface/common/CardProps";

// Komponen Kartu
export default function Card({ style, children }: CardProps) {
    return <div className={`${style} shadow rounded `}>{children}</div>;
}
