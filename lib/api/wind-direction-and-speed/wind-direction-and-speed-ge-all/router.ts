const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface WindData {
  id: number;
  date: string;
  speed: number;
  max_speed: number;
  direction: string;
  most_frequent_direction: string;
}

interface GetWindDataResponse {
  success: boolean;
  message: string;
  data: WindData[];
}

export async function getAllDataAngin(): Promise<WindData[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}wind-direction-and-speed/get-all`,
      {
        method: "GET",
      }
    );

    const result: GetWindDataResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data arah dan kecepatan angin";
      throw new Error(errorMessage);
    }

    console.log("Data angin berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      date: item.date,
      speed: item.speed,
      max_speed: item.max_speed,
      direction: item.direction,
      most_frequent_direction: item.most_frequent_direction,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data arah dan kecepatan angin"
    );
  }
}
