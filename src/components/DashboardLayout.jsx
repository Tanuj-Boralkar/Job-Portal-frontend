import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./SideBar";

// Shared shell for the candidate, recruiter and admin dashboards
const DashboardLayout = ({
  title,
  subtitle,
  sidebarTitle,
  links,
  children,
}) => (
  <Container fluid className="px-0">
    <Row className="g-0">
      <Col lg={3} xl={2}>
        <div className="p-3 p-lg-0">
          <Sidebar title={sidebarTitle} links={links} />
        </div>
      </Col>
      <Col lg={9} xl={10}>
        <div className="p-3 p-lg-4">
          <div className="mb-4 dashboard-heading">
            <h1 className="h3 section-heading mb-1">{title}</h1>
            {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
          </div>
          {children}
        </div>
      </Col>
    </Row>
  </Container>
);

export default DashboardLayout;
