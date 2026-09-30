import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/useAuth";

const homeFor = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "recruiter") return "/recruiter/dashboard";
  return "/candidate/dashboard";
};

// Sends a signed-in user back to their own dashboard if the role does not match
const RoleRoute = ({ allowed = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking your access" fullPage />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowed.includes(user.role))
    return <Navigate to={homeFor(user.role)} replace />;

  return <Outlet />;
};

export default RoleRoute;
