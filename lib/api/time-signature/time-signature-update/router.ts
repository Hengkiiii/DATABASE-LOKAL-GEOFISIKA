export async function updateDataTimeSignature(
  id: string,
  user_id: string,
  dataUpdate: {
    name: string;
    date: string;
    file_base64: string;
  }
): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${API_BASE_URL}time-signature/update?id=${id}&user_id=${user_id}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUpdate),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "Gagal memperbarui data tanda waktu";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat memperbarui data tanda waktu"
    );
  }
}
