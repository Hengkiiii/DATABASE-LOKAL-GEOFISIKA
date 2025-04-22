import React from "react";
import { CardStatistikGempaProps } from "@/interface/common/CardStatistikGempaProps";
export default function CardStatistik({
  title,
  count,
  description,
  badge,
  color = "text-blue-600",
}: CardStatistikGempaProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 relative">
      {badge && (
        <span className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
          {badge}
        </span>
      )}
      <h2 className="text-gray-500 font-medium">{title}</h2>
      <p className={`text-4xl font-bold ${color}`}>{count}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
