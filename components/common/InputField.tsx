"use client";
import React, { FC } from "react";
import { useMedia } from "react-use";
import { FloatingLabelFormProps } from "@/interface/common/FloatingLabelFormProps";

const InputField: FC<FloatingLabelFormProps> = ({
  type,
  icon,
  label,
  placeholder,
  value,
  accept,
  extraContent,
  onChange,
}) => {
  const isDarkMode = useMedia("(prefers-color-scheme: dark)", false);

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      <label
        className={`text-sm font-medium ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {label}
      </label>

      {/* Input dengan border */}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          accept={accept}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          className={`w-full py-2 px-3 rounded-md border outline-none text-sm sm:text-base ${
            icon ? "pl-10" : ""
          } ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              : "bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
          } outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
        />
      </div>
      {/* Extra content (optional) */}
      {extraContent && (
        <div className="mt-1 text-xs text-gray-500">{extraContent}</div>
      )}
    </div>
  );
};

export default InputField;
