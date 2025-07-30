import { motion } from "framer-motion";
import { FaHandsHelping, FaLeaf, FaHeart } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: <FaHandsHelping size={30} className="text-fuchsia-600" />,
    title: "Perawatan Peduli",
    description:
      "Memberikan perawatan penuh kasih dan kepedulian kepada lansia dengan pendekatan personal.",
  },
  {
    icon: <FaLeaf size={30} className="text-green-600" />,
    title: "Lingkungan Asri",
    description:
      "Lingkungan panti yang bersih, hijau, dan nyaman sehingga lansia merasa seperti di rumah sendiri.",
  },
  {
    icon: <FaHeart size={30} className="text-pink-600" />,
    title: "Kegiatan Positif",
    description:
      "Beragam aktivitas positif untuk menjaga semangat dan kebahagiaan penghuni setiap harinya.",
  },
];

const Profile = () => {
  const [ref, inView] = useInView({
    triggerOnce: false, // akan aktif setiap scroll muncul
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-16 px-4 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Kiri: Gambar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-3xl shadow-xl"
        >
          <img
            src="/bg.jpg"
            alt="Panti Jompo Harapan Sejahtera"
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </motion.div>

        {/* Kanan: Profil */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-fuchsia-600">
            Profil Panti Jompo Harapan Sejahtera
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Kami memberikan perawatan terbaik bagi lansia dengan kasih sayang,
            lingkungan yang nyaman, serta berbagai kegiatan positif yang
            mendukung kesejahteraan dan kebahagiaan mereka.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div>{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
