const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateHumidity(
  user_id: string,
  id: string,
  dataUpdate: {
    date: string;
    humidity_07: number;
    humidity_13: number;
    humidity_18: number;
  }
) {
  const url = `${API_BASE_URL}humidity/update?id=${id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataUpdate),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response dari server:", data);
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal mengupdate data kelembapan udara";
      throw new Error(errorMessage);
    }

    console.log("Data kelembapan udara berhasil diupdate:", data);
    return data;
  } catch (error) {
    console.error("Error updateHumidity:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data kelembapan udara"
    );
  }
}
