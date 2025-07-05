const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AirPressureItem {
  id: number;
  air_pressure_07: string;
  air_pressure_13: string;
  air_pressure_18: string;
  air_pressure: string;
  date: string;
}

export async function getAirPressureByDate(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}air-pressure/get-by-date?start_date=${startDate}&end_date=${endDate}`,
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
        "Gagal mengambil data tekanan udara berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: AirPressureItem) => ({
      id: item.id,
      air_pressure_07: item.air_pressure_07,
      air_pressure_13: item.air_pressure_13,
      air_pressure_18: item.air_pressure_18,
      pressure: item.air_pressure,
      date: item.date,
    }));
  } catch (error) {
    console.error("Error saat fetch data tekanan udara by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data tekanan udara"
    );
  }
}
