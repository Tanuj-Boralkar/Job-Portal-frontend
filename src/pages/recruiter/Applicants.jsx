import { assetUrl } from "../../services/api";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Form, Modal, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import recruiterLinks from "./recruiterLinks";
import { statusTone } from "../../utils/statusTone";

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const Applicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get(`/applications/job/${id}`)
      .then(({ data }) => {
        setJob(data.data.job);
        setApplications(data.data.applications);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (application, status) => {
    try {
      await api.patch(`/applications/${application._id}/status`, { status });
      setApplications((prev) =>
        prev.map((item) =>
          item._id === application._id ? { ...item, status } : item,
        ),
      );
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <DashboardLayout
      title={job ? `Applicants for ${job.title}` : "Applicants"}
      subtitle="Review each candidate, open their resume and move them through your pipeline."
      sidebarTitle="Recruiter"
      links={recruiterLinks}
    >
      {loading && <Loader label="Loading applicants" />}
      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <Card className="soft-card">
          <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
            <h2 className="h6 mb-0">{applications.length} applicants</h2>
            <Link to="/recruiter/jobs" className="small fw-semibold text-ink">
              Back to my jobs
            </Link>
          </Card.Header>
          <Card.Body className="pt-0">
            {applications.length === 0 ? (
              <div className="text-center py-5">
                <p className="fw-semibold mb-1">No applications yet</p>
                <p className="text-secondary small mb-0">
                  Share the job link to start receiving applications.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr className="text-secondary small">
                      <th>Candidate</th>
                      <th>Skills</th>
                      <th>Applied on</th>
                      <th>Resume</th>
                      <th>Status</th>
                      <th className="text-end">Profile</th>
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
                          {(application.candidate?.skills || [])
                            .slice(0, 3)
                            .join(", ") || "-"}
                        </td>
                        <td className="small">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {application.resume ? (
                            <a
                              href={assetUrl(application.resume)}
                              target="_blank"
                              rel="noreferrer"
                              className="fw-semibold text-ink"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-secondary small">None</span>
                          )}
                        </td>
                        <td style={{ minWidth: 170 }}>
                          <Form.Select
                            size="sm"
                            value={application.status}
                            onChange={(e) =>
                              changeStatus(application, e.target.value)
                            }
                            aria-label={`Status for ${application.candidate?.name}`}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Form.Select>
                          <Badge
                            bg={statusTone(application.status)}
                            className="mt-1"
                          >
                            {application.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => setSelected(application)}
                          >
                            View
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
      )}

      <Modal
        show={!!selected}
        onHide={() => setSelected(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">{selected?.candidate?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <dl className="row mb-3">
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{selected?.candidate?.email || "-"}</dd>
            <dt className="col-sm-3">Phone</dt>
            <dd className="col-sm-9">{selected?.candidate?.phone || "-"}</dd>
            <dt className="col-sm-3">Location</dt>
            <dd className="col-sm-9">{selected?.candidate?.location || "-"}</dd>
            <dt className="col-sm-3">Education</dt>
            <dd className="col-sm-9">
              {selected?.candidate?.education || "-"}
            </dd>
            <dt className="col-sm-3">Experience</dt>
            <dd className="col-sm-9">
              {selected?.candidate?.experience || "-"}
            </dd>
            <dt className="col-sm-3">Skills</dt>
            <dd className="col-sm-9">
              {(selected?.candidate?.skills || []).join(", ") || "-"}
            </dd>
          </dl>

          <h3 className="h6">Cover letter</h3>
          <p className="text-body-secondary" style={{ whiteSpace: "pre-line" }}>
            {selected?.coverLetter ||
              "The candidate did not include a cover letter."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {selected?.resume && (
            <a
              href={assetUrl(selected.resume)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary"
            >
              Open resume
            </a>
          )}
          <Button variant="outline-secondary" onClick={() => setSelected(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default Applicants;
