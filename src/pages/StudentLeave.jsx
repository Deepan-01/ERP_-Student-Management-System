import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

function StudentLeave() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ fromDate: "", toDate: "", reason: "" });

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leaves", form);
      alert("Leave applied successfully");
      setForm({ fromDate: "", toDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply leave");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const statusBadge = (status) => {
    const colors = { Pending: "warning", Approved: "success", Rejected: "danger" };
    return <span className={`badge bg-${colors[status] || "secondary"}`}>{status}</span>;
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 style={{ margin: 0, color: "white" }}>Apply Leave</h1>
            <p style={{ margin: "4px 0 0", opacity: 0.85 }}>{user?.name} ({user?.rollNo})</p>
          </div>
          <div>
            <button className="btn btn-light btn-sm me-2" onClick={() => navigate("/my-results")}>My Results</button>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm" style={{ borderRadius: "16px", border: "none" }}>
            <div className="card-body p-4">
              <h4 style={{ fontSize: "1.1rem", marginBottom: "1.2rem" }}>New Leave Application</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>From Date</label>
                  <input type="date" name="fromDate" className="form-control" value={form.fromDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>To Date</label>
                  <input type="date" name="toDate" className="form-control" value={form.toDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Reason</label>
                  <textarea name="reason" className="form-control" rows="3" value={form.reason} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100" style={{ borderRadius: "10px", padding: "10px" }}>Submit Application</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm" style={{ borderRadius: "16px", border: "none" }}>
            <div className="card-body p-4">
              <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Leave History</h4>
              {leaves.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover" style={{ margin: 0 }}>
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th style={{ borderTop: "none" }}>From</th><th style={{ borderTop: "none" }}>To</th>
                        <th style={{ borderTop: "none" }}>Reason</th><th style={{ borderTop: "none" }}>Status</th><th style={{ borderTop: "none" }}>Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((l) => (
                        <tr key={l._id}>
                          <td>{new Date(l.fromDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                          <td>{new Date(l.toDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                          <td>{l.reason}</td>
                          <td>{statusBadge(l.status)}</td>
                          <td style={{ fontSize: "0.85rem", color: "#6b7280" }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mb-0">No leave applications yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLeave;
