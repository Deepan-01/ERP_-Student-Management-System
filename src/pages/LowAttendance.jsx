import { useEffect, useState } from "react";
import api from "../services/api";

function LowAttendance() {
  const [students, setStudents] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get(
        "/attendance/low-attendance"
      );

      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Low Attendance Alert</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Attendance %</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {student.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LowAttendance;