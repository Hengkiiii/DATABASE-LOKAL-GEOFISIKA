const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllShakemap() {
  try {
    const response = await fetch(`${API_BASE_URL}shakemap/get-all`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "*/*",
      },
    });

    const result = await response.json();
    console.log("Response JSON:", result);

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data shakemap";
      throw new Error(errorMessage);
    }

    const dataArray = result.data;

    if (!Array.isArray(dataArray)) {
      throw new Error("Data shakemap tidak ditemukan.");
    }

    // Mapping data supaya properti konsisten
    const mappedData = dataArray.map((data) => ({
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
    }));

    return mappedData;
  } catch (error) {
    console.error("Error getAllShakemap:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data shakemap"
    );
  }
}
