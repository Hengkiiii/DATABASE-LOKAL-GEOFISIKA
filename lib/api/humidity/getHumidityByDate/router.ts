const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getHumidityByDate(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}humidity/get-by-date?start_date=${startDate}&end_date=${endDate}`,
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
        "Gagal mengambil data kelembapan udara berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: any) => ({
      id: item.id,
      humidity_07: item.humidity_07,
      humidity_13: item.humidity_13,
      humidity_18: item.humidity_18,
      humidity: item.avg_humidity,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error saat fetch data kelembapan udara by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data kelembapan udara"
    );
  }
}
