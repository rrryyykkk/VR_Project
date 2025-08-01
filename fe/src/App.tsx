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
import Analytic from "./page/admin/Analytic";
import AnalyticById from "./page/admin/AnalyticById";
import ProfilePage from "./page/admin/ProfileAdmin";

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
      <Route
        path="/admin/analytics"
        element={
          <AdminLayout>
            <Analytic />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/analytics/:id"
        element={
          <AdminLayout>
            <AnalyticById />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <AdminLayout>
            <ProfilePage />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default App;
