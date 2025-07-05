const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteDataPosHujan(id: number, user_id: string) {
  try {
    const url = `${API_BASE_URL}rain-gauge/delete?id=${encodeURIComponent(
      id
    )}&user_id=${encodeURIComponent(user_id)}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
      },
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      throw new Error(
        JSON.parse(text).message || "Gagal menghapus data pos hujan"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menghapus data pos hujan"
    );
  }
}
