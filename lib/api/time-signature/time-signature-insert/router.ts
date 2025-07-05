const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function tambahDataTimeSignature({
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
    const url = `${API_BASE_URL}time-signature/insert?user_id=${encodeURIComponent(
      user_id
    )}`;

    const payload = { name, date, file_base64 };
    console.log("POST URL:", url);
    console.log("Payload:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    console.log("Raw Response:", rawText);

    if (!response.ok) {
      let errorMessage = "Gagal menyimpan data time signature";
      try {
        const errorData = JSON.parse(rawText);
        errorMessage = errorData.message || errorMessage;
      } catch (_) {
        // parsing gagal, abaikan
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(rawText);
    return data;
  } catch (error) {
    console.error("Gagal mengirim:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat menyimpan data time signature"
    );
  }
}
