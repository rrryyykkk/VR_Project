import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "../../../hooks/ToastContext";

interface Profile {
  userName: string;
  fullName: string;
  email: string;
  imgProfile: string;
}

interface Props {
  profile: Profile;
  onSave: (formData: FormData) => Promise<void> | void;
}

export default function EditFormProfile({ profile, onSave }: Props) {
  const [form, setForm] = useState({
    ...profile,
    newPassword: "",
    oldPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imgProfile: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);

      if (form.oldPassword) {
        formData.append("oldPassword", form.oldPassword);
      }
      if (form.newPassword) {
        formData.append("newPassword", form.newPassword);
      }
      if (file) {
        formData.append("imgProfile", file); // upload file
      } else if (form.imgProfile.startsWith("http")) {
        formData.append("imgProfile", form.imgProfile); // kirim link
      }

      await onSave(formData);
      addToast("Profil berhasil diperbarui!", "success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        addToast(error.message, "error");
      } else {
        addToast("Terjadi kesalahan saat update profil", "error");
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-lg"
    >
      <h3 className="text-2xl font-semibold text-gray-800">Edit Profil</h3>

      {/* Username */}
      <div className="form-control">
        <label className="label pb-1">Username</label>
        <input
          type="text"
          name="userName"
          className="input input-bordered w-full"
          value={form.userName}
          onChange={handleChange}
        />
      </div>

      {/* Full Name */}
      <div className="form-control">
        <label className="label pb-1">Nama Lengkap</label>
        <input
          type="text"
          name="fullName"
          className="input input-bordered w-full"
          value={form.fullName}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="form-control">
        <label className="label pb-1">Email</label>
        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      {/* Old Password */}
      <div className="form-control">
        <label className="label pb-1">Password Lama</label>
        <input
          type={showPassword ? "text" : "password"}
          name="oldPassword"
          className="input input-bordered w-full"
          value={form.oldPassword}
          onChange={handleChange}
        />
      </div>

      {/* New Password */}
      <div className="form-control">
        <label className="label pb-1">Password Baru</label>
        <input
          type={showPassword ? "text" : "password"}
          name="newPassword"
          className="input input-bordered w-full"
          value={form.newPassword}
          onChange={handleChange}
        />
      </div>

      {/* Toggle Show Password */}
      <div className="form-control">
        <label className="label cursor-pointer gap-3">
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <span className="label-text text-sm">Tampilkan Password</span>
        </label>
      </div>

      {/* Profile Image - Upload */}
      <div className="form-control">
        <label className="label pb-1">Upload Foto Profil</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />
      </div>

      {/* OR pakai link */}
      <div className="form-control">
        <label className="label pb-1">Link Foto Profil</label>
        <input
          type="text"
          name="imgProfile"
          placeholder="https://example.com/profile.jpg"
          className="input input-bordered w-full"
          value={form.imgProfile}
          onChange={handleChange}
        />
      </div>

      {/* Preview */}
      {form.imgProfile && (
        <div className="flex justify-center">
          <img
            src={form.imgProfile}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button type="submit" className="btn btn-primary w-full">
          Simpan Perubahan
        </button>
      </div>
    </motion.form>
  );
}
