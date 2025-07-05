const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AirPressureData {
  id: number;
  air_pressure: number;
  air_pressure_07: number;
  air_pressure_13: number;
  air_pressure_18: number;
  date: string;
}

interface GetAirPressureResponse {
  success: boolean;
  message: string;
  data: AirPressureData[];
}

export async function getAirPressureAll(): Promise<AirPressureData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}air-pressure/get-all`, {
      method: "GET",
    });

    const result: GetAirPressureResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data tekanan udara";
      throw new Error(errorMessage);
    }

    console.log("Data tekanan udara berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      air_pressure: item.air_pressure,
      air_pressure_07: item.air_pressure_07,
      air_pressure_13: item.air_pressure_13,
      air_pressure_18: item.air_pressure_18,
      date: item.date,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data tekanan udara"
    );
  }
}
