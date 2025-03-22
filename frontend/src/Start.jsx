import axios from "axios";
import { useState } from "react";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const result = await axios.post("endpoint", body);
}

export default function Start() {
  const [visible, setVisibility] = useState(false);

  return (
    <div style={styles.container}>
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
        <a href="/nurse">Open messages portal</a>
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
    </div>
  );
}