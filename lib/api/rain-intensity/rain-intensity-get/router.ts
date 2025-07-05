const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataRainIntensity(id: number) {
  try {
    const url = `${API_BASE_URL}rain-intensity/get?id=${id}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      let errorMessage = "Gagal mengambil data intensitas hujan berdasarkan ID";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);

    if (data.success === false) {
      throw new Error(
        data.message || "Gagal mengambil data intensitas hujan berdasarkan ID"
      );
    }

    return data.data;
  } catch (error) {
    console.error("Gagal mengambil data by ID:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data intensitas hujan berdasarkan ID"
    );
  }
}
