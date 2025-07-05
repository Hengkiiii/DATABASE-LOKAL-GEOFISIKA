const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataTimeSignatureByDate(
  start_date: string,
  end_date: string
) {
  try {
    const url = `${API_BASE_URL}time-signature/get-by-date?start_date=${start_date}&end_date=${end_date}`;

    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      let errorMessage =
        "Gagal mengambil data time signature berdasarkan rentang tanggal";
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(text);

    if (data.success === false) {
      throw new Error(
        data.message ||
          "Gagal mengambil data time signature berdasarkan rentang tanggal"
      );
    }

    return data.data;
  } catch (error) {
    console.error("Gagal mengambil data by date:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data time signature berdasarkan tanggal"
    );
  }
}
