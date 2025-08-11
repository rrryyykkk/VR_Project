import { motion } from "framer-motion";

interface Profile {
  username: string;
  fullName: string;
  email: string;
  profileImage: string;
}

interface Props {
  profile: Profile;
}

export default function ProfileDisplayUser({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col items-center"
    >
      <motion.img
        src={profile.profileImage}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-pink-300 shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      />

      <div className="mt-4 text-center space-y-1">
        <h2 className="text-2xl font-bold text-pink-500">{profile.fullName}</h2>
        <p className="text-sm text-gray-500">@{profile.username}</p>
        <p className="text-gray-600">{profile.email}</p>
      </div>
    </motion.div>
  );
}
