const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataPetirByDate(
  startDate: string,
  endDate: string,
  lightningData: string
) {
  try {
    const url = `${API_BASE_URL}lightning/get-by-date?lightning_data=${encodeURIComponent(
      lightningData
    )}&start_date=${encodeURIComponent(
      startDate
    )}&end_date=${encodeURIComponent(endDate)}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    const text = await response.text();
    console.log("API Response Status:", response.status);
    console.log("API Response Headers:", response.headers);
    console.log("Raw Response Text:", text);

    if (!response.ok) {
      throw new Error(
        JSON.parse(text).message ||
          "Gagal mengambil data petir berdasarkan tanggal"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal mengambil data petir:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data petir berdasarkan tanggal"
    );
  }
}
