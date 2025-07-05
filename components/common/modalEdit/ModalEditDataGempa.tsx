"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";

interface GempaData {
  id: number;
  dateTime: string;
  lintang: string;
  bujur: string;
  kedalaman: number;
  magnitudo: number;
  mmi: string | null;
  keterangan: string;
  observer: string;
}

interface ModalEditGempaProps {
  show: boolean;
  data: GempaData | null;
  isDarkMode: boolean;
  onClose: () => void;
  onSave: (data: GempaData) => void;
  setData: React.Dispatch<React.SetStateAction<GempaData | null>>;
}

export default function ModalEditGempa({
  show,
  data,
  onClose,
  onSave,
  setData,
}: ModalEditGempaProps) {
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
            className="w-full max-w-2xl rounded-xl p-6 shadow-lg space-y-4 bg-white text-gray-800"
          >
            <h3 className="text-lg font-semibold">Edit Data Gempa</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Tanggal:</label>
                <input
                  type="date"
                  value={data?.dateTime?.split("T")[0] ?? ""}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev!,
                      dateTime: `${e.target.value}T${
                        data?.dateTime?.split("T")[1] ?? "00:00:00"
                      }`,
                    }))
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">Waktu:</label>
                <input
                  type="time"
                  value={data?.dateTime?.split("T")[1]?.slice(0, 5) ?? ""}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev!,
                      dateTime: `${
                        data?.dateTime?.split("T")[0] ?? "1970-01-01"
                      }T${e.target.value}:00`,
                    }))
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">Lintang:</label>
                <input
                  type="text"
                  value={data.lintang}
                  onChange={(e) =>
                    setData({ ...data, lintang: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">Bujur:</label>
                <input
                  type="text"
                  value={data.bujur}
                  onChange={(e) => setData({ ...data, bujur: e.target.value })}
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">Kedalaman (km):</label>
                <input
                  type="number"
                  step="0.1"
                  value={data.kedalaman}
                  onChange={(e) =>
                    setData({ ...data, kedalaman: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">Magnitudo:</label>
                <input
                  type="number"
                  step="0.1"
                  value={data.magnitudo}
                  onChange={(e) =>
                    setData({ ...data, magnitudo: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">MMI:</label>
                <input
                  type="text"
                  step="0.1"
                  value={data.mmi ?? ""}
                  onChange={(e) => setData({ ...data, mmi: e.target.value })}
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm">Observer:</label>
                <input
                  type="text"
                  value={data.observer}
                  onChange={(e) =>
                    setData({ ...data, observer: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm">Keterangan:</label>
                <textarea
                  value={data.keterangan}
                  onChange={(e) =>
                    setData({ ...data, keterangan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border bg-white border-gray-300 text-gray-800"
                  rows={3}
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
