import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaIdCard,
  FaLink,
} from "react-icons/fa";
import { useToast } from "../../../hooks/ToastContext";

interface Profile {
  userName?: string;
  fullName?: string;
  email?: string;
  imgProfile?: string;
  password?: string;
}

interface Props {
  profile: Profile;
  onSave: (formData: FormData) => void;
  isLoading?: boolean;
}

const IconInput = ({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1">
    <label className="block text-gray-700 font-medium text-sm">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-gray-400" />
      <input
        {...props}
        className={`input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
          props.className || ""
        }`}
      />
    </div>
  </div>
);

export default function EditFormProfileUser({
  profile,
  onSave,
  isLoading,
}: Props) {
  const { addToast } = useToast();
  const [form, setForm] = useState<Profile>({ ...profile, password: "" });
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
        setForm({ ...form, imgProfile: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password && form.password !== confirmPassword) {
      addToast("Password tidak cocok!", "error");
      return;
    }

    const formData = new FormData();
    if (form.userName) formData.append("userName", form.userName);
    if (form.fullName) formData.append("fullName", form.fullName);
    if (form.email) formData.append("email", form.email);
    if (form.password) formData.append("newPassword", form.password);

    // imgProfile bisa file atau link
    if (form.imgProfile) {
      if (form.imgProfile.startsWith("data:")) {
        fetch(form.imgProfile)
          .then((res) => res.blob())
          .then((blob) => {
            formData.append("imgProfile", blob, "profile.png");
            onSave(formData);
            addToast("Profil berhasil diperbarui!", "success");
          })
          .catch(() => addToast("Gagal upload gambar!", "error"));
      } else {
        formData.append("imgProfile", form.imgProfile); // link langsung
        onSave(formData);
        addToast("Profil berhasil diperbarui!", "success");
      }
    } else {
      onSave(formData);
      addToast("Profil berhasil diperbarui!", "success");
    }
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
        label="UserName"
        icon={FaUser}
        type="text"
        name="userName"
        value={form.userName || ""}
        onChange={handleChange}
        placeholder="Masukkan userName"
      />

      <IconInput
        label="Nama Lengkap"
        icon={FaIdCard}
        type="text"
        name="fullName"
        value={form.fullName || ""}
        onChange={handleChange}
        placeholder="Masukkan nama lengkap"
      />

      <IconInput
        label="Email"
        icon={FaEnvelope}
        type="email"
        name="email"
        value={form.email || ""}
        onChange={handleChange}
        placeholder="Masukkan email"
      />

      {/* Upload Foto + Link */}
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium text-sm">
          Foto Profil
        </label>
        {form.imgProfile && (
          <img
            src={form.imgProfile}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
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
        <div className="flex items-center gap-3">
          <FaLink className="text-gray-400" />
          <input
            type="text"
            placeholder="Masukkan link gambar (opsional)"
            value={form.imgProfile?.startsWith("http") ? form.imgProfile : ""}
            onChange={(e) => setForm({ ...form, imgProfile: e.target.value })}
            className="input input-bordered w-full"
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
        disabled={isLoading}
        className="btn btn-primary w-full bg-pink-500 hover:bg-pink-600 border-none disabled:opacity-50"
      >
        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </motion.form>
  );
}
