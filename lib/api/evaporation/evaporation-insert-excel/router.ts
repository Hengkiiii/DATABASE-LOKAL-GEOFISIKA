const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface EvaporationData {
  id: number;
  evaporation: number;
  date: string;
}

interface TambahEvaporationResponse {
  success: boolean;
  message: string;
  data: EvaporationData[];
}

export async function tambahDataEvaporationExcel(
  user_id: string,
  file_base64: string
): Promise<TambahEvaporationResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}evaporation/insert-excel?user_id=${encodeURIComponent(
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
      throw new Error(data.message || "Gagal menambahkan data penguapan");
    }

    return data as TambahEvaporationResponse;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data penguapan";
    throw new Error(message);
  }
}
