// src/pages/Insight.tsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const insights = [
  {
    title: "MIND Platform: Mixedreality untuk Diagnosis Neurokognitif",
    date: "Agustus 2025",
    excerpt:
      "MIND Platform adalah penelitian inovatif yang menggabungkan Virtual Reality (VR) dan Machine Learning untuk mendukung diagnosis neurokognitif. Studi kasus dilakukan di PPSLU sebagai langkah awal penerapan teknologi ini.",
  },
  {
    title: "VR sebagai Media Rekam Data Kognitif",
    date: "Agustus 2025",
    excerpt:
      "Dengan memanfaatkan lingkungan simulasi interaktif berbasis VR, peneliti dapat merekam respons, gerakan, dan perilaku lansia. Data ini menjadi dasar analisis pola neurokognitif yang lebih komprehensif.",
  },
  {
    title: "Pemanfaatan Machine Learning",
    date: "Agustus 2025",
    excerpt:
      "Algoritma Machine Learning digunakan untuk menganalisis data yang diperoleh dari VR. Hasilnya, sistem dapat mengidentifikasi indikasi dini gangguan kognitif dan memberikan insight berharga untuk intervensi.",
  },
];

const Insight = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="py-20 px-4 max-w-6xl mx-auto relative overflow-hidden text-fuchsia-700"
    >
      {/* Haikei Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute top-0 w-full h-48 text-pink-100 rotate-180"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,106.7C672,117,768,139,864,144C960,149,1056,139,1152,138.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L0,0Z"
          ></path>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-fuchsia-50 to-pink-100"></div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Insight MIND Platform
        </h1>
        <p className="max-w-2xl mx-auto text-gray-700">
          Insight seputar penelitian{" "}
          <strong>
            MIND (Mixedreality Intelligent Neurocognitive Diagnosis) Platform
          </strong>
          , yang menggunakan <strong>Virtual Reality</strong> untuk rekam data,
          diproses dengan <strong>Machine Learning</strong>, dan diterapkan di{" "}
          <strong>PPSLU</strong> sebagai studi kasus.
        </p>
      </motion.div>

      {/* Insight Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-md p-6 hover:shadow-xl transition"
          >
            <h2 className="text-lg font-semibold mb-2 text-fuchsia-700">
              {insight.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{insight.date}</p>
            <p className="text-gray-600">{insight.excerpt}</p>
          </motion.div>
        ))}
      </div>

      {/* Haikei Bottom */}
      <svg
        className="absolute bottom-0 w-full h-48 text-pink-100"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,165.3C672,171,768,149,864,133.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};

export default Insight;
