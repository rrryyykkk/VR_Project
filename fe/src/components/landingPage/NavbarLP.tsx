import { useEffect, useState } from "react";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
          <div className="hidden lg:block">
            <div
              className={`flex space-x-8 items-center font-semibold transition-colors duration-300 ${
                isScroll ? "text-black" : "text-fuchsia-600"
              }`}
            >
              {menu.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="hover:text-fuchsia-300 transition"
                >
                  {item.name}
                </a>
              ))}
              {/* Beautiful Login Button */}
              <a
                href="/login"
                className="relative inline-block rounded-2xl px-4 py-2 font-bold text-white overflow-hidden group transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm"></span>
                <span className="relative z-10">Login</span>
              </a>
            </div>
          </div>

          {/* Hamburger Button */}
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

      {/* Hamburger Overlay with Framer Motion */}
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

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 bg-white w-4/5 max-w-xs h-full px-8 py-6 flex flex-col justify-between shadow-2xl shadow-black/20 rounded-r-3xl"
            >
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setHamburgerMenu(false)}
                  className="text-3xl text-gray-700 hover:text-fuchsia-600 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-full p-1 cursor-pointer"
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
              </div>

              {/* Beautiful Login Button */}
              <a
                href="/login"
                onClick={() => setHamburgerMenu(false)}
                className="relative inline-block rounded-full text-center px-6 py-3 font-semibold text-white overflow-hidden group transition-all duration-300 mt-6"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-500  transition-transform duration-500 group-hover:scale-110 group-hover:blur-sm rounded-full"></span>
                <span className="relative z-10 text-white">Login</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarLP;
