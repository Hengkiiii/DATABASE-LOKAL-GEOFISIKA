const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataKelembaban(
  user_id: string,
  humidity_07: number,
  humidity_13: number,
  humidity_18: number,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}humidity/insert?user_id=${encodeURIComponent(user_id)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          humidity_07,
          humidity_13,
          humidity_18,
          date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data kelembaban");
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data kelembaban"
    );
  }
}
