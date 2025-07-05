const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface EvaporationData {
  id: number;
  evaporation: number;
  date: string;
}
export async function getEvaporationByDate(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}evaporation/get-by-date?start_date=${startDate}&end_date=${endDate}`,
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
        "Gagal mengambil data penguapan berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: EvaporationData) => ({
      id: item.id,
      evaporation: item.evaporation,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error saat fetch data penguapan by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data penguapan"
    );
  }
}
