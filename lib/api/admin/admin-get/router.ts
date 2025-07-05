const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getAdmin(user_id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}admin/get?user_id=${user_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal mengambil data admin login";
      throw new Error(errorMessage);
    }

    console.log("Data admin login berhasil diambil:", data);

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      photoUrl: data.photo,
      role: data.role,
      userId: data.user_id || "",
    };
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data admin login"
    );
  }
}
