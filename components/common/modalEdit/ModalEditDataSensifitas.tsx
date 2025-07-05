import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";

interface SensifitasData {
  id: number;
  lat: string;
  long: string;
  Fo: string;
  Ao: string;
  Tdom: string;
  Kg: string;
}

interface ModalEditPenguapanProps {
  show: boolean;
  data: SensifitasData | null;
  onClose: () => void;
  onSave: (data: SensifitasData) => void;
  isDarkMode: boolean;
  setData: React.Dispatch<React.SetStateAction<SensifitasData | null>>;
}

export default function ModalEditDataSensifitas({
  show,
  data,
  onClose,
  onSave,
  isDarkMode,
  setData,
}: ModalEditPenguapanProps) {
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
            <h3 className="text-lg font-semibold">Edit Data Sensitivitas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Latitude:</label>
                <input
                  type="text"
                  value={data.lat}
                  onChange={(e) => setData({ ...data, lat: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">Longitude:</label>
                <input
                  type="text"
                  value={data.long}
                  onChange={(e) => setData({ ...data, long: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">Fo:</label>
                <input
                  type="text"
                  value={data.Fo}
                  onChange={(e) => setData({ ...data, Fo: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">Ao:</label>
                <input
                  type="text"
                  value={data.Ao}
                  onChange={(e) => setData({ ...data, Ao: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">Tdom:</label>
                <input
                  type="text"
                  value={data.Tdom}
                  onChange={(e) => setData({ ...data, Tdom: e.target.value })}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-[#18171F] border-gray-700 text-gray-100"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="text-sm">Kg:</label>
                <input
                  type="text"
                  value={data.Kg}
                  onChange={(e) => setData({ ...data, Kg: e.target.value })}
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
                onClick={() => onSave(data)}
                icon={<FiSave size={18} />}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
