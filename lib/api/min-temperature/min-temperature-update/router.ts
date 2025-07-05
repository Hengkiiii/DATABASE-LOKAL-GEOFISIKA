interface UpdateMinTemperatureResponse {
  success: boolean;
  message: string;
  data: MinTemperatureData;
}
interface MinTemperatureData {
  id: number;
  min_temperature: number;
  date: string;
}
export async function updateMinTemperature(
  id: string,
  user_id: string,
  dataUpdate: {
    date: string;
    min_temperature: string;
  }
): Promise<UpdateMinTemperatureResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}min-temperature/update?id=${id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataUpdate),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "Gagal mengupdate data suhu udara minimum";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data suhu udara minimum"
    );
  }
}
