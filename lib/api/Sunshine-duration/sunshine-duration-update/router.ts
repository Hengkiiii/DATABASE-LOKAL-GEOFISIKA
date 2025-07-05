export interface SunshineDurationData {
  id: number;
  date: string;
  sunshine_duration: string;
}

export interface SunshineDurationUpdateResponse {
  success: boolean;
  message: string;
  data: SunshineDurationData;
}

export async function updateSunshineDuration(
  id: string,
  user_id: string,
  dataUpdate: {
    date: string;
    sunshine_duration: string;
  }
): Promise<SunshineDurationUpdateResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}sunshine-duration/update?id=${id}&user_id=${user_id}`;

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
        errorData.message || "Gagal mengupdate data durasi sinar matahari";
      throw new Error(errorMessage);
    }

    const data: SunshineDurationUpdateResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengupdate data durasi sinar matahari"
    );
  }
}
