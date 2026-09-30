import { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiCheckCircle,
  FiStar,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import recruiterLinks from "./recruiterLinks";
import { statusTone } from "../../utils/statusTone";
import { useAuth } from "../../context/useAuth";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/jobs/recruiter/stats")
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      title={`Hiring overview, ${user?.name?.split(" ")[0] || ""}`}
      subtitle="Your open roles and the candidates moving through them."
      sidebarTitle="Recruiter"
      links={recruiterLinks}
    >
      {loading && <Loader label="Loading your dashboard" />}
      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <Row className="g-3 mb-4">
            <Col sm={6} xl={3}>
              <StatCard
                label="Total jobs"
                value={data.stats.totalJobs}
                icon={<FiBriefcase />}
                tone="primary"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Active jobs"
                value={data.stats.activeJobs}
                icon={<FiZap />}
                tone="info"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Total applicants"
                value={data.stats.totalApplicants}
                icon={<FiUsers />}
                tone="warning"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Shortlisted"
                value={data.stats.shortlisted}
                icon={<FiStar />}
                tone="secondary"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Selected"
                value={data.stats.selected}
                icon={<FiCheckCircle />}
                tone="success"
              />
            </Col>
          </Row>

          <Row className="g-3">
            <Col xl={7}>
              <Card className="soft-card h-100">
                <Card.Header className="bg-white border-0 pt-3">
                  <h2 className="h6 mb-0">Recent applications</h2>
                </Card.Header>
                <Card.Body className="pt-0">
                  {data.recentApplications.length === 0 ? (
                    <p className="text-secondary small mb-0 py-3">
                      No applications yet. They will show up here as candidates
                      apply.
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0">
                        <thead>
                          <tr className="text-secondary small">
                            <th>Candidate</th>
                            <th>Job</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentApplications.map((application) => (
                            <tr key={application._id}>
                              <td className="fw-semibold">
                                {application.candidate?.name || "Deleted user"}
                              </td>
                              <td>{application.job?.title || "Job removed"}</td>
                              <td>
                                <Badge bg={statusTone(application.status)}>
                                  {application.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col xl={5}>
              <Card className="soft-card h-100">
                <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
                  <h2 className="h6 mb-0">Recently posted</h2>
                  <Link
                    to="/recruiter/jobs"
                    className="small fw-semibold text-ink"
                  >
                    Manage jobs
                  </Link>
                </Card.Header>
                <Card.Body className="pt-0">
                  {data.recentJobs.length === 0 ? (
                    <div className="py-3">
                      <p className="text-secondary small mb-3">
                        You have not posted a job yet.
                      </p>
                      <Link
                        to="/recruiter/jobs/add"
                        className="btn btn-accent btn-sm"
                      >
                        Post your first job
                      </Link>
                    </div>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {data.recentJobs.map((job) => (
                        <li key={job._id} className="py-2 border-bottom">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="fw-semibold text-ink"
                          >
                            {job.title}
                          </Link>
                          <div className="text-secondary small">
                            {job.location} · {job.jobType}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
