const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface maxTemperatureData {
  id: number;
  max_temperature: string;
  date: string;
}

interface tambahDataMaxTemperature {
  success: boolean;
  message: string;
  data: maxTemperatureData[];
}

export async function tambahDataMaxTemperatureExcel(
  user_id: string,
  file_base64: string
): Promise<tambahDataMaxTemperature> {
  try {
    const response = await fetch(
      `${API_BASE_URL}max-temperature/insert-excel?user_id=${encodeURIComponent(
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
      throw new Error(data.message || "Gagal menambahkan data maksimum suhu");
    }

    return data as tambahDataMaxTemperature;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data maksimum suhu";
    throw new Error(message);
  }
}
