import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [temperature, setTemperature] = useState({});
  const [zipcode, setZipcode] = useState("");

  const fetchData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=384530a26df84465ffe7e9419c8ef8db`;
    let response = await fetch(url);
    let data = await response.json();
    setTemperature(data);
    console.log(data);
  };

  const handleZipCodeChange = (event) => {
    setZipcode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="App">
      <div className="Input">
        <input
          type="text"
          value={zipcode}
          onChange={handleZipCodeChange}
          placeholder="zipcode"
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <div className="Display">
        <table>
          <thead>
            <tr>
              <th> Zip Code </th>
              <th>City Name</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{zipcode}</td>
              <td>{temperature.name}</td>
              <td>{temperature.main.temp}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
