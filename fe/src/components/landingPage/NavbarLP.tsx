import { useEffect, useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../app/store/AuthStore";
import { useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useUserProfile } from "../../app/store/UserStore";

const menu = [
  { name: "Home", link: "/" },
  { name: "Tentang Kami", link: "/about" },
  { name: "Kontak", link: "/contact" },
  { name: "Insight", link: "/insight" },
  { name: "360 View", link: "/vr" },
];

const NavbarLP = () => {
  const [hamburgerMenu, setHamburgerMenu] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useUserProfile();
  const { logoutUser } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logOutUser = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed top-0 z-50 w-full grid grid-cols-2 transition-all duration-300 rounded-b-xl ${
          isScroll
            ? "backdrop-blur-md bg-black/10 border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        {/* Left Logo */}
        <div className="flex p-5 font-bold text-2xl text-teal-400">
          M<span className="text-fuchsia-600">I</span>N
          <span className="text-fuchsia-600">D</span>
        </div>

        {/* Right Menu */}
        <div className="flex p-5 justify-end items-center space-x-4">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {menu.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className={`font-medium transition-colors ${
                  isScroll ? "text-gray-800" : "text-fuchsia-600"
                } hover:text-fuchsia-400`}
              >
                {item.name}
              </a>
            ))}

            {/* ✅ Profile / Login */}
            {isLoading ? null : isError || !user ? (
              <a
                href="/login"
                className="relative inline-block rounded-full px-4 py-2 font-bold text-white overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm"></span>
                <span className="relative z-10">Login</span>
              </a>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center"
                >
                  {user.imgProfile ? (
                    <img
                      src={user.imgProfile}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border-2 border-fuchsia-500 object-cover shadow-md"
                    />
                  ) : (
                    <FaUserCircle className="w-9 h-9 text-gray-700 hover:text-fuchsia-600 transition cursor-pointer" />
                  )}
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-60 rounded-2xl shadow-xl border border-white/20 
                                 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/20">
                        <div className="flex items-center space-x-3">
                          {user.imgProfile ? (
                            <img
                              src={user.imgProfile}
                              alt="avatar"
                              className="w-12 h-12 rounded-full border border-fuchsia-400 object-cover"
                            />
                          ) : (
                            <FaUserCircle className="w-12 h-12 text-fuchsia-600 cursor-pointer" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <a
                        href="/profile"
                        className="block px-4 py-3 text-gray-800 font-medium hover:bg-fuchsia-100 transition"
                      >
                        Profile
                      </a>
                      <button
                        onClick={logOutUser}
                        className="w-full text-left px-4 py-3 text-gray-800 font-medium hover:bg-fuchsia-100 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Hamburger Button (Mobile) */}
          <div className="block lg:hidden">
            <button
              onClick={() => setHamburgerMenu(true)}
              className="text-3xl cursor-pointer text-fuchsia-600"
            >
              <RxHamburgerMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Drawer (Mobile) */}
      <AnimatePresence>
        {hamburgerMenu && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setHamburgerMenu(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 bg-white w-4/5 max-w-xs h-full px-8 py-6 flex flex-col justify-between shadow-2xl shadow-black/20 rounded-r-3xl"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setHamburgerMenu(false)}
                  className="text-3xl text-gray-700 hover:text-fuchsia-600 p-1 rounded-full focus:outline-none"
                  aria-label="Close menu"
                >
                  <RxCross2 />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col space-y-5 mt-6 overflow-y-auto">
                {menu.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    onClick={() => setHamburgerMenu(false)}
                    className="text-lg font-medium text-gray-800 hover:text-fuchsia-600 transition underline-offset-4 hover:underline"
                  >
                    {item.name}
                  </a>
                ))}

                {/* ✅ Mobile Profile / Login */}
                {isLoading ? null : isError || !user ? (
                  <a
                    href="/login"
                    onClick={() => setHamburgerMenu(false)}
                    className="relative inline-block rounded-full text-center px-6 py-3 font-semibold text-white overflow-hidden group transition-all duration-300 mt-6"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-500 transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm rounded-full"></span>
                    <span className="relative z-10 text-white">Login</span>
                  </a>
                ) : (
                  <div className="mt-6 space-y-3">
                    <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
                      <div className="flex items-center space-x-4">
                        {user.imgProfile ? (
                          <img
                            src={user.imgProfile}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-12 h-12 text-white" />
                        )}
                        <div>
                          <p className="font-bold text-lg">{user.fullName}</p>
                          <p className="text-sm opacity-80">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href="/profile"
                      onClick={() => setHamburgerMenu(false)}
                      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-fuchsia-100"
                    >
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        logOutUser();
                        setHamburgerMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-fuchsia-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarLP;
