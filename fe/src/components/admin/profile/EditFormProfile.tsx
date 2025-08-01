import { useState } from "react";
import { motion } from "framer-motion";

interface Profile {
  username: string;
  fullName: string;
  email: string;
  profileImage: string;
  password: string;
}

interface Props {
  profile: Profile;
  onSave: (updated: Profile) => void;
}

export default function EditFormProfile({ profile, onSave }: Props) {
  const [form, setForm] = useState(profile);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    onSave(form);
    alert("Profil berhasil diperbarui!");
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
        <label htmlFor="username" className="label pb-1">
          <span className="label-text text-base">Username</span>
        </label>
        <input
          id="username"
          type="text"
          name="username"
          className="input input-bordered w-full"
          value={form.username}
          onChange={handleChange}
        />
      </div>

      {/* Full Name */}
      <div className="form-control">
        <label htmlFor="fullName" className="label pb-1">
          <span className="label-text text-base">Nama Lengkap</span>
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          className="input input-bordered w-full"
          value={form.fullName}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="form-control">
        <label htmlFor="email" className="label pb-1">
          <span className="label-text text-base">Email</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="input input-bordered w-full"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      {/* Profile Image */}
      <div className="form-control">
        <label htmlFor="profileImage" className="label pb-1">
          <span className="label-text text-base">Foto Profil</span>
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />
      </div>

      {/* Password */}
      <div className="form-control">
        <label htmlFor="password" className="label pb-1">
          <span className="label-text text-base">Password Baru</span>
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          className="input input-bordered w-full"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      {/* Confirm Password */}
      <div className="form-control">
        <label htmlFor="confirmPassword" className="label pb-1">
          <span className="label-text text-base">Konfirmasi Password</span>
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          className="input input-bordered w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

      {/* Submit Button */}
      <div className="pt-2">
        <button type="submit" className="btn btn-primary w-full">
          Simpan Perubahan
        </button>
      </div>
    </motion.form>
  );
}
