const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ActivityLogData {
  ip_address: string;
  user_agent: string;
  login_time: string;
  admin_id: string;
}

export async function getLoginById(
  id: string | number
): Promise<ActivityLogData[]> {
  try {
    if (!id) throw new Error("ID tidak boleh kosong");

    const response = await fetch(`${API_BASE_URL}login-log/get?user_id=${id}`, {
      method: "GET",
      credentials: "include",
    });

    const cloned = response.clone();
    const rawText = await cloned.text();

    if (!response.ok) {
      let errorMessage = "Gagal mengambil data log aktivitas";
      try {
        const errorResult = JSON.parse(rawText);
        if (errorResult.message) errorMessage = errorResult.message;
      } catch {}
      throw new Error(errorMessage);
    }

    if (!rawText) {
      throw new Error("Response kosong dari server");
    }

    const result: ActivityLogData[] = JSON.parse(rawText);
    console.log("Data aktivitas berdasarkan ID berhasil diambil:", result);

    return result;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data aktivitas"
    );
  }
}
