import { Route, Routes } from "react-router";
import Home from "./page/landingPage/Home";
import About from "./page/landingPage/About";
import Contact from "./page/landingPage/Contact";
import LandingPage from "./layout/LandingPageLayout";
import Donation from "./page/landingPage/Donation";
import ProfilePageUser from "./page/users/ProfilePageUser";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import UsersPage from "./page/admin/Users";
import AnalyticById from "./page/admin/AnalyticById";
import ProfilePage from "./page/admin/ProfileAdmin";
import LoginUsers from "./page/auth/LoginUsers";
import LoginAdmin from "./page/auth/LoginAdmin";
import UsersLayout from "./layout/userLayout";
import HistoryPageUsers from "./page/users/HistoryPageUser";
import Analytic from "./page/admin/Analytic";
import { adminSessions } from "./data/VRsession";
import VRSessionAdmin from "./page/admin/VRSessionAdmin";

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
      <Route path="/login" element={<LoginUsers />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
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
            <Analytic sessions={adminSessions} />
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
      <Route
        path="/admin/VrAdmin"
        element={
          <AdminLayout>
            <VRSessionAdmin />
          </AdminLayout>
        }
      />
      {/* users */}
      <Route
        path="/profile"
        element={
          <UsersLayout>
            <ProfilePageUser />
          </UsersLayout>
        }
      />
      <Route
        path="/users/history"
        element={
          <UsersLayout>
            <HistoryPageUsers />
          </UsersLayout>
        }
      />
    </Routes>
  );
};

export default App;
