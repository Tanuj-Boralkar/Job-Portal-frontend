import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/useAuth";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "Not specified";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Tell a returning candidate they have already applied
  useEffect(() => {
    if (user?.role !== "candidate") return;
    api
      .get("/applications/my-applications")
      .then(({ data }) =>
        setApplied(
          data.data.some((application) => application.job?._id === id),
        ),
      )
      .catch(() => setApplied(false));
  }, [user, id]);

  const openApply = () => {
    if (!user) {
      toast.info("Sign in as a candidate to apply");
      navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setShowApply(true);
  };

  const handleApply = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!resumeFile && !user.resume) {
      setFormError("Attach a resume, or upload one to your profile first.");
      return;
    }

    const payload = new FormData();
    payload.append("coverLetter", coverLetter);
    if (resumeFile) payload.append("resume", resumeFile);

    setSubmitting(true);
    try {
      await api.post(`/applications/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted");
      setShowApply(false);
      setApplied(true);
      navigate("/candidate/applications");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading job" fullPage />;
  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
        <Button as={Link} to="/jobs" variant="outline-primary">
          Back to jobs
        </Button>
      </Container>
    );
  }
  if (!job) return null;

  const isCandidate = user?.role === "candidate";
  const canApply = !user || isCandidate;
  const expired = Boolean(job.deadline && new Date(job.deadline) < new Date());

  return (
    <Container className="py-4 py-lg-5">
      <Row className="g-4">
        <Col lg={8}>
          <Card className="soft-card">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <h1 className="h3 section-heading mb-1">{job.title}</h1>
                  <p className="text-secondary mb-0">{job.company}</p>
                </div>
                <Badge
                  bg={job.status === "active" ? "success" : "secondary"}
                  className="text-uppercase"
                >
                  {job.status}
                </Badge>
              </div>

              <div className="d-flex flex-wrap gap-3 text-secondary small mt-3">
                <span className="d-inline-flex align-items-center gap-1">
                  <FiMapPin aria-hidden="true" /> {job.location}
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiBriefcase aria-hidden="true" /> {job.jobType} ·{" "}
                  {job.workMode}
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiTrendingUp aria-hidden="true" /> {job.experienceLevel}
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiUsers aria-hidden="true" /> {job.vacancies} vacancies
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiCalendar aria-hidden="true" /> Apply by{" "}
                  {formatDate(job.deadline)}
                </span>
              </div>

              <hr />

              <h2 className="h5 section-heading">Job description</h2>
              <p
                style={{ whiteSpace: "pre-line" }}
                className="text-body-secondary"
              >
                {job.description}
              </p>

              {job.skills?.length > 0 && (
                <>
                  <h2 className="h5 section-heading mt-4">Skills</h2>
                  <div className="d-flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {job.recruiter?.companyDescription && (
                <>
                  <h2 className="h5 section-heading mt-4">
                    About {job.company}
                  </h2>
                  <p className="text-body-secondary mb-0">
                    {job.recruiter.companyDescription}
                  </p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="soft-card sticky-lg-top" style={{ top: "88px" }}>
            <Card.Body>
              <div className="mb-3">
                <div className="text-secondary small">Salary</div>
                <div className="fs-5 fw-bold">
                  {job.salary || "Not disclosed"}
                </div>
              </div>
              <ul className="list-unstyled small text-secondary mb-4">
                <li className="d-flex justify-content-between py-1">
                  <span>Category</span>{" "}
                  <span className="text-ink fw-semibold">{job.category}</span>
                </li>
                <li className="d-flex justify-content-between py-1">
                  <span>Posted</span>{" "}
                  <span className="text-ink fw-semibold">
                    {formatDate(job.createdAt)}
                  </span>
                </li>
                <li className="d-flex justify-content-between py-1">
                  <span>Deadline</span>{" "}
                  <span className="text-ink fw-semibold">
                    {formatDate(job.deadline)}
                  </span>
                </li>
              </ul>

              {canApply ? (
                <div className="d-grid">
                  <Button
                    className="btn-accent"
                    onClick={openApply}
                    disabled={applied || expired || job.status === "closed"}
                  >
                    {job.status === "closed" || expired
                      ? "Applications closed"
                      : applied
                        ? "Already applied"
                        : "Apply Now"}
                  </Button>
                </div>
              ) : (
                <p className="small text-secondary mb-0">
                  You are signed in as a {user.role}, so applying is not
                  available on this account.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showApply} onHide={() => setShowApply(false)} centered>
        <Form onSubmit={handleApply}>
          <Modal.Header closeButton>
            <Modal.Title className="h5">Apply for {job.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && (
              <div className="alert alert-danger py-2">{formError}</div>
            )}

            <Form.Group className="mb-3" controlId="apply-resume">
              <Form.Label>Resume (PDF, DOC or DOCX)</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0] || null)}
              />
              <Form.Text className="text-secondary">
                {user?.resume
                  ? "Leave empty to use the resume saved on your profile."
                  : "You have no saved resume, so attach one here."}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="apply-cover">
              <Form.Label>Cover letter (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                maxLength={3000}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Why are you a good fit for this role?"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowApply(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-accent" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />{" "}
                  Submitting
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default JobDetails;
