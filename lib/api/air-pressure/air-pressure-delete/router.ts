const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteAirPressure(id: number, user_id: string) {
  const response = `${API_BASE_URL}air-pressure/delete?id=${id}&user_id=${user_id}`;

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
        : data.message || "Gagal menghapus data tekanan udara";

      if (data.error?.message) {
        throw new Error(`${errorMessage}: ${data.error.message}`);
      }

      throw new Error(errorMessage);
    }

    console.log("Data tekanan udara berhasil dihapus:", data);
    return data;
  } catch (error) {
    console.error("Error deleteAirPressure:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menghapus data tekanan udara"
    );
  }
}
