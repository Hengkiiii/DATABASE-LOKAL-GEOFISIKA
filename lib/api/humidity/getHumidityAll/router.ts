const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface HumidityData {
  id: string;
  avg_humidity: number;
  humidity_07: number;
  humidity_13: number;
  humidity_18: number;
  date: string;
}

interface GetHumidityResponse {
  success: boolean;
  message: string;
  data: HumidityData[];
}

export async function getAllHumidityAll(): Promise<HumidityData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}humidity/get-all`, {
      method: "GET",
    });

    const result: GetHumidityResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data kelembapan";
      throw new Error(errorMessage);
    }

    console.log("Data kelembapan berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      avg_humidity: item.avg_humidity,
      humidity_07: item.humidity_07,
      humidity_13: item.humidity_13,
      humidity_18: item.humidity_18,
      date: item.date,
    }));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat mengambil data kelembapan"
    );
  }
}
