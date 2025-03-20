import axios from "axios";

export async function clientLoader() {
    //const page = await axios.get(`http://localhost:2999/pages`);
}

export default function HomeDoctor({ loaderData }) {
    const { pages } = loaderData;

    return (
        <div>
            <div>
                //toggle switch
            </div>
            <ul>
                {pages.map(page => 
                //TODO: VARIABLES NAMES MATCH
                    <li>
                        <p>Room: ${page.room_number}, ${page.icd_code}</p>
                        <p>${page.description}</p>
                        <button>delete</button>
                    </li>
                )}
            </ul>
        </div>
    )
}