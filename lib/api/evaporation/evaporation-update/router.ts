export async function updateEvaporation(
  user_id: string,
  id: string,
  dataUpdate: {
    date: string;
    evaporation: string;
  }
): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}evaporation/update?id=${id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataUpdate),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response dari server:", data);
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Gagal mengupdate data penguapan";
      throw new Error(errorMessage);
    }

    console.log("Data penguapan berhasil diupdate:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data penguapan"
    );
  }
}
