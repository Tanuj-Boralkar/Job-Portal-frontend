import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") === "recruiter" ? "recruiter" : "candidate",
    companyName: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user)
      navigate(
        user.role === "admin" ? "/admin/dashboard" : user.role === "recruiter"
          ? "/recruiter/dashboard"
          : "/candidate/dashboard",
        { replace: true },
      );
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (form.phone && !/^[0-9+\-\s]{8,15}$/.test(form.phone))
      next.phone = "Enter a valid phone number";
    if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match";
    if (form.role === "recruiter" && !form.companyName.trim())
      next.companyName = "Enter your company name";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      role: form.role,
      companyName: form.companyName.trim(),
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Account created");
    navigate(
      result.user.role === "recruiter"
        ? "/recruiter/dashboard"
        : "/candidate/dashboard",
      { replace: true },
    );
  };

  return (
    <Container className="auth-page">
      <Row className="align-items-center justify-content-between g-4">
        <Col lg={5}><div className="auth-intro"><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>A little ambition.<br /><em>A world of possibility.</em></h2><p>Find work that fits your life, and people who share your drive.</p><div className="auth-point"><span>✓</span> Opportunities that match your skills</div><div className="auth-point"><span>✓</span> All your applications in one place</div><div className="auth-point"><span>✓</span> A simpler way to take the next step</div></div></Col>
        <Col lg={7}>
          <Card className="soft-card auth-card">
            <Card.Body className="p-4">
              <h1 className="h4 section-heading mb-1">Create your account</h1>
              <p className="text-secondary small mb-4">
                Choose candidate to apply for jobs, or recruiter to post them.
              </p>

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>I am joining as</Form.Label>
                  <div className="d-flex gap-4">
                    <Form.Check
                      type="radio"
                      id="role-candidate"
                      name="role"
                      value="candidate"
                      label="Candidate"
                      checked={form.role === "candidate"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      id="role-recruiter"
                      name="role"
                      value="recruiter"
                      label="Recruiter"
                      checked={form.role === "recruiter"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="register-name">
                      <Form.Label>Full name</Form.Label>
                      <Form.Control
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Arjun Patil"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="register-email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="you@example.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="register-phone">
                      <Form.Label>Phone (optional)</Form.Label>
                      <Form.Control
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        placeholder="9876543210"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  {form.role === "recruiter" && (
                    <Col md={6}>
                      <Form.Group controlId="register-company">
                        <Form.Label>Company name</Form.Label>
                        <Form.Control
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                          isInvalid={!!errors.companyName}
                          placeholder="Nimbus Technologies"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.companyName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}
                  <Col md={6}>
                    <Form.Group controlId="register-password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="At least 6 characters"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="register-confirm">
                      <Form.Label>Confirm password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        placeholder="Repeat your password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button
                    type="submit"
                    className="btn-accent"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />{" "}
                        Creating account
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>
              </Form>

              <p className="small text-secondary mt-4 mb-0">
                Already registered?{" "}
                <Link to="/login" className="fw-semibold text-ink">
                  Sign in
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
