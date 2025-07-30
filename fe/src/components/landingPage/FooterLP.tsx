import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const Services = [
  { name: "Perawatan 24 Jam", link: "#" },
  { name: "Nutrisi Seimbang", link: "#" },
  { name: "Pemeriksaan Kesehatan", link: "#" },
  { name: "Kegiatan Rekreasi", link: "#" },
];

const AboutUs = [
  { name: "Profil Panti", link: "/about" },
  { name: "Visi & Misi", link: "#" },
  { name: "Galeri", link: "#" },
  { name: "Hubungi Kami", link: "/contact" },
];

const Information = [
  { name: "Kebijakan Privasi", link: "#" },
  { name: "Syarat & Ketentuan", link: "#" },
  { name: "Donasi", link: "#" },
  { name: "FAQ", link: "#" },
];

const FooterLP = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="relative mt-20">
      {/* Haikei wave divider */}
      <svg
        className="w-full h-12 md:h-16 lg:h-20 xl:h-24 text-fuchsia-100 -mb-1 md:-mb-2 lg:-mb-4"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,144C672,139,768,149,864,154.7C960,160,1056,160,1152,154.7C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      {/* Footer Content */}
      <motion.footer
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-b from-fuchsia-50 to-white text-gray-700 px-6 md:px-10 py-12"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <img src="/vite.svg" alt="Logo" className="w-32" />
          </motion.div>

          {/* Sections */}
          {[
            { title: "Layanan", items: Services },
            { title: "Tentang Kami", items: AboutUs },
            { title: "Informasi", items: Information },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + idx * 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-fuchsia-600 mb-2">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      className="text-gray-600 hover:text-fuchsia-600 transition"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.footer>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-fuchsia-50 text-gray-600 text-center py-4 flex flex-col items-center gap-2"
      >
        <FaHeart className="text-fuchsia-400" />
        <p className="text-sm">
          © {new Date().getFullYear()} Panti Jompo Harapan Sejahtera. All rights
          reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default FooterLP;
