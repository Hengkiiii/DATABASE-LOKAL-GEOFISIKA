"use client";
import { useState } from "react";
import { FiSave, FiXCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import { useModal } from "@/context/ModalContext";
import TabelDataSestifitas from "@/components/common/tabel/TabelDataSestifitas";
import { tambahDataMicrothermor } from "@/lib/api/microthermor/microthermor-insert/router";

export default function MicrothermorPage() {
    const { isOpenModal, setIsOpenModal } = useModal();
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [FO, setFO] = useState("");
    const [AO, setAO] = useState("");
    const [TDOM, setTDOM] = useState("");
    const [KG, setKG] = useState("");

    const resetForm = () => {
        setLatitude("");
        setLongitude("");
        setFO("");
        setAO("");
        setTDOM("");
        setKG("");
    };

    const handleSubmit = async () => {
        const user_id = sessionStorage.getItem("user_id");
        if (!user_id) {
            toast.error("User ID tidak ditemukan. Silakan login ulang.");
            return;
        }

        if (!latitude || !longitude || !FO || !AO || !TDOM || !KG) {
            toast.warning("Semua kolom harus diisi");
            return;
        }

        try {
            await tambahDataMicrothermor(
                user_id,
                latitude,
                longitude,
                parseFloat(FO),
                parseFloat(AO),
                parseFloat(TDOM),
                parseFloat(KG)
            );

            toast.success("Data mikrotermor berhasil ditambahkan");
            setIsOpenModal(false);
            resetForm();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(
                    error.message || "Gagal menambahkan data mikrotermor"
                );
            } else {
                toast.error("Gagal menambahkan data mikrotermor");
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="p-6 space-y-4">
                <TabelDataSestifitas />

                <Modal
                    title="Tambah Data Mikrotermor"
                    isOpen={isOpenModal}
                    onClose={() => {
                        setIsOpenModal(false);
                        resetForm();
                    }}
                >
                    <div className="space-y-4 mt-4 px-6">
                        <InputField
                            label="Latitude :"
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                        />
                        <InputField
                            label="Longitude :"
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                        />
                        <InputField
                            label="FO :"
                            type="number"
                            value={FO}
                            onChange={(e) => setFO(e.target.value)}
                        />
                        <InputField
                            label="AO :"
                            type="number"
                            value={AO}
                            onChange={(e) => setAO(e.target.value)}
                        />
                        <InputField
                            label="TDOM :"
                            type="number"
                            value={TDOM}
                            onChange={(e) => setTDOM(e.target.value)}
                        />
                        <InputField
                            label="KG :"
                            type="number"
                            value={KG}
                            onChange={(e) => setKG(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 px-6 pb-4">
                        <Button
                            type="button"
                            icon={<FiXCircle size={18} />}
                            onClick={() => {
                                setIsOpenModal(false);
                                resetForm();
                            }}
                            buttonStyle="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md transition"
                        />
                        <Button
                            type="button"
                            icon={<FiSave size={18} />}
                            onClick={handleSubmit}
                            buttonStyle="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md shadow-md transition"
                        />
                    </div>
                </Modal>
            </div>
        </>
    );
}
