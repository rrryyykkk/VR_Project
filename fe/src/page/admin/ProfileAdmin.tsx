import { useState } from "react";
import ProfileDisplay from "../../components/admin/profile/ProfileDisplay";
import EditFormProfile from "../../components/admin/profile/EditFormProfile";

const initialProfile = {
  username: "hana123",
  fullName: "Hana Nana",
  email: "hana@example.com",
  profileImage: "/vite.svg",
  password: "default123",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Halaman Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileDisplay profile={profile} />
        </div>
        <div className="md:col-span-2">
          <EditFormProfile profile={profile} onSave={setProfile} />
        </div>
      </div>
    </div>
  );
}
