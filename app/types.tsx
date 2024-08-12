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
  
export interface Alert {}

export interface Station {}

export interface Forecast {
    resolvedAddress: string;
    timezone: string;
    latitude: number;
    longitude: number;
    alerts: Alert[];
    description: string;
    stations: Station[];
}
  