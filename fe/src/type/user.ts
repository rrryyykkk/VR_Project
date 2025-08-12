export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  riwayatPendidikan: string;
  medicalNote: string;

  // status login & VR
  isLoggedIn?: boolean; // true kalau sudah login ke sistem
  isActive?: boolean; // true kalau sedang aktif VR
  currentSessionId?: string;
  currentRoom?: string;
  device?: string;
}

export const dummyUsers: User[] = [
  {
    id: 1,
    name: "Budi",
    email: "budi@gmail.com",
    password: "default123",
    age: 74,
    gender: "Laki-Laki",
    riwayatPendidikan: "SMA",
    medicalNote: "Diabetes",

    // Login & aktif VR
    isLoggedIn: true,
    isActive: true,
    currentSessionId: "sess-001",
    currentRoom: "Gallery",
    device: "Oculus Quest 2",
  },
  {
    id: 2,
    name: "Siti",
    email: "siti@gmail.com",
    password: "default123",
    age: 69,
    gender: "Perempuan",
    riwayatPendidikan: "D3",
    medicalNote: "Hipertensi",

    // Login tapi belum aktif VR
    isLoggedIn: true,
    isActive: false,
  },
  {
    id: 3,
    name: "Andi",
    email: "andi@gmail.com",
    password: "default123",
    age: 65,
    gender: "Laki-Laki",
    riwayatPendidikan: "S1",
    medicalNote: "Sehat",

    // Tidak login
    isLoggedIn: false,
    isActive: false,
  },
];
