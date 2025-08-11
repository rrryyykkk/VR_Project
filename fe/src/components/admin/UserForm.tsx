import { useState } from "react";
import type { User } from "../../type/user";
import { motion } from "framer-motion";
import { FaUserPlus, FaTimes } from "react-icons/fa";

interface UserFormProps {
  onSubmit: (user: User) => void;
  onCancel: () => void;
  initialData?: User;
}

const UserForm = ({ onSubmit, onCancel, initialData }: UserFormProps) => {
  const [form, setForm] = useState<User>({
    name: "",
    age: 0,
    gender: "Male",
    riwayatPendidikan: "",
    medicalNote: "",
    ...initialData,
  });

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
      className="max-w-3xl w-full bg-base-100 p-8 rounded-3xl shadow-xl border border-base-300 mx-auto"
    >
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        {form.id ? "Update User" : "Add New User"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label font-semibold">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input input-bordered w-full"
          />
        </div>

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

        <div className="form-control">
          <label className="label font-semibold">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="form-control md:col-span-2">
          <label className="label font-semibold">Riwayat Pendidikan</label>
          <input
            name="riwayatPendidikan"
            value={form.riwayatPendidikan}
            onChange={handleChange}
            placeholder="Room (e.g. A101)"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control md:col-span-2">
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

      <div className="flex justify-end gap-4 mt-10">
        <button onClick={onCancel} className="btn btn-outline btn-error px-6">
          <FaTimes className="mr-2" />
          Cancel
        </button>
        <button onClick={() => onSubmit(form)} className="btn btn-primary px-6">
          <FaUserPlus className="mr-2" />
          {form.id ? "Update" : "Add"}
        </button>
      </div>
    </motion.div>
  );
};

export default UserForm;
