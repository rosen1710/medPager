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
    <div>
      <Form method="POST">
        <div>
          <h1 className="homepage">MedPager</h1>
          <input type="text" name="username" />
          <input type={visible ? "text" : "password"} name="password" />
          <button onClick={() => setVisibility(!visible)}>see</button>
        </div>
        <button>Log In</button>
      </Form>
    </div>
  );
}
