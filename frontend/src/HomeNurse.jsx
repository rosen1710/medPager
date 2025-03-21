import axios from 'axios';

export async function clientLoader() {
    const codes = await axios.get(`http://192.168.5.86:5000/emergencies`);
    return codes;
}

export async function clientAction() {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const result = await axios.post(`http://192.168.5.86:5000/prompt`, body);
}

export default function HomeNurse({ loaderData }) {
    const codes = loaderData.data;

    return(
        <div>
            <div>
                <select name="code">
                    {Object.keys(codes).map(code =>         
                        <option value={code}>{code}</option>
                    )}
                </select>
                <button>Page</button>
            </div>
            <div>
                <label>
                    <p>Room:</p>
                    <input type="number" name="room_number"/>
                </label>
                <label>
                    <p>ICD-10 Code: </p>
                    <input type="text" name="icd_code"/>
                </label>
                <label>
                    <p>Description: </p>
                    <input type="text" name="description"/>
                </label>
                <button>Page</button>
            </div>
        </div>
    )
}