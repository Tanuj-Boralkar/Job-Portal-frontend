import { FiBriefcase, FiGrid, FiPlusCircle, FiUser } from "react-icons/fi";

const recruiterLinks = [
  {
    to: "/recruiter/dashboard",
    label: "Overview",
    icon: <FiGrid aria-hidden="true" />,
    end: true,
  },
  {
    to: "/recruiter/jobs",
    label: "My jobs",
    icon: <FiBriefcase aria-hidden="true" />,
    end: true,
  },
  {
    to: "/recruiter/jobs/add",
    label: "Post a job",
    icon: <FiPlusCircle aria-hidden="true" />,
  },
  {
    to: "/profile",
    label: "Company profile",
    icon: <FiUser aria-hidden="true" />,
  },
];

export default recruiterLinks;
