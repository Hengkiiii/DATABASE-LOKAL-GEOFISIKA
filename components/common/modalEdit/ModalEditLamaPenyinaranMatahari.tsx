"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";
import InputField from "@/components/common/InputField";

interface TabelLamaPenyinaran {
  id: number;
  date: string;
  sunshine_duration: string;
}

interface ModalEditLamaPenyinaranProps {
  show: boolean;
  data: TabelLamaPenyinaran | null;
  onClose: () => void;
  onSave: (data: TabelLamaPenyinaran) => void;
  isDarkMode: boolean;
  setData: React.Dispatch<React.SetStateAction<TabelLamaPenyinaran | null>>;
}

export default function ModalEditLamaPenyinaran({
  show,
  data,
  onClose,
  onSave,
  isDarkMode,
  setData,
}: ModalEditLamaPenyinaranProps) {
  return (
    <AnimatePresence>
      {show && data && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-3xl rounded-xl p-6 shadow-lg space-y-4 ${
              isDarkMode
                ? "bg-[#232136] text-gray-100"
                : "bg-white text-gray-800"
            }`}
          >
            <h3 className="text-lg font-semibold">
              Edit Data Lama Penyinaran Matahari
            </h3>
            <div className="space-y-4">
              <InputField
                label="Tanggal"
                type="date"
                value={data.date.toString()}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                darkMode={isDarkMode}
              />
              <InputField
                label="Lama Penyinaran (jam)"
                type="number"
                value={data.sunshine_duration}
                onChange={(e) => {
                  const value = e.target.value;
                  setData({ ...data, sunshine_duration: value });
                }}
                darkMode={isDarkMode}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                onClick={onClose}
                icon={<FiXCircle size={18} />}
                type="button"
              />

              <Button
                type="button"
                buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                onClick={() => onSave?.(data)}
                icon={<FiSave size={18} />}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
