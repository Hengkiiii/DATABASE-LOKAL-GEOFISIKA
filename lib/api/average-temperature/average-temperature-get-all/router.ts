const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AverageTemperatureData {
  id: number;
  avg_temperature: number;
  avg_temperature_07: number;
  avg_temperature_13: number;
  avg_temperature_18: number;
  date: string;
}

interface GetAirAverageTemperatureResponse {
  success: boolean;
  message: string;
  data: AverageTemperatureData[];
}

export async function getAverageTemperatureAll(): Promise<
  AverageTemperatureData[]
> {
  try {
    const response = await fetch(`${API_BASE_URL}average-temperature/get-all`, {
      method: "GET",
    });

    const result: GetAirAverageTemperatureResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data suhu rata-rata udara";
      throw new Error(errorMessage);
    }

    console.log("Data tekanan udara berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      avg_temperature: item.avg_temperature,
      avg_temperature_07: item.avg_temperature_07,
      avg_temperature_13: item.avg_temperature_13,
      avg_temperature_18: item.avg_temperature_18,
      date: item.date,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data suhu rata-rata udara"
    );
  }
}
