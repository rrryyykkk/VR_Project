export interface User {
  id?: number; // string kalau dari Firebase/MongoDB, bisa ubah ke number kalau pakai SQL
  name: string;
  age: number;
  gender: "Male" | "Female";

  riwayatPendidikan: string;
  medicalNote: string;
}
