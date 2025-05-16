import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [weather, setWeather] = useState({});
  const [zipcode, setZipcode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [units, setUnits] = useState('imperial');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchData = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${API_KEY}&units=${units}`;
    let response = await fetch(url);
    let data = await response.json();
    setWeather(data);
    console.log(data);

    await fetch('http://localhost:5000/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zip: zipcode,
        city: data.name,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
      }),
    });

    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      fetchData();
    }
  }, [units]);

  const handleZipCodeChange = (event) => {
    setZipcode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleUnitChange = (event) => {
    setUnits(event.target.value);
  };

  return (
    <div className='App'>
      <div className='Input'>
        <input
          type='text'
          value={zipcode}
          onChange={handleZipCodeChange}
          placeholder='zipcode'
        />
        <button type='submit' onClick={handleSubmit}>
          Submit
        </button>

        {/*Choose units*/}
        <select value={units} onChange={handleUnitChange}>
          <option value='imperial'>Fahrenheit (°F)</option>
          <option value='metric'>Celsius (°C)</option>
        </select>
      </div>

      {submitted && (
        <div className='Display'>
          <table>
            <thead>
              <tr>
                <th>Zip Code</th>
                <th>City Name</th>
                <th>Weather</th>
                <th>Temperature</th>
                <th>Feels Like</th>
                <th>Humidity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{zipcode}</td>
                <td>{weather.name || ''}</td>
                <td>
                  {weather.weather ? weather.weather[0].main : ''}
                  {weather.weather && (
                    <img
                      className='weather-icon'
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      title={weather.weather[0].description}
                    />
                  )}
                </td>
                <td>
                  {weather.main.temp} {units === 'imperial' ? '°F' : '°C'}
                </td>
                <td>
                  {weather.main.feels_like} {units === 'imperial' ? '°F' : '°C'}
                </td>
                <td>{weather.main.humidity}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
