import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

function LeaveManagement() {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchLeaves = async () => {
    try {
      const url = statusFilter ? `/leaves/all?status=${statusFilter}` : "/leaves/all";
      const res = await api.get(url);
      setLeaves(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, { status });
      fetchLeaves();
    } catch (err) {
      console.log(err);
    }
  };

  const statusBadge = (status) => {
    const colors = { Pending: "warning", Approved: "success", Rejected: "danger" };
    return <span className={`badge bg-${colors[status] || "secondary"}`}>{status}</span>;
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4" style={{ borderRadius: "16px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem" }}>📋 Leave Management</h1>
            {user?.role === "staff" && (
              <span className="badge bg-info mt-1" style={{ fontSize: "0.8rem" }}>Showing: {user.department} Department</span>
            )}
          </div>
          <select className="form-select w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Approved">✅ Approved</option>
            <option value="Rejected">❌ Rejected</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover" style={{ margin: 0 }}>
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th style={{ borderTop: "none" }}>Roll No</th><th style={{ borderTop: "none" }}>Name</th>
                <th style={{ borderTop: "none" }}>Dept</th><th style={{ borderTop: "none" }}>From</th>
                <th style={{ borderTop: "none" }}>To</th><th style={{ borderTop: "none" }}>Reason</th>
                <th style={{ borderTop: "none" }}>Status</th><th style={{ borderTop: "none" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? leaves.map((l) => (
                <tr key={l._id}>
                  <td><strong>{l.rollNo}</strong></td>
                  <td>{l.name}</td>
                  <td><span className="badge bg-secondary">{l.department}</span></td>
                  <td>{new Date(l.fromDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                  <td>{new Date(l.toDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</td>
                  <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</td>
                  <td>{statusBadge(l.status)}</td>
                  <td>
                    {l.status === "Pending" && (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="btn btn-success btn-sm" style={{ borderRadius: "8px" }} onClick={() => updateStatus(l._id, "Approved")}>✅ Approve</button>
                        <button className="btn btn-danger btn-sm" style={{ borderRadius: "8px" }} onClick={() => updateStatus(l._id, "Rejected")}>❌ Reject</button>
                      </div>
                    )}
                    {l.status !== "Pending" && <span className="text-muted" style={{ fontSize: "0.85rem" }}>—</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="text-center py-4 text-muted">📭 No leave applications found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaveManagement;
