"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { X, Trash2 } from "lucide-react";

interface ModalHapusGempaProps {
  show: boolean;
  data: {
    id: number;
    dateTime: string;
    lintang: string;
    bujur: string;
    kedalaman: number;
    magnitudo: number;
  } | null;
  onClose: () => void;
  onDelete: () => void;
  isDarkMode: boolean;
}

export default function ModalHapusGempa({
  show,
  data,
  onClose,
  onDelete,
  isDarkMode,
}: ModalHapusGempaProps) {
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
            <h3 className="text-lg font-semibold">Hapus Data Gempa</h3>
            <p className="text-sm">
              Apakah Anda yakin ingin menghapus data gempa pada{" "}
              <span className="font-semibold">{data.dateTime}</span> pukul{" "}
              <span className="font-semibold">{data.dateTime}</span> di lokasi{" "}
              <span className="font-semibold">
                {data.lintang}, {data.bujur}
              </span>
              ?
            </p>
            <p className="text-sm">
              Dengan kedalaman{" "}
              <span className="font-semibold">{data.kedalaman} km</span> dan
              magnitudo <span className="font-semibold">{data.magnitudo}</span>?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                icon={<X size={16} />}
                buttonStyle="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white text-sm"
                onClick={onClose}
                type="button"
              />
              <Button
                icon={<Trash2 size={16} />}
                buttonStyle="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                onClick={onDelete}
                type="button"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
