import { FiFileText, FiGrid, FiSearch, FiUser } from "react-icons/fi";

const candidateLinks = [
  {
    to: "/candidate/dashboard",
    label: "Overview",
    icon: <FiGrid aria-hidden="true" />,
    end: true,
  },
  {
    to: "/candidate/applications",
    label: "My applications",
    icon: <FiFileText aria-hidden="true" />,
  },
  {
    to: "/candidate/profile",
    label: "Edit profile",
    icon: <FiUser aria-hidden="true" />,
  },
  { to: "/jobs", label: "Browse jobs", icon: <FiSearch aria-hidden="true" /> },
];

export default candidateLinks;
