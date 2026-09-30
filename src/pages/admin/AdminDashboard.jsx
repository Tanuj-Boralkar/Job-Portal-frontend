import { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiBriefcase,
  FiFileText,
  FiUserCheck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import adminLinks from "./adminLinks";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      title="Platform overview"
      subtitle="Everything happening across candidates, recruiters and jobs."
      sidebarTitle="Admin"
      links={adminLinks}
    >
      {loading && <Loader label="Loading statistics" />}
      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <Row className="g-3 mb-4">
            <Col sm={6} xl={4}>
              <StatCard
                label="Users"
                value={data.stats.totalUsers}
                icon={<FiUsers />}
                tone="primary"
              />
            </Col>
            <Col sm={6} xl={4}>
              <StatCard
                label="Candidates"
                value={data.stats.totalCandidates}
                icon={<FiUserCheck />}
                tone="info"
              />
            </Col>
            <Col sm={6} xl={4}>
              <StatCard
                label="Recruiters"
                value={data.stats.totalRecruiters}
                icon={<FiAward />}
                tone="warning"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Jobs"
                value={data.stats.totalJobs}
                icon={<FiBriefcase />}
                tone="secondary"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Active jobs"
                value={data.stats.activeJobs}
                icon={<FiZap />}
                tone="success"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Applications"
                value={data.stats.totalApplications}
                icon={<FiFileText />}
                tone="primary"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Selected candidates"
                value={data.stats.selectedCandidates}
                icon={<FiUserCheck />}
                tone="success"
              />
            </Col>
          </Row>

          <Row className="g-3">
            <Col xl={6}>
              <Card className="soft-card h-100">
                <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
                  <h2 className="h6 mb-0">Newest users</h2>
                  <Link
                    to="/admin/users"
                    className="small fw-semibold text-ink"
                  >
                    Manage users
                  </Link>
                </Card.Header>
                <Card.Body className="pt-0">
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr className="text-secondary small">
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentUsers.map((user) => (
                          <tr key={user._id}>
                            <td className="fw-semibold">{user.name}</td>
                            <td className="small">{user.email}</td>
                            <td>
                              <Badge
                                bg="light"
                                text="dark"
                                className="border text-capitalize"
                              >
                                {user.role}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={6}>
              <Card className="soft-card h-100">
                <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
                  <h2 className="h6 mb-0">Newest jobs</h2>
                  <Link to="/admin/jobs" className="small fw-semibold text-ink">
                    Manage jobs
                  </Link>
                </Card.Header>
                <Card.Body className="pt-0">
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead>
                        <tr className="text-secondary small">
                          <th>Job</th>
                          <th>Recruiter</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentJobs.map((job) => (
                          <tr key={job._id}>
                            <td className="fw-semibold">
                              <Link
                                to={`/jobs/${job._id}`}
                                className="text-ink"
                              >
                                {job.title}
                              </Link>
                            </td>
                            <td className="small">
                              {job.recruiter?.name || "-"}
                            </td>
                            <td>
                              <Badge
                                bg={
                                  job.status === "active"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {job.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
