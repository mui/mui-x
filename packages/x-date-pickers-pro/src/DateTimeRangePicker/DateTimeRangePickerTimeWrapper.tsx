// The date-time range and time range pickers share the exact same time-view
// wrapper logic, so the implementation lives in a single place and is re-exported
// here under the date-time-specific name.
export {
  TimeRangePickerTimeWrapper as DateTimeRangePickerTimeWrapper,
  type TimeRangePickerTimeWrapperProps as DateTimeRangePickerTimeWrapperProps,
} from '../TimeRangePicker/TimeRangePickerTimeWrapper';
