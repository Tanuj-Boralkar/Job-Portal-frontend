import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import MyApplications from "./pages/candidate/MyApplications";
import EditProfile from "./pages/candidate/EditProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import MyJobs from "./pages/recruiter/MyJobs";
import AddJob from "./pages/recruiter/AddJob";
import EditJob from "./pages/recruiter/EditJob";
import Applicants from "./pages/recruiter/Applicants";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageJobs from "./pages/admin/ManageJobs";
import ManageApplications from "./pages/admin/ManageApplications";

const App = () => (
  <div className="d-flex flex-column min-vh-100">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <NavigationBar />

    <main id="main-content" className="flex-grow-1">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Any signed-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Candidate */}
        <Route element={<RoleRoute allowed={["candidate"]} />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/applications" element={<MyApplications />} />
          <Route path="/candidate/profile" element={<EditProfile />} />
        </Route>

        {/* Recruiter */}
        <Route element={<RoleRoute allowed={["recruiter"]} />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/jobs" element={<MyJobs />} />
          <Route path="/recruiter/jobs/add" element={<AddJob />} />
          <Route path="/recruiter/jobs/edit/:id" element={<EditJob />} />
          <Route
            path="/recruiter/jobs/:id/applicants"
            element={<Applicants />}
          />
        </Route>

        {/* Admin */}
        <Route element={<RoleRoute allowed={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/jobs" element={<ManageJobs />} />
          <Route path="/admin/applications" element={<ManageApplications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>

    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      theme="colored"
    />
  </div>
);

export default App;
