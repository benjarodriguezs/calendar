import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../etc/AppSettings';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  key: string = APP_SETTINGS.key;
  urlAPI: string = APP_SETTINGS.url;

  constructor(
    private http: HttpClient,
  ) { }

  getWeather(city: any) {
    let url = `${this.urlAPI}weather?q=${city}&units=metric&appid=${this.key}`
    return this.http.get<any>(url)
  }
}
