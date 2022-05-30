import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient,
  ) { }

  getWeather(lat: any, lon: any) {
    let key = 'a332cb01f520e8569dca055037d9ecff';
    // let url2 = https://api.openweathermap.org/data/2.5/onecall?lat=42.56760000&lon=1.59756000&appid=a332cb01f520e8569dca055037d9ecff
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`
    return this.http.get<any>(url)
  }
}
