import axios from "axios";
import { useState } from "react";

export async function clientLoader() {
    //const page = await axios.get(`http://localhost:2999/pages`);
}

export default function HomeDoctor({  }) {
    const pages = [
        {
            room_number: 202,
            icd_code: "S82.001A",
            description: "Fracture of patella, right knee, initial encounter"
        },
        {
            room_number: 137,
            icd_code: "S72.001A",
            description: "Fracture of unspecified part of neck of right femur, initial encounter"
        }
        ];

    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <div>
            <div>
                <p>Availability: </p>
                <label className='flex cursor-pointer select-none items-center'>
                    <div className='relative'>
                        <input
                        type='checkbox'
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className='sr-only'
                        />
                        <div
                        className={`box block h-8 w-14 rounded-full ${
                            isChecked ? 'bg-primary' : 'bg-dark'
                        }`}
                        ></div>
                        <div
                        className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                            isChecked ? 'translate-x-full' : ''
                        }`}
                        ></div>
                    </div>
                </label>
            </div>
            <ul>
                {pages.map((page) => 
                //TODO: VARIABLES NAMES MATCH
                    <li className="page">
                        <p className="page-details">Room: {page.room_number}, {page.icd_code}</p>
                        <p className="color: red">{page.description}</p>
                        <button className="delete-button">delete</button>
                    </li>
                )}
            </ul>
        </div>
    )
}