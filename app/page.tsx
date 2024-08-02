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

  function getCurrentDay () {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const dayIndex = today.getDay();
      return days[dayIndex]; // return the name of the current day
  }

  const getCurrentDayForOtherDays = (dateString: string | number | Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
    setCurrentDay(getCurrentDayForOtherDays(''));
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
            <div className="weather-container p-4">
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
            </div>

          {/* Next 6 day Forecast */}
          {days.slice(1,7).map((day, index) => (
            <div key={index} className="weather-container p-4">
              <div className="title text-center uppercase font-bold my-4 my-px">
                {getCurrentDayForOtherDays(day?.datetime)}
              </div>
              <div className="text-center italic font-bold text-sm">
                <div>{day.conditions}</div>
                <div>Temp: {day.temp}</div>
                <div>Feels like: {day.feelslike}</div>
                <div>Dew Point: {day.dew}</div>
              </div>
            </div>
          ))}
        </div>
    </main>
  );
}
