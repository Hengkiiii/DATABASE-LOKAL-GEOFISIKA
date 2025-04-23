// Mengimpor tipe data untuk tiap item hari hujan
import { DataTabelProps } from "@/interface/common/DataTableProps";

// Interface untuk properti yang dikirim ke komponen TableHariHujan
export interface TabelProps {
  // 'data' adalah array dari objek DataHariHujanProps
  dataHariHujan: DataTabelProps[];
  dataPenguapan: DataTabelProps[];
}
