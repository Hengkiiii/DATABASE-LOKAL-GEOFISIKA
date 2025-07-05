const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ParsedEarthquakeItem {
  id: number;
  date: string;
  time: string;
  mmi: string | null;
  description: string;
  depth: number;
  latitude: number;
  longitude: number;
  magnitude: number;
  observer_name: string;
}

interface TambahDataGempaParseResponse {
  success: boolean;
  message: string;
  data: ParsedEarthquakeItem[];
}

export async function tambahDataGempaDariTeks(
  user_id: string,
  input: string
): Promise<TambahDataGempaParseResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}earthquake/insert-parse?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data dari input teks");
    }

    return data as TambahDataGempaParseResponse;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat menambahkan data"
    );
  }
}
