import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { Country, State, City }  from 'country-state-city';
import { WeatherService } from 'src/app/services/weather.service';


interface CalendarItem {
  day: string;
  dayName: string;
  month: string;
  className: string;
  isWeekend: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  date = moment();
  calendar: Array<CalendarItem[]> = [];
  outday: boolean = false;
  modalRef: BsModalRef | undefined;
  cities: any;
  colors: any = [{name: 'purple'}, {name: 'pink'}, {name: 'lightblue'}, {name: 'green'}]
  example: any;
  reminder: any;
  reminderText: string = ''
  cityReminder: string = ''
  day: any;
  colorReminder: string = '';
  reminders = new Map();
  cityWeather: any;
  weatherCondition: any;
  weatherBoolean: boolean = false;

  constructor(
    private modalService: BsModalService,
    private weatherService: WeatherService,
  ) { }

  ngOnInit(): void {
    this.calendar = this.createCalendar(this.date);
  }

  createCalendar(month: moment.Moment) {
    let daysInMonth = month.daysInMonth();
    let startOfMonth = month.startOf('months').format('ddd');
    let endOfMonth = month.endOf('months').format('ddd');
    let weekdaysShort = moment.weekdaysShort();
    let calendar: CalendarItem[] = [];

    let daysBefore = weekdaysShort.indexOf(startOfMonth);
    let daysAfter = weekdaysShort.length - 1 - weekdaysShort.indexOf(endOfMonth);

    let clone = month.startOf('months').clone();
    if (daysBefore > 0) {
      clone.subtract(daysBefore, 'days');
    }

    for (let i = 0; i < daysBefore; i++) {
      calendar.push(this.createCalendarItem(clone, 'previous-month'));
      clone.add(1, 'days');
    }

    for (let i = 0; i < daysInMonth; i++) {
      calendar.push(this.createCalendarItem(clone, 'in-month'));
      clone.add(1, 'days');
      this.outday = true;
    }

    for (let i = 0; i < daysAfter; i++) {
      calendar.push(this.createCalendarItem(clone, 'next-month'));
      clone.add(1, 'days');
      this.outday = true;
    }


    return calendar.reduce((pre: Array<CalendarItem[]>, curr: CalendarItem) => {
      if (pre[pre.length - 1].length < weekdaysShort.length) {
        pre[pre.length - 1].push(curr);
      } else {
        pre.push([curr]);
      }
      return pre;
    }, [[]]);
  }

  createCalendarItem(data: moment.Moment, className: string) {
    const dayName = data.format('dddd');
    return {
      day: data.format('DD'),
      dayName,
      month: data.format('MM'),
      className,
      isWeekend: dayName === 'Sunday' || dayName === 'Saturday',
    };
  }

  nextmonth() {
    this.date.add(1,'M');
    this.calendar = this.createCalendar(this.date);
  }

  previousmonth() {
    this.date.subtract(1,'M');
    this.calendar = this.createCalendar(this.date);
  }

  openModal(template: TemplateRef<any>, calendar: CalendarItem) {
    this.searchCities();
    this.day = calendar;
    this.modalRef = this.modalService.show(template);
  }

  searchCities() {
    // Uncomment the following line to get all the cities of the world
    // this.cities = City.getAllCities();
    this.cities = [
    {name: 'Andorra la Vella', latitude: '42.50779000', longitude: '1.52109000'},
    {name: 'Arinsal', latitude: '42.57205000', longitude: '1.48453000'},
    {name: 'Canillo', latitude: '42.56760000', longitude: '1.59756000'},
    {name: 'Bezouce', latitude: '43.88229000', longitude: '4.49072000'},
    {name: 'El Palmito', latitude: '19.91733000', longitude: '-99.68127000'}
    ]
  }

  closeModal() {
    this.modalService.hide();
  }

  addReminder() {
    let key = this.day.day.concat('',this.day.month);
    this.reminder = {day: this.day.day, text: this.reminderText, month: this.day.month, color: this.colorReminder, city: this.cityReminder}
    this.reminders.set(key,this.reminder)
    this.modalService.hide();
  }

  removeReminder() {
    let key = this.day.day.concat('',this.day.month);
    this.reminders.delete(key);
    this.modalService.hide();
  }

  checkWeather() {
    let lat;
    let lon;
    for (let i=0; i<this.cities.length; i++) {
      if (this.cities[i].name === this.cityReminder) {
        lat = this.cities[i].latitude;
        lon = this.cities[i].longitude;
        this.getWeather(lat, lon)
      }
    }
  }

  getWeather(lat: string, lon: string){
    this.weatherService.getWeather(lat, lon)
      .subscribe((res: any) => {
        this.weatherBoolean = true;
        this.weatherCondition = res.current.weather[0].main;
        this.cityWeather = res;
      }, err => console.error(err));
  }

  searchReminder(day: any, month:any) {
    let key = day.concat('',month);
    if (this.reminders.get(key) === undefined) {
      return false;
    }
    if (this.reminders.get(key) !== null) {
      this.searchCityUbication(key);
      return true
  } else {
      return false;
  }
  }

  searchCityUbication(key: any) {
    let city = this.reminders.get(key).city
  }
}