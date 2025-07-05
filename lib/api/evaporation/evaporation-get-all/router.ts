const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface EvaporationData {
  id: number;
  evaporation: string;
  date: string;
}

interface GetEvaporationResponse {
  success: boolean;
  message: string;
  data: EvaporationData[];
}

export async function getEvaporationAll(): Promise<EvaporationData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}evaporation/get-all`, {
      method: "GET",
    });

    const result: GetEvaporationResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data penguapan";
      throw new Error(errorMessage);
    }

    console.log("Data penguapan berhasil diambil:", result.data);

    // langsung return data karena properti sudah sesuai
    return result.data.map((item) => ({
      id: item.id,
      evaporation: item.evaporation,
      date: item.date,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data penguapan"
    );
  }
}
