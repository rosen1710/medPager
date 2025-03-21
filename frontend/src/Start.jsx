import axios from "axios";
import { useState } from "react";
import { Form } from "react-router";
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

export async function clientAction({ request }) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const result = await axios.post("endpoint", body);
}

export default function Start() {
  const [visible, setVisibility] = useState(false);

  return (
    <div style={styles.container}>
      <Form method="POST">
        <div style={styles.content}>
          <h1 style={styles.title}>MedPager</h1>
          <p style={styles.description}>
            medPager е проект, който цели да улесни комуникацията между всички
            медицински лица в една болница. Представлява иновативна система,
            която използва изкуствен интелект, на който медицинската сестра
            изпраща описание на симптомите на даден пациент и след това
            системата изпраща известие за него само на лекарите, които са
            специалисти в съответната област на медицината. Всяко съобщение
            съдържа номера на стаята, където е пациента и код на проблема по
            ICD-10 класификацията. Тези съобщения ще пристигат само на
            пейджърите на лекарите, които са специалисти по дадената
            специалност.
          </p>
          <div style={styles.imageContainer}>
            <img
              src="/signal-2025-03-21-193104_002.jpeg"
              alt="Image 1"
              style={styles.image}
            />
            <img
              src="/signal-2025-03-21-193104.jpeg"
              alt="Image 2"
              style={styles.image}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f8f9fa",
  },
  content: {
    maxWidth: "900px",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#333",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  image: {
    width: "45vw",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
};
