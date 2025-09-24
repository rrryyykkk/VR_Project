import { Route, Routes } from "react-router";
// public routes
import Home from "./page/landingPage/Home";
import About from "./page/landingPage/About";
import Contact from "./page/landingPage/Contact";
import VRViewParent from "./page/landingPage/VRViewParent";
import VRView from "./page/landingPage/VRView";
import Insight from "./page/landingPage/Insight";
// layout
import LandingPage from "./layout/LandingPageLayout";
import AdminLayout from "./layout/AdminLayout";
import UsersLayout from "./layout/userLayout";
// users
import ProfilePageUser from "./page/users/ProfilePageUser";
import HistoryPageUsers from "./page/users/HistoryPageUser";
// admin
import Dashboard from "./page/admin/Dashboard";
import UsersPage from "./page/admin/Users";
import AnalyticById from "./page/admin/AnalyticById";
import ProfilePage from "./page/admin/ProfileAdmin";
import Analytic from "./page/admin/Analytic";
import VRSessionAdmin from "./page/admin/VRSessionAdmin";
// aut
import LoginUsers from "./page/auth/LoginUsers";
import LoginAdmin from "./page/auth/LoginAdmin";
// middleware
import ProtectedRoute from "./middleware/ProtectedRoutes";
// hooks
import { useEffect } from "react";
import NotFound from "./page/NotFound";

const App = () => {
  useEffect(() => {
    const btn = document.getElementById("VRButton");
    if (btn) btn.remove(); // hapus tombol bawaan
  }, []);

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
        path="/insight"
        element={
          <LandingPage>
            <Insight />
          </LandingPage>
        }
      />
      <Route
        path="/vr"
        element={
          <LandingPage>
            <VRViewParent />
          </LandingPage>
        }
      />
      <Route path="/vr/:locationId" element={<VRView />} />
      {/* auth */}
      <Route path="/login" element={<LoginUsers />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      {/* admin */}
      <Route element={<ProtectedRoute role="admin" />}>
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
        <Route
          path="/admin/VrAdmin"
          element={
            <AdminLayout>
              <VRSessionAdmin />
            </AdminLayout>
          }
        />
      </Route>
      {/* users */}
      <Route element={<ProtectedRoute role="user" />}>
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
      </Route>
      {/* Not Found */}
      <Route
        path="*"
        element={
          <LandingPage>
            <NotFound />
          </LandingPage>
        }
      />
    </Routes>
  );
};

export default App;
