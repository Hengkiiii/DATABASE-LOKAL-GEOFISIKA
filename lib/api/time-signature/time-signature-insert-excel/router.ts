const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TimeSignatureData {
  id: number;
  name: string;
  date: string;
  file_url: string | null;
}

interface TambahTimeSignatureResponse {
  success: boolean;
  message: string;
  data: TimeSignatureData[];
}

export async function tambahDataTimeSignatureExcel(
  user_id: string,
  file_base64: string
): Promise<TambahTimeSignatureResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}time-signature/insert-excel?user_id=${encodeURIComponent(
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
        data.message || "Gagal menyimpan data tanda waktu dari Excel"
      );
    }

    if (data.success === false) {
      throw new Error(
        data.message || "Gagal menyimpan data tanda waktu dari Excel"
      );
    }

    return data as TambahTimeSignatureResponse;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menyimpan data tanda waktu dari Excel";
    throw new Error(message);
  }
}
