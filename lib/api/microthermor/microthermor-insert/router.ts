const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataMicrothermor(
  user_id: string,
  latitude: string,
  longitude: string,
  FO: number,
  AO: number,
  TDOM: number,
  KG: number
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}microthermor/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          FO,
          AO,
          TDOM,
          KG,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data mikrotermor");
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data mikrotermor"
    );
  }
}
