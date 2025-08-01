const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataGempa(
  user_id: string,
  date_time: string,
  mmi: string,
  description: string,
  depth: number,
  latitude: number,
  longitude: number,
  magnitude: number,
  observer_name: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}earthquake/insert?user_id=${user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_time,
          mmi,
          description,
          depth,
          latitude,
          longitude,
          magnitude,
          observer_name,
        }),
      }
    );
    console.log({
      user_id,
      date_time: date_time,
      mmi,
      description: description,
      depth: Number(depth),
      latitude: Number(latitude),
      longitude: Number(longitude),
      magnitude: Number(magnitude),
      observer_name: observer_name,
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data gempa");
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data gempa"
    );
  }
}
