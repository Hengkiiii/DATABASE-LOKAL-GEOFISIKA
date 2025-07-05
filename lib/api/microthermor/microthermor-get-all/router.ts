const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface MicrothermorData {
  id: number;
  latitude: string;
  longitude: string;
  FO: number;
  AO: number;
  TDOM: number;
  KG: number;
}

interface GetMicrothermorResponse {
  success: boolean;
  message: string;
  data: MicrothermorData[];
}

export async function getAllDataMicrothermor(): Promise<MicrothermorData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}microthermor/get-all`, {
      method: "GET",
    });

    const result: GetMicrothermorResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data mikrotermor";
      throw new Error(errorMessage);
    }

    console.log("Data mikrotermor berhasil diambil:", result.data);

    return result.data.map((item) => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      FO: item.FO,
      AO: item.AO,
      TDOM: item.TDOM,
      KG: item.KG,
    }));
  } catch (error) {
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data mikrotermor"
    );
  }
}
