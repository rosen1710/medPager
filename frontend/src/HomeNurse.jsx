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
  } catch (error) {
    console.error(error);
    return { "No connection": "backend server is unreachable" };
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
      kc.updateToken(60); // update the token if it expires in the next 60 seconds
    }, 30000); // check once at every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  async function sendPrompt() {
    const result = await axios.post(`http://localhost:5000/prompt`, {
      token: kc.token,
      symptoms: description,
    });
    // console.log(result.data);
    setIcdCode(result.data.code);
    setDepartment(result.data.department);
  }

  async function submitPage() {
    const result = await axios.post(`http://localhost:5000/create_page`, {
      token: kc.token,
      symptoms: description,
      department: department,
      icd_code: icdCode,
      room_number: Number(roomNumber),
    });
    // console.log(result.data);
    alert("Successfully submitted message!");
  }

  async function submitEmergency() {
    const result = await axios.post(`http://localhost:5000/create_page`, {
      token: kc.token,
      icd_code: emergencyCode,
    });
    // console.log(result.data);
    alert("Successfully submitted message!");
  }

  return (
    <div>
      <button onClick={kc.logout} className="button bg-red-500">
        Logout
      </button>
      <br></br>
      <br></br>
      <br></br>
      <div className="emergency">
        <select
          name="code"
          onChange={(e) => setEmergencyCode(e.target.value)}
          value={emergencyCode}
          className="select"
        >
          {Object.keys(codes).map((code) => (
            <option value={code}>
              {code} - {codes[code]}
            </option>
          ))}
        </select>
        <button onClick={submitEmergency} className="button">
          Send emergency code
        </button>
      </div>
      <div className="emergency">
        <label>
          <p>Description:</p>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            className="textarea"
          />
        </label>
        <button onClick={sendPrompt} className="button">
          Get code
        </button>
        <label>
          <p>ICD-10 Code:</p>
          <input
            type="text"
            name="icd_code"
            onChange={(e) => setIcdCode(e.target.value)}
            value={icdCode}
            className="input"
          />
        </label>
        <label>
          <p>Department</p>
          <input
            type="text"
            name="department"
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            className="input"
          />
        </label>
        <label>
          <p>Room:</p>
          <input
            type="number"
            name="room_number"
            onChange={(e) => setRoomNumber(e.target.value)}
            className="input"
          />
        </label>
        <button onClick={submitPage} className="button">
          Submit
        </button>
      </div>
    </div>
  );
}
