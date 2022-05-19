import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { Country, State, City }  from 'country-state-city';

interface CalendarItem {
  day: string;
  dayName: string;
  className: string;
  isWeekend: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  date = moment();
  calendar: Array<CalendarItem[]> = [];
  outday: boolean = false;
  modalRef: BsModalRef | undefined;
  // cities: Array<CityItem[]> = [];
  cities: any;
  colors: any = [{name: 'red'}, {name: 'blue'}, {name: 'yellow'}, {name: 'green'}, {name: 'lightblue'}]
  example: any;

  constructor(
    private modalService: BsModalService,
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
      className,
      isWeekend: dayName === 'Sunday' || dayName === 'Saturday'
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
    let day = calendar;
    console.log(day);
    this.modalRef = this.modalService.show(template);
  }

  searchCities() {
    // this.cities = City.getAllCities();
    this.cities = [
    {name: 'Andorra la Vella', latitude: '42.50779000', longitude: '1.52109000'},
    {name: 'Arinsal', latitude: '42.57205000', longitude: '1.48453000'},
    {name: 'Canillo', latitude: '42.56760000', longitude: '1.59756000'}]
  }

  closeModal() {
    this.modalService.hide();
  }

  addReminder() {
  }

}
