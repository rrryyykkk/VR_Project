import { motion } from "framer-motion";
import { FaUserNurse, FaUtensils, FaHeartbeat, FaSmile } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const services = [
  {
    icon: <FaUserNurse size={30} className="text-fuchsia-600" />,
    title: "Perawatan 24 Jam",
    description:
      "Perawatan intensif selama 24 jam oleh tenaga profesional dengan kasih sayang dan empati.",
  },
  {
    icon: <FaUtensils size={30} className="text-fuchsia-600" />,
    title: "Nutrisi Seimbang",
    description:
      "Menyediakan makanan bergizi dan seimbang sesuai dengan kebutuhan dan kondisi kesehatan penghuni.",
  },
  {
    icon: <FaHeartbeat size={30} className="text-fuchsia-600" />,
    title: "Pemeriksaan Kesehatan",
    description:
      "Pemeriksaan kesehatan rutin oleh tenaga medis untuk memastikan kondisi kesehatan penghuni tetap optimal.",
  },
  {
    icon: <FaSmile size={30} className="text-fuchsia-600" />,
    title: "Kegiatan Rekreasi",
    description:
      "Beragam aktivitas rekreasi untuk menjaga semangat dan suasana hati positif penghuni setiap harinya.",
  },
];

const Service = () => {
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
          Layanan Kami
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Kami menyediakan layanan terbaik untuk memastikan penghuni mendapatkan
          perawatan, kenyamanan, dan kebahagiaan setiap hari.
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
