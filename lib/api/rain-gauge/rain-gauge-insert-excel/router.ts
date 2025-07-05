const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataPosHujanExcel(
  user_id: string,
  city: string,
  village: string,
  file_base64: string
) {
  try {
    const url = `${API_BASE_URL}rain-gauge/insert-excel?user_id=${encodeURIComponent(
      user_id
    )}&city=${encodeURIComponent(city)}&village=${encodeURIComponent(village)}`;

    console.log("URL:", url);

    // Payload untuk file Excel (base64)
    const payload = {
      file_base64,
    };

    console.log("Payload:", payload);

    // Kirim request POST ke server
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    // Tangani error jika status bukan 2xx
    if (!response.ok) {
      throw new Error(
        JSON.parse(text).message || "Gagal menyimpan data pos hujan (Excel)"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal mengirim:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menyimpan data pos hujan (Excel)"
    );
  }
}
