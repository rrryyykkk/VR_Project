import { motion } from "framer-motion";
import type { User } from "../../../type/user";

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
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="overflow-x-auto w-full"
    >
      <div className="min-w-[640px] md:min-w-full">
        <table className="table table-zebra w-full text-sm rounded-xl shadow border border-base-300">
          <thead className="bg-base-200 text-base-content text-xs md:text-sm">
            <tr>
              <th>Nama</th>
              <th>Umur</th>
              <th className="hidden sm:table-cell">Gender</th>
              <th className="hidden sm:table-cell">Riwayat Pendidikan</th>
              <th className="hidden lg:table-cell">Catatan Medis</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr key={user.id} variants={rowVariants} className="hover">
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td className="hidden sm:table-cell">{user.gender}</td>
                <td>{user.riwayatPendidikan}</td>
                <td className="hidden lg:table-cell">{user.medicalNote}</td>
                <td>
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
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
