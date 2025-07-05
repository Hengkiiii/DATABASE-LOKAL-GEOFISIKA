import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";

interface DataFile {
  id: number;
  date: string;
  name: string;
  file_url: string;
  fileBase64: string;
}

interface ModalEditDataFileProps {
  show: boolean;
  data: DataFile | null;
  onClose: () => void;
  onSave: (data: DataFile) => void;
  isDarkMode: boolean;
  setData: React.Dispatch<React.SetStateAction<DataFile | null>>;
}

export default function ModalEditDataFile({
  show,
  data,
  onClose,
  onSave,
  isDarkMode,
  setData,
}: ModalEditDataFileProps) {
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
            <h3 className="text-lg font-semibold">Edit Data File</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm">tanggal:</label>
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">nama:</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">File (Base64):</label>
                <input
                  type="file"
                  value={data.fileBase64}
                  onChange={(e) =>
                    setData({ ...data, fileBase64: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
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
