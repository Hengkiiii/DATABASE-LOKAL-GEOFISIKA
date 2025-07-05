const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataEvaporation(
  user_id: string,
  evaporation: number,
  date: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}evaporation/insert?user_id=${encodeURIComponent(
        user_id
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evaporation,
          date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal menambahkan data penguapan");
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menambahkan data penguapan"
    );
  }
}
