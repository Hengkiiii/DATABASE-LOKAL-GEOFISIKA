interface UpdateMaxTemperatureResponse {
  success: boolean;
  message: string;
  data: MaxTemperatureData;
}
interface MaxTemperatureData {
  id: number;
  max_temperature: number;
  date: string;
}
export async function updateMaxTemperature(
  id: string,
  user_id: string,
  dataUpdate: {
    date: string;
    max_temperature: string;
  }
): Promise<UpdateMaxTemperatureResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}max-temperature/update?id=${id}&user_id=${user_id}`;

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
        errorData.message || "Gagal mengupdate data suhu udara maksimum";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data suhu udara maksimum"
    );
  }
}
