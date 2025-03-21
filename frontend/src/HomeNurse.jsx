import axios from "axios";
import { useState } from "react";

export async function clientLoader() {
  const codes = await axios.get(`http://localhost:5000/emergencies`);
  return codes;
}

export async function clientAction({ request }) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  await axios.post(`http://localhost:5000/prompt`, body);
}

export default function HomeNurse({ loaderData }) {
  const codes = loaderData.data;
  const [formData, setFormData] = useState({
    room_number: "",
    icd_code: "",
    description: "",
    code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nurse Emergency Paging</h1>

      {/* Code Selector */}
      <div style={styles.section}>
        <label style={styles.label}>Select Emergency Code:</label>
        <select
          name="code"
          value={formData.code}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Code</option>
          {Object.keys(codes).map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {/* Form Inputs */}
      <div style={styles.section}>
        <label style={styles.label}>Room Number:</label>
        <input
          type="number"
          name="room_number"
          value={formData.room_number}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>ICD-10 Code:</label>
        <input
          type="text"
          name="icd_code"
          value={formData.icd_code}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
        />
      </div>

      {/* Submit Button */}
      <button style={styles.button}>Page</button>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    maxWidth: "500px",
    margin: "50px auto",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  section: {
    width: "100%",
    marginBottom: "15px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "80px",
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
