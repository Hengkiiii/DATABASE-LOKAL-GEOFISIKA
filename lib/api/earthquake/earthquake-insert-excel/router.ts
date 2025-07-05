const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface GempaData {
  id: number;
  date: string;
  time: string;
  mmi: string;
  description: string;
  depth: number;
  latitude: number;
  longitude: number;
  magnitude: number;
  observer_name: string;
}

interface TambahDataGempaExcelResponse {
  success: boolean;
  message: string;
  data: GempaData[];
}

export async function tambahDataGempaExcel(
  user_id: string,
  file_base64: string
): Promise<TambahDataGempaExcelResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}earthquake/insert-excel?user_id=${encodeURIComponent(
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
        data.message || "Gagal menambahkan data gempa dari Excel"
      );
    }

    return data as TambahDataGempaExcelResponse;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data gempa dari Excel";
    throw new Error(message);
  }
}
