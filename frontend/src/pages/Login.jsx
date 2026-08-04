import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [tab, setTab] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState("");

  const handleAdminStaffLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login({ ...res.data.user, token: res.data.token });
      if (res.data.user.role === "admin") navigate("/dashboard");
      else navigate("/staff");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/student-login", { rollNo });
      login({ ...res.data.user, token: res.data.token });
      navigate("/my-results");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="card shadow-lg p-5" style={{ width: "450px", borderRadius: "20px", border: "none" }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: "3rem", marginBottom: "6px", lineHeight: 1 }}>🏫</div>
          <h2 style={{ fontWeight: "700", color: "#1f2937" }}>ERP Student Management</h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Sign in to your account</p>
        </div>

        <div className="d-flex mb-4" style={{ gap: "8px" }}>
          <button className={`btn flex-fill ${tab === "admin" ? "btn-primary" : "btn-light"}`}
            style={{ borderRadius: "10px", fontWeight: tab === "admin" ? "600" : "400" }}
            onClick={() => setTab("admin")}>Admin</button>
          <button className={`btn flex-fill ${tab === "staff" ? "btn-primary" : "btn-light"}`}
            style={{ borderRadius: "10px", fontWeight: tab === "staff" ? "600" : "400" }}
            onClick={() => setTab("staff")}>Staff</button>
          <button className={`btn flex-fill ${tab === "student" ? "btn-primary" : "btn-light"}`}
            style={{ borderRadius: "10px", fontWeight: tab === "student" ? "600" : "400" }}
            onClick={() => setTab("student")}>Student</button>
        </div>

        {tab !== "student" ? (
          <form onSubmit={handleAdminStaffLogin}>
            <div className="mb-3">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#4b5563", marginBottom: "4px", display: "block" }}>Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)} required style={{ padding: "12px 16px" }} />
            </div>
            <div className="mb-4">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#4b5563", marginBottom: "4px", display: "block" }}>Password</label>
              <input type="password" className="form-control" placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)} required style={{ padding: "12px 16px" }} />
            </div>
            <button type="submit" className="btn btn-primary w-100" style={{ padding: "12px", fontWeight: "600", borderRadius: "10px" }}>Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleStudentLogin}>
            <div className="mb-3">
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#4b5563", marginBottom: "4px", display: "block" }}>Register Number</label>
              <input type="text" className="form-control" placeholder="Enter your register number" value={rollNo}
                onChange={(e) => setRollNo(e.target.value)} required style={{ padding: "12px 16px" }} />
            </div>
            <button type="submit" className="btn btn-success w-100" style={{ padding: "12px", fontWeight: "600", borderRadius: "10px" }}>Sign In</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
