const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataPetirByLightningData(lightning_data: string) {
  try {
    const url = `${API_BASE_URL}lightning/get-by-lightning-data?lightning_data=${encodeURIComponent(
      lightning_data
    )}`;

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
      throw new Error(
        JSON.parse(text).message ||
          "Gagal mengambil data petir berdasarkan lightning_data"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal mengambil data petir:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data petir berdasarkan lightning_data"
    );
  }
}
