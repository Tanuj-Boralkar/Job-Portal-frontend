import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FiMapPin, FiSearch } from "react-icons/fi";

const SearchBar = ({
  initialKeyword = "",
  initialLocation = "",
  onSearch,
  buttonLabel = "Search jobs",
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch({ keyword: keyword.trim(), location: location.trim() });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2 align-items-center">
        <Col md={5}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FiSearch aria-hidden="true" />
            </span>
            <Form.Control
              className="border-start-0"
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </Col>
        <Col md={4}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FiMapPin aria-hidden="true" />
            </span>
            <Form.Control
              className="border-start-0"
              placeholder="City or Remote"
              aria-label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </Col>
        <Col md={3} className="d-grid">
          <Button type="submit" className="btn-accent">
            {buttonLabel}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
