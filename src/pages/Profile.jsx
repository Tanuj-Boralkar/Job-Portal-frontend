import { assetUrl } from "../services/api";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/useAuth";

// Shared profile editor for all three roles
export const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    companyName: "",
    companyDescription: "",
    password: "",
  });
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/users/profile");
        const me = data.data;
        setProfile(me);
        setForm({
          name: me.name || "",
          phone: me.phone || "",
          location: me.location || "",
          skills: (me.skills || []).join(", "),
          experience: me.experience || "",
          education: me.education || "",
          companyName: me.companyName || "",
          companyDescription: me.companyDescription || "",
          password: "",
        });
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (form.phone && !/^[0-9+\-\s]{8,15}$/.test(form.phone))
      next.phone = "Enter a valid phone number";
    if (form.password && form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "password" && !value) return;
      payload.append(key, value);
    });
    if (profileImage) payload.append("profileImage", profileImage);
    if (resume) payload.append("resume", resume);

    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(data.data);
      updateUser({
        name: data.data.name,
        profileImage: data.data.profileImage,
      });
      setForm((prev) => ({ ...prev, password: "" }));
      setProfileImage(null);
      setResume(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading profile" />;

  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "candidate";

  return (
    <Row className="g-4">
      <Col lg={4}>
        <Card className="soft-card">
          <Card.Body className="text-center">
            {profile?.profileImage ? (
              <img
                src={assetUrl(profile.profileImage)}
                alt={`${profile.name} profile`}
                className="rounded-circle mb-3"
                width={96}
                height={96}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-ink text-white d-grid mx-auto mb-3"
                style={{
                  width: 96,
                  height: 96,
                  placeItems: "center",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
              >
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="h5 mb-1">{profile?.name}</h2>
            <p className="text-secondary small mb-2">{profile?.email}</p>
            <span className="badge bg-warning-subtle text-warning-emphasis text-capitalize">
              {profile?.role}
            </span>

            {isCandidate && (
              <div className="mt-3 small">
                {profile?.resume ? (
                  <a
                    href={assetUrl(profile.resume)}
                    target="_blank"
                    rel="noreferrer"
                    className="fw-semibold text-ink"
                  >
                    View saved resume
                  </a>
                ) : (
                  <span className="text-secondary">No resume saved yet</span>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col lg={8}>
        <Card className="soft-card">
          <Card.Body className="p-4">
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="profile-name">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="profile-phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="profile-location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Pune, Maharashtra"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="profile-image">
                    <Form.Label>Profile image (JPG, PNG, WEBP)</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) =>
                        setProfileImage(e.target.files[0] || null)
                      }
                    />
                  </Form.Group>
                </Col>

                {isCandidate && (
                  <>
                    <Col md={12}>
                      <Form.Group controlId="profile-skills">
                        <Form.Label>Skills (comma separated)</Form.Label>
                        <Form.Control
                          name="skills"
                          value={form.skills}
                          onChange={handleChange}
                          placeholder="React, Node.js, MongoDB"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="profile-experience">
                        <Form.Label>Experience</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="profile-education">
                        <Form.Label>Education</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="education"
                          value={form.education}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="profile-resume">
                        <Form.Label>Resume (PDF, DOC, DOCX)</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setResume(e.target.files[0] || null)}
                        />
                        <Form.Text className="text-secondary">
                          The saved resume is attached automatically when you
                          apply.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </>
                )}

                {isRecruiter && (
                  <>
                    <Col md={6}>
                      <Form.Group controlId="profile-company">
                        <Form.Label>Company name</Form.Label>
                        <Form.Control
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="profile-company-description">
                        <Form.Label>About the company</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="companyDescription"
                          value={form.companyDescription}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}

                <Col md={6}>
                  <Form.Group controlId="profile-password">
                    <Form.Label>New password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Leave empty to keep the current one"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-4">
                <Button type="submit" className="btn-accent" disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />{" "}
                      Saving
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const Profile = () => (
  <Container className="py-4 py-lg-5">
    <div className="mb-4">
      <h1 className="h3 section-heading mb-1">My profile</h1>
      <p className="text-secondary mb-0">
        Keep your details current so recruiters see the right information.
      </p>
    </div>
    <ProfileForm />
  </Container>
);

export default Profile;
