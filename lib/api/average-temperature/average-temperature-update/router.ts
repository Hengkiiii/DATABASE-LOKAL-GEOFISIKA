const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function updateAverageTemperature(
  user_id: string,
  id: string,
  dataUpdate: {
    avg_temperature_07: number;
    avg_temperature_13: number;
    avg_temperature_18: number;
    date: string;
  }
) {
  const url = `${API_BASE_URL}average-temperature/update?id=${id}&user_id=${user_id}`;

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
        : data.message || "Gagal mengupdate suhu rata-rata udara";
      throw new Error(errorMessage);
    }

    console.log("Data suhu rata-rata udara berhasil diupdate:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate suhu rata-rata udara"
    );
  }
}
