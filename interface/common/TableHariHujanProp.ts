// Mengimpor tipe data untuk tiap item hari hujan
import { DataHariHujanProps } from "@/interface/common/DataHariHujanProps";

// Interface untuk properti yang dikirim ke komponen TableHariHujan
export interface TableHariHujanProps {
  // 'data' adalah array dari objek DataHariHujanProps
  data: DataHariHujanProps[];
}
