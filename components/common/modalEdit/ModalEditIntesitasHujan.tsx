import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";
import InputField from "@/components/common/InputField";

interface TableIntensitasHujan {
  id: number;
  name: string;
  tanggal: string;
  file_base64: string;
}

interface ModalEditIntensitasHujanProps {
  show: boolean;
  data: TableIntensitasHujan | null;
  onClose: () => void;
  onSave: (data: TableIntensitasHujan) => void;
  isDarkMode: boolean;
  setData: React.Dispatch<React.SetStateAction<TableIntensitasHujan | null>>;
}

export default function ModalEditIntensitasHujan({
  show,
  data,
  onClose,
  onSave,
  isDarkMode,
  setData,
}: ModalEditIntensitasHujanProps) {
  if (!show || !data) return null;

  return (
    <AnimatePresence>
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
            isDarkMode ? "bg-[#232136] text-gray-100" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Edit Data Intensitas Hujan</h3>
          <div className="space-y-4">
            <InputField
              label="Tanggal"
              type="date"
              value={data.tanggal}
              onChange={(e) => setData({ ...data, tanggal: e.target.value })}
              darkMode={isDarkMode}
            />
            <InputField
              label="Nama"
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              darkMode={isDarkMode}
            />
            <InputField
              label="File Base64"
              type="text"
              value={data.file_base64}
              onChange={(e) =>
                setData({ ...data, file_base64: e.target.value })
              }
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
              onClick={() => onSave(data)}
              icon={<FiSave size={18} />}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
