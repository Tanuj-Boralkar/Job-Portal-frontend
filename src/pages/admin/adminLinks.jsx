import { FiBriefcase, FiFileText, FiGrid, FiUsers } from "react-icons/fi";

const adminLinks = [
  {
    to: "/admin/dashboard",
    label: "Overview",
    icon: <FiGrid aria-hidden="true" />,
    end: true,
  },
  { to: "/admin/users", label: "Users", icon: <FiUsers aria-hidden="true" /> },
  {
    to: "/admin/jobs",
    label: "Jobs",
    icon: <FiBriefcase aria-hidden="true" />,
  },
  {
    to: "/admin/applications",
    label: "Applications",
    icon: <FiFileText aria-hidden="true" />,
  },
];

export default adminLinks;
