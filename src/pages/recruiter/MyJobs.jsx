import { useEffect, useState } from "react";
import { Badge, Button, Card, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import recruiterLinks from "./recruiterLinks";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/recruiter/my-jobs");
      setJobs(data.data);
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

  const toggleStatus = async (job) => {
    const status = job.status === "active" ? "closed" : "active";
    try {
      await api.patch(`/jobs/${job._id}/status`, { status });
      setJobs((prev) =>
        prev.map((item) => (item._id === job._id ? { ...item, status } : item)),
      );
      toast.success(`Job marked as ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/jobs/${pendingDelete._id}`);
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
      title="My jobs"
      subtitle="Edit, close or remove the roles you have posted."
      sidebarTitle="Recruiter"
      links={recruiterLinks}
    >
      <Card className="soft-card">
        <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
          <h2 className="h6 mb-0">{jobs.length} jobs</h2>
          <Link to="/recruiter/jobs/add" className="btn btn-accent btn-sm">
            Post a job
          </Link>
        </Card.Header>
        <Card.Body className="pt-0">
          {loading && <Loader label="Loading your jobs" />}
          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="text-center py-5">
              <p className="fw-semibold mb-1">No jobs posted yet</p>
              <p className="text-secondary small mb-3">
                Publish a role and candidates can start applying today.
              </p>
              <Link to="/recruiter/jobs/add" className="btn btn-accent btn-sm">
                Post a job
              </Link>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Job</th>
                    <th>Type</th>
                    <th>Applicants</th>
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
                          {job.location}
                        </div>
                      </td>
                      <td className="small">
                        {job.jobType}
                        <div className="text-secondary">{job.workMode}</div>
                      </td>
                      <td>
                        <Link
                          to={`/recruiter/jobs/${job._id}/applicants`}
                          className="fw-semibold text-ink"
                        >
                          {job.applicationsCount}
                        </Link>
                      </td>
                      <td>
                        <Badge
                          bg={job.status === "active" ? "success" : "secondary"}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex flex-wrap gap-2 justify-content-end">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            as={Link}
                            to={`/recruiter/jobs/${job._id}/applicants`}
                          >
                            Applicants
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            as={Link}
                            to={`/recruiter/jobs/edit/${job._id}`}
                          >
                            Edit
                          </Button>
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
          application submitted for it. This cannot be undone.
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

export default MyJobs;
