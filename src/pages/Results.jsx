import { useContext, useEffect, useState } from "react";
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

function Results() {
  const { user } = useContext(AuthContext);
  const [selectedDepartment, setSelectedDepartment] = useState(user?.role === "staff" ? user.department : "");
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [formData, setFormData] = useState({
    rollNo: "", name: "", department: "", semester: "",
    subject1: "", subject2: "", subject3: "", subject4: "", subject5: "", subject6: "", subject7: "",
  });

  const semester = formData.semester ? Number(formData.semester) : null;
  const subjects = semester ? subjectMap[semester] || [] : [];

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/students?department=${selectedDepartment}`);
      setStudents(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchResults = async () => {
    try {
      const res = await api.get(`/results?department=${selectedDepartment}`);
      setResults(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    if (selectedDepartment) {
      fetchStudents();
      fetchResults();
    }
  }, [selectedDepartment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addResult = async (e) => {
    e.preventDefault();
    try {
      await api.post("/results", formData);
      alert("Result Added Successfully");
      setFormData({ rollNo: "", name: "", department: selectedDepartment, semester: "", subject1: "", subject2: "", subject3: "", subject4: "", subject5: "", subject6: "", subject7: "" });
      fetchResults();
    } catch (err) {
      console.log(err);
      alert("Failed to Add Result");
    }
  };

  const deleteResult = async (id) => {
    try {
      await api.delete(`/results/${id}`);
      alert("Result Deleted Successfully");
      fetchResults();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
      result.name?.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter === "" || String(result.semester) === semesterFilter;
    return matchesSearch && matchesSemester;
  });

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    setFormData({ ...formData, department: dept });
  };

  const fillFromStudent = (student) => {
    setFormData({
      ...formData,
      rollNo: student.rollNo,
      name: student.name,
      department: selectedDepartment,
      semester: formData.semester,
    });
  };

  if (!selectedDepartment) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow-lg p-5 text-center" style={{ borderRadius: "20px", maxWidth: "600px", border: "none" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Results Management</h1>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>Select a department to manage student results</p>
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
          <h1 style={{ fontSize: "1.6rem", margin: 0 }}>Results — {selectedDepartment}</h1>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedDepartment("")}>Change Dept</button>
        </div>

        <form onSubmit={addResult} className="card bg-light p-4 mb-4" style={{ borderRadius: "12px", border: "none" }}>
          <h5 style={{ marginBottom: "1rem" }}>Add New Result</h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <input type="text" name="rollNo" placeholder="Roll No" className="form-control" value={formData.rollNo} onChange={handleChange} required />
            </div>
            <div className="col-md-3 mb-3">
              <input type="text" name="name" placeholder="Student Name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-md-3 mb-3">
              <input type="hidden" name="department" value={selectedDepartment} />
              <input type="text" className="form-control" value={selectedDepartment} disabled />
            </div>
            <div className="col-md-3 mb-3">
              <select name="semester" className="form-select" value={formData.semester} onChange={handleChange} required>
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            {subjects.map((label, i) => (
              <div key={i} className="col-md-2 mb-3">
                <input type="number" name={`subject${i + 1}`} placeholder={label} className="form-control"
                  value={formData[`subject${i + 1}`]} onChange={handleChange} required title={label} />
              </div>
            ))}
            <div className="col-md-2 mb-3 d-flex align-items-end">
              <button type="submit" className="btn btn-success w-100">Add Result</button>
            </div>
          </div>
        </form>

        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Students in {selectedDepartment}</h2>
        <div className="table-responsive mb-4">
          <table className="table table-hover">
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th style={{ borderTop: "none" }}>Roll No</th><th style={{ borderTop: "none" }}>Name</th>
                <th style={{ borderTop: "none" }}>Year</th><th style={{ borderTop: "none" }}>Result</th><th style={{ borderTop: "none" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const hasResult = results.find((r) => r.rollNo === student.rollNo);
                return (
                  <tr key={student._id}>
                    <td><strong>{student.rollNo}</strong></td>
                    <td>{student.name}</td>
                    <td>{student.year}</td>
                    <td>{hasResult ? <span className="badge bg-success">Added</span> : <span className="badge bg-danger">No Result</span>}</td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => fillFromStudent(student)}>Add Result</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Search by Roll No or Name" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button className="btn btn-success btn-sm" onClick={async () => {
            try {
              const res = await api.get("/results/export/excel", { responseType: "blob" });
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "results.xlsx");
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) { console.log(err); }
          }}>
            Export Excel
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ borderTop: "none" }}>Roll No</th><th style={{ borderTop: "none" }}>Name</th>
              <th style={{ borderTop: "none" }}>Sem</th><th style={{ borderTop: "none" }}>Total</th>
              <th style={{ borderTop: "none" }}>%</th><th style={{ borderTop: "none" }}>Grade</th>
              <th style={{ borderTop: "none" }}>GPA</th><th style={{ borderTop: "none" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => (
              <tr key={result._id}>
                <td><strong>{result.rollNo}</strong></td><td>{result.name}</td>
                <td>{result.semester}</td><td>{result.total}</td><td>{result.percentage}%</td>
                <td><span className={`badge ${result.grade === "RA" ? "bg-danger" : result.grade === "O" ? "bg-success" : "bg-primary"}`}>{result.grade}</span></td>
                <td><strong>{result.gpa}</strong></td>
                <td>
                  <button className="btn btn-outline-danger btn-sm me-1" onClick={() => deleteResult(result._id)}>Delete</button>
                  <button className="btn btn-outline-primary btn-sm" onClick={async () => {
                    try {
                      const res = await api.get(`/results/marksheet/${result._id}`, { responseType: "blob" });
                      const url = window.URL.createObjectURL(new Blob([res.data]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", `${result.rollNo}_marksheet.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    } catch (err) { console.log(err); }
                  }}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default Results;
