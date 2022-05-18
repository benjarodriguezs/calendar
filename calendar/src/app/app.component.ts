import { Component, OnInit, NgModule } from '@angular/core';
import * as moment from 'moment';

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


  constructor() { }

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
    }

    for (let i = 0; i < daysAfter; i++) {
      calendar.push(this.createCalendarItem(clone, 'next-month'));
      clone.add(1, 'days');
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
      isWeekend: dayName === 'Sun' || dayName === 'Sat',
      outMonth: false,
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

}
