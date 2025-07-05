const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getWindDirectionAndSpeedByDate(
  startDate: string,
  endDate: string
) {
  if (!startDate || !endDate) {
    throw new Error("Tanggal mulai dan akhir harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}wind-direction-and-speed/get-by-date?start_date=${startDate}&end_date=${endDate}`,
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
        "Gagal mengambil data arah dan kecepatan angin berdasarkan rentang tanggal";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: any) => ({
      id: item.id,
      tanggal: item.date,
      kecepatan: item.speed,
      kecepatanMaksimum: item.max_speed,
      arah: item.direction,
      arahTerbanyak: item.most_frequent_direction,
    }));
  } catch (error) {
    console.error(
      "Error saat fetch data arah dan kecepatan angin by date:",
      error
    );
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data arah dan kecepatan angin"
    );
  }
}
