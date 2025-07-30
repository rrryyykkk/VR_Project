import FooterLP from "../components/landingPage/FooterLP";
import NavbarLP from "../components/landingPage/NavbarLP";

interface LandingPageProps {
  children: React.ReactNode;
}

const LandingPage = ({ children }: LandingPageProps) => {
  return (
    <div className="min-h-screen">
      <NavbarLP />
      {children}
      <FooterLP />
    </div>
  );
};

export default LandingPage;
