"use client"; 
import { SetStateAction, useEffect, useState } from "react"
import { Forecast, Day, Alerts, Stations } from "./types";
import MapComponent from "./components/MapComponent";

export default function Home() {
  const [forecast, setForecast] = useState<Forecast>();
  const [days, setDays] = useState<Day[]>([]);
  const [alerts, setAlerts] = useState<Alerts[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState<Stations[]>([]);
  const weatherDataApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

   useEffect(() => {
    const fetchData = async () => {
      console.log(weatherDataApiKey);

      try {
        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Portland,OR?key=${weatherDataApiKey}`)
        .then(response => {
          if(!response.ok){
            throw new Error('Error fetching API request.')
          }
          return response.json();
        })
        .then(data => {
          if(data){
            setDays(data.days);
            setForecast(data);
            setStations(data.stations);
            setAlerts(data.alerts);
            console.log('Data: ', data)
          }
        })
      } catch (e) {
        console.error('Error has occurred inside of fetchData:', e);
      }
    };

    fetchData();

  }, []);

  const getDayNameFromDate = (dateString: string | number | Date) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let today;
    if(dateString == '') {
      today = new Date();
    } else {
      today = new Date(dateString);
    }
    const dayIndex = today.getDay(); 
    return days[dayIndex]; 
  };

 const handleSearchInput = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    if (searchQuery.trim() !== '') {
      try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?key=${weatherDataApiKey}`);

        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        setDays(data.days);
        setForecast(data);
        setStations(data.stations);
        setAlerts(data.alerts);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchClick();
    }
  };
  

  return (
    <main className="main-container flex flex-col items-center justify-between p-4">
      <div className="p-4">
        <h1 className="font-bold text-lg capitalize text-center">Weather or not</h1>
        <h2 className="font-bold text-md text-center">Location: {forecast?.resolvedAddress}</h2>

        {/* Search bar */}
        <div className="search-container flex">
          <input className="search-bar" 
            type="search" 
            placeholder="Search for location..." 
            value={searchQuery} 
            onChange={handleSearchInput}
            onKeyDown={handleKeyDown} />
          <button 
            className="search-button" 
            onClick={handleSearchClick}>Search</button>      
          </div>
        </div>

      {/* Adding Weather Alerts */}
        {alerts.map((alert, index) => (
          <div key={index} className="alert-container container mx-auto m-auto p-2">
              <div className="flex justify-center">
                <div className="alert-icon"></div>
                <div className="my-auto">{alert.headline}</div>
              </div>
          </div>
        ))}
      <div className="h-96 grid grid-columns-5 sm:grid-flow-col sm:grid-flow-row gap-2 container">
        {/* Next 7 day Forecast */}
        {days.slice(0,7).map((day, index) => (
          <div key={index} className="weather-container p-4">
            <div className="title text-center uppercase font-bold my-4 my-px">
              {getDayNameFromDate(day?.datetime)}
            </div>
            <div className="text-center text-sm">{day?.datetime}</div>
            <div className="text-center italic font-bold text-sm pt-4">
              <div className="pb-2">{day.conditions}</div>
              <div className={day?.icon + " weather-icon"}></div>
            </div>
            {/* Temp info */}
            <div className="pt-4 pb-4">
              <div className="uppercase font-bold text-center">Temperature</div>
              <div className="pt-2">
                <div>High: {day?.tempmin} F</div>
                <div>Low: {day?.tempmax} F</div>
                <div>Feels like: {day.feelslike} F</div>
                <div>Dew Point: {day.dew}</div>
                <div>Wind Gust: {day.windgust}</div>
                <div>Snow: {day.snow}%</div>
              </div>
            </div>
            
            {/* Sun info */}
            <div className="pt-4 pb-4">
              <div className="uppercase font-bold text-center">Sun info</div>
              <div className="pt-2">
                <div>Sunrise: {day.sunrise}</div>
                <div>Sunset: {day.sunset}</div>              
                <div>UV Index: {day.uvindex}</div>
              </div>
            </div>

            {/* Moon Cycle Info */}
            <div className="pt-4 pb-4">
              <div className="uppercase font-bold text-center">Moon Cycle</div>
                <div>
                  <div>Moon phase: {day.moonphase}</div>
                  <div>Visibility: {day.visability}</div>              
                  <div>UV Index: {day.uvindex}</div>
                </div>
              </div>
            </div>
        ))}
      </div>

      {/* <MapComponent stations={stations}/> */}
    </main>
  );
}
