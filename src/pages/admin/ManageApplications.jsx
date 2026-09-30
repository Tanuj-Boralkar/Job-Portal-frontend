import { assetUrl } from "../../services/api";
import { useCallback, useEffect, useState } from "react";
import { Badge, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import adminLinks from "./adminLinks";
import { statusTone } from "../../utils/statusTone";

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/applications", {
        params: { status: status || undefined },
      });
      setApplications(data.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    // Shared fetch resets loading on navigation and after user actions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <DashboardLayout
      title="Applications"
      subtitle="Every application submitted across the platform."
      sidebarTitle="Admin"
      links={adminLinks}
    >
      <Card className="soft-card">
        <Card.Header className="bg-white border-0 pt-3">
          <Row className="g-2 align-items-center">
            <Col md={4}>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={8} className="text-md-end text-secondary small">
              {applications.length} applications
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="pt-3">
          {loading && <Loader label="Loading applications" />}
          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && applications.length === 0 && (
            <p className="text-secondary text-center py-4 mb-0">
              No applications to show.
            </p>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Recruiter</th>
                    <th>Applied on</th>
                    <th>Status</th>
                    <th className="text-end">Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <div className="fw-semibold">
                          {application.candidate?.name || "Deleted user"}
                        </div>
                        <div className="text-secondary small">
                          {application.candidate?.email}
                        </div>
                      </td>
                      <td className="small">
                        {application.job ? (
                          <Link
                            to={`/jobs/${application.job._id}`}
                            className="text-ink fw-semibold"
                          >
                            {application.job.title}
                          </Link>
                        ) : (
                          "Job removed"
                        )}
                      </td>
                      <td className="small">
                        {application.recruiter?.name || "-"}
                      </td>
                      <td className="small">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={statusTone(application.status)}>
                          {application.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {application.resume ? (
                          <a
                            href={assetUrl(application.resume)}
                            target="_blank"
                            rel="noreferrer"
                            className="fw-semibold text-ink"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-secondary small">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
};

export default ManageApplications;
