import { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiSend,
  FiUserCheck,
  FiXCircle,
} from "react-icons/fi";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import candidateLinks from "./candidateLinks";
import { useAuth } from "../../context/useAuth";

import { statusTone } from "../../utils/statusTone";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/applications/candidate/stats")
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
      subtitle="Track where each of your applications stands."
      sidebarTitle="Candidate"
      links={candidateLinks}
    >
      {loading && <Loader label="Loading your dashboard" />}
      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <Row className="g-3 mb-4">
            <Col sm={6} xl={3}>
              <StatCard
                label="Applications submitted"
                value={stats.submitted}
                icon={<FiSend />}
                tone="primary"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Under review"
                value={stats.underReview}
                icon={<FiClock />}
                tone="info"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Interviews"
                value={stats.interviews}
                icon={<FiUserCheck />}
                tone="warning"
              />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard
                label="Selected"
                value={stats.selected}
                icon={<FiCheckCircle />}
                tone="success"
              />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col sm={6} xl={3}>
              <StatCard
                label="Rejected"
                value={stats.rejected}
                icon={<FiXCircle />}
                tone="danger"
              />
            </Col>
          </Row>

          <Card className="soft-card">
            <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
              <h2 className="h6 mb-0">Recent applications</h2>
              <Link
                to="/candidate/applications"
                className="small fw-semibold text-ink"
              >
                See all
              </Link>
            </Card.Header>
            <Card.Body className="pt-0">
              {data.recentApplications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="fw-semibold mb-1">
                    You have not applied anywhere yet
                  </p>
                  <p className="text-secondary small mb-3">
                    Find a role that fits and send your first application.
                  </p>
                  <Link to="/jobs" className="btn btn-accent btn-sm">
                    Browse jobs
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Job</th>
                        <th>Company</th>
                        <th>Applied on</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentApplications.map((application) => (
                        <tr key={application._id}>
                          <td className="fw-semibold">
                            {application.job?.title || "Job removed"}
                          </td>
                          <td>{application.job?.company || "-"}</td>
                          <td>
                            {new Date(
                              application.createdAt,
                            ).toLocaleDateString()}
                          </td>
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
        </>
      )}
    </DashboardLayout>
  );
};

export default CandidateDashboard;
