import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient,
  ) { }

  getWeather(city: any) {
    let key = 'a332cb01f520e8569dca055037d9ecff';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
    return this.http.get<any>(url)
  }
}
