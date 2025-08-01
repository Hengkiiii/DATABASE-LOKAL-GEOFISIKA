import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { X, Trash2 } from "lucide-react";

interface ModalHapusKecepatanAnginProps {
  show: boolean;
  data: {
    tanggal: string;
    kecepatan: number;
    arahTerbanyak: string;
    kecepatanTerbesar: number;
    arah: string;
  } | null;
  onClose: () => void;
  onDelete: () => void;
  isDarkMode: boolean;
}

export default function ModalHapusKecepatanAngin({
  show,
  data,
  onClose,
  onDelete,
  isDarkMode,
}: ModalHapusKecepatanAnginProps) {
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
              Hapus Data Kecepatan Angin
            </h3>
            <p className="text-sm">
              Apakah Anda yakin ingin menghapus data tanggal{" "}
              <span className="font-semibold">{data.tanggal}</span> dengan
              kecepatan{" "}
              <span className="font-semibold">{data.kecepatan} km/h</span>, arah
              terbanyak{" "}
              <span className="font-semibold">{data.arahTerbanyak}</span>,
              kecepatan terbesar{" "}
              <span className="font-semibold">
                {data.kecepatanTerbesar} km/h
              </span>
              , dan arah <span className="font-semibold">{data.arah}</span>?
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
