import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
    <p className="display-4 fw-bold mb-2">404</p>
    <h1 className="h4 mb-3">This page does not exist</h1>
    <p className="text-secondary mb-4">
      The link may be broken or the job may have been removed.
    </p>
    <Button as={Link} to="/jobs" className="btn-accent">
      Browse jobs
    </Button>
  </Container>
);

export default NotFound;
