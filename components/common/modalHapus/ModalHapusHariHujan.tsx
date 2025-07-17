import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { X, Trash2 } from "lucide-react";

interface ModalHapusProps {
  show: boolean;
  data: { date: string; rainyDay: string } | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function ModalHapus({
  show,
  data,
  onClose,
  onDelete,
}: ModalHapusProps) {
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
            className="w-full max-w-3xl rounded-xl p-6 shadow-lg space-y-4 bg-white text-gray-800"
          >
            <h3 className="text-lg font-semibold">Konfirmasi Hapus Data</h3>
            <p className="text-sm">
              Apakah Anda yakin ingin menghapus data hari hujan tanggal{" "}
              <span className="font-medium">{data.date}</span> dengan hari
              <span className="font-medium">{data.rainyDay}</span>
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                icon={<X size={16} />}
                buttonStyle="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                onClick={onClose}
                type="button"
              />
              <Button
                icon={<Trash2 size={16} />}
                buttonStyle="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
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
