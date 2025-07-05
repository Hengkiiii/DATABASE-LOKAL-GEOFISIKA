const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface minTemperatureData {
  id: number;
  min_temperature: string;
  date: string;
}

interface tambahDataMinTemperature {
  success: boolean;
  message: string;
  data: minTemperatureData[];
}

export async function tambahDataMinTemperatureExcel(
  user_id: string,
  file_base64: string
): Promise<tambahDataMinTemperature> {
  try {
    const response = await fetch(
      `${API_BASE_URL}min-temperature/insert-excel?user_id=${encodeURIComponent(
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
      throw new Error(data.message || "Gagal menambahkan data minimum suhu");
    }

    return data as tambahDataMinTemperature;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data minimum suhu";
    throw new Error(message);
  }
}
