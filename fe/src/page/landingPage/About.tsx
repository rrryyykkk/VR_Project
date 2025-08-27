import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const About = () => {
  const visiMisi = {
    visi: "Mengembangkan MIND (Mixedreality Intelligent Neurocognitive Diagnosis) sebagai platform berbasis penelitian untuk mendukung deteksi dini, monitoring, dan intervensi neurokognitif pada lansia.",
    misi: [
      "Menerapkan teknologi Virtual Reality (VR) dalam stimulasi kognitif lansia.",
      "Merekam dan menganalisis data respon pasien secara real-time.",
      "Mengintegrasikan machine learning untuk diagnosis neurokognitif yang adaptif.",
      "Melakukan penelitian berbasis studi kasus di PPSLU untuk meningkatkan kualitas hidup lansia.",
    ],
  };

  const strukturOrganisasi = {
    kepala: { role: "Kepala Peneliti", name: "Dr. Siti Rahma" },
    wakil: { role: "Wakil Peneliti", name: "Ahmad Fauzi, M.Sc" },
    tim: [
      { role: "Ahli Neurokognitif", name: "dr. Indah Lestari" },
      { role: "Engineer VR", name: "Maya Sari" },
      { role: "Data Scientist", name: "Dian Kusuma" },
      { role: "Administrasi Penelitian", name: "Rahmat Hidayat" },
    ],
  };

  return (
    <div className="relative overflow-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          MIND Platform - Penelitian Mixedreality Neurocognitive Diagnosis di
          PPSLU
        </title>
        <meta
          name="description"
          content="MIND (Mixedreality Intelligent Neurocognitive Diagnosis) adalah platform penelitian di PPSLU yang memanfaatkan Virtual Reality, data recording, dan machine learning untuk mendukung diagnosis neurokognitif lansia."
        />
        <meta
          name="keywords"
          content="MIND Platform, Mixedreality, Neurocognitive Diagnosis, VR Health, Machine Learning, PPSLU, penelitian lansia, teknologi kesehatan"
        />
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ResearchProject",
            "name": "MIND Platform (Mixedreality Intelligent Neurocognitive Diagnosis)",
            "description": "Penelitian berbasis studi kasus di PPSLU menggunakan VR, data recording, dan machine learning untuk diagnosis neurokognitif lansia.",
            "author": {
              "@type": "Organization",
              "name": "Pusat Pelayanan Sosial Lanjut Usia (PPSLU)"
            },
            "keywords": ["MIND Platform", "Mixedreality", "VR Therapy", "Machine Learning", "Neurocognitive Diagnosis", "PPSLU"],
            "applicationCategory": "HealthApplication",
            "instrument": ["Virtual Reality", "Machine Learning", "Data Recording System"],
            "areaServed": "Indonesia"
          }
        `}</script>
      </Helmet>

      {/* Haikei wave top */}
      <svg
        className="absolute top-0 w-full h-48 text-pink-100 rotate-180"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,106.7C672,117,768,139,864,144C960,149,1056,139,1152,138.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      {/* Gradient Layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 via-fuchsia-50 to-pink-100"></div>

      <div className="relative z-10 min-h-screen py-16 px-4 sm:px-8 md:px-16 lg:px-32">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-fuchsia-700 mb-8 text-center"
        >
          Tentang MIND Platform (Mixedreality Intelligent Neurocognitive
          Diagnosis)
        </motion.h1>

        {/* Visi Misi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-10 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-fuchsia-600 mb-4">Visi</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{visiMisi.visi}</p>

          <h2 className="text-2xl font-bold text-fuchsia-600 mb-4">Misi</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {visiMisi.misi.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Struktur Organisasi Tree */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-fuchsia-700 mb-8 text-center">
            Tim Penelitian MIND Platform
          </h2>

          <div className="flex flex-col items-center space-y-6">
            {/* Kepala */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg px-6 py-4 text-center border border-fuchsia-100 hover:border-fuchsia-300 transition w-64"
            >
              <p className="text-fuchsia-600 font-semibold">
                {strukturOrganisasi.kepala.role}
              </p>
              <p className="text-gray-800 text-lg font-bold">
                {strukturOrganisasi.kepala.name}
              </p>
            </motion.div>

            {/* Arrow */}
            <div className="text-fuchsia-400 text-3xl animate-bounce">↓</div>

            {/* Wakil */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg px-6 py-4 text-center border border-fuchsia-100 hover:border-fuchsia-300 transition w-64"
            >
              <p className="text-fuchsia-600 font-semibold">
                {strukturOrganisasi.wakil.role}
              </p>
              <p className="text-gray-800 text-lg font-bold">
                {strukturOrganisasi.wakil.name}
              </p>
            </motion.div>

            {/* Arrow */}
            <div className="text-fuchsia-400 text-3xl animate-bounce">↓</div>

            {/* Tim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strukturOrganisasi.tim.map((person, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-md px-4 py-4 text-center border border-fuchsia-100 hover:border-fuchsia-300 transition"
                >
                  <p className="text-fuchsia-600 font-semibold">
                    {person.role}
                  </p>
                  <p className="text-gray-800 font-medium mt-1">
                    {person.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Haikei wave bottom */}
      <svg
        className="absolute bottom-0 w-full h-48 text-pink-100"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,165.3C672,171,768,149,864,133.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default About;
