const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function insertRainIntensity({
  user_id,
  name,
  date,
  file_base64,
}: {
  user_id: string;
  name: string;
  date: string;
  file_base64: string;
}) {
  try {
    const url = `${API_BASE_URL}rain-intensity/insert?user_id=${encodeURIComponent(
      user_id
    )}`;

    const hasPrefix = file_base64.startsWith("data:");
    const base64WithPrefix = hasPrefix
      ? file_base64
      : `data:image/jpeg;base64,${file_base64}`;

    const payload = {
      name,
      date,
      file_base64: base64WithPrefix,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    if (!response.ok) {
      let errorMessage = "Gagal menyimpan data intensitas hujan";
      try {
        const errorData = JSON.parse(rawText);
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const data = JSON.parse(rawText);
    return data;
  } catch (error) {
    console.error("Gagal mengirim:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menyimpan data intensitas hujan"
    );
  }
}
