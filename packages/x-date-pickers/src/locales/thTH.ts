import { PickersLocaleText } from './utils/pickersLocaleTextApi';
import { getPickersLocalization } from './utils/getPickersLocalization';
import { TimeViewWithMeridiem } from '../internals/models';

const views: Record<TimeViewWithMeridiem, string> = {
  hours: 'ชั่วโมง',
  minutes: 'นาที',
  seconds: 'วินาที',
  meridiem: 'ช่วงเวลา',
};

const thTHPickers: Partial<PickersLocaleText> = {
  // Calendar navigation
  previousMonth: 'เดือนก่อนหน้า',
  nextMonth: 'เดือนถัดไป',

  // View navigation
  openPreviousView: 'เปิดมุมมองก่อนหน้า',
  openNextView: 'เปิดมุมมองถัดไป',
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === 'year' ? 'มุมมองปีเปิดอยู่ สลับไปมุมมองปฏิทิน' : 'มุมมองปฏิทินเปิดอยู่ สลับไปมุมมองปี',

  // DateRange labels
  start: 'เริ่มต้น',
  end: 'สิ้นสุด',
  startDate: 'วันที่เริ่มต้น',
  startTime: 'เวลาเริ่มต้น',
  endDate: 'วันที่สิ้นสุด',
  endTime: 'เวลาสิ้นสุด',

  // Action bar
  cancelButtonLabel: 'ยกเลิก',
  clearButtonLabel: 'ล้าง',
  okButtonLabel: 'ตกลง',
  todayButtonLabel: 'วันนี้',
  nextStepButtonLabel: 'ถัดไป',

  // Toolbar titles
  datePickerToolbarTitle: 'เลือกวันที่',
  dateTimePickerToolbarTitle: 'เลือกวันที่และเวลา',
  timePickerToolbarTitle: 'เลือกเวลา',
  dateRangePickerToolbarTitle: 'เลือกช่วงวันที่',
  timeRangePickerToolbarTitle: 'เลือกช่วงเวลา',

  // Clock labels
  clockLabelText: (view, formattedTime) =>
    `เลือก${views[view]} ${!formattedTime ? 'ยังไม่ได้เลือกเวลา' : `เวลาที่เลือกคือ ${formattedTime}`}`,
  hoursClockNumberText: (hours) => `${hours} ชั่วโมง`,
  minutesClockNumberText: (minutes) => `${minutes} นาที`,
  secondsClockNumberText: (seconds) => `${seconds} วินาที`,

  // Digital clock labels
  selectViewText: (view) => `เลือก${views[view]}`,

  // Calendar labels
  calendarWeekNumberHeaderLabel: 'หมายเลขสัปดาห์',
  calendarWeekNumberHeaderText: '#',
  calendarWeekNumberAriaLabelText: (weekNumber) => `สัปดาห์ที่ ${weekNumber}`,
  calendarWeekNumberText: (weekNumber) => `${weekNumber}`,

  // Open Picker labels
  openDatePickerDialogue: (formattedDate) =>
    formattedDate ? `เลือกวันที่ วันที่ที่เลือกคือ ${formattedDate}` : 'เลือกวันที่',
  openTimePickerDialogue: (formattedTime) =>
    formattedTime ? `เลือกเวลา เวลาที่เลือกคือ ${formattedTime}` : 'เลือกเวลา',
  openRangePickerDialogue: (formattedRange) =>
    formattedRange ? `เลือกช่วง ช่วงที่เลือกคือ ${formattedRange}` : 'เลือกช่วง',
  fieldClearLabel: 'ล้าง',

  // Table labels
  timeTableLabel: 'เลือกเวลา',
  dateTableLabel: 'เลือกวันที่',

  // Field section placeholders
  fieldYearPlaceholder: (params) => 'ป'.repeat(params.digitAmount),
  fieldMonthPlaceholder: (params) => (params.contentType === 'letter' ? 'ดดดด' : 'ดด'),
  fieldDayPlaceholder: () => 'วว',
  fieldWeekDayPlaceholder: (params) => (params.contentType === 'letter' ? 'วววว' : 'วว'),
  fieldHoursPlaceholder: () => 'ชช',
  fieldMinutesPlaceholder: () => 'นน',
  fieldSecondsPlaceholder: () => 'วว',
  fieldMeridiemPlaceholder: () => 'ทท',

  // View names
  year: 'ปี',
  month: 'เดือน',
  day: 'วัน',
  weekDay: 'วันในสัปดาห์',
  hours: 'ชั่วโมง',
  minutes: 'นาที',
  seconds: 'วินาที',
  meridiem: 'ช่วงเวลา',

  // Common
  empty: 'ว่างเปล่า',
};

export const thTH = getPickersLocalization(thTHPickers);
