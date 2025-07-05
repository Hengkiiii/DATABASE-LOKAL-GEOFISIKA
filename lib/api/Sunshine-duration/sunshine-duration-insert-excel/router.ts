const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface sunshineDurationeData {
  id: number;
  sunshine_duration: string;
  date: string;
}

interface tambahDataSunshineDuration {
  success: boolean;
  message: string;
  data: sunshineDurationeData[];
}

export async function tambahDataSunshineDurationExcel(
  user_id: string,
  file_base64: string
): Promise<tambahDataSunshineDuration> {
  try {
    const response = await fetch(
      `${API_BASE_URL}sunshine-duration/insert-excel?user_id=${encodeURIComponent(
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
        data.message || "Gagal menambahkan data durasi sinar matahari"
      );
    }

    return data as tambahDataSunshineDuration;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menambahkan data durasi sinar matahari";
    throw new Error(message);
  }
}
