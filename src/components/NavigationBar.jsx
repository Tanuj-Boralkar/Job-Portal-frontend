import { assetUrl } from "../services/api";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const dashboardPath = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "recruiter") return "/recruiter/dashboard";
  return "/candidate/dashboard";
};

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  return (
    <Navbar collapseOnSelect expand="lg" sticky="top" className="app-navbar py-2">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold text-ink"
        >
          <span className="brand-mark">H</span> HireDesk
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/jobs">
              Find a job
            </Nav.Link>
            {user && (
              <Nav.Link as={NavLink} to={dashboardPath(user.role)}>
                Dashboard
              </Nav.Link>
            )}
            {user?.role === "recruiter" && (
              <Nav.Link as={NavLink} to="/recruiter/jobs/add">
                Post a job
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center gap-lg-2">
            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Sign in
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  className="btn-accent btn-sm px-3"
                >
                  Create account
                </Button>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="d-flex align-items-center gap-2 border"
                >
                  {user.profileImage ? (
                    <img
                      src={assetUrl(user.profileImage)}
                      alt=""
                      width={24}
                      height={24}
                      className="rounded-circle object-fit-cover"
                    />
                  ) : (
                    <FiUser aria-hidden="true" />
                  )}
                  <span className="text-truncate" style={{ maxWidth: 140 }}>
                    {user.name}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header className="text-capitalize">
                    Signed in as {user.role}
                  </Dropdown.Header>
                  <Dropdown.Item as={Link} to={dashboardPath(user.role)}>
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile">
                    My profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="d-flex align-items-center gap-2 text-danger"
                  >
                    <FiLogOut aria-hidden="true" /> Sign out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
