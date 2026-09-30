import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="app-footer mt-auto pt-5 pb-4">
    <Container>
      <Row className="g-4">
        <Col md={4}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="brand-mark">H</span>
            <span className="fw-bold text-white fs-5">HireDesk</span>
          </div>
          <p className="small mb-0">
            A job portal where candidates track every application and recruiters
            manage hiring in one place.
          </p>
        </Col>
        <Col md={2} xs={6}>
          <h4 className="h6 text-white">Candidates</h4>
          <ul className="list-unstyled small mb-0">
            <li>
              <Link to="/jobs">Browse jobs</Link>
            </li>
            <li>
              <Link to="/register">Create account</Link>
            </li>
            <li>
              <Link to="/candidate/applications">My applications</Link>
            </li>
          </ul>
        </Col>
        <Col md={2} xs={6}>
          <h4 className="h6 text-white">Recruiters</h4>
          <ul className="list-unstyled small mb-0">
            <li>
              <Link to="/recruiter/jobs/add">Post a job</Link>
            </li>
            <li>
              <Link to="/recruiter/jobs">Manage jobs</Link>
            </li>
            <li>
              <Link to="/recruiter/dashboard">Dashboard</Link>
            </li>
          </ul>
        </Col>
        <Col md={4}>
          <h4 className="h6 text-white">Make your next move</h4>
          <ul className="list-unstyled small mb-0">
            <li>Good work begins with a conversation.</li>
            <li>Pune, Maharashtra, India</li>
          </ul>
        </Col>
      </Row>
      <hr className="border-secondary my-4" />
      <p className="small mb-0">
        © {new Date().getFullYear()} HireDesk. A place for your next chapter.
      </p>
    </Container>
  </footer>
);

export default Footer;
