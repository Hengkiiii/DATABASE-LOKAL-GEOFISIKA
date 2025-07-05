const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ActivityLogData {
  description: string;
  ip_address: string;
  action: string;
  user_agent: string;
  created_at: string;
}

export async function getActivityLogAll(): Promise<ActivityLogData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}activity-log/get-all`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data log aktivitas");
    }

    // Response langsung array ActivityLogData[]
    const result: ActivityLogData[] = await response.json();

    console.log("Data log aktivitas berhasil diambil:", result);

    return result;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data log aktivitas"
    );
  }
}
