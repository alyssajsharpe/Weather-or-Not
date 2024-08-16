export interface Day {
    datetime: string;
    conditions: string;
    temp: number;
    feelslike: number;
    tempmax: number;
    feelslikemax: number;
    tempmin: number;
    feelslikemin: number;
    uvindex: number;
    visability: number;
    windgust: number;
    dew: number;
    sunrise: string;
    sunset: string;
    snow: number;
    moonphase: number;
    icon: string;
  }
  
export interface Alerts {
  description: string;
  ends: string;
  event: string;
  headline: string;
  onset: string;
}

export interface Stations {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  distance: number;
}

export interface Forecast {
    resolvedAddress: string;
    timezone: string;
    latitude: number;
    longitude: number;
    alerts: Alerts[];
    description: string;
    stations: Stations[];
}
