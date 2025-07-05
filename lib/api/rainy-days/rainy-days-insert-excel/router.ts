const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RainyDayData {
  id: number;
  rainy_day: string;
  date: string;
}

interface TambahHariHujanResponse {
  success: boolean;
  message: string;
  data: RainyDayData[];
}

export async function tambahDataHariHujanExcel(
  user_id: string,
  file_base64: string
): Promise<TambahHariHujanResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}rainy-days/insert-excel?user_id=${encodeURIComponent(
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
      throw new Error(data.message || "Gagal menambahkan data hari hujan");
    }

    return data as TambahHariHujanResponse;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data hari hujan";
    throw new Error(message);
  }
}
