import axios from 'axios';
import { useState } from 'react';

export async function clientAction({request}) {
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
                    <h1 className='homepage'>MedPager</h1>
                    <input type="text" name="username"/>
                    <input type={visible ? "text" : "password"} name="password"/>
                    <button onClick={() => setVisibility(!visible)}>see</button>
                </div>
                <button>Log In</button>
            </Form>
        </div>
    )
}