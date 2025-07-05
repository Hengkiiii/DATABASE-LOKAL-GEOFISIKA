const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataPetirById(
  id: string | number,
  lightningData: string
) {
  try {
    const url = `${API_BASE_URL}lightning/get-by-id?id=${encodeURIComponent(
      id
    )}&lightning_data=${encodeURIComponent(lightningData)}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    const json = JSON.parse(text);

    if (!response.ok || !json.success) {
      throw new Error(
        json.message || "Gagal mengambil data petir berdasarkan ID"
      );
    }

    return json.data;
  } catch (error) {
    console.error("Gagal mengambil data petir:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data petir berdasarkan ID"
    );
  }
}
