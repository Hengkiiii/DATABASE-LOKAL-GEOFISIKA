const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getAirPressure(id: string | number) {
  try {
    const response = await fetch(`${API_BASE_URL}air-pressure/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Response JSON:", result);

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data tekanan udara";
      throw new Error(errorMessage);
    }

    const data = result.data;

    if (!data) {
      throw new Error("Data tekanan udara tidak ditemukan.");
    }

    console.log("Data tekanan udara berhasil diambil:", data);

    return {
      id: data.id,
      tanggal: data.date,
      tekananPagi: data.air_pressure_07,
      tekananSiang: data.air_pressure_13,
      tekananSore: data.air_pressure_18,
      tekananUdara:
        data.air_pressure_07 + data.air_pressure_13 + data.air_pressure_18,
    };
  } catch (error) {
    console.error("Error getAirPressure:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data tekanan udara"
    );
  }
}
