const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RainyDay {
  id: number;
  rainyDay: string;
  date: string;
}
export async function getRainyDaysByDate(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}rainy-days/get-by-date?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();
    console.log("Response:", result);

    if (!response.ok || result.success === false) {
      const errorMessage =
        result.message ||
        "Gagal mengambil data hari hujan berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: RainyDay) => ({
      id: item.id,
      rainyDay: item.rainyDay,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error saat fetch by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data hari hujan"
    );
  }
}
