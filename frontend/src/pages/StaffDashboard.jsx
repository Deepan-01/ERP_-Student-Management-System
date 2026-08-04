import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

function StaffDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/events/upcoming?category=Activity");
      setActivities(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 bg-white rounded-3 shadow-sm">
        <div>
          <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Staff Dashboard</h1>
          {user?.department && (
            <span className="badge bg-primary mt-1">{user.department} Department</span>
          )}
        </div>
        <div>
          <span className="me-3" style={{ color: "#4b5563" }}>👋 Welcome, <strong>{user?.name}</strong></span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <Link to="/students" className="text-decoration-none">
            <div className="card shadow-sm text-center p-4 text-white" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: "16px" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>👥</div>
              <h4 style={{ margin: 0 }}>Students</h4>
              <p style={{ opacity: 0.85, margin: "6px 0 0", fontSize: "0.9rem" }}>Add, Edit, Delete</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/attendance" className="text-decoration-none">
            <div className="card shadow-sm text-center p-4 text-white" style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", borderRadius: "16px" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>📋</div>
              <h4 style={{ margin: 0 }}>Attendance</h4>
              <p style={{ opacity: 0.85, margin: "6px 0 0", fontSize: "0.9rem" }}>Mark & Manage</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/results" className="text-decoration-none">
            <div className="card shadow-sm text-center p-4 text-white" style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", borderRadius: "16px" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>📊</div>
              <h4 style={{ margin: 0 }}>Results</h4>
              <p style={{ opacity: 0.85, margin: "6px 0 0", fontSize: "0.9rem" }}>Manage Grades</p>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="/leave-management" className="text-decoration-none">
            <div className="card shadow-sm text-center p-4 text-white" style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", borderRadius: "16px" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>📅</div>
              <h4 style={{ margin: 0 }}>Leave</h4>
              <p style={{ opacity: 0.85, margin: "6px 0 0", fontSize: "0.9rem" }}>Applications</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="card shadow-sm p-4" style={{ borderRadius: "16px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>📌 Upcoming Activities</h2>
        <div className="row g-3">
          {activities.length > 0 ? activities.map((act) => (
            <div key={act._id} className="col-md-4">
              <div className="card shadow-sm p-3 h-100" style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "6px" }}>
                  📅 {new Date(act.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </div>
                <h5 style={{ margin: 0 }}>{act.title}</h5>
                {act.description && <p className="mb-0 text-muted mt-2" style={{ fontSize: "0.9rem" }}>{act.description}</p>}
              </div>
            </div>
          )) : (
            <p className="text-muted">No upcoming activities</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
