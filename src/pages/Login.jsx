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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const homeFor = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "recruiter") return "/recruiter/dashboard";
  return "/candidate/dashboard";
};

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("expired")) {
      toast.info("Your session expired. Please sign in again.");
    }
  }, [location.search]);

  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ""}` : homeFor(user.role), { replace: true });
  }, [user, navigate, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await login({
      email: form.email.trim(),
      password: form.password,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Signed in");
    const from = location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ""}` : null;
    navigate(from || homeFor(result.user.role), { replace: true });
  };

  return (
    <Container className="auth-page">
      <Row className="align-items-center justify-content-between g-4">
        <Col lg={5}><div className="auth-intro"><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>A little ambition.<br /><em>A world of possibility.</em></h2><p>Find work that fits your life, and people who share your drive.</p><div className="auth-point"><span>✓</span> Opportunities that match your skills</div><div className="auth-point"><span>✓</span> All your applications in one place</div><div className="auth-point"><span>✓</span> A simpler way to take the next step</div></div></Col>
        <Col lg={6}>
          <Card className="soft-card auth-card">
            <Card.Body className="p-4">
              <h1 className="h4 section-heading mb-1">Sign in</h1>
              <p className="text-secondary small mb-4">
                Welcome back. Your next move is waiting.
              </p>

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="login-email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="you@example.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="login-password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Your password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
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
                        Signing in
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </Form>

              <p className="small text-secondary mt-4 mb-0">
                New here?{" "}
                <Link to="/register" className="fw-semibold text-ink">
                  Create an account
                </Link>
              </p>
            </Card.Body>
          </Card>


        </Col>
      </Row>
    </Container>
  );
};

export default Login;
