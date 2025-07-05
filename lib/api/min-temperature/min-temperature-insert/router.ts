const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataMinTemperature(
  user_id: string,
  min_temperature: string,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}min-temperature/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          min_temperature,
          date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data minimum suhu");
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data minimum suhu"
    );
  }
}
