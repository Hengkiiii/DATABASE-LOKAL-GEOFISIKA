export async function updateRainGauge(
  id: string | number,
  user_id: string,
  dataUpdate: {
    date?: string;
    name?: string;
    city?: string;
    village?: string;
    file_url?: string;
  }
): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}rain-gauge/update?id=${encodeURIComponent(
    id
  )}&user_id=${encodeURIComponent(user_id)}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataUpdate),
    });

    console.log("updateRainGauge: response status", response.status);

    if (!response.ok) {
      let errorMessage = "Gagal mengupdate data pos hujan";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error("updateRainGauge: error response", errorData);
      } catch (e) {
        console.error("updateRainGauge: gagal parsing error response");
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("updateRainGauge: response data", data);
    return data;
  } catch (error) {
    console.error("updateRainGauge: exception", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data pos hujan"
    );
  }
}
