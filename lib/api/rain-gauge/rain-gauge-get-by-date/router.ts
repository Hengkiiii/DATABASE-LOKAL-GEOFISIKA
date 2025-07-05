const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataPosHujanByDate(
  startDate: string,
  endDate: string,
  city: string,
  village: string
) {
  try {
    const url = `${API_BASE_URL}rain-gauge/get-by-date?start_date=${encodeURIComponent(
      startDate
    )}&end_date=${encodeURIComponent(endDate)}&city=${encodeURIComponent(
      city
    )}&village=${encodeURIComponent(village)}`;

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
          "Gagal mengambil data pos hujan berdasarkan tanggal"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data pos hujan berdasarkan tanggal"
    );
  }
}
