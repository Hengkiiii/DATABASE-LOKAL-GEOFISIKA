const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface MicrothermorData {
  id: number;
  latitude: number;
  longitude: number;
  FO: number;
  AO: number;
  TDOM: string;
  KG: number;
}
export async function getMicrothermorByTDOM(minTdom: string, maxTdom: string) {
  if (minTdom === undefined || maxTdom === undefined) {
    throw new Error("Nilai minimum dan maksimum TDOM harus diisi");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}microthermor/get-by-TDOM?min_tdom=${minTdom}&max_tdom=${maxTdom}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();
    console.log("Response:", result);

    if (!response.ok || result.success === false) {
      const errorMessage =
        result.message ||
        "Gagal mengambil data mikrotermor berdasarkan nilai TDOM";
      throw new Error(errorMessage);
    }

    const data = result.data;

    return data.map((item: MicrothermorData) => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      FO: item.FO,
      AO: item.AO,
      TDOM: item.TDOM,
      KG: item.KG,
    }));
  } catch (error) {
    console.error("Error saat fetch by TDOM:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data mikrotermor"
    );
  }
}
