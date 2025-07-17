interface UpdateRainyDayResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    date: string;
    rainy_day: string;
  };
}
export async function updateRainyDay(
  id: string,
  user_id: string,
  dataUpdate: {
    date: string;
    rainy_day: string;
  }
): Promise<UpdateRainyDayResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}rainy-days/update?id=${id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dataUpdate),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "Gagal mengupdate data hari hujan";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data hari hujan"
    );
  }
}
