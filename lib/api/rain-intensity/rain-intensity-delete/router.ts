const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function hapusDataRainIntensity(id: string, user_id: string) {
  try {
    const url = `${API_BASE_URL}rain-intensity/delete?id=${id}&user_id=${user_id}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      let errorMessage = "Gagal menghapus data intensitas hujan";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);

    if (data.success === false) {
      throw new Error(data.message || "Gagal menghapus data intensitas hujan");
    }

    return data;
  } catch (error) {
    console.error("Gagal menghapus:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menghapus data intensitas hujan"
    );
  }
}
