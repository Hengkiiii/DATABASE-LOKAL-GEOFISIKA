const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataPosHujanById(
  id: string | number,
  city: string,
  village: string
) {
  try {
    const url = `${API_BASE_URL}rain-gauge/get-by-id?id=${encodeURIComponent(
      id
    )}&city=${encodeURIComponent(city)}&village=${encodeURIComponent(village)}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      // Jika response gagal, coba parse pesan error dari server
      const errorObj = JSON.parse(text);
      throw new Error(
        errorObj.message || "Gagal mengambil data pos hujan berdasarkan ID"
      );
    }

    const json = JSON.parse(text);

    if (!json.success) {
      // Jika response sukses false, lempar error dengan pesan
      throw new Error(
        json.message || "Gagal mengambil data pos hujan berdasarkan ID"
      );
    }

    return json.data; // Ambil data dari properti data
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data pos hujan berdasarkan ID"
    );
  }
}
