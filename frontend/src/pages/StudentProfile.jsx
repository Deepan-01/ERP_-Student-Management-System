import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);

        if (res.data?.rollNo) {
          try {
            const attRes = await api.get(`/attendance/percentage/${res.data.rollNo}`);
            setAttendance(attRes.data);
          } catch (_) {
            // Attendance percentage optional
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container p-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container p-5 text-center">
        <div className="alert alert-danger mb-4">{error || "Student not found"}</div>
        <button className="btn btn-primary" onClick={() => navigate("/students")}>
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/students")}>
          &larr; Back to Students List
        </button>
        <span className="badge bg-primary fs-6">{student.department} Department</span>
      </div>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4 text-center" style={{ borderRadius: "16px" }}>
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0 auto 16px",
              }}
            >
              {student.name ? student.name.charAt(0).toUpperCase() : "S"}
            </div>
            <h3 className="card-title fw-bold mb-1">{student.name}</h3>
            <p className="text-muted mb-2">Roll No: <strong>{student.rollNo}</strong></p>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <span className="badge bg-info text-dark">Year {student.year}</span>
              <span className="badge bg-secondary">{student.department}</span>
            </div>

            {attendance && (
              <div className="p-3 bg-light rounded-3 mt-3">
                <small className="text-muted d-block mb-1">Attendance Rate</small>
                <h4 className={`mb-1 fw-bold ${attendance.percentage < 75 ? "text-danger" : "text-success"}`}>
                  {attendance.percentage}%
                </h4>
                <small className="text-muted">
                  {attendance.presentDays} of {attendance.totalDays} days present
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4" style={{ borderRadius: "16px" }}>
            <h4 className="fw-bold mb-4 pb-2 border-bottom">Academic & Contact Information</h4>
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="text-muted small">Full Name</label>
                <p className="fw-semibold mb-0">{student.name}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Register Number</label>
                <p className="fw-semibold mb-0">{student.rollNo}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Department</label>
                <p className="fw-semibold mb-0">{student.department}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Current Year</label>
                <p className="fw-semibold mb-0">Year {student.year}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Email Address</label>
                <p className="fw-semibold mb-0">{student.email || "Not specified"}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Residential Address</label>
                <p className="fw-semibold mb-0">{student.address || "Not specified"}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Parent / Guardian Name</label>
                <p className="fw-semibold mb-0">{student.parentName || "Not specified"}</p>
              </div>
              <div className="col-sm-6">
                <label className="text-muted small">Parent Contact Phone</label>
                <p className="fw-semibold mb-0">{student.parentPhone || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;