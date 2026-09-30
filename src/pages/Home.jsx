import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiArrowRight, FiCode, FiPenTool, FiBarChart2, FiLayers, FiCheck, FiBriefcase, FiCompass, FiSend } from "react-icons/fi";
import { useGetJobsQuery } from "../store/jobsApi";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";

const categories = [
  { name: "Software Development", label: "Development", text: "Build what comes next.", icon: FiCode, tone: "mint" },
  { name: "Design", label: "Design & creative", text: "Make your mark.", icon: FiPenTool, tone: "peach" },
  { name: "Data Science", label: "Data & analytics", text: "Turn insight into impact.", icon: FiBarChart2, tone: "lilac" },
  { name: "Marketing", label: "Marketing", text: "Bring big ideas to life.", icon: FiLayers, tone: "yellow" },
];
export default function Home() {
  const navigate = useNavigate();
  const { data, isFetching: loading, error, refetch } = useGetJobsQuery({ limit: 6 });
  const jobs = data?.jobs || [];
  const search = ({ keyword, location }) => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params}`);
  };
  return <>
    <section className="home-hero">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <div className="eyebrow"><span className="live-dot" /> BIG POSSIBILITIES. YOUR NEXT CHAPTER.</div>
            <h1>Good work.<br />Great people.<br /><em>Your next move.</em></h1>
            <p className="hero-copy">A fresh start, a bigger challenge, a place to belong.<br className="d-none d-md-block" /> Find the opportunity that feels right for you.</p>
            <div className="hero-search"><SearchBar onSearch={search} buttonLabel="Find my next job" /></div>
            <div className="popular-searches"><span>Popular searches</span>{["React", "Design", "Internship"].map(term => <Link key={term} to={term === "Internship" ? "/jobs?jobType=Internship" : `/jobs?keyword=${term}`}>{term} <FiArrowUpRight /></Link>)}</div>
          </Col>
          <Col lg={5}>
            <div className="career-art" aria-label="Find your own path: explore, apply, grow">
              <div className="art-grid" />
              <div className="art-label">A LITTLE AMBITION GOES A LONG WAY</div>
              <div className="art-orbit" /><div className="art-spark">✳</div>
              <div className="career-note"><span className="note-icon"><FiCompass /></span><div><strong>Room to grow.</strong><span>Space to be yourself.</span></div></div>
              <div className="career-step step-one"><span>01</span> Explore <FiArrowUpRight /></div>
              <div className="career-step step-two"><span>02</span> Apply <FiArrowUpRight /></div>
              <div className="career-step step-three"><span>03</span> Grow <FiArrowUpRight /></div>
              <div className="art-caption"><FiCheck /> Your next chapter starts here.</div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    <section className="benefit-strip"><Container><Row className="g-3">
      {[[FiCompass, "Find your kind of work", "Explore roles by skill, location, and lifestyle."], [FiSend, "Make your move", "Apply with your resume and a personal note."], [FiBriefcase, "Keep it all together", "Follow every application from one dashboard."]].map(([Icon, title, copy]) => <Col md={4} key={title}><div className="benefit-item"><Icon /><div><strong>{title}</strong><p>{copy}</p></div></div></Col>)}
    </Row></Container></section>
    <section className="section-space"><Container>
      <div className="section-top"><div><div className="eyebrow">FOLLOW YOUR CURIOSITY</div><h2>There's a place for your talent.</h2></div><Link to="/jobs" className="text-link">Explore all categories <FiArrowUpRight /></Link></div>
      <Row className="g-3">{categories.map(({ name, label, text, icon: Icon, tone }) => <Col sm={6} lg={3} key={name}><Link className={`category-tile ${tone}`} to={`/jobs?category=${encodeURIComponent(name)}`}><div className="category-top"><span className="category-icon"><Icon /></span><FiArrowUpRight /></div><h3>{label}</h3><p>{text}</p></Link></Col>)}</Row>
    </Container></section>
    <section className="jobs-section section-space"><Container>
      <div className="section-top"><div><div className="eyebrow">YOUR NEXT CHAPTER</div><h2>Fresh opportunities.</h2><p className="text-secondary mb-0">New roles. New teams. A whole lot of potential.</p></div><Button as={Link} to="/jobs" variant="outline-primary">View all jobs <FiArrowUpRight className="ms-2" /></Button></div>
      {loading ? <Loader label="Finding opportunities" /> : error ? <div className="soft-card p-4" role="alert"><h3 className="h5">We couldn't load the latest roles.</h3><p className="text-secondary">Please try again in a moment.</p><Button variant="outline-primary" onClick={refetch}>Try again</Button></div> : jobs.length === 0 ? <div className="soft-card p-5 text-center"><FiBriefcase className="fs-1 mb-3 text-secondary" /><h3 className="h5">A new beginning, for everyone.</h3><p className="text-secondary">The first opportunities are on their way. Create an account to get started.</p><Button as={Link} to="/register">Join HireDesk <FiArrowRight /></Button></div> : <Row className="g-4">{jobs.map(job => <Col md={6} lg={4} key={job._id}><JobCard job={job} /></Col>)}</Row>}
    </Container></section>
    <section className="section-space"><Container><div className="hiring-banner"><div><div className="eyebrow">FOR THE TEAM BUILDERS</div><h2>Your next great hire<br />is out there.</h2><p>Give your opening a home. Meet people who move your team forward.</p><Button as={Link} to="/register?role=recruiter" className="btn-coral">Start hiring <FiArrowUpRight className="ms-2" /></Button></div><div className="hiring-art" aria-hidden="true"><span>Good people.</span><span>Better together.</span><FiArrowUpRight /></div></div></Container></section>
  </>;
}
