const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getAverageTemperature(id: string | number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}average-temperature/get?id=${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Response JSON:", result);

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data suhu rata-rata";
      throw new Error(errorMessage);
    }

    const data = result.data;

    if (!data) {
      throw new Error("Data tekanan udara tidak ditemukan.");
    }

    console.log("Data tekanan udara berhasil diambil:", data);

    return {
      id: data.id,
      tanggal: data.date,
      suhuUdaraPagi: data.avg_temperature_07,
      SuhuUdaraSiang: data.avg_temperature_13,
      suhuUdaraSore: data.avg_temperature_18,
      suhuUdara:
        data.avg_temperature_07 +
        data.avg_temperature_13 +
        data.avg_temperature_18,
    };
  } catch (error) {
    console.error("Error getAirPressure:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data suhu rata-rata udara"
    );
  }
}
