const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataPetirExcel(
  user_id: string,
  lightning_data: string,
  file_base64: string
) {
  try {
    // Bangun URL dengan query parameters
    const url = `${API_BASE_URL}lightning/insert-excel?user_id=${encodeURIComponent(
      user_id
    )}&lightning_data=${encodeURIComponent(lightning_data)}`;

    console.log("URL:", url);

    const payload = {
      file_base64,
    };

    console.log("Payload:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("Raw Response:", text);

    if (!response.ok) {
      throw new Error(
        JSON.parse(text).message || "Gagal menyimpan data petir (Excel)"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal mengirim:", error);
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat menyimpan data petir"
    );
  }
}
