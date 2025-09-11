export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  imgProfile: string;
  age: number;
  gender: string;
  educationHistory: string;
  medicalNote: string;
}

export interface UserVR extends User {
  // status login & VR
  isLogin?: boolean; // true kalau sudah login ke sistem
  isActive?: boolean; // true kalau sedang aktif VR
  currentSessionId?: string;
  currentRoom?: string;
  device?: string;
}

export type UserPayload = Omit<User, "id">;
