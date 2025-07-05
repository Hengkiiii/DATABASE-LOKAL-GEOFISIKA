import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiTrash2, FiXCircle } from "react-icons/fi";

interface ModalDeletePenguapanProps {
  show: boolean;
  data: { tanggal: string; penguapan: string } | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function ModalDeletePenguapan({
  show,
  data,
  onClose,
  onDelete,
}: ModalDeletePenguapanProps) {
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
              Apakah Anda yakin ingin menghapus data penguapan tanggal{" "}
              <span className="font-medium">{data.tanggal}</span>?
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                buttonStyle="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                onClick={onClose}
                icon={<FiXCircle size={18} />}
                type="button"
              />
              <Button
                buttonStyle="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md transition duration-200"
                onClick={onDelete}
                icon={<FiTrash2 size={18} />}
                type="button"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
