import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const testimonies = [
  {
    name: "Ibu Sari",
    relation: "Keluarga Penghuni",
    message:
      "Panti ini sangat peduli dengan penghuni, lingkungan nyaman, dan pelayanan yang penuh kasih sayang.",
    photo: "/avatar/01.jpg",
  },
  {
    name: "Pak Budi",
    relation: "Penghuni",
    message:
      "Di sini saya merasa seperti keluarga sendiri, banyak teman, dan banyak kegiatan yang menyenangkan.",
    photo: "/avatar/02.jpg",
  },
  {
    name: "Bu Ratna",
    relation: "Relawan",
    message:
      "Saya senang bisa menjadi relawan di sini, suasananya positif dan membuat penghuni merasa dihargai.",
    photo: "/avatar/03.jpg",
  },
];

const Testimoni = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fuchsia-600">
          Testimoni Mereka
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Cerita dan pengalaman mereka yang telah merasakan kehangatan pelayanan
          kami.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonies.map((testi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <FaQuoteLeft className="text-fuchsia-600 text-3xl mb-4" />
            <p className="text-gray-600 italic mb-4">"{testi.message}"</p>
            <img
              src={testi.photo}
              alt={testi.name}
              className="w-16 h-16 rounded-full object-cover mb-2 shadow-md"
            />
            <h3 className="font-semibold text-gray-800">{testi.name}</h3>
            <span className="text-sm text-gray-500">{testi.relation}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimoni;
