import { useState } from "react";
import { motion } from "framer-motion";
import type { User } from "../../../type/user";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(
    new Set()
  );

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="overflow-x-auto w-full"
    >
      {/* Container dengan min-w supaya tabel tidak mengecil */}
      <div className="min-w-[800px]">
        <table className="table table-zebra w-full text-sm rounded-xl shadow border border-base-300">
          <thead className="bg-base-200 text-base-content text-xs md:text-sm">
            <tr>
              <th className="whitespace-nowrap">Nama</th>
              <th className="whitespace-nowrap">Email</th>
              <th className="whitespace-nowrap">Password</th>
              <th className="whitespace-nowrap">Umur</th>
              <th className="whitespace-nowrap">Gender</th>
              <th className="whitespace-nowrap">Riwayat Pendidikan</th>
              <th className="whitespace-nowrap">Catatan Medis</th>
              <th className="whitespace-nowrap text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isVisible = visiblePasswords.has(user.id!);
              return (
                <motion.tr
                  key={user.id}
                  variants={rowVariants}
                  className="hover"
                >
                  <td className="whitespace-nowrap">{user.name}</td>
                  <td className="whitespace-nowrap">{user.email}</td>
                  <td className="whitespace-nowrap flex items-center gap-2">
                    <span>
                      {isVisible
                        ? user.password
                        : "*".repeat(user.password.length)}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(user.id!)}
                      className="btn btn-xs btn-ghost p-0"
                      aria-label={
                        isVisible
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                      type="button"
                    >
                      {isVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </td>
                  <td className="whitespace-nowrap">{user.age}</td>
                  <td className="whitespace-nowrap">{user.gender}</td>
                  <td className="whitespace-nowrap">
                    {user.riwayatPendidikan}
                  </td>
                  <td className="whitespace-nowrap">{user.medicalNote}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex flex-wrap justify-end gap-2 py-1">
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => onDelete(user.id!)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
