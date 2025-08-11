import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaImage, FaIdCard } from "react-icons/fa";

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

const IconInput = ({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1">
    <label className="block text-gray-700 font-medium text-sm">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-gray-400" />
      <input
        {...props}
        className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  </div>
);

export default function EditFormProfileUser({ profile, onSave }: Props) {
  const [form, setForm] = useState(profile);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setForm({ ...form, profileImage: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.fullName || !form.email) {
      return alert("Harap isi semua data profil!");
    }
    if (form.password !== confirmPassword) {
      return alert("Password tidak cocok!");
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
      className="bg-white rounded-2xl shadow-xl p-6 space-y-5"
    >
      <h3 className="text-xl font-bold text-gray-800">Edit Profil</h3>

      <IconInput
        label="Username"
        icon={FaUser}
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Masukkan username"
      />

      <IconInput
        label="Nama Lengkap"
        icon={FaIdCard}
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Masukkan nama lengkap"
      />

      <IconInput
        label="Email"
        icon={FaEnvelope}
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Masukkan email"
      />

      {/* Upload Foto + Preview */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium text-sm">
          Foto Profil
        </label>
        {form.profileImage && (
          <img
            src={form.profileImage}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover mb-3 border border-gray-200"
          />
        )}
        <div className="flex items-center gap-3">
          <FaImage className="text-gray-400" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
        </div>
      </div>

      {/* Password & Konfirmasi */}
      <div className="grid grid-cols-2 gap-3">
        <IconInput
          label="Password Baru"
          icon={FaLock}
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Masukkan password baru"
        />
        <IconInput
          label="Konfirmasi Password"
          icon={FaLock}
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi password"
        />
      </div>

      {/* Toggle Show Password */}
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        Tampilkan Password
      </label>

      <button
        type="submit"
        className="btn btn-primary w-full bg-pink-500 hover:bg-pink-600 border-none"
      >
        Simpan Perubahan
      </button>
    </motion.form>
  );
}
