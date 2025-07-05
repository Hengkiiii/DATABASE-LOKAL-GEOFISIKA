export async function updateDataMicrothermor(
  id: string,
  user_id: string,
  dataUpdate: {
    latitude: string;
    longitude: string;
    FO: string;
    AO: string;
    TDOM: string;
    KG: string;
  }
): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}microthermor/update?id=${id}&user_id=${user_id}`;

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
        : data.message || "Gagal mengupdate data mikrotermor";
      throw new Error(errorMessage);
    }

    console.log("Data mikrotermor berhasil diupdate:", data);
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data mikrotermor"
    );
  }
}
