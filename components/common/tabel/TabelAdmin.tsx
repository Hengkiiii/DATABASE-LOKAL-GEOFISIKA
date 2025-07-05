"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/common/Card";
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/common/Button";
import { getAdminAll } from "@/lib/api/admin/admin-get-all/router";
import { getAdmin } from "@/lib/api/admin/admin-get/router";
import ModalEditAdmin from "@/components/common/modalEdit/ModalEditAdmin";
import ModalHapusAdmin from "@/components/common/modalHapus/ModalHapusAdmin";
import { deleteAdmin } from "@/lib/api/admin/admin-delete/router";
import { editAdmin } from "@/lib/api/admin/admin-edit/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Admin {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
    role: string;
    userId: string;
}

export default function DaftarAdmin() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode] = useState(false);
    const [editAdminData, setEditAdminData] = useState<Admin | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    async function handleSave(updatedData: Admin & { file_base64?: string }) {
        if (!updatedData || !updatedData.userId) {
            toast.error("User ID tidak valid.");
            return;
        }

        const user_id = sessionStorage.getItem("user_id");
        if (!user_id) {
            toast.error("User ID tidak ditemukan di sessionStorage.");
            return;
        }

        try {
            await editAdmin(user_id, updatedData.userId, {
                first_name: updatedData.firstName,
                last_name: updatedData.lastName,
                email: updatedData.email,
                role: updatedData.role,
                file_base64: updatedData.file_base64,
            });

            setAdmins((prev) =>
                prev.map((a) => (a.id === updatedData.id ? updatedData : a))
            );
            toast.success("Data admin berhasil disimpan!");
            setShowEditModal(false);
        } catch (err) {
            toast.error((err as Error).message || "Gagal menyimpan perubahan.");
        }
    }

    async function handleDelete() {
        if (!adminToDelete || !adminToDelete.userId) {
            toast.error("User ID admin tidak valid.");
            return;
        }

        const user_id = sessionStorage.getItem("user_id");
        if (!user_id) {
            toast.error("User ID tidak ditemukan di sessionStorage.");
            return;
        }

        try {
            await deleteAdmin(adminToDelete.userId, user_id);
            setAdmins((prev) => prev.filter((a) => a.id !== adminToDelete.id));
            toast.success("Data admin berhasil dihapus!");
        } catch (err) {
            const message =
                (err as Error).message ||
                "Gagal menghapus admin. Silakan coba lagi.";
            toast.error(message);
        } finally {
            setShowDeleteModal(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [adminsData] = await Promise.all([getAdminAll()]);
                setAdmins(adminsData);
                setError(null);
            } catch (err) {
                const message =
                    (err as Error).message || "Gagal memuat data admin";
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <Card style="bg-white p-6 md:p-8 space-y-6 shadow-xl rounded-2xl mt-6 ml-6 mr-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Daftar Admin
                </h2>
                {loading && <p className="text-center">Memuat data admin...</p>}

                {error && (
                    <p className="text-center text-black">
                        Data tidak ditemukan.
                    </p>
                )}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700 border-collapse rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th></th>
                                    <th className="py-3 px-5 text-left">No</th>
                                    <th className="py-3 px-5 text-left">
                                        Email
                                    </th>
                                    <th className="py-3 px-5 text-left">
                                        Nama Lengkap
                                    </th>
                                    <th className="py-3 px-5 text-left">
                                        Role
                                    </th>
                                    <th className="py-3 px-5 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length > 0 ? (
                                    admins.map((admin, index) => (
                                        <tr
                                            key={admin.id}
                                            className={`${
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            } hover:bg-gray-100 transition`}
                                        >
                                            <td>
                                                <div className="flex justify-center items-center h-full">
                                                    <Image
                                                        src={admin.photoUrl}
                                                        alt={`${admin.firstName} ${admin.lastName}`}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-5">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 px-5">
                                                {admin.email}
                                            </td>
                                            <td className="py-3 px-5">
                                                {admin.firstName}{" "}
                                                {admin.lastName}
                                            </td>
                                            <td className="py-3 px-5 capitalize">
                                                {admin.role}
                                            </td>
                                            <td className="py-3 px-5">
                                                <div className="flex justify-center gap-3">
                                                    <Button
                                                        icon={<Pencil />}
                                                        buttonStyle="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm shadow-md hover:scale-105 transition"
                                                        onClick={async () => {
                                                            if (!admin.userId)
                                                                return;
                                                            const adminLoginData =
                                                                await getAdmin(
                                                                    admin.userId
                                                                );
                                                            setEditAdminData(
                                                                adminLoginData
                                                            );
                                                            setShowEditModal(
                                                                true
                                                            );
                                                        }}
                                                    />
                                                    <Button
                                                        icon={<Trash2 />}
                                                        buttonStyle="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow-md hover:scale-105 transition"
                                                        onClick={() => {
                                                            if (!admin.userId)
                                                                return;
                                                            setAdminToDelete(
                                                                admin
                                                            );
                                                            setShowDeleteModal(
                                                                true
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            Data admin tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ModalEditAdmin
                show={showEditModal}
                adminData={editAdminData}
                onClose={() => setShowEditModal(false)}
                onSave={handleSave}
                isDarkMode={isDarkMode}
            />
            <ModalHapusAdmin
                show={showDeleteModal}
                adminData={adminToDelete}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
                isDarkMode={isDarkMode}
            />
        </>
    );
}
