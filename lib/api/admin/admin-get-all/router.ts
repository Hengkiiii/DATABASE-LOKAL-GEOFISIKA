const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AdminResponseItem {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
  role: string;
  user_id?: string;
}

export async function getAdminAll() {
  try {
    const response = await fetch(`${API_BASE_URL}admin/get-all`, {
      method: "GET",
    });
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal mengambil data admin";
      throw new Error(errorMessage);
    }

    console.log("Data admin berhasil diambil:", data);

    return data.map((admin: AdminResponseItem) => ({
      id: admin.id,
      email: admin.email,
      firstName: admin.first_name,
      lastName: admin.last_name,
      photoUrl: admin.photo,
      role: admin.role,
      userId: admin.user_id || "",
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mengambil data admin"
    );
  }
}
