import { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

// Inline column on large screens, slide-over drawer on mobile
const Sidebar = ({ title, links }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="d-lg-none mb-3">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShow(true)}
        >
          <FiMenu aria-hidden="true" /> <span className="ms-1">{title}</span>
        </Button>
      </div>

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        responsive="lg"
        className="dash-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-block p-3">
          <p className="text-secondary small fw-semibold mb-3 d-none d-lg-block">
            {title}
          </p>
          <nav aria-label="Dashboard sections">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className="dash-link"
                onClick={() => setShow(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
