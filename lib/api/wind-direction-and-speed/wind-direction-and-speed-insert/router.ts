const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataAngin(
  user_id: string,
  date: string,
  speed: number,
  max_speed: number,
  direction: string,
  most_frequent_direction: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}wind-direction-and-speed/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          speed,
          max_speed,
          direction,
          most_frequent_direction,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data angin");
    }
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data angin"
    );
  }
}
