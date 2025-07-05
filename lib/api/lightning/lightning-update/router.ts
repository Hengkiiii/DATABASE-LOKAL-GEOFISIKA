const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateLightning(
  id: string | number,
  user_id: string,
  dataUpdate: {
    name?: string;
    date?: string;
    file_url?: string;
    lightning_data?: string;
  }
): Promise<any> {
  const url = `${API_BASE_URL}lightning/update?id=${encodeURIComponent(
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

    console.log("updateLightning: response status", response.status);

    if (!response.ok) {
      let errorMessage = "Gagal mengupdate data petir";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error("updateLightning: error response", errorData);
      } catch (e) {
        console.error("updateLightning: gagal parsing error response");
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("updateLightning: response data", data);
    return data;
  } catch (error) {
    console.error("updateLightning: exception", error);
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mengupdate data petir"
    );
  }
}
