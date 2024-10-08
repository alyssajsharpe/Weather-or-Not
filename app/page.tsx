"use client"; 
import { SetStateAction, useEffect, useState } from "react"
import { Forecast, Day, Alerts, Stations } from "./types";
import dynamic from 'next/dynamic';


export default function Home() {
  const [forecast, setForecast] = useState<Forecast>();
  const [days, setDays] = useState<Day[]>([]);
  const [alerts, setAlerts] = useState<Alerts[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState<Stations[]>([]);

  const weatherDataApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  let map: google.maps.Map;

   useEffect(() => {
    const fetchData = async () => {
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
            initMap(data.stations, data.latitude, data.longitude);
          }
        })
      } catch (e) {
        console.error('Error has occurred inside of fetchData:', e);
      }
    };

    fetchData();
  }, []);

  async function initMap(stations : Stations[], locationLat :string, locationLong :string): Promise<void> {
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    var infoWindow = new google.maps.InfoWindow();
   
   
    // Create new map centered at main location area
    map = new Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 10,
        center: {lat: Number(locationLat), lng: Number(locationLong)},
        mapId: '3f8fe927d450854f',
      }
    );
    // Display stations as markers on map
    Object.entries(stations).map(([key, station], index)  => {
      const stationName = document.createElement('div');
      stationName.className = 'station-map-icon';
      stationName.textContent = station.name;

      const stationInfo = document.createElement('div');
      stationInfo.innerHTML = `Station name: ${station.name}` + '<br>' + `Latitude: ${station.latitude}` + '<br>' + `Longitude: ${station.longitude}`;      stationInfo.className = 'station-info';
 
      const marker = new AdvancedMarkerElement({
        map: map,
        position: {lat: station.latitude, lng: station.longitude},
        title: `${station.name}`,
        content: stationName,
      });


      marker.addListener('click', function() {
        infoWindow.setContent(stationInfo)
        infoWindow.open(map, marker);
      });
      
    });

  } 

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
        initMap(data.stations, data.latitude, data.longitude);

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
      <div className="h-96 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-7 place-items-stretch gap-2 container h-full">
        {/* Next 7 day Forecast */}
        {days.slice(0,7).map((day, index) => (
          <div key={index} className="weather-container dynamic-padding">
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
                <div>High: {day?.tempmax} F</div>
                <div>Low: {day?.tempmin} F</div>
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
      <div className="container pt-4">
          <div className="text-lg capitalize text-center pb-2">Weather Stations around {forecast?.resolvedAddress}</div>
          <div id="map" style={{ width: '100%', height: '500px' }}></div>
      </div>

      <div className="text-center footer-text">Weather or Not v1.0.1</div>
    </main>
  );
}
