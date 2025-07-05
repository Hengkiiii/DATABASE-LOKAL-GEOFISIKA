export async function editAdmin(
  user_id: string,
  id_role: string,
  dataUpdate: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    file_base64?: string;
  }
) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}admin/edit?user_id=${user_id}&id_role=${id_role}`;

  const payload = {
    user_id,
    id_role,
    ...dataUpdate,
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response dari server:", data);
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal mengedit admin";
      throw new Error(errorMessage);
    }

    console.log("Admin berhasil diedit:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mengedit admin"
    );
  }
}
