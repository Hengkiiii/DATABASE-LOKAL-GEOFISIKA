const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AverageTemperatureItem {
  id: number;
  avg_temperature_07: string;
  avg_temperature_13: string;
  avg_temperature_18: string;
  avg_temperature: string;
  date: string;
}

export async function getAverageTemperatureByDate(
  startDate: string,
  endDate: string
) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}average-temperature/get-by-date?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();
    console.log("Response:", result);

    if (!response.ok || result.success === false) {
      const errorMessage =
        result.message ||
        "Gagal mengambil data suhu rata-rata udara berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: AverageTemperatureItem) => ({
      id: item.id,
      avg_temperature_07: item.avg_temperature_07,
      avg_temperature_13: item.avg_temperature_13,
      avg_temperature_18: item.avg_temperature_18,
      avg_temperature: item.avg_temperature,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error saat fetch data suhu rata-rata by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data suhu rata-rata udara"
    );
  }
}
