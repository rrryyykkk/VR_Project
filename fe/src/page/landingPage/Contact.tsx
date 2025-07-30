import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="relative overflow-hidden text-pink-200">
      {/* Haikei wave top */}
      <svg
        className="absolute top-0 w-full h-48 text-pink-100 rotate-180"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,149.3C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      {/* Gradient Layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 via-fuchsia-50 to-pink-100"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-16 px-4 sm:px-8 md:px-16 lg:px-24">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-fuchsia-700 mb-4 text-center"
        >
          Yuk, Sapa Kami!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-xl mx-auto text-gray-700 mb-10"
        >
          Kami di sini untuk mendengar setiap cerita dan kebutuhanmu. Jangan
          ragu untuk menghubungi kami, karena setiap pesanmu adalah langkah
          kebaikan untuk lansia yang berbahagia.
        </motion.p>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <FaPhoneAlt className="text-fuchsia-600 text-3xl mb-2" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Telepon
            </h3>
            <p className="text-gray-600">(021) 123-4567</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <FaEnvelope className="text-fuchsia-600 text-3xl mb-2" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
            <p className="text-gray-600">info@pantiharapan.id</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <FaWhatsapp className="text-fuchsia-600 text-3xl mb-2" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              WhatsApp
            </h3>
            <p className="text-gray-600">+62 812-3456-7890</p>
          </div>
        </motion.div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="rounded-2xl overflow-hidden shadow-xl mb-12"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.952640325421!2d106.82715331612276!3d-6.175394462122012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e3d63c807f%3A0x2d38b18bffbffa54!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1615555555555!5m2!1sid!2sid"
            width="100%"
            height="400"
            loading="lazy"
            className="w-full h-80 md:h-96 border-0"
          ></iframe>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <a
            href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20mengetahui%20lebih%20lanjut"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:scale-105 hover:shadow-lg transition"
          >
            Kirim Pesan Sekarang 💌
          </a>
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

export default Contact;
