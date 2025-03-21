import axios from "axios";
import { useState } from "react";

export async function clientLoader({ params }) {
  const { data: page } = await axios.get(
    `http://localhost:5000//get_page_by_doc/${params.id}`
  );
  console.log("pages", page);
  console.log([page, ...params.id]);
  return { ...page, ...params.id };
}

const Availability = async (available, id) => {
  if (available) {
    const result = await axios.post(`http://localhost:5000/available/${id}`);
  } else {
    const result = await axios.post(`http://localhost:5000/unavailable/${id}`);
  }
};

export default function HomeDoctor({ loaderData }) {
  console.log(loaderData);
  const { pages, id } = loaderData;
  console.log("pages", pages);
  console.log("id", id);

  const [available, setAvailable] = useState(false);
  const handleAvailableChange = () => {
    setAvailable(!available);
    Availability(available, id);
  };

  return (
    <div>
      <div className="toggle">
        <p>Availability: </p>
        <label className="flex cursor-pointer select-none items-center">
          <div className="relative">
            <input
              type="checkbox"
              checked={available}
              onChange={handleAvailableChange}
              className="sr-only"
            />
            <div
              className={`box block h-8 w-14 rounded-full ${
                available ? "bg-primary" : "bg-dark"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                available ? "translate-x-full" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>
      <ul>
        {pages.map((page) => (
          <li className="doctors-page">
            <p className="page-details">
              Room: {page.room_number}, {page.icd_code}
            </p>
            <button className="delete-button">delete</button>
            <p className="page-desc">{page.symptoms}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
