import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { Country, State, City }  from 'country-state-city';
import { WeatherService } from 'src/app/services/weather.service';
import { ICalendarItem } from 'src/app/interfaces/calendar'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  date = moment();
  calendar: Array<ICalendarItem[]> = [];
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
  weatherTemp: any;
  weatherBoolean: boolean = false;
  editBoolean: boolean = false;

  constructor(
    private modalService: BsModalService,
    private weatherService: WeatherService,
  ) { }

  ngOnInit(): void {
    this.calendar = this.createCalendar(this.date);
    this.searchCities();
  }

  createCalendar(month: moment.Moment) {
    let daysInMonth = month.daysInMonth();
    let startOfMonth = month.startOf('months').format('ddd');
    let endOfMonth = month.endOf('months').format('ddd');
    let weekdaysShort = moment.weekdaysShort();
    let calendar: ICalendarItem[] = [];
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


    return calendar.reduce((pre: Array<ICalendarItem[]>, curr: ICalendarItem) => {
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

  openModal(template: TemplateRef<any>, calendar: ICalendarItem) {
    this.day = calendar;
    this.modalRef = this.modalService.show(template);
  }

  searchCities() {
    //Delete the slice method to get all cities
    this.cities = City.getAllCities().slice(0, 2500);
  }

  closeModal() {
    this.modalService.hide();
  }

  addReminder() {
    let key = this.day.day.concat('-',this.day.month);
    this.reminder = {day: this.day.day, text: this.reminderText, month: this.day.month, color: this.colorReminder, city: this.cityReminder}
    let remindersInDay = this.reminders.get(key);
    if (remindersInDay === undefined){
      this.reminders.set(key, [this.reminder])
    } else {
      remindersInDay.push(this.reminder)
      this.reminders.set(key, remindersInDay);
    }
    this.resetValues();
    this.modalService.hide();
  }

  getReminderForDay(day:string, month:string){
    return this.reminders.get(day + "-" + month);
  }

  resetValues() {
    this.reminderText = '';
    this.colorReminder = '';
    this.cityReminder = '';
    this.weatherBoolean = false;
    this.editBoolean = false;
  }

  editReminder() {
    let key = this.day.day.concat('-',this.day.month);
    this.reminders.delete(key);
    this.reminder = {day: this.day.day, text: this.reminderText, month: this.day.month, color: this.colorReminder, city: this.cityReminder}
    let remindersInDay = this.reminders.get(key);
    if (remindersInDay === undefined){
      this.reminders.set(key, [this.reminder])
    } else {
      remindersInDay.push(this.reminder)
      this.reminders.set(key, remindersInDay);
    }
    this.resetValues();
    this.modalService.hide();
  }

  removeReminder() {
    let key = this.day.day.concat('-',this.day.month);
    this.reminders.delete(key);
    this.resetValues();
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
        this.weatherTemp = res.current.temp;
        this.weatherCondition = res.current.weather[0].main;
        this.cityWeather = res;
      }, err => console.error(err));
  }

  searchReminder(day: any, month:any) {
    let key = day.concat('-' ,month);
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

  editState() {
    this.editBoolean = true;
  }
}
