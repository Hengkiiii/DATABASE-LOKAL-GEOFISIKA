import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";

interface Admin {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  role: string;
  userId: string;
}

interface ModalEditAdminProps {
  show: boolean;
  adminData: Admin | null;
  onClose: () => void;
  onSave: (updatedAdmin: Admin) => void;
  isDarkMode: boolean;
}

export default function ModalEditAdmin({
  show,
  adminData,
  onClose,
  onSave,
  isDarkMode,
}: ModalEditAdminProps) {
  const [data, setData] = useState<Admin | null>(null);

  useEffect(() => {
    if (adminData) setData(adminData);
  }, [adminData]);

  if (!data) return null;

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
            <h3 className="text-lg font-semibold">Edit Data Admin</h3>

            <div className="space-y-3">
              <label className="block">
                <span>Email</span>
                <input
                  type="email"
                  value={data.email || ""}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </label>

              <label className="block">
                <span>Nama Depan</span>
                <input
                  type="text"
                  value={data.firstName ?? ""}
                  onChange={(e) =>
                    setData({ ...data, firstName: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </label>

              <label className="block">
                <span>Nama Belakang</span>
                <input
                  type="text"
                  value={data.lastName ?? ""}
                  onChange={(e) =>
                    setData({ ...data, lastName: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </label>

              <label className="block">
                <span>Role</span>
                <select
                  value={data.role ?? ""}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-md bg-white text-black dark:bg-[#2a2a40] dark:text-white appearance-none"
                >
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                </select>
              </label>

              <label className="block">
                <span>Photo URL</span>
                <input
                  type="text"
                  value={data.photoUrl ?? ""}
                  onChange={(e) =>
                    setData({ ...data, photoUrl: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </label>
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
