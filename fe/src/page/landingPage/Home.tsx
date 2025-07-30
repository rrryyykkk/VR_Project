import Banner from "./home/Banner";
import Profile from "./home/Profile";
import Service from "./home/Service";
import Testimoni from "./home/Testimoni";

const Home = () => {
  return (
    <>
      {/* Banner */}
      <section className="bg-white">
        <Banner />
      </section>

      {/* Divider */}
      <svg
        className="w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FFF1F2" // pink-50
          d="M0,64L48,96C96,128,192,192,288,197.3C384,203,480,149,576,138.7C672,128,768,160,864,154.7C960,149,1056,107,1152,117.3C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Profile */}
      <section className="bg-pink-50">
        <Profile />
      </section>

      {/* Divider */}
      <svg
        className="w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FFF1F2" // pink-50
          d="M0,64L48,101.3C96,139,192,213,288,213.3C384,213,480,139,576,122.7C672,107,768,149,864,170.7C960,192,1056,192,1152,197.3C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>

      {/* Service */}
      <section className="bg-pink-50">
        <Service />
      </section>

      {/* Divider */}
      <svg
        className="w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FFF1F2" // pink-50
          d="M0,128L48,122.7C96,117,192,107,288,122.7C384,139,480,181,576,197.3C672,213,768,203,864,197.3C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Testimoni */}
      <section className="bg-pink-50">
        <Testimoni />
      </section>
    </>
  );
};

export default Home;
