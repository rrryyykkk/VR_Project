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

export default function ProfileDisplayUser({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg 
                 p-4 sm:p-6 md:p-8 
                 flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto"
    >
      <motion.img
        src={profile.imgProfile}
        alt="Profile"
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
                   rounded-full object-cover border-4 border-pink-300 shadow-md"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      />

      <div className="mt-4 text-center sm:text-left w-full space-y-1">
        {/* Full Name */}
        <h2
          className="text-lg sm:text-xl md:text-2xl font-bold text-pink-500 
                     truncate"
          title={profile.fullName} // tooltip kalau hover
        >
          {profile.fullName}
        </h2>

        {/* Username */}
        <p className="text-xs sm:text-sm md:text-base text-gray-500">
          @{profile.userName}
        </p>

        {/* Email */}
        <p
          className="text-sm sm:text-base text-gray-600 truncate"
          title={profile.email}
        >
          {profile.email}
        </p>
      </div>
    </motion.div>
  );
}
