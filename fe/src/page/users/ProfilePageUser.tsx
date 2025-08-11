import { useState } from "react";
import ProfileDisplayUser from "../../components/users/profile/DisplayProfileUser";
import EditFormProfileUser from "../../components/users/profile/EditProfileUser";

const initialProfile = {
  username: "hana_user",
  fullName: "Hana Cantik",
  email: "hana.user@example.com",
  profileImage: "/vite.svg",
  password: "default123",
};

export default function ProfilePageUser() {
  const [profile, setProfile] = useState(initialProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Profil Saya
        </h1>
        <p className="text-gray-500">Kelola informasi akun Anda dengan mudah</p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileDisplayUser profile={profile} />
        </div>
        <div className="md:col-span-2">
          <EditFormProfileUser profile={profile} onSave={setProfile} />
        </div>
      </div>
    </div>
  );
}
