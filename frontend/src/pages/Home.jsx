import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchPublicEvents = async () => {
    try {
      const res = await api.get("/events/upcoming?category=Event");
      setEvents(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchPublicActivities = async () => {
    try {
      const res = await api.get("/events/upcoming?category=Activity");
      setActivities(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchPublicEvents();
    fetchPublicActivities();
  }, []);

  return (
    <div>
      <div className="hero"
        style={{ backgroundImage: "url('https://kce.ac.in/images/kce/contact/admission-enquiries.png')" }}>
        <div className="overlay">
          <h1>ERP Student Management System</h1>
          <p>Manage Students, Attendance and Results through one integrated platform.</p>
          <Link to="/"><button className="enter-btn">Login</button></Link>
        </div>
      </div>

      <section className="features">
        <h2>ERP Modules</h2>
        <div className="card-container">
          <div className="feature-card"><h3>Student Management</h3><p>Add, View and Manage Students</p></div>
          <div className="feature-card"><h3>Attendance</h3><p>Track Student Attendance</p></div>
          <div className="feature-card"><h3>Results</h3><p>Manage Marks and Grades</p></div>
        </div>
      </section>

      <section className="features" style={{ background: "#f8f9fa" }}>
        <h2>Upcoming Events</h2>
        <div className="card-container">
          {events.length > 0 ? events.map((ev) => (
            <div key={ev._id} className="feature-card">
              <h3>{ev.title}</h3>
              <p><strong>{new Date(ev.date).toLocaleDateString()}</strong></p>
              {ev.location && <p>📍 {ev.location}</p>}
              {ev.description && <p>{ev.description}</p>}
              {ev.department && <p><small>{ev.department}</small></p>}
            </div>
          )) : <p>No upcoming events</p>}
        </div>
      </section>

      <section className="features">
        <h2>Upcoming Activities</h2>
        <div className="card-container">
          {activities.length > 0 ? activities.map((act) => (
            <div key={act._id} className="feature-card">
              <h3>{act.title}</h3>
              <p><strong>{new Date(act.date).toLocaleDateString()}</strong></p>
              {act.description && <p>{act.description}</p>}
            </div>
          )) : <p>No upcoming activities</p>}
        </div>
      </section>
    </div>
  );
}

export default Home;
