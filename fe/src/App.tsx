import { Route, Routes } from "react-router";
import Home from "./page/landingPage/Home";
import About from "./page/landingPage/About";
import Contact from "./page/landingPage/Contact";
import LandingPage from "./layout/LandingPageLayout";
import Donation from "./page/landingPage/Donation";
import Login from "./page/auth/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import UsersPage from "./page/admin/Users";

const App = () => {
  return (
    <Routes>
      {/* landing page */}
      <Route
        path="/"
        element={
          <LandingPage>
            <Home />
          </LandingPage>
        }
      />
      <Route
        path="/about"
        element={
          <LandingPage>
            <About />
          </LandingPage>
        }
      />
      <Route
        path="/contact"
        element={
          <LandingPage>
            <Contact />
          </LandingPage>
        }
      />
      <Route
        path="/donation"
        element={
          <LandingPage>
            <Donation />
          </LandingPage>
        }
      />
      {/* auth */}
      <Route path="/login" element={<Login />} />
      {/* admin */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <UsersPage />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default App;
