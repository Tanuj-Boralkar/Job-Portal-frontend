import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";
const formatDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Recently posted";
  const days = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 86400000),
  );
  return days === 0
    ? "Posted today"
    : days === 1
      ? "Posted yesterday"
      : `Posted ${days} days ago`;
};
export default function JobCard({ job }) {
  return (
    <Card className="job-card h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center gap-3 mb-3">
          <span className="company-monogram" aria-hidden="true">
            {(job.company || "J")
              .split(/\s+/)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </span>
          <div className="company-line flex-grow-1">{job.company}</div>
          <Badge bg={job.status === "active" ? "success" : "secondary"}>
            {job.status === "active" ? "Hiring" : "Closed"}
          </Badge>
        </div>
        <Card.Title as="h3" className="mb-0">
          <Link to={`/jobs/${job._id}`} className="text-ink">
            {job.title}
          </Link>
        </Card.Title>
        <div className="job-meta">
          <span>
            <FiMapPin />
            {job.location}
          </span>
          <span>
            <FiBriefcase />
            {job.jobType}
          </span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <span className="skill-chip">{job.workMode}</span>
          <span className="skill-chip">{job.experienceLevel}</span>
          {job.skills?.slice(0, 2).map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
        <p className="posting-date">
          <FiClock className="me-1" /> {formatDate(job.createdAt)}
        </p>
        <div className="job-card-footer">
          <span className="salary-label">
            {job.salary || "Salary not disclosed"}
          </span>
          <Link to={`/jobs/${job._id}`}>
            View role <FiArrowUpRight />
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
