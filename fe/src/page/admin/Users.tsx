import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import UserForm from "../../components/admin/UserForm";
import { Toast } from "../../components/common/Toast";
import type { User } from "../../type/user";
import UserTable from "../../components/admin/table/UserTable";

const dummyUsers: User[] = [
  {
    id: 1,
    name: "Budi",
    email: "budi@example.com",
    age: 74,
    gender: "Male",
    room: "A1",
    medicalNote: "Diabetes",
  },
  {
    id: 2,
    name: "Siti",
    email: "siti@example.com",
    age: 69,
    gender: "Female",
    room: "B3",
    medicalNote: "Hipertensi",
  },
];

export default function UsersPage() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = dummyUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => dummyUsers,
  });

  const updateMutation = useMutation({
    mutationFn: async (user: User) => user,
    onSuccess: (data) => {
      queryClient.setQueryData(["users"], (old: User[] | undefined) => {
        const filtered = old?.filter((u) => u.id !== data.id) || [];
        return [...filtered, data];
      });
      setToast({ message: "Data berhasil disimpan", type: "success" });
      setSelectedUser(null);
      setIsAddMode(false);
    },
    onError: () => setToast({ message: "Gagal menyimpan data", type: "error" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => id,
    onSuccess: (id) => {
      queryClient.setQueryData(
        ["users"],
        (old: User[] | undefined) => old?.filter((u) => u.id !== id) || []
      );
      setToast({ message: "Penghuni dihapus", type: "success" });
    },
    onError: () => setToast({ message: "Gagal menghapus data", type: "error" }),
  });

  const handleSubmit = (user: User) => {
    const data = user.id ? user : { ...user, id: Date.now() };
    updateMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manajemen Penghuni</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIsAddMode(true);
            setSelectedUser(null);
          }}
        >
          Tambah Penghuni
        </button>
      </div>

      <UserTable
        users={users}
        onEdit={(user) => {
          setSelectedUser(user);
          setIsAddMode(true);
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <AnimatePresence>
        {(isAddMode || selectedUser) && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-base-100 p-6 rounded shadow-lg w-full max-w-md"
            >
              <UserForm
                initialData={selectedUser || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsAddMode(false);
                  setSelectedUser(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
