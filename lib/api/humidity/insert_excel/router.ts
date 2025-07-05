const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HumidityData {
  humidity_07: number;
  humidity_13: number;
  humidity_18: number;
  date: string;
}

interface TambahKelembabanResponse {
  success: boolean;
  message: string;
  data: HumidityData[];
}

export async function tambahDataKelembabanExcel(
  user_id: string,
  file_base64: string
): Promise<TambahKelembabanResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}humidity/insert-excel?user_id=${encodeURIComponent(
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
      throw new Error(data.message || "Gagal menambahkan data kelembaban");
    }

    return data as TambahKelembabanResponse;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data kelembaban"
    );
  }
}
