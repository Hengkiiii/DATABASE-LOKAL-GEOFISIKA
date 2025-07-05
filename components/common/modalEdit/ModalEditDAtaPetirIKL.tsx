import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { FiSave, FiXCircle } from "react-icons/fi";

interface DataPetir {
    tanggal: string;
    nama: string;
    unduhLink: string;
}

interface ModalEditPetirProps {
    show: boolean;
    data: DataPetir | null;
    onClose: () => void;
    onSave: (updatedData: DataPetir) => void;
    isDarkMode: boolean;
    setData: React.Dispatch<React.SetStateAction<DataPetir | null>>;
}

export default function ModalEditPetir({
    show,
    data,
    onClose,
    onSave,
    isDarkMode,
}: ModalEditPetirProps) {
    const [formData, setFormData] = useState<DataPetir>({
        tanggal: "",
        nama: "",
        unduhLink: "",
    });

    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
                    className={`w-full max-w-2xl rounded-xl p-6 shadow-lg space-y-4 ${
                        isDarkMode
                            ? "bg-[#232136] text-gray-100"
                            : "bg-white text-gray-800"
                    }`}
                >
                    <h3 className="text-lg font-semibold">
                        Edit Data Petir IKL
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tanggal
                            </label>
                            <input
                                type="date"
                                name="tanggal"
                                value={formData.tanggal}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Nama
                            </label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Link Unduh
                            </label>
                            <input
                                type="text"
                                name="unduhLink"
                                value={formData.unduhLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm"
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
        </AnimatePresence>
    );
}
