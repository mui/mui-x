"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var React = require("react");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var MonthCalendar_1 = require("@mui/x-date-pickers/MonthCalendar");
var YearCalendar_1 = require("@mui/x-date-pickers/YearCalendar");
var TimeClock_1 = require("@mui/x-date-pickers/TimeClock");
var DayCalendarSkeleton_1 = require("@mui/x-date-pickers/DayCalendarSkeleton");
// prettier-ignore
function App() {
    (0, DateCalendar_1.getDateCalendarUtilityClass)('root');
    (0, MonthCalendar_1.getMonthCalendarUtilityClass)('root');
    (0, YearCalendar_1.getYearCalendarUtilityClass)('root');
    (0, TimeClock_1.getTimeClockUtilityClass)('root');
    (0, DayCalendarSkeleton_1.getDayCalendarSkeletonUtilityClass)('root');
    return (<React.Fragment>
      <DateCalendar_1.DateCalendar value={null} onChange={function () { }}/>
      <MonthCalendar_1.MonthCalendar value={null} onChange={function () { }}/>
      <YearCalendar_1.YearCalendar value={null} onChange={function () { }}/>
      <TimeClock_1.TimeClock value={null} onChange={function () { }}/>
      <DayCalendarSkeleton_1.DayCalendarSkeleton />
    </React.Fragment>);
}
