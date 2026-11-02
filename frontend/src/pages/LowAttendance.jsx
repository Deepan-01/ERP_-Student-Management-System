import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function LowAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/low");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm p-4" style={{ borderRadius: "16px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 style={{ fontSize: "1.6rem", margin: 0 }}>⚠️ Low Attendance Alert</h1>
            <p className="text-muted mb-0 small">Students with overall attendance below 75%</p>
          </div>
          <Link to="/attendance" className="btn btn-outline-primary btn-sm">
            &larr; Back to Attendance
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Total Classes</th>
                  <th>Present</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.rollNo}>
                      <td><strong>{student.rollNo}</strong></td>
                      <td>{student.name}</td>
                      <td>{student.total}</td>
                      <td>{student.present}</td>
                      <td>
                        <strong className="text-danger">{student.percentage}%</strong>
                      </td>
                      <td>
                        <span className="badge bg-danger">Critical (&lt; 75%)</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      🎉 No students with low attendance found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LowAttendance;