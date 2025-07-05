const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getWindDirectionAndSpeed(id: string | number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}wind-direction-and-speed/get?id=${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Response JSON:", result);

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message ||
          result.error?.message ||
          "Gagal mengambil data arah dan kecepatan angin";
      throw new Error(errorMessage);
    }

    const data = result.data;

    if (!data) {
      throw new Error("Data arah dan kecepatan angin tidak ditemukan.");
    }

    console.log("Data arah dan kecepatan angin berhasil diambil:", data);

    return {
      id: data.id,
      tanggal: data.date,
      kecepatan: data.speed,
      kecepatanMaksimum: data.max_speed,
      arah: data.direction,
      arahTerbanyak: data.most_frequent_direction,
    };
  } catch (error) {
    console.error("Error getWindDirectionAndSpeed:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data arah dan kecepatan angin"
    );
  }
}
