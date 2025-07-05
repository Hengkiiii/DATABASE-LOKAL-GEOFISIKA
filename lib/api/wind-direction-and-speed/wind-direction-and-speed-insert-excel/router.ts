const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface WindData {
  id: number;
  date: string;
  speed: number;
  max_speed: number;
  direction: string;
  most_frequent_direction: string;
}

interface TambahArahKecepatanAnginResponse {
  success: boolean;
  message: string;
  data: WindData[];
}

export async function tambahDataArahKecepatanAnginExcel(
  user_id: string,
  file_base64: string
): Promise<TambahArahKecepatanAnginResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}wind-direction-and-speed/insert-excel?user_id=${encodeURIComponent(
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
        data.message || "Gagal menambahkan data arah dan kecepatan angin"
      );
    }

    return data as TambahArahKecepatanAnginResponse;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data arah dan kecepatan angin";
    throw new Error(message);
  }
}
