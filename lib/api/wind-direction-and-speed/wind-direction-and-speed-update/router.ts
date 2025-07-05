const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateWindDirectionAndSpeed(
  user_id: string,
  id: string,
  dataUpdate: {
    date: string;
    speed: number;
    max_speed: number;
    direction: string;
    most_frequent_direction: string;
  }
) {
  const url = `${API_BASE_URL}wind-direction-and-speed/update?id=${id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataUpdate),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response dari server:", data);
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal mengupdate data arah dan kecepatan angin";
      throw new Error(errorMessage);
    }

    console.log("Data arah dan kecepatan angin berhasil diupdate:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data arah dan kecepatan angin"
    );
  }
}
