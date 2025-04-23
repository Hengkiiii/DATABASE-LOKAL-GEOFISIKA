// Interface untuk mendefinisikan struktur data gempa per bulan
export interface DataGempaProps {
  // Nama bulan (contoh: "Januari", "Februari", dst.)
  bulan: string;

  // Jumlah kejadian gempa pada bulan tersebut
  jumlah: number;

  // Tahun kejadian gempa
  tahun: number;
}
