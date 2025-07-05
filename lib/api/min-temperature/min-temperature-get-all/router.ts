const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface minTemperatureData {
  id: number;
  min_temperature: string;
  date: string;
}

interface GetMinTemperatureResponse {
  success: boolean;
  message: string;
  data: minTemperatureData[];
}

export async function getMinTemperatureAll(): Promise<minTemperatureData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}min-temperature/get-all`, {
      method: "GET",
    });

    const result: GetMinTemperatureResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data Minimum Temperature";
      throw new Error(errorMessage);
    }

    console.log("Data Minimum Temperature berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      min_temperature: item.min_temperature,
      date: item.date,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data Minimum Temperature"
    );
  }
}
