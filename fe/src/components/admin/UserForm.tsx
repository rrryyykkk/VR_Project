import { useState } from "react";
import type { User } from "../../type/user";
import { motion } from "framer-motion";
import { FaUserPlus, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

interface UserFormProps {
  onSubmit: (user: User) => void;
  onCancel: () => void;
  initialData?: User;
}

const UserForm = ({ onSubmit, onCancel, initialData }: UserFormProps) => {
  const [form, setForm] = useState<User>({
    id: initialData?.id ?? "",
    userName: initialData?.userName ?? "",
    fullName: initialData?.fullName ?? "",
    imgProfile: initialData?.imgProfile ?? "",
    email: initialData?.email ?? "",
    password: initialData?.password ?? "",
    age: initialData?.age ?? 0,
    gender: initialData?.gender ?? "lakiLaki",
    educationHistory: initialData?.educationHistory ?? "",
    medicalNote: initialData?.medicalNote ?? "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) : value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg sm:max-w-2xl bg-base-100 p-6 sm:p-8 rounded-2xl shadow-xl border border-base-300 mx-4 sm:mx-auto overflow-auto"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center text-primary mb-6 sm:mb-8">
        {form.id ? "Update User" : "Add New User"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Username */}
        <div className="form-control">
          <label className="label font-semibold">Username</label>
          <input
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Username"
            className="input input-bordered w-full"
          />
        </div>

        {/* Full Name */}
        <div className="form-control">
          <label className="label font-semibold">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="input input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label font-semibold">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full"
          />
        </div>

        {/* Password */}
        <div className="form-control relative">
          <label className="label font-semibold">Password</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Age */}
        <div className="form-control">
          <label className="label font-semibold">Age</label>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="input input-bordered w-full"
          />
        </div>

        {/* Gender */}
        <div className="form-control">
          <label className="label font-semibold">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="lakiLaki">Laki-Laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Education History */}
        <div className="form-control sm:col-span-2">
          <label className="label font-semibold">Riwayat Pendidikan</label>
          <input
            name="educationHistory"
            value={form.educationHistory}
            onChange={handleChange}
            placeholder="Riwayat Pendidikan"
            className="input input-bordered w-full"
          />
        </div>

        {/* Medical Note */}
        <div className="form-control sm:col-span-2">
          <label className="label font-semibold">Medical Note</label>
          <input
            name="medicalNote"
            value={form.medicalNote}
            onChange={handleChange}
            placeholder="Medical Note"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="btn btn-outline btn-error w-full sm:w-auto px-6"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
        <button
          onClick={() => onSubmit(form)}
          className="btn btn-primary w-full sm:w-auto px-6"
        >
          <FaUserPlus className="mr-2" />
          {form.id ? "Update" : "Add"}
        </button>
      </div>
    </motion.div>
  );
};

export default UserForm;
