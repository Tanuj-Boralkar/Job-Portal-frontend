import { Spinner } from "react-bootstrap";

const Loader = ({ label = "Loading", fullPage = false }) => (
  <div
    className="d-flex flex-column align-items-center justify-content-center text-secondary py-5"
    style={fullPage ? { minHeight: "60vh" } : undefined}
    role="status"
    aria-live="polite"
  >
    <Spinner animation="border" variant="dark" />
    <span className="mt-2 small">{label}</span>
  </div>
);

export default Loader;
