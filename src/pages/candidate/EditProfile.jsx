import DashboardLayout from "../../components/DashboardLayout";
import candidateLinks from "./candidateLinks";
import { ProfileForm } from "../Profile";

const EditProfile = () => (
  <DashboardLayout
    title="Edit profile"
    subtitle="Recruiters see this information when they review your application."
    sidebarTitle="Candidate"
    links={candidateLinks}
  >
    <ProfileForm />
  </DashboardLayout>
);

export default EditProfile;
