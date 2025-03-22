import { useState, useEffect } from "react";
import axios from "axios";
import Keycloak from "keycloak-js";

let kcOptions = {
  url: "http://localhost:8080",
  realm: "medpager",
  clientId: "frontend",
};

let kc = new Keycloak(kcOptions);

await kc.init({
  onLoad: "login-required", // Supported values: 'check-sso' (default), 'login-required'
});

export async function clientLoader() {
  try {
    const codes = await axios.get(`http://localhost:5000/emergencies`);
    return codes.data;
  }
  catch(error) {
    // console.error(error);
    return {"No connection": "backend server is unreachable"};
  }
}

export default function HomeNurse({ loaderData }) {
  const codes = loaderData;

  const [description, setDescription] = useState();
  const [roomNumber, setRoomNumber] = useState();
  const [department, setDepartment] = useState();
  const [icdCode, setIcdCode] = useState();
  const [emergencyCode, setEmergencyCode] = useState("Black");

  useEffect(() => {
    const intervalId = setInterval(() => {
      context.kc.updateToken(60); // update the token if it expires in the next 60 seconds
    }, 30000); // check once at every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  async function sendPrompt() {
    const result = await axios.post(`http://localhost:5000/prompt`,
      {
        "token": kc.token,
        "symptoms": description
      }
    );
    // console.log(result.data);
    setIcdCode(result.data.code);
    setDepartment(result.data.department);
  }

  async function submitPage() {
    const result = await axios.post(`http://localhost:5000/create_page`,
      {
        "token": kc.token,
        "symptoms": description,
        "department": department,
        "icd_code": icdCode,
        "room_number": Number(roomNumber)
      }
    );
    // console.log(result.data);
    alert("Successfully submitted message!");
  }

  async function submitEmergency() {
    const result = await axios.post(`http://localhost:5000/create_page`,
      {
        "token": kc.token,
        "icd_code": emergencyCode
      }
    );
    // console.log(result.data);
    alert("Successfully submitted message!");
  }

  return (
    <div>
      <button onClick={kc.logout}>Logout</button>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <select name="code" onChange={(e) => setEmergencyCode(e.target.value)} value={emergencyCode}>
          {Object.keys(codes).map((code) => (
            <option value={code}>{code} - {codes[code]}</option>
          ))}
        </select>
        <button onClick={submitEmergency}>Send emergency code</button>
      </div>
      <div>
        <label>
          <p>Description:</p>
          <textarea name="description" onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button onClick={sendPrompt}>Get code</button>
        <label>
          <p>ICD-10 Code:</p>
          <input type="text" name="icd_code" onChange={(e) => setIcdCode(e.target.value)} value={icdCode} />
        </label>
        <label>
          <p>Department</p>
          <input type="text" name="department" onChange={(e) => setDepartment(e.target.value)} value={department} />
        </label>
        <label>
          <p>Room:</p>
          <input type="number" name="room_number" onChange={(e) => setRoomNumber(e.target.value)} />
        </label>
        <button onClick={submitPage}>Submit</button>
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
