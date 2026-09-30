import { Card } from "react-bootstrap";

// Small dashboard tile: value, label and an icon badge
const StatCard = ({ label, value, icon, tone = "dark" }) => (
  <Card className="stat-card h-100">
    <Card.Body className="d-flex align-items-center gap-3">
      <span className={`stat-icon bg-${tone}-subtle text-${tone}-emphasis`}>
        {icon}
      </span>
      <div>
        <div className="stat-value">{value ?? 0}</div>
        <div className="text-secondary small">{label}</div>
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;
