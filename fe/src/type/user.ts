export interface User {
  id?: number; // string kalau dari Firebase/MongoDB, bisa ubah ke number kalau pakai SQL
  name: string;
  email: string;
  age: number;
  gender: "Male" | "Female";
  room: string;
  medicalNote: string;
}
