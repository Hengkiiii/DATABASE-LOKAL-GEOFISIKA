const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getDataGempaByDate(
  startDate: string,
  endDate: string,
  minMagnitude: string,
  maxMagnitude: string,
  minDepth: string,
  maxDepth: string,
  minLat: string,
  maxLat: string,
  minLong: string,
  maxLong: string,
  mmiMin: string,
  mmiMax: string
) {
  try {
    // Bangun parameter query secara dinamis
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);
    if (minMagnitude) queryParams.append("min_magnitude", minMagnitude);
    if (maxMagnitude) queryParams.append("max_magnitude", maxMagnitude);
    if (minDepth) queryParams.append("min_depth", minDepth);
    if (maxDepth) queryParams.append("max_depth", maxDepth);
    if (minLat) queryParams.append("min_lat", minLat);
    if (maxLat) queryParams.append("max_lat", maxLat);
    if (minLong) queryParams.append("min_long", minLong);
    if (maxLong) queryParams.append("max_long", maxLong);
    if (mmiMin) queryParams.append("min_mmi", mmiMin.toUpperCase());
    if (mmiMax) queryParams.append("max_mmi", mmiMax.toUpperCase());

    const url = `${API_BASE_URL}earthquake/get-by-all-data?${queryParams.toString()}`;
    console.log("URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Gagal mengambil data gempa berdasarkan filter"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    throw new Error(
      (error as Error).message ||
        "Terjadi kesalahan saat mengambil data gempa berdasarkan filter"
    );
  }
}
