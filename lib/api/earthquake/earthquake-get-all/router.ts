const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface EarthquakeData {
  id: number;
  date_time: string;
  mmi: string | null;
  description: string;
  depth: number;
  latitude: number;
  longitude: number;
  magnitude: number;
  observer_name: string;
}

interface GetEarthquakeResponse {
  success: boolean;
  message: string;
  data: EarthquakeData[];
}

export async function getEarthquakeAll(): Promise<EarthquakeData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}earthquake/get-all`, {
      method: "GET",
    });

    const result: GetEarthquakeResponse = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Gagal mengambil data gempa";
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat mengambil data gempa"
    );
  }
}
