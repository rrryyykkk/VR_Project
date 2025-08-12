export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  riwayatPendidikan: string;
  medicalNote: string;

  // tambahan untuk monitoring VR
  isActive?: boolean; // true = sedang aktif VR
  currentSessionId?: string; // session VR yang sedang aktif
  currentRoom?: string; // nama room terakhir user di VR
  device?: string; // device VR yang dipakai user saat aktif
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

    // data aktif VR
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

    // user ini tidak aktif VR sekarang
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

    // aktif di VR dengan session lain
    isActive: true,
    currentSessionId: "sess-004",
    currentRoom: "Lobby",
    device: "HTC Vive",
  },
];
