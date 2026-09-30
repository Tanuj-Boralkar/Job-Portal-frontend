import { useEffect, useState } from "react";
import { Badge, Button, Card, Form, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import candidateLinks from "./candidateLinks";
import { statusTone } from "../../utils/statusTone";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingWithdraw, setPendingWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/my-applications");
      setApplications(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Shared fetch resets loading on navigation and after user actions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      await api.delete(`/applications/${pendingWithdraw._id}`);
      setApplications((prev) =>
        prev.filter((item) => item._id !== pendingWithdraw._id),
      );
      toast.success("Application withdrawn");
      setPendingWithdraw(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWithdrawing(false);
    }
  };

  const visible = statusFilter
    ? applications.filter((item) => item.status === statusFilter)
    : applications;

  return (
    <DashboardLayout
      title="My applications"
      subtitle="Every role you have applied to, with its current status."
      sidebarTitle="Candidate"
      links={candidateLinks}
    >
      <Card className="soft-card">
        <Card.Header className="bg-white border-0 pt-3 d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <h2 className="h6 mb-0">{visible.length} applications</h2>
          <Form.Select
            size="sm"
            style={{ maxWidth: 220 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {[
              "Applied",
              "Under Review",
              "Shortlisted",
              "Interview",
              "Selected",
              "Rejected",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Form.Select>
        </Card.Header>
        <Card.Body className="pt-0">
          {loading && <Loader label="Loading applications" />}
          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="text-center py-5">
              <p className="fw-semibold mb-1">Nothing here yet</p>
              <p className="text-secondary small mb-3">
                Applications you send will appear in this table.
              </p>
              <Link to="/jobs" className="btn btn-accent btn-sm">
                Browse jobs
              </Link>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Job</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Applied on</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((application) => (
                    <tr key={application._id}>
                      <td className="fw-semibold">
                        {application.job ? (
                          <Link
                            to={`/jobs/${application.job._id}`}
                            className="text-ink"
                          >
                            {application.job.title}
                          </Link>
                        ) : (
                          "Job removed"
                        )}
                      </td>
                      <td>{application.job?.company || "-"}</td>
                      <td>{application.job?.location || "-"}</td>
                      <td>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={statusTone(application.status)}>
                          {application.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => setPendingWithdraw(application)}
                          disabled={application.status === "Selected"}
                        >
                          Withdraw
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={!!pendingWithdraw}
        onHide={() => setPendingWithdraw(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Withdraw application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This removes your application for{" "}
          <strong>{pendingWithdraw?.job?.title || "this job"}</strong>. You can
          apply again later while the job is open.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setPendingWithdraw(null)}
          >
            Keep it
          </Button>
          <Button
            variant="danger"
            onClick={handleWithdraw}
            disabled={withdrawing}
          >
            {withdrawing ? "Withdrawing" : "Withdraw"}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default MyApplications;
