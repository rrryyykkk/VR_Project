import { motion } from "framer-motion";
import { FaBrain, FaVrCardboard, FaRobot, FaDatabase } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
// SEO Helmet
import { Helmet } from "react-helmet";

const features = [
  {
    icon: <FaVrCardboard size={30} className="text-fuchsia-600" />,
    title: "Virtual Reality Therapy",
    description:
      "Menggunakan teknologi Virtual Reality untuk melatih dan menstimulasi fungsi neurokognitif lansia secara imersif.",
  },
  {
    icon: <FaBrain size={30} className="text-green-600" />,
    title: "Neurocognitive Analysis",
    description:
      "Menganalisis kondisi neurokognitif lansia dengan pendekatan berbasis data untuk diagnosis lebih akurat.",
  },
  {
    icon: <FaDatabase size={30} className="text-pink-600" />,
    title: "Data Recording & Monitoring",
    description:
      "MIND Platform merekam data kesehatan dan respon pasien, memungkinkan pemantauan yang lebih komprehensif.",
  },
  {
    icon: <FaRobot size={30} className="text-indigo-600" />,
    title: "Machine Learning Diagnosis",
    description:
      "Menggunakan kecerdasan buatan untuk mengolah data pasien sehingga menghasilkan diagnosis cerdas dan adaptif.",
  },
];

const Profile = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="py-16 px-4 max-w-6xl mx-auto"
      aria-labelledby="mind-platform-title"
    >
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          MIND Platform - Penelitian Mixedreality Neurocognitive Diagnosis
          dengan VR & Machine Learning
        </title>
        <meta
          name="description"
          content="MIND Platform (Mixedreality Intelligent Neurocognitive Diagnosis) adalah penelitian di PPSLU yang memanfaatkan Virtual Reality, data recording, dan machine learning untuk mendukung diagnosis pintar serta meningkatkan kualitas hidup lansia."
        />
        <meta
          name="keywords"
          content="MIND Platform, Mixedreality, Neurocognitive Diagnosis, VR Health, Machine Learning, PPSLU, penelitian lansia, teknologi kesehatan"
        />
        {/* Structured Data untuk Google */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ResearchProject",
            "name": "MIND Platform (Mixedreality Intelligent Neurocognitive Diagnosis)",
            "description": "Penelitian di PPSLU yang memanfaatkan teknologi Virtual Reality, data recording, dan machine learning untuk mendukung diagnosis cerdas neurokognitif pada lansia.",
            "keywords": ["MIND Platform", "Mixedreality", "VR Therapy", "Neurocognitive Diagnosis", "Machine Learning", "PPSLU"],
            "author": {
              "@type": "Organization",
              "name": "Pusat Pelayanan Sosial Lanjut Usia (PPSLU)"
            },
            "areaServed": "Indonesia",
            "applicationCategory": "HealthApplication",
            "instrument": ["Virtual Reality", "Machine Learning", "Data Recording System"]
          }
        `}</script>
      </Helmet>

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
            alt="Penelitian MIND Platform menggunakan VR dan Machine Learning di PPSLU untuk diagnosis neurokognitif"
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
          <h1
            id="mind-platform-title"
            className="text-3xl md:text-4xl font-bold text-fuchsia-600"
          >
            MIND Platform (Mixedreality Intelligent Neurocognitive Diagnosis)
          </h1>
          <p className="text-gray-700 leading-relaxed">
            <strong>MIND Platform</strong> merupakan hasil penelitian di{" "}
            <strong>Pusat Pelayanan Sosial Lanjut Usia (PPSLU)</strong> yang
            menggabungkan <em>Virtual Reality</em>, rekaman data, serta{" "}
            <em>machine learning</em> untuk mendukung analisis neurokognitif dan
            diagnosis cerdas. Tujuannya adalah membantu deteksi dini,
            pemantauan, serta meningkatkan kualitas hidup lansia melalui
            teknologi kesehatan berbasis penelitian.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            Fitur Utama MIND Platform
          </h2>
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
