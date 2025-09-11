import { motion } from "framer-motion";
import type { User } from "../../../type/user";

interface Props {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void; // ganti number -> string
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function UserTable({ users, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="overflow-x-auto w-full"
    >
      <div className="min-w-[800px]">
        <table className="table table-zebra w-full text-sm rounded-xl shadow border border-base-300">
          <thead className="bg-base-200 text-base-content text-xs md:text-sm">
            <tr>
              <th className="whitespace-nowrap">Nama</th>
              <th className="whitespace-nowrap">Email</th>
              <th className="whitespace-nowrap">Umur</th>
              <th className="whitespace-nowrap">Gender</th>
              <th className="whitespace-nowrap">Riwayat Pendidikan</th>
              <th className="whitespace-nowrap">Catatan Medis</th>
              <th className="whitespace-nowrap text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <motion.tr
                  key={user.id}
                  variants={rowVariants}
                  className="hover"
                >
                  <td className="whitespace-nowrap">{user.fullName}</td>
                  <td className="whitespace-nowrap">{user.email}</td>

                  <td className="whitespace-nowrap">{user.age}</td>
                  <td className="whitespace-nowrap">{user.gender}</td>
                  <td className="whitespace-nowrap">{user.educationHistory}</td>
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
                        onClick={() => onDelete(user.id)}
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
