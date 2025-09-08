import ProfileDisplay from "../../components/admin/profile/ProfileDisplay";
import EditFormProfile from "../../components/admin/profile/EditFormProfile";
import {
  useAdminProfile,
  useEditProfileAdmin,
} from "../../app/store/AdminStore";

export default function ProfilePage() {
  // ✅ Fetch admin profile via React Query
  const { data: admin, isLoading, isError, error } = useAdminProfile();
  const editProfileMutation = useEditProfileAdmin();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;
  if (!admin) return <p>No admin found</p>;

  // ✅ handler cukup mutate saja, toast sudah otomatis
  const handleSave = (formData: FormData) => {
    editProfileMutation.mutate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Halaman Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileDisplay profile={admin} />
        </div>
        <div className="md:col-span-2">
          <EditFormProfile profile={admin} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
