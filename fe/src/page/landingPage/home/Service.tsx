import { motion } from "framer-motion";
import { FaVrCardboard, FaBrain, FaDatabase, FaRobot } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const services = [
  {
    icon: <FaVrCardboard size={30} className="text-fuchsia-600" />,
    title: "Virtual Reality Therapy",
    description:
      "Menggunakan teknologi Virtual Reality untuk melatih fungsi kognitif lansia dengan pengalaman interaktif yang imersif.",
  },
  {
    icon: <FaBrain size={30} className="text-fuchsia-600" />,
    title: "Neurocognitive Assessment",
    description:
      "Menganalisis kondisi neurokognitif secara real-time untuk mendukung diagnosis dini pada lansia.",
  },
  {
    icon: <FaDatabase size={30} className="text-fuchsia-600" />,
    title: "Data Recording & Monitoring",
    description:
      "Merekam dan memantau data kesehatan serta respons pengguna untuk mendukung penelitian berbasis bukti di PPSLU.",
  },
  {
    icon: <FaRobot size={30} className="text-fuchsia-600" />,
    title: "Machine Learning Support",
    description:
      "Menggunakan kecerdasan buatan untuk mengolah data hasil terapi sehingga diagnosis menjadi lebih cerdas dan akurat.",
  },
];

const Service = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="py-16 px-4 max-w-6xl mx-auto"
      aria-labelledby="mind-services-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2
          id="mind-services-title"
          className="text-3xl md:text-4xl font-bold mb-4 text-fuchsia-600"
        >
          Layanan & Fitur MIND Platform
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          <strong>
            MIND (Mixedreality Intelligent Neurocognitive Diagnosis)
          </strong>
          merupakan platform penelitian di <strong>PPSLU</strong> yang memadukan
          <em>Virtual Reality</em>, rekaman data, dan <em>machine learning</em>
          untuk mendukung diagnosis cerdas, pemantauan kesehatan, serta
          peningkatan kualitas hidup lansia.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Service;
