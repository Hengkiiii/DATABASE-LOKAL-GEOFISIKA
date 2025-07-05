const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface sunshineDurationData {
  id: number;
  sunshine_duration: string;
  date: string;
}

interface getSunshineDurationResponse {
  success: boolean;
  message: string;
  data: sunshineDurationData[];
}

export async function getSunshineDurationAll(): Promise<
  sunshineDurationData[]
> {
  try {
    const response = await fetch(`${API_BASE_URL}sunshine-duration/get-all`, {
      method: "GET",
    });

    const result: getSunshineDurationResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data durasi sinar matahari";
      throw new Error(errorMessage);
    }

    console.log("Data durasi sinar matahari berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      sunshine_duration: item.sunshine_duration,
      date: item.date,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data durasi sinar matahari"
    );
  }
}
