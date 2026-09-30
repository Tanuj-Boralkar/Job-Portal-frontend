import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import JobForm from "./JobForm";
import recruiterLinks from "./recruiterLinks";

const toDateInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => {
        const job = data.data;
        setValues({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          jobType: job.jobType,
          workMode: job.workMode,
          salary: job.salary || "",
          experienceLevel: job.experienceLevel,
          skills: (job.skills || []).join(", "),
          category: job.category || "Other",
          vacancies: job.vacancies || 1,
          deadline: toDateInput(job.deadline),
          status: job.status,
          description: job.description || "",
        });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      await api.put(`/jobs/${id}`, form);
      toast.success("Job updated");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Edit job"
      subtitle="Changes go live immediately for anyone viewing this listing."
      sidebarTitle="Recruiter"
      links={recruiterLinks}
    >
      {loading && <Loader label="Loading job" />}
      {!loading && error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && values && (
        <JobForm
          initialValues={values}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save changes"
        />
      )}
    </DashboardLayout>
  );
};

export default EditJob;
