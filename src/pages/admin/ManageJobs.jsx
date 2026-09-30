import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import adminLinks from "./adminLinks";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/jobs", {
        params: { status: status || undefined, keyword: keyword || undefined },
      });
      setJobs(data.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, keyword]);

  useEffect(() => {
    // Shared fetch resets loading on navigation and after user actions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const toggleStatus = async (job) => {
    const next = job.status === "active" ? "closed" : "active";
    try {
      await api.patch(`/admin/jobs/${job._id}/status`, { status: next });
      setJobs((prev) =>
        prev.map((item) =>
          item._id === job._id ? { ...item, status: next } : item,
        ),
      );
      toast.success(`Job marked as ${next}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/jobs/${pendingDelete._id}`);
      setJobs((prev) => prev.filter((item) => item._id !== pendingDelete._id));
      toast.success("Job deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Jobs"
      subtitle="Every listing on the platform, from every recruiter."
      sidebarTitle="Admin"
      links={adminLinks}
    >
      <Card className="soft-card">
        <Card.Header className="bg-white border-0 pt-3">
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <Form.Control
                placeholder="Search by title, company or location"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search jobs"
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Col>
            <Col md={4} className="text-md-end text-secondary small">
              {jobs.length} jobs
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="pt-3">
          {loading && <Loader label="Loading jobs" />}
          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <p className="text-secondary text-center py-4 mb-0">
              No jobs match this search.
            </p>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Job</th>
                    <th>Recruiter</th>
                    <th>Type</th>
                    <th>Posted</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="fw-semibold text-ink"
                        >
                          {job.title}
                        </Link>
                        <div className="text-secondary small">
                          {job.company} · {job.location}
                        </div>
                      </td>
                      <td className="small">{job.recruiter?.name || "-"}</td>
                      <td className="small">{job.jobType}</td>
                      <td className="small">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge
                          bg={job.status === "active" ? "success" : "secondary"}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => toggleStatus(job)}
                          >
                            {job.status === "active" ? "Close" : "Reopen"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => setPendingDelete(job)}
                          >
                            Delete
                          </Button>
                        </div>
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
        show={!!pendingDelete}
        onHide={() => setPendingDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Delete job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting <strong>{pendingDelete?.title}</strong> also removes every
          application for it.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setPendingDelete(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting" : "Delete job"}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageJobs;
