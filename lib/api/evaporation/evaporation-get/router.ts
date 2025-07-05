const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEvaporation(id: string | number) {
  try {
    const response = await fetch(`${API_BASE_URL}evaporation/get?id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data penguapan";
      throw new Error(errorMessage);
    }

    console.log("Data penguapan berhasil diambil:", result);

    const data = result.data;

    return {
      id: data.id,
      evaporation: data.evaporation,
      date: data.date,
    };
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data penguapan"
    );
  }
}
