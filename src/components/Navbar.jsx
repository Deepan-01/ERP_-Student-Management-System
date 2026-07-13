import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-primary shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
      <Link to={user?.role === "admin" ? "/dashboard" : "/staff"} className="navbar-brand fw-bold mb-0" style={{ fontSize: "1.2rem" }}>ERP Student Management</Link>
      <div className="d-flex align-items-center gap-3">
        <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>{user?.name || user?.rollNo}</span>
        <button className="btn btn-outline-light btn-sm px-3" style={{ borderRadius: "8px" }} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
