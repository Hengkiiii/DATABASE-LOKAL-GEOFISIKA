const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RainIntensityData {
  id: number;
  name: string;
  date: string;
  file_url: string | null;
}

interface TambahDataRainIntensityRespon {
  success: boolean;
  message: string;
  data: RainIntensityData[];
}

export async function tambahDataRainIntensityExcel(
  user_id: string,
  file_base64: string
): Promise<TambahDataRainIntensityRespon> {
  try {
    const response = await fetch(
      `${API_BASE_URL}rain-intensity/insert-excel?user_id=${encodeURIComponent(
        user_id
      )}`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_base64 }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal menyimpan data intensitas Hujan dari Excel"
      );
    }

    if (data.success === false) {
      throw new Error(
        data.message || "Gagal menyimpan data intensitas Hujan dari Excel"
      );
    }

    return data as TambahDataRainIntensityRespon;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menyimpan data intensitas Hujan dari Excel";
    throw new Error(message);
  }
}
