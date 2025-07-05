const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateEarthquake(
  user_id: string,
  id: string | number,
  dataUpdate: {
    date_time: string;
    mmi: string | null;
    description: string;
    depth: number;
    latitude: string;
    longitude: string;
    magnitude: number;
    observer_name: string;
  }
) {
  const url = `${API_BASE_URL}earthquake/update?id=${id}&user_id=${user_id}`;

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
        : data.message || "Gagal mengupdate data gempa";
      throw new Error(errorMessage);
    }

    console.log("Data gempa berhasil diupdate:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mengupdate data gempa"
    );
  }
}
