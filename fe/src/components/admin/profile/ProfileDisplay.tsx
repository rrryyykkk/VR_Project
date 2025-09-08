import { motion } from "framer-motion";

interface Profile {
  userName: string;
  fullName: string;
  email: string;
  imgProfile: string;
}

interface Props {
  profile: Profile;
}

export default function ProfileDisplay({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 p-6 bg-base-200 rounded-2xl shadow-md w-full max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="avatar"
      >
        <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={profile.imgProfile}
            alt="Profile"
            className="object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-bold text-primary">{profile.fullName}</h2>
        <p className="text-base text-gray-500">@{profile.userName}</p>
        <p className="text-base text-gray-600">{profile.email}</p>
      </motion.div>
    </motion.div>
  );
}
