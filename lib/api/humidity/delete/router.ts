const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteHumidity(id: string, user_id: string) {
  const url = `${API_BASE_URL}humidity/delete?id=${id}&user_id=${user_id}`;

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
        : data.message || "Gagal menghapus data kelembapan udara";

      if (data.error?.message) {
        throw new Error(`${errorMessage}: ${data.error.message}`);
      }

      throw new Error(errorMessage);
    }

    console.log("Data kelembapan udara berhasil dihapus:", data);
    return data;
  } catch (error) {
    console.error("Error deleteHumidity:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menghapus data kelembapan udara"
    );
  }
}
