const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllDataRainIntensity() {
  try {
    const url = `${API_BASE_URL}rain-intensity/get-all`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      let errorMessage = "Gagal mengambil data intensitas hujan";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);

    if (data.success === false) {
      throw new Error(data.message || "Gagal mengambil data intensitas hujan");
    }

    return data.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data intensitas hujan"
    );
  }
}
