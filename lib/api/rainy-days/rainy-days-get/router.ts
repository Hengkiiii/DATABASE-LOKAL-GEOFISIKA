const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getRainyDay(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}rainy-days/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data hari hujan";
      throw new Error(errorMessage);
    }

    console.log("Data hari hujan berhasil diambil:", result);

    const data = result.data;

    return {
      id: data.id,
      rainyDay: data.rainy_day,
      date: data.date,
    };
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data hari hujan"
    );
  }
}
