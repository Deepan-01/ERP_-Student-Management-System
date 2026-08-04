import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

function Attendance() {
  const { user } = useContext(AuthContext);
  const [selectedDepartment, setSelectedDepartment] = useState(user?.role === "staff" ? user.department : "");
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [percentageData, setPercentageData] = useState(null);
  const [rollSearch, setRollSearch] = useState("");

  const [formData, setFormData] = useState({
    rollNo: "", name: "", department: "", status: "", absentReason: "", odReason: "",
  });

  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, onDuty: 0 });

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/students?department=${selectedDepartment}`);
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance?department=${selectedDepartment}&date=${selectedDate}`);
      setAttendance(res.data);

      const total = res.data.length;
      const present = res.data.filter((item) => item.status === "Present").length;
      const absent = res.data.filter((item) => item.status === "Absent").length;
      const onDuty = res.data.filter((item) => item.status === "On Duty").length;

      setStats({ total, present, absent, onDuty });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedDepartment, selectedDate]);

  const getPercentage = async () => {
    try {
      const res = await api.get(`/attendance/percentage/${rollSearch}`);
      setPercentageData(res.data);
    } catch (err) {
      console.log(err);
      alert("Student Not Found");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.post("/attendance", formData);
      alert("Attendance Marked Successfully");
      setFormData({ rollNo: "", name: "", department: selectedDepartment, status: "", absentReason: "", odReason: "" });
      fetchAttendance();
    } catch (err) {
      console.log(err);
      alert("Failed to Mark Attendance");
    }
  };

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    setFormData({ ...formData, department: dept });
  };

  if (!selectedDepartment) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow-lg p-5 text-center" style={{ borderRadius: "20px", maxWidth: "600px", border: "none" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Attendance Management</h1>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>Select a department to view and manage attendance</p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            {["CSE", "IT", "CSBS", "CSE(AIML)"].map((dept, i) => {
              const colors = ["#667eea", "#43e97b", "#f093fb", "#4facfe"];
              return (
                <button key={dept} onClick={() => handleDepartmentSelect(dept)}
                  style={{ padding: "24px 48px", fontSize: "18px", background: colors[i], color: "white", border: "none", borderRadius: "16px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", transition: "transform 0.2s", minWidth: "160px" }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}>
                  {dept}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm p-4" style={{ borderRadius: "16px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ fontSize: "1.6rem", margin: 0 }}>Attendance — {selectedDepartment}</h1>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedDepartment("")}>
            Change Dept
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#4b5563", marginBottom: "4px", display: "block" }}>Select Date</label>
            <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </div>

        <div className="card bg-light p-3 mb-4" style={{ borderRadius: "12px" }}>
          <div className="row text-center g-3">
            <div className="col-3"><strong>Total</strong><p className="mb-0 fs-5">{stats.total}</p></div>
            <div className="col-3"><strong style={{ color: "#198754" }}>Present</strong><p className="mb-0 fs-5" style={{ color: "#198754" }}>{stats.present}</p></div>
            <div className="col-3"><strong style={{ color: "#dc3545" }}>Absent</strong><p className="mb-0 fs-5" style={{ color: "#dc3545" }}>{stats.absent}</p></div>
            <div className="col-3"><strong style={{ color: "#0d6efd" }}>On Duty</strong><p className="mb-0 fs-5" style={{ color: "#0d6efd" }}>{stats.onDuty}</p></div>
          </div>
        </div>

        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Students — {selectedDate}</h2>
        {students.length > 0 ? (
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  <th style={{ borderTop: "none" }}>Roll No</th><th style={{ borderTop: "none" }}>Name</th>
                  <th style={{ borderTop: "none" }}>Year</th><th style={{ borderTop: "none" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const dayRecord = attendance.find((a) => a.rollNo === student.rollNo);
                  return (
                    <tr key={student._id}>
                      <td><strong>{student.rollNo}</strong></td>
                      <td>{student.name}</td>
                      <td>{student.year}</td>
                      <td>
                        {dayRecord ? (
                          <span className={`badge bg-${dayRecord.status === "Present" ? "success" : dayRecord.status === "On Duty" ? "primary" : "danger"}`}>
                            {dayRecord.status}{dayRecord.status === "Absent" && dayRecord.absentReason ? ` (${dayRecord.absentReason})` : ""}
                            {dayRecord.status === "On Duty" && dayRecord.odReason ? ` (${dayRecord.odReason})` : ""}
                          </span>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() =>
                            setFormData({ rollNo: student.rollNo, name: student.name, department: selectedDepartment, status: "Present", absentReason: "", odReason: "" })
                          }>Mark</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (<p className="text-muted">No students found.</p>)}

        {formData.rollNo && (
          <div className="card border-primary mb-4" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h5 className="card-title">Marking Attendance for: <strong>{formData.name}</strong> ({formData.rollNo})</h5>
              <form onSubmit={markAttendance} className="row g-2 mt-2">
                <input type="hidden" name="rollNo" value={formData.rollNo} />
                <input type="hidden" name="name" value={formData.name} />
                <input type="hidden" name="department" value={selectedDepartment} />
                <div className="col-auto">
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange} required>
                    <option value="">Select Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="On Duty">On Duty</option>
                  </select>
                </div>
                {formData.status === "Absent" && (
                  <div className="col-auto">
                    <input type="text" className="form-control" name="absentReason" placeholder="Reason for absence" value={formData.absentReason} onChange={handleChange} />
                  </div>
                )}
                {formData.status === "On Duty" && (
                  <div className="col-auto">
                    <input type="text" className="form-control" name="odReason" placeholder="On duty reason" value={formData.odReason} onChange={handleChange} />
                  </div>
                )}
                <div className="col-auto">
                  <button type="submit" className="btn btn-success">Submit</button>
                  <button type="button" className="btn btn-outline-danger ms-1" onClick={() => setFormData({ rollNo: "", name: "", department: selectedDepartment, status: "", absentReason: "", odReason: "" })}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <hr />
        <h2 style={{ fontSize: "1.1rem" }}>Attendance Percentage</h2>
        <div className="input-group mb-3" style={{ maxWidth: "400px" }}>
          <input type="text" className="form-control" placeholder="Enter Roll No" value={rollSearch} onChange={(e) => setRollSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={getPercentage}>Check</button>
        </div>
        {percentageData && (
          <div className="card bg-light p-3 mb-3" style={{ borderRadius: "12px", maxWidth: "400px" }}>
            <p className="mb-1"><strong>Roll No:</strong> {percentageData.rollNo}</p>
            <p className="mb-1"><strong>Total Days:</strong> {percentageData.totalDays}</p>
            <p className="mb-1"><strong>Present Days:</strong> {percentageData.presentDays}</p>
            <p className="mb-0"><strong>Attendance:</strong> {percentageData.percentage}%</p>
          </div>
        )}

        <button className="btn btn-success btn-sm" onClick={async () => {
          try {
            const res = await api.get("/attendance/export/excel", { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "attendance.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (err) { console.log(err); }
        }}>
          Export Excel
        </button>
      </div>
    </div>
  );
}

export default Attendance;
