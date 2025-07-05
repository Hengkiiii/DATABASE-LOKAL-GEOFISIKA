const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataAirPressure(
  user_id: string,
  air_pressure: number,
  air_pressure_07: number,
  air_pressure_13: number,
  air_pressure_18: number,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}air-pressure/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          air_pressure,
          air_pressure_07,
          air_pressure_13,
          air_pressure_18,
          date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data tekanan udara");
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data tekanan udara"
    );
  }
}
