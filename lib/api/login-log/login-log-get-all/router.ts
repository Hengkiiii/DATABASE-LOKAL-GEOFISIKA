const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginLogData {
  ip_address: string;
  user_agent: string;
  login_time: string;
  admin_id: string;
}

export async function getLoginLogAll(): Promise<LoginLogData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}login-log/get-all`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil data log aktivitas: ${errorText}`);
    }

    const result: LoginLogData[] = await response.json();

    console.log("Data log aktivitas berhasil diambil:", result);

    return result;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data log aktivitas"
    );
  }
}
