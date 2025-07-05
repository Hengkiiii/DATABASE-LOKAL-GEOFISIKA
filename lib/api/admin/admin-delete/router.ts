export async function deleteAdmin(user_id: string, id_role: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const url = `${API_BASE_URL}admin/delete?user_id=${user_id}&id_role=${id_role}`;
  console.log("URL Hapus:", url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal menghapus admin";
      throw new Error(errorMessage);
    }

    console.log("Admin berhasil dihapus:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat menghapus admin"
    );
  }
}
