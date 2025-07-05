const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataAverageTemperature(
  user_id: string,
  avg_temperature: Number,
  avg_temperature_07: Number,
  avg_temperature_13: Number,
  avg_temperature_18: Number,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}average-temperature/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avg_temperature,
          avg_temperature_07,
          avg_temperature_13,
          avg_temperature_18,
          date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal menambahkan data suhu rata-rata udara"
      );
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data suhu udara rata-rata"
    );
  }
}
