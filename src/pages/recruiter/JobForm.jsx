import { useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";

const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
];
const WORK_MODES = ["On-site", "Remote", "Hybrid"];
const EXPERIENCE = [
  "Fresher",
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
];
const CATEGORIES = [
  "Software Development",
  "Data Science",
  "Design",
  "Marketing",
  "Mobile Development",
  "Cloud & DevOps",
  "Human Resources",
  "Quality Assurance",
  "Content",
  "Other",
];


// Used by both AddJob and EditJob so the fields never drift apart
const JobForm = ({ initialValues, onSubmit, submitting, submitLabel }) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.title.trim().length < 3) next.title = "Enter a job title";
    if (!form.company.trim()) next.company = "Enter the company name";
    if (!form.location.trim())
      next.location = "Enter a location, or type Remote";
    if (form.description.trim().length < 30)
      next.description = "Describe the role in at least 30 characters";
    if (Number(form.vacancies) < 1)
      next.vacancies = "There must be at least one vacancy";
    if (
      form.deadline &&
      new Date(form.deadline) < new Date(new Date().toDateString())
    )
      next.deadline = "Pick a deadline in the future";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, vacancies: Number(form.vacancies) });
  };

  return (
    <Card className="soft-card">
      <Card.Body className="p-4">
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="job-title">
                <Form.Label>Job title</Form.Label>
                <Form.Control
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="job-company">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  isInvalid={!!errors.company}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.company}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="job-location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  isInvalid={!!errors.location}
                  placeholder="Pune, Maharashtra"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="job-salary">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="4 - 7 LPA"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-type">
                <Form.Label>Job type</Form.Label>
                <Form.Select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-workmode">
                <Form.Label>Work mode</Form.Label>
                <Form.Select
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                >
                  {WORK_MODES.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-experience">
                <Form.Label>Experience level</Form.Label>
                <Form.Select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                >
                  {EXPERIENCE.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-vacancies">
                <Form.Label>Vacancies</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  name="vacancies"
                  value={form.vacancies}
                  onChange={handleChange}
                  isInvalid={!!errors.vacancies}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.vacancies}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-deadline">
                <Form.Label>Application deadline</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  isInvalid={!!errors.deadline}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.deadline}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="job-skills">
                <Form.Label>Skills (comma separated)</Form.Label>
                <Form.Control
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="job-description">
                <Form.Label>Job description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  isInvalid={!!errors.description}
                  placeholder="Responsibilities, requirements and what a good candidate looks like."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="job-status">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4">
            <Button type="submit" className="btn-accent" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />{" "}
                  Saving
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default JobForm;
