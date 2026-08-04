import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    totalResults: 0,
    totalPassed: 0,
    totalFailed: 0,
    passPercentage: 0,
  });

  const [deptStats, setDeptStats] = useState({
    cse: 0,
    it: 0,
    csbs: 0,
    aiml: 0,
  });

  const [resultStats, setResultStats] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [semesterStats, setSemesterStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", category: "Event", department: "", location: "" });

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDepartmentStats = async () => {
    try {
      const res = await api.get("/dashboard/departments");

      const data = {
        cse: 0,
        it: 0,
        csbs: 0,
        aiml: 0,
      };

      res.data.forEach((item) => {
        if (item._id === "CSE") data.cse = item.count;
        if (item._id === "IT") data.it = item.count;
        if (item._id === "CSBS") data.csbs = item.count;
        if (item._id === "CSE(AIML)") data.aiml = item.count;
      });

      setDeptStats(data);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchResultStats = async () => {
    try {
      const res = await api.get("/dashboard/result-stats");
      setResultStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSemesterStats = async () => {
    try {
      const res = await api.get("/dashboard/semester-stats");
      setSemesterStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchToppers = async () => {
    try {
      const res = await api.get("/dashboard/toppers");
      setToppers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEvents = async () => {
    try { const res = await api.get("/events/upcoming?category=Event"); setEvents(res.data); }
    catch (err) { console.log(err); }
  };

  const fetchActivities = async () => {
    try { const res = await api.get("/events/upcoming?category=Activity"); setActivities(res.data); }
    catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchStats();
    fetchDepartmentStats();
    fetchResultStats();
    fetchSemesterStats();
    fetchToppers();
    fetchEvents();
    fetchActivities();
  }, []);

  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", eventForm);
      alert(`${eventForm.category} Added Successfully`);
      setEventForm({ title: "", description: "", date: "", category: "Event", department: "", location: "" });
      if (eventForm.category === "Event") fetchEvents(); else fetchActivities();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to Add");
    }
  };

  const deleteEvent = async (id, category) => {
    try {
      await api.delete(`/events/${id}`);
      if (category === "Event") fetchEvents(); else fetchActivities();
    } catch (err) {
      console.log(err);
    }
  };

  const departmentChartData = [
    {
      department: "CSE",
      students: deptStats.cse,
    },
    {
      department: "IT",
      students: deptStats.it,
    },
    {
      department: "CSBS",
      students: deptStats.csbs,
    },
    {
      department: "AIML",
      students: deptStats.aiml,
    },
  ];

  const passFailData = [
    {
      name: "Passed",
      value: stats.totalPassed,
    },
    {
      name: "Failed",
      value: stats.totalFailed,
    },
  ];

  const COLORS = ["#28a745", "#dc3545"];

  return (
    <div className="dashboard-container">

      <h1 className="text-center fw-bold mb-5">
        ERP Student Management System
      </h1>

      <div className="text-center mb-5">

        <Link
          to="/students"
          className="btn btn-primary me-3"
        >
          Students
        </Link>

        <Link
          to="/attendance"
          className="btn btn-success me-3"
        >
          Attendance
        </Link>

        <Link
          to="/results"
          className="btn btn-warning"
        >
          Results
        </Link>

        <Link
          to="/leave-management"
          className="btn btn-info text-white"
        >
          Leave
        </Link>

      </div>

      <div className="row g-4">

        <div className="col-lg-3 col-md-6">
          <div className="card shadow text-center p-4">
            <h4>Total Students</h4>
            <h2>{stats.totalStudents}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card bg-success text-white shadow text-center p-4">
            <h4>Total Attendance</h4>
            <h2>{stats.totalAttendance}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card bg-warning shadow text-center p-4">
            <h4>Total Results</h4>
            <h2>{stats.totalResults}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card bg-info text-white shadow text-center p-4">
            <h4>Pass %</h4>
            <h2>{stats.passPercentage}%</h2>
          </div>
        </div>

      </div>
            {/* Department Wise Students */}

      <h2 className="text-center mt-5 mb-4">
        Department Wise Students
      </h2>

      <div className="row g-4">

        <div className="col-lg-3 col-md-6">
          <div className="card bg-primary text-white shadow text-center p-4">
            <h4>CSE</h4>
            <h2>{deptStats.cse}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card bg-secondary text-white shadow text-center p-4">
            <h4>CSE(AIML)</h4>
            <h2>{deptStats.aiml}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card bg-dark text-white shadow text-center p-4">
            <h4>CSBS</h4>
            <h2>{deptStats.csbs}</h2>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card bg-success text-white shadow text-center p-4">
            <h4>IT</h4>
            <h2>{deptStats.it}</h2>
          </div>
        </div>

      </div>

      {/* Result Statistics */}

      <h2 className="text-center mt-5 mb-4">
        Result Statistics
      </h2>

      <div className="row g-4">

        <div className="col-lg-4">
          <div className="card shadow text-center p-4">
            <h4>Total Passed</h4>
            <h2>{stats.totalPassed}</h2>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow text-center p-4">
            <h4>Total Failed</h4>
            <h2>{stats.totalFailed}</h2>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow text-center p-4">
            <h4>Pass Percentage</h4>
            <h2>{stats.passPercentage}%</h2>
          </div>
        </div>

      </div>

      {/* Department Result */}

      <h2 className="text-center mt-5">
        Department Wise Results
      </h2>

      <div className="table-responsive mt-3">

        <table className="table table-bordered table-striped">

          <thead className="table-dark">

            <tr>
              <th>Department</th>
              <th>Total Students</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Pass %</th>
            </tr>

          </thead>

          <tbody>

            {resultStats.map((item) => (

              <tr key={item._id}>

                <td>{item._id}</td>

                <td>{item.totalStudents}</td>

                <td>

                  <span className="badge bg-success">
                    {item.passed}
                  </span>

                </td>

                <td>

                  <span className="badge bg-danger">
                    {item.failed}
                  </span>

                </td>

                <td>

                  <span className="badge bg-primary">
                    {item.passPercentage}%
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Department Toppers */}

      <h2 className="text-center mt-5">
        Department Wise Toppers
      </h2>

      <div className="table-responsive mt-3">

        <table className="table table-bordered table-hover">

          <thead className="table-dark">

            <tr>
              <th>Department</th>
              <th>Topper Name</th>
              <th>Roll No</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>

          </thead>

          <tbody>

            {toppers.map((item) => (

              <tr key={item._id}>

                <td>{item._id}</td>

                <td>{item.topperName}</td>

                <td>{item.rollNo}</td>

                <td>{item.percentage}%</td>

                <td>{item.grade}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Semester Report */}

      <h2 className="text-center mt-5">
        Semester Wise Report
      </h2>

      <div className="table-responsive mt-3">

        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>

              <th>Semester</th>

              <th>Total Students</th>

              <th>Passed</th>

              <th>Failed</th>

            </tr>

          </thead>

          <tbody>

            {semesterStats.map((item) => (

              <tr key={item._id}>

                <td>Semester {item._id}</td>

                <td>{item.totalStudents}</td>

                <td>{item.passed}</td>

                <td>{item.failed}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* Department Chart */}

      <h2 className="text-center mt-5 mb-4">
        Department Wise Students Chart
      </h2>

      <div
        className="card shadow p-4 mb-5"
        style={{ height: "450px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentChartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="department" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="students"
              fill="#0d6efd"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pass Fail Chart */}

      <h2 className="text-center mt-5 mb-4">
        Pass vs Fail
      </h2>

      <div
        className="card shadow p-4 mb-5"
        style={{ height: "450px" }}
      >
        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={passFailData}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              label
            >

              {passFailData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>
      </div>

      {/* Add Event / Activity */}
      <div className="card shadow p-4 mt-5">
        <h3 className="mb-3">Add Event / Activity</h3>
        <form onSubmit={addEvent} className="row g-2">
          <div className="col-md-4">
            <input type="text" name="title" placeholder="Title" className="form-control" value={eventForm.title} onChange={handleEventChange} required />
          </div>
          <div className="col-md-3">
            <input type="date" name="date" className="form-control" value={eventForm.date} onChange={handleEventChange} required />
          </div>
          <div className="col-md-2">
            <select name="category" className="form-control" value={eventForm.category} onChange={handleEventChange}>
              <option value="Event">Event</option>
              <option value="Activity">Activity</option>
            </select>
          </div>
          {eventForm.category === "Event" && (
            <div className="col-md-3">
              <input type="text" name="location" placeholder="Location" className="form-control" value={eventForm.location} onChange={handleEventChange} />
            </div>
          )}
          {eventForm.category === "Event" && (
            <div className="col-md-3">
              <input type="text" name="department" placeholder="Department" className="form-control" value={eventForm.department} onChange={handleEventChange} />
            </div>
          )}
          <div className="col-md-12">
            <input type="text" name="description" placeholder="Description (optional)" className="form-control" value={eventForm.description} onChange={handleEventChange} />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>

      {/* Upcoming Events & Activities */}
      <div className="row mt-4 g-4">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="mb-3">Upcoming Events</h3>
            {events.length > 0 ? (
              <ul className="list-group">
                {events.map((ev) => (
                  <li key={ev._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{ev.title}</strong>
                      <br />
                      <small className="text-muted">{new Date(ev.date).toLocaleDateString()}{ev.location ? ` - ${ev.location}` : ""}{ev.department ? ` (${ev.department})` : ""}</small>
                      {ev.description && <p className="mb-0 mt-1"><small>{ev.description}</small></p>}
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteEvent(ev._id, "Event")}>&times;</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No upcoming events</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="mb-3">Upcoming Activities</h3>
            {activities.length > 0 ? (
              <ul className="list-group">
                {activities.map((act) => (
                  <li key={act._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{act.title}</strong>
                      <br />
                      <small className="text-muted">{new Date(act.date).toLocaleDateString()}</small>
                      {act.description && <p className="mb-0 mt-1"><small>{act.description}</small></p>}
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteEvent(act._id, "Activity")}>&times;</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No upcoming activities</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="text-center mt-5 mb-4">

        <hr />

        <h5 className="text-secondary">
          ERP Student Management System
        </h5>

        <p className="text-muted">
          Final Year Project Dashboard
        </p>

      </div>

    </div>

  );

}

export default Dashboard;