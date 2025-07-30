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
      className="overflow-x-auto"
    >
      <table className="table table-zebra w-full text-sm rounded-lg overflow-hidden shadow border border-base-300">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Umur</th>
            <th>Gender</th>
            <th>Kamar</th>
            <th>Catatan Medis</th>
            <th className="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <motion.tr key={user.id} variants={rowVariants}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.room}</td>
              <td>{user.medicalNote}</td>
              <td className="flex justify-end gap-2 py-2">
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => onDelete(user.id!)}
                >
                  Hapus
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
