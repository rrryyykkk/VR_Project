import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Services = [
  { name: "Perawatan 24 Jam", link: "#" },
  { name: "Nutrisi Seimbang", link: "#" },
  { name: "Pemeriksaan Kesehatan", link: "#" },
  { name: "Kegiatan Rekreasi", link: "#" },
];

const AboutMIND = [
  { name: "Profil MIND Platform", link: "#" },
  { name: "Visi & Misi Penelitian", link: "#" },
  { name: "Galeri", link: "#" },
  { name: "Hubungi Tim Penelitian", link: "#" },
];

const Information = [
  { name: "Kebijakan Privasi", link: "#" },
  { name: "Syarat & Ketentuan Partisipasi", link: "#" },
  { name: "FAQ", link: "#" },
];

const FooterLP = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="relative mt-20">
      {/* Wave Divider */}
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
          {/* Logo & MIND tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <img src="/logo/1.png" alt="MIND Platform Logo" className="w-32" />
            <p className="text-sm text-gray-600">
              Mixedreality Intelligent Neurocognitive Diagnosis Platform
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-fuchsia-600 mb-2">
              Layanan
            </h3>
            <ul className="space-y-2">
              {Services.map((item, index) => (
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

          {/* About MIND */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-fuchsia-600 mb-2">
              Tentang MIND
            </h3>
            <ul className="space-y-2">
              {AboutMIND.map((item, index) => (
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

          {/* Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-fuchsia-600 mb-2">
              Informasi
            </h3>
            <ul className="space-y-2">
              {Information.map((item, index) => (
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
        </div>
      </motion.footer>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
        className="bg-fuchsia-50 text-gray-600 text-center py-4 flex flex-col items-center gap-2"
      >
        <p className="text-sm">
          © {new Date().getFullYear()} MIND Platform. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default FooterLP;
