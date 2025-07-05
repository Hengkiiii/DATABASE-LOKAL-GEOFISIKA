const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface RainyDayData {
  id: number;
  date: string;
  rainy_day: number;
}

interface GetRainyDaysResponse {
  success: boolean;
  message: string;
  data: RainyDayData[];
}

export async function getRainyDaysAll(): Promise<RainyDayData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}rainy-days/get-all`, {
      method: "GET",
    });

    const result: GetRainyDaysResponse = await response.json();
    console.log("Response:", result);

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data hari hujan";
      throw new Error(errorMessage);
    }

    return result.data.map((item) => ({
      id: item.id,
      date: item.date,
      rainy_day: item.rainy_day,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data hari hujan"
    );
  }
}
