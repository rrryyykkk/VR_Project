import { location as locationsData } from "../../data/360data";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const VRLocationsParent = () => {
  const navigate = useNavigate();
  console.log(locationsData);

  const handleGoVR = (locId: string) => {
    const foundLocation = locationsData.find((loc) => loc.id === locId);
    const views = foundLocation?.view || [];
    navigate(`/vr/${locId}`, { state: { views } });
  };

  return (
    <div className="relative overflow-hidden">
      {/* header */}
      <div className="relative z-10 py-16 px-4 sm:px-8 md:px-16">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-fuchsia-700 mb-12 text-center"
        >
          Pilih Lokasi VR360
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {locationsData.map((loc, index) => (
            <motion.div
              key={loc.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg cursor-pointer border border-pink-100 hover:border-pink-300 transition"
              onClick={() => handleGoVR(loc.id)}
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-fuchsia-700">
                  {loc.name}
                </h2>
                <p className="text-gray-600 mt-2">{loc.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default VRLocationsParent;
