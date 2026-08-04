import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

const subjectMap = {
  1: ["PIC", "English", "Tamil", "Matrices and calculus", "Physics", "Chemistry"],
  2: ["Computational methods", "English", "Tamil", "BEEE", "Physics", "EG", "PSPP"],
  3: ["DM", "OOPS", "DPCO", "FOE", "FDSA"],
  4: ["PS", "DBMS", "ML", "IBS", "EVS", "OS"],
  5: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"],
  6: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6"],
  7: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"],
  8: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6"],
};

const getGrade = (mark) => {
  if (mark == null) return "-";
  if (mark >= 90) return "O";
  if (mark >= 80) return "A+";
  if (mark >= 70) return "A";
  if (mark >= 60) return "B+";
  if (mark >= 50) return "B";
  if (mark >= 40) return "C";
  return "RA";
};

const getGPA = (mark) => (mark != null ? (mark / 10).toFixed(2) : "-");

function StudentResults() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchResults = async () => {
    try {
      const res = await api.get("/results/my-results");
      setResults(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load results");
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get("/events/upcoming?category=Activity");
      setActivities(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchResults();
    fetchActivities();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const gradeColor = (g) => {
    if (g === "O" || g === "A+") return "success";
    if (g === "A" || g === "B+") return "primary";
    if (g === "B" || g === "C") return "warning";
    return "danger";
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: "16px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 style={{ margin: 0, color: "white" }}>My Results</h1>
            <p style={{ margin: "4px 0 0", opacity: 0.85 }}>{user?.name} ({user?.rollNo})</p>
          </div>
          <div>
            <Link to="/my-leave" className="btn btn-light btn-sm me-2">Apply Leave</Link>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {results.length > 0 ? results.map((r) => {
        const subs = subjectMap[r.semester] || [];
        const subjects = subs.map((name, i) => ({ name, mark: r[`subject${i + 1}`] }));

        return (
          <div key={r._id} className="card shadow-sm mb-4" style={{ borderRadius: "16px", border: "none" }}>
            <div className="card-header" style={{ background: "#f8f9fa", borderRadius: "16px 16px 0 0", border: "none", padding: "1rem 1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Semester {r.semester}</h3>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead style={{ background: "#f8f9fa" }}>
                    <tr>
                      <th style={{ borderTop: "none" }}>#</th>
                      <th style={{ borderTop: "none" }}>Subject</th>
                      <th style={{ borderTop: "none" }}>Grade</th>
                      <th style={{ borderTop: "none" }}>GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{s.name}</td>
                        <td><span className={`badge bg-${gradeColor(getGrade(s.mark))}`}>{getGrade(s.mark)}</span></td>
                        <td><strong>{getGPA(s.mark)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <hr />
              <div className="d-flex gap-4">
                <span><strong>Overall Grade:</strong> <span className={`badge bg-${gradeColor(r.grade)}`}>{r.grade}</span></span>
                <span><strong>Overall GPA:</strong> <strong style={{ fontSize: "1.1rem" }}>{r.gpa}</strong></span>
              </div>
            </div>
          </div>
        );
      }) : (
        <div className="card shadow-sm p-5 text-center" style={{ borderRadius: "16px" }}>
          <p className="text-muted mb-0">No results found for your register number.</p>
        </div>
      )}

      <div className="card shadow-sm p-4 mt-4" style={{ borderRadius: "16px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Upcoming Activities</h2>
        <div className="row g-3">
          {activities.length > 0 ? activities.map((act) => (
            <div key={act._id} className="col-md-4">
              <div className="card shadow-sm p-3 h-100" style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "6px" }}>
                  {new Date(act.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
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

export default StudentResults;
