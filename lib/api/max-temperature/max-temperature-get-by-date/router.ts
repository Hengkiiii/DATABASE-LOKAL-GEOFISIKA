const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getMaxTemperatureByDate(
  startDate: string,
  endDate: string
) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}max-temperature/get-by-date?start_date=${startDate}&end_date=${endDate}`,
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
        "Gagal mengambil data suhu udara minimum berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: any) => ({
      id: item.id,
      max_temperature: item.max_temperature,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error saat fetch by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data suhu udara maksimum berdasarkan rentang tanggal"
    );
  }
}
