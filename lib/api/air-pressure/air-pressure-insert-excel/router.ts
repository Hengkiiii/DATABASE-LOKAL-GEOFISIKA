const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AirPressureItem {
  id: number;
  air_pressure: number;
  air_pressure_07: number;
  air_pressure_13: number;
  air_pressure_18: number;
  date: string;
}

interface TambahTekananUdaraResponse {
  success: boolean;
  message: string;
  data: AirPressureItem[];
}

export async function tambahDataTekananUdaraExcel(
  user_id: string,
  file_base64: string
): Promise<TambahTekananUdaraResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}air-pressure/insert-excel?user_id=${encodeURIComponent(
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
      throw new Error(data.message || "Gagal menambahkan data tekanan udara");
    }

    return data as TambahTekananUdaraResponse;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data tekanan udara"
    );
  }
}
