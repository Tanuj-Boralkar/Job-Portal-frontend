export const statusTone = (status) =>
  ({
    Applied: "secondary",
    "Under Review": "info",
    Shortlisted: "primary",
    Interview: "warning",
    Selected: "success",
    Rejected: "danger",
  })[status] || "secondary";
