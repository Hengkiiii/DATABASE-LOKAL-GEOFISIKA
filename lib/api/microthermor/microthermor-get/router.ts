const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataMicrothermorById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}microthermor/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data mikrotermor berdasarkan ID";
      throw new Error(errorMessage);
    }

    console.log("Data mikrotermor berhasil diambil:", result);

    const data = result.data;

    return {
      id: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
      FO: data.FO,
      AO: data.AO,
      TDOM: data.TDOM,
      KG: data.KG,
    };
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data mikrotermor berdasarkan ID"
    );
  }
}
