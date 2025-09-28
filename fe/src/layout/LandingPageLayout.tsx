// src/layout/LandingPageLayout.tsx
import { useInitializeAuthUser } from "../app/store/AuthStore";
import FooterLP from "../components/landingPage/FooterLP";
import NavbarLP from "../components/landingPage/NavbarLP";

interface LandingPageProps {
  children: React.ReactNode;
}
const LandingPageLayout = ({ children }: LandingPageProps) => {
  useInitializeAuthUser();
  return (
    <>
      <NavbarLP />
      {children}
      <FooterLP />
    </>
  );
};

export default LandingPageLayout;
