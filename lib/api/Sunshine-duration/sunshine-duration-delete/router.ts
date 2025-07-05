const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteSunshineDuration(id: string, user_id: string) {
  const response = `${API_BASE_URL}sunshine-duration/delete?id=${id}&user_id=${user_id}`;

  try {
    const result = await fetch(response, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await result.json();

    if (!result.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal menghapus data durasi sinar matahari";
      throw new Error(errorMessage);
    }

    console.log("Data durasi sinar matahari berhasil dihapus:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menghapus data durasi sinar matahari"
    );
  }
}
