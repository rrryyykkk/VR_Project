import { motion } from "framer-motion";
import { FaDonate, FaHandHoldingHeart, FaHandsHelping } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const benefits = [
  {
    icon: <FaDonate size={40} className="text-fuchsia-600" />,
    title: "Transparansi Dana",
    description:
      "Setiap donasi Anda dicatat secara transparan dan digunakan tepat sasaran untuk kebutuhan lansia.",
  },
  {
    icon: <FaHandHoldingHeart size={40} className="text-pink-600" />,
    title: "Memberikan Kebahagiaan",
    description:
      "Donasi Anda membantu lansia mendapatkan perawatan, nutrisi, dan kegiatan positif setiap hari.",
  },
  {
    icon: <FaHandsHelping size={40} className="text-green-600" />,
    title: "Bantu Lansia Berdaya",
    description:
      "Dengan berdonasi, Anda mendukung lansia untuk tetap aktif dan merasa dihargai di masa tuanya.",
  },
];

const Donation = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="py-20 px-4 max-w-6xl mx-auto relative overflow-hidden text-fuchsia-700"
    >
      {/* Haikei Background Wave */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient overlay biar teks tetap kontras */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/60 to-pink-100/80"></div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Mari Berdonasi untuk Lansia
        </h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          Donasi Anda membantu menyediakan kebutuhan nutrisi, layanan kesehatan,
          dan kenyamanan bagi para lansia di Panti Jompo Harapan Sejahtera.
          Bersama kita wujudkan masa tua yang bahagia.
        </p>
      </motion.div>

      {/* Benefit Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-fuchsia-700">
              {benefit.title}
            </h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center mt-12"
      >
        <a
          href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20berdonasi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-semibold px-8 py-4 rounded-full shadow hover:brightness-110 transition"
        >
          Donasi Sekarang
        </a>
      </motion.div>
    </section>
  );
};

export default Donation;
