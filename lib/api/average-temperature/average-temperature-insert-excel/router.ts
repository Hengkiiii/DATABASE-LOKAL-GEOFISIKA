const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AverageTemperatureData {
  id: number;
  avg_temperature: number;
  avg_temperature_07: number;
  avg_temperature_13: number;
  avg_temperature_18: number;
  date: string;
}

interface tambahDataAverageTemperatureResponse {
  success: boolean;
  message: string;
  data: AverageTemperatureData[];
}

export async function tambahDataAverageTemperatureExcel(
  user_id: string,
  file_base64: string
): Promise<tambahDataAverageTemperatureResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}average-temperature/insert-excel?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_base64 }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal menambahkan data suhu rata-rata udara"
      );
    }

    return data as tambahDataAverageTemperatureResponse;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data suhu rata-rata udara"
    );
  }
}
