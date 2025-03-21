import axios from 'axios';

export async function clientLoader() {
    //const codes = await axios.get(`http://8888/emergencies`);
    //return codes;
}

export default function HomeNurse({ }) {
    const codes = {
        "Black": "someone is armed and a threat",
        "Blue": "life-threatening medical emergency",
        "Brown": "external emergency",
        "Gray": "unarmed but a threath",
        "MET": "close to code blue",
        "Orange": "evacuation",
        "Pink": "unexpected labor unexpectedly or a newborn medical emergency",
        "Purple": "bomb threat",
        "Red": "fire",
        "Yellow": "internal emergency"
    };

    return(
        <div>
            <div>
                <select name="code">
                    {Object.keys(codes).map(code => {
                        <option value={code}>{code}</option>
                    })}
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