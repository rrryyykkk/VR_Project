import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserForm from "../../components/admin/UserForm";
import UserTable from "../../components/admin/table/UserTable";
import { Toast } from "../../components/common/Toast";
import type { User, UserPayload } from "../../type/user";

import {
  useAllUsers,
  useCreateUserAdmin,
  useEditUserAdmin,
  useDeleteUserAdmin,
} from "../../app/store/UserStore";

const UsersPage = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // 🔹 Hooks
  const { data: users = [], isLoading } = useAllUsers();
  const createMutation = useCreateUserAdmin();

  const editMutation = useEditUserAdmin();
  const deleteMutation = useDeleteUserAdmin();

  // 🔹 Handle Submit (Add or Edit)
  const handleSubmit = (user: User) => {
    // 🔹 Siapkan payload JSON
    const payload: UserPayload = {
      fullName: user.fullName,
      userName: user.userName,
      imgProfile: user.imgProfile,
      email: user.email,
      password: user.password,
      age: user.age,
      gender: user.gender,
      educationHistory: user.educationHistory,
      medicalNote: user.medicalNote,
    };

    console.log("payload", payload);
    if (user.id) {
      // Edit user
      editMutation.mutate(
        { id: user.id, payload },
        {
          onSuccess: () => {
            setToast({ message: "User berhasil diperbarui", type: "success" });
            setSelectedUser(null);
            setIsAddMode(false);
          },
          onError: () =>
            setToast({ message: "Gagal memperbarui user", type: "error" }),
        }
      );
    } else {
      // Add user
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          console.log("Response", data);
          setToast({ message: "User berhasil ditambahkan", type: "success" });
          setIsAddMode(false);
        },
        onError: () =>
          setToast({ message: "Gagal menambahkan user", type: "error" }),
      });
    }
  };

  // 🔹 Handle Delete
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () =>
        setToast({ message: "User berhasil dihapus", type: "success" }),
      onError: () =>
        setToast({ message: "Gagal menghapus user", type: "error" }),
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">Manajemen User</h2>
        <button
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => {
            setIsAddMode(true);
            setSelectedUser(null);
          }}
        >
          Tambah User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 p-4 rounded-xl shadow">
        <UserTable
          users={users}
          loading={isLoading}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsAddMode(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {(isAddMode || selectedUser) && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-md"
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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UsersPage;
