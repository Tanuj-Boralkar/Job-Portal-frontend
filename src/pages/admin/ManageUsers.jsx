import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import Loader from "../../components/Loader";
import adminLinks from "./adminLinks";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users", {
        params: { role: role || undefined, keyword: keyword || undefined },
      });
      setUsers(data.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [role, keyword]);

  useEffect(() => {
    // Shared fetch resets loading on navigation and after user actions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const toggleBlock = async (user) => {
    try {
      const { data } = await api.patch(`/admin/users/${user._id}/status`, {
        isBlocked: !user.isBlocked,
      });
      setUsers((prev) =>
        prev.map((item) => (item._id === user._id ? data.data : item)),
      );
      toast.success(data.message);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${pendingDelete._id}`);
      setUsers((prev) => prev.filter((item) => item._id !== pendingDelete._id));
      toast.success("User deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Users"
      subtitle="Search, block or remove accounts across the platform."
      sidebarTitle="Admin"
      links={adminLinks}
    >
      <Card className="soft-card">
        <Card.Header className="bg-white border-0 pt-3">
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <Form.Control
                placeholder="Search by name, email or company"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Search users"
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Filter by role"
              >
                <option value="">All roles</option>
                <option value="candidate">Candidates</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Admins</option>
              </Form.Select>
            </Col>
            <Col md={4} className="text-md-end text-secondary small">
              {users.length} users
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="pt-3">
          {loading && <Loader label="Loading users" />}
          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="text-secondary text-center py-4 mb-0">
              No users match this search.
            </p>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Account</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="fw-semibold">
                        {user.name}
                        {user.companyName && (
                          <div className="text-secondary small">
                            {user.companyName}
                          </div>
                        )}
                      </td>
                      <td className="small">{user.email}</td>
                      <td>
                        <Badge
                          bg="light"
                          text="dark"
                          className="border text-capitalize"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="small">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={user.isBlocked ? "danger" : "success"}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            size="sm"
                            variant={
                              user.isBlocked
                                ? "outline-success"
                                : "outline-warning"
                            }
                            onClick={() => toggleBlock(user)}
                            disabled={user.role === "admin"}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => setPendingDelete(user)}
                            disabled={user.role === "admin"}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={!!pendingDelete}
        onHide={() => setPendingDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting <strong>{pendingDelete?.name}</strong> also removes their
          jobs and applications. This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setPendingDelete(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting" : "Delete user"}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;
