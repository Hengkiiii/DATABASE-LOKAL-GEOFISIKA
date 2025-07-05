const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEarthquake(id: string | number) {
  try {
    const response = await fetch(`${API_BASE_URL}earthquake/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Response status:", response.status);

    const result = await response.json();
    console.log("Response JSON:", result);

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data gempa";
      throw new Error(errorMessage);
    }

    const data = result.data;

    if (!data) {
      throw new Error("Data gempa tidak ditemukan.");
    }

    console.log("Data gempa berhasil diambil:", data);

    return {
      id: data.id,
      tanggal: data.date,
      waktu: data.time,
      mmi: data.mmi,
      deskripsi: data.description,
      kedalaman: data.depth,
      latitude: data.latitude,
      longitude: data.longitude,
      magnitude: data.magnitude,
      observer_name: data.observer_name,
    };
  } catch (error) {
    console.error("Error getEarthquake:", error);
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mengambil data gempa"
    );
  }
}
