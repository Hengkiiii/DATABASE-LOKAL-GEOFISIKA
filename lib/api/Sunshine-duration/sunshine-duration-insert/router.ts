const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataSunshineDuration(
  user_id: string,
  sunshine_duration: string,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}sunshine-duration/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sunshine_duration,
          date,
        }),
      }
    );

    const data = await response.json();
    console.log("Response dari server:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal menambahkan data durasi sinar matahari"
      );
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data durasi sinar matahari"
    );
  }
}
