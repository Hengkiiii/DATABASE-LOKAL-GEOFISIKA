const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function updateAirPressure(
  user_id: string,
  id: string,
  dataUpdate: {
    air_pressure_07: number;
    air_pressure_13: number;
    air_pressure_18: number;
    date: string;
  }
) {
  const url = `${API_BASE_URL}air-pressure/update?id=${id}&user_id=${user_id}`;

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
        : data.message || "Gagal mengupdate tekanan udara";
      throw new Error(errorMessage);
    }

    console.log("Tekanan udara berhasil diupdate:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate tekanan udara"
    );
  }
}
