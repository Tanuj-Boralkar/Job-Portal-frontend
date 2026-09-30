import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import JobForm from "./JobForm";
import { emptyJob } from "../../utils/emptyJob";
import recruiterLinks from "./recruiterLinks";
import { useAuth } from "../../context/useAuth";

const AddJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.post("/jobs", values);
      toast.success("Job posted");
      navigate("/recruiter/jobs");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Post a job"
      subtitle="Candidates see this listing as soon as you publish it."
      sidebarTitle="Recruiter"
      links={recruiterLinks}
    >
      <JobForm
        initialValues={{ ...emptyJob, company: user?.companyName || "" }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Publish job"
      />
    </DashboardLayout>
  );
};

export default AddJob;
