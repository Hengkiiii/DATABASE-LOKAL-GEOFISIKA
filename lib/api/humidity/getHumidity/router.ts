const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getHumidity(id: string | number) {
  try {
    const response = await fetch(`${API_BASE_URL}humidity/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Response JSON:", result);

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data kelembapan udara";
      throw new Error(errorMessage);
    }

    const data = result.data;

    if (!data) {
      throw new Error("Data kelembapan udara tidak ditemukan.");
    }

    console.log("Data kelembapan udara berhasil diambil:", data);

    return {
      id: data.id,
      tanggal: data.date,
      kelembabanPagi: data.humidity_07,
      kelembabanSiang: data.humidity_13,
      kelembabanSore: data.humidity_18,
      kelembabanRataRata:
        data.humidity_07 + data.humidity_13 + data.humidity_18,
    };
  } catch (error) {
    console.error("Error getHumidity:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data kelembapan udara"
    );
  }
}
