import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface BannerItem {
  id: number;
  name: string;
  image: string;
}

const banner: BannerItem[] = [
  {
    id: 1,
    name: "bg1",
    image: "/bg.jpg",
  },
  {
    id: 2,
    name: "bg2",
    image: "/bg2.jpg",
  },
];

const Banner = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {banner.map((item) => (
          <SwiperSlide key={item.id}>
            <BannerSlide item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const BannerSlide = ({ item }: { item: BannerItem }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${item.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="relative text-center text-white px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow mb-4"
        >
          Selamat Datang di Situs Kami
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-lg mx-auto text-lg md:text-xl drop-shadow"
        >
          Temukan fitur terbaru dan berbagai layanan terbaik untuk membantu Anda
          hari ini.
        </motion.p>

        <motion.a
          href="#"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-block mt-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
        >
          Mulai Sekarang
        </motion.a>
      </motion.div>
    </div>
  );
};

export default Banner;
