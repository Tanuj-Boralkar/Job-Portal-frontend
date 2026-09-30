import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useGetJobsQuery } from "../store/jobsApi";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
];
const WORK_MODES = ["On-site", "Remote", "Hybrid"];
const EXPERIENCE = [
  "Fresher",
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
];
const CATEGORIES = [
  "Software Development",
  "Data Science",
  "Design",
  "Marketing",
  "Mobile Development",
  "Cloud & DevOps",
  "Human Resources",
  "Quality Assurance",
  "Content",
  "Other",
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const {
    currentData,
    isFetching: loading,
    error: queryError,
  } = useGetJobsQuery({ page: 1, limit: 9, ...query });
  const jobs = currentData?.jobs || [];
  const meta = currentData || { page: 1, pages: 1, total: 0 };
  const error = queryError?.message;

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const handleSearch = ({ keyword, location }) => {
    const next = new URLSearchParams(searchParams);
    keyword ? next.set("keyword", keyword) : next.delete("keyword");
    location ? next.set("location", location) : next.delete("location");
    next.delete("page");
    setSearchParams(next);
  };

  const changePage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());

  const filterSelect = (label, key, options) => (
    <Form.Group className="mb-3" controlId={`filter-${key}`}>
      <Form.Label className="small fw-semibold">{label}</Form.Label>
      <Form.Select
        value={query[key] || ""}
        onChange={(e) => setParam(key, e.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );

  return (
    <Container className="py-4 py-lg-5">
      <div className="job-page-title">
        <div className="eyebrow">FIND YOUR KIND OF WORK</div>
        <h1>A new chapter awaits.</h1>
        <p className="text-secondary">
          Explore opportunities that fit your skills, your ambitions, and your
          life.
        </p>
      </div>
      <div className="soft-card p-3 p-lg-4 mb-4">
        <SearchBar
          key={`${query.keyword || ""}:${query.location || ""}`}
          initialKeyword={query.keyword || ""}
          initialLocation={query.location || ""}
          onSearch={handleSearch}
        />
      </div>

      <Row className="g-4">
        <Col lg={3}>
          <Card className="soft-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h6 mb-0">Filters</h2>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-decoration-none"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
              {filterSelect("Job type", "jobType", JOB_TYPES)}
              {filterSelect("Work mode", "workMode", WORK_MODES)}
              {filterSelect("Experience", "experienceLevel", EXPERIENCE)}
              {filterSelect("Category", "category", CATEGORIES)}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 section-heading mb-0">Open roles</h2>
            <span className="text-secondary small">
              {meta.total} jobs found
            </span>
          </div>

          {loading && <Loader label="Loading jobs" />}

          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="soft-card p-5 text-center">
              <p className="fw-semibold mb-2">No jobs match these filters</p>
              <p className="text-secondary mb-3">
                Try a different keyword, or clear the filters to see everything.
              </p>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}

          <Row className="g-3">
            {!loading &&
              !error &&
              jobs.map((job) => (
                <Col key={job._id} md={6}>
                  <JobCard job={job} />
                </Col>
              ))}
          </Row>

          <Pagination
            page={meta.page}
            pages={!loading && !error ? meta.pages : 1}
            onChange={changePage}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Jobs;
