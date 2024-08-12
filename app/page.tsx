"use client"; 
import { useEffect, useState } from "react"
import { Forecast, Day, Alert, Station } from "./types";

export default function Home() {
  const [forecast, setForecast] = useState<Forecast>();
  const [currentForecast, setCurrentForecast] = useState<Day>();
  const [days, setDays] = useState<Day[]>([]);
  const [currentDay, setCurrentDay] = useState<String>();

   useEffect(() => {
    const fetchData = async () => {
      try {
        fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Portland,OR?key=9TA4WZGMLKBDSN2HQZYCHAGJ3')
        .then(response => {
          if(!response.ok){
            throw new Error('Error fetching API request.')
          }
          return response.json();
        })
        .then(data => {
          if(data){
            setCurrentForecast(data.currentConditions);
            setDays(data.days);
            setForecast(data)
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
  
  
  useEffect(() => {
    setCurrentDay(getDayNameFromDate(''));
  }, [forecast]);
  
  return (
    <main className="main-container flex flex-col items-center justify-between p-4">
      <div className="p-4">
        <h1 className="font-bold text-lg capitalize text-center">Weather or not</h1>
        <h2 className="font-bold text-md text-center">Location: {forecast?.resolvedAddress}</h2>
      </div>
      <div className="h-96 grid grid-columns-5 sm:grid-flow-col sm:grid-flow-row
      gap-2 container">
        {/* Current Forecast */}
            {/* <div className="weather-container p-4">
                  <div className="title text-center uppercase font-bold my-4 my-px">
                    <div>{currentDay}</div>
                    <div className="italic text-sm capitalize">(Current)</div>
                  </div>
                  <div className="text-center italic font-bold text-sm">
                    <div>{currentForecast?.conditions}</div>
                    <div>Temp: {currentForecast?.temp}</div>
                    <div>Feels like: {currentForecast?.feelslike}</div>
                    <div>Dew point:{currentForecast?.dew}</div>
                  </div>
            </div> */}

          {/* Next 6 day Forecast */}
            {/* Next 6 day Forecast */}
            {days.slice(0,7).map((day, index) => (
            <div key={index} className="weather-container p-4">
              <div className="title text-center uppercase font-bold my-4 my-px">
                {getDayNameFromDate(day?.datetime)}
              </div>
              <div className="text-center text-sm">{day?.datetime}</div>
              <div className="text-center italic font-bold text-sm pt-4">
                <div className="pb-2">{day.conditions}</div>
                <img className={day?.icon + " weather-icon"}></img>
              </div>
              <div className="p-2 pt-6">
                <div>High: {day?.tempmin} F</div>
                <div>Low: {day?.tempmax} F</div>
                <div>Feels like: {day.feelslike} F</div>
                <div>Dew Point: {day.dew}</div>
              </div>
            </div>
          ))}
        </div>
    </main>
  );
}
