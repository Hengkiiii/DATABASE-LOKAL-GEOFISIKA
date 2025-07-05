const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataPosHujan(
  user_id: string,
  city: string,
  village: string,
  date: string,
  name: string,
  file_base64: string
) {
  try {
    const url = `${API_BASE_URL}rain-gauge/insert?user_id=${encodeURIComponent(
      user_id
    )}&city=${encodeURIComponent(city)}&village=${encodeURIComponent(village)}`;

    console.log("URL:", url);

    const payload = {
      date,
      name,
      city,
      village,
      file_base64: file_base64,
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
        JSON.parse(text).message || "Gagal menyimpan data pos hujan"
      );
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Gagal mengirim:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menyimpan data pos hujan"
    );
  }
}
