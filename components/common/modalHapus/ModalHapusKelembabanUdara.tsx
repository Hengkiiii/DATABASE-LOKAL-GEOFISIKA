"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiXCircle, FiTrash2 } from "react-icons/fi";

interface DeleteModalProps {
  show: boolean;
  data: { tanggal: string; kelembabanRataRata: number } | null;
  onClose: () => void;
  onDelete: () => void;
  isDarkMode: boolean;
}

export default function ModalHapusKelembabanUdara({
  show,
  data,
  onClose,
  onDelete,
  isDarkMode,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {show && data && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
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
            <h2 className="text-lg font-semibold">Konfirmasi Hapus Data</h2>
            <p className="text-sm">
              Apakah kamu yakin ingin menghapus data kelembaban udara pada{" "}
              <strong>{data.tanggal}</strong> dengan nilai{" "}
              <strong>{data.kelembabanRataRata}%</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={onClose}
                buttonStyle="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                type="button"
                icon={<FiXCircle size={18} />}
              />

              <Button
                onClick={onDelete}
                buttonStyle="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                type="button"
                icon={<FiTrash2 size={18} />}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
