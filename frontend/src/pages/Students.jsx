import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../services/api";
import "./Students.css";

function Students() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(user?.role === "staff" ? user.department : "");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    department: "",
    year: "",
    email: "",
    address: "",
    parentName: "",
    parentPhone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async (e) => {
    e.preventDefault();

    try {
      await api.post("/students", formData);
      alert("Student Added Successfully");
      setFormData({
        rollNo: "", name: "", department: "", year: "", email: "",
        address: "", parentName: "", parentPhone: "",
      });
      fetchStudents();
    } catch (err) {
      console.log("Add Error:", err);
      alert("Failed to Add Student");
    }
  };

  const editStudent = (student) => {
    setEditId(student._id);
    setFormData({
      rollNo: student.rollNo,
      name: student.name,
      year: student.year,
      department: student.department,
      email: student.email,
      address: student.address,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
    });
  };

  const updateStudent = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/students/${editId}`, formData);
      alert("Student Updated Successfully");

      setEditId(null);
      setFormData({
        rollNo: "", name: "", department: "", year: "", email: "",
        address: "", parentName: "", parentPhone: "",
      });
      fetchStudents();
    } catch (err) {
      console.log("Update Error:", err);
      alert("Update Failed");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = department === "" || student.department === department;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm p-4" style={{ borderRadius: "16px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ fontSize: "1.6rem", margin: 0 }}>Student Management</h1>
          <button className="btn btn-success" onClick={async () => {
            try {
              const res = await api.get("/students/export/excel", { responseType: "blob" });
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "students.xlsx");
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) { console.log(err); }
          }}>
            Export Excel
          </button>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Search by name..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}
              disabled={user?.role === "staff"}>
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="CSBS">CSBS</option>
              <option value="CSE(AIML)">CSE(AIML)</option>
            </select>
          </div>
        </div>

        <form onSubmit={editId ? updateStudent : addStudent} className="row g-2 mb-4 p-3 bg-light rounded-3">
          <div className="col-md-3">
            <input type="text" className="form-control form-control-sm" name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control form-control-sm" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control form-control-sm" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="col-md-1">
            <input type="text" className="form-control form-control-sm" name="year" placeholder="Year" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input type="email" className="form-control form-control-sm" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input type="text" className="form-control form-control-sm" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control form-control-sm" name="parentName" placeholder="Parent Name" value={formData.parentName} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control form-control-sm" name="parentPhone" placeholder="Parent Phone" value={formData.parentPhone} onChange={handleChange} />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button type="submit" className="btn btn-primary btn-sm w-100">{editId ? "Update" : "Add"}</button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th><th>Name</th><th>Dept</th><th>Year</th>
                <th>Email</th><th>Address</th><th>Parent</th><th>Phone</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td><strong>{student.rollNo}</strong></td><td>{student.name}</td><td>{student.department}</td>
                    <td>{student.year}</td><td>{student.email}</td><td>{student.address}</td>
                    <td>{student.parentName}</td><td>{student.parentPhone}</td>
                    <td>
                      <Link to={`/student/${student._id}`} className="btn btn-info text-white btn-sm me-1">View</Link>
                      <button className="btn btn-success btn-sm me-1" onClick={() => editStudent(student)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(student._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9" className="text-center py-3 text-muted">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Students;
