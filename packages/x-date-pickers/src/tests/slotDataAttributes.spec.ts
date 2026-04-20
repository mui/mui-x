import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { DateCalendarSlotProps } from '@mui/x-date-pickers/DateCalendar';
import type { DateFieldSlotProps } from '@mui/x-date-pickers/DateField';
import type { DatePickerSlotProps } from '@mui/x-date-pickers/DatePicker';
import type { DateTimeFieldSlotProps } from '@mui/x-date-pickers/DateTimeField';
import type { DateTimePickerSlotProps } from '@mui/x-date-pickers/DateTimePicker';
import type { DesktopDatePickerSlotProps } from '@mui/x-date-pickers/DesktopDatePicker';
import type { DesktopDateTimePickerSlotProps } from '@mui/x-date-pickers/DesktopDateTimePicker';
import type { DesktopTimePickerSlotProps } from '@mui/x-date-pickers/DesktopTimePicker';
import type { DigitalClockSlotProps } from '@mui/x-date-pickers/DigitalClock';
import type { MobileDatePickerSlotProps } from '@mui/x-date-pickers/MobileDatePicker';
import type { MobileDateTimePickerSlotProps } from '@mui/x-date-pickers/MobileDateTimePicker';
import type { MobileTimePickerSlotProps } from '@mui/x-date-pickers/MobileTimePicker';
import type { MonthCalendarSlotProps } from '@mui/x-date-pickers/MonthCalendar';
import type { MultiSectionDigitalClockSlotProps } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import type { PickersCalendarHeaderSlotProps } from '@mui/x-date-pickers/PickersCalendarHeader';
import type { PickersLayoutSlotProps } from '@mui/x-date-pickers/PickersLayout';
import type { PickerValidValue } from '@mui/x-date-pickers/internals';
import type { PickersSectionListSlotProps } from '@mui/x-date-pickers/PickersSectionList';
import type {
  PickersInputBaseProps,
  PickersTextFieldSlotProps,
} from '@mui/x-date-pickers/PickersTextField';
import type { StaticDatePickerSlotProps } from '@mui/x-date-pickers/StaticDatePicker';
import type { StaticDateTimePickerSlotProps } from '@mui/x-date-pickers/StaticDateTimePicker';
import type { StaticTimePickerSlotProps } from '@mui/x-date-pickers/StaticTimePicker';
import type { TimeClockSlotProps } from '@mui/x-date-pickers/TimeClock';
import type { TimeFieldSlotProps } from '@mui/x-date-pickers/TimeField';
import type { TimePickerSlotProps } from '@mui/x-date-pickers/TimePicker';
import type { YearCalendarSlotProps } from '@mui/x-date-pickers/YearCalendar';

// Compile-time assertion: every slot in every exported SlotProps type of `x-date-pickers`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.
// A regression on any slot surfaces as a TS error pointing at the offending slot by name.

type AssertDateCalendar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateCalendarSlotProps, 'DateCalendar'>>
>;
type AssertDateField = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateFieldSlotProps, 'DateField'>>
>;
type AssertDatePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DatePickerSlotProps, 'DatePicker'>>
>;
type AssertDateTimeField = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateTimeFieldSlotProps, 'DateTimeField'>>
>;
type AssertDateTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateTimePickerSlotProps, 'DateTimePicker'>>
>;
type AssertDesktopDatePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DesktopDatePickerSlotProps, 'DesktopDatePicker'>>
>;
type AssertDesktopDateTimePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<DesktopDateTimePickerSlotProps, 'DesktopDateTimePicker'>
  >
>;
type AssertDesktopTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DesktopTimePickerSlotProps, 'DesktopTimePicker'>>
>;
type AssertDigitalClock = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DigitalClockSlotProps, 'DigitalClock'>>
>;
type AssertMobileDatePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MobileDatePickerSlotProps, 'MobileDatePicker'>>
>;
type AssertMobileDateTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MobileDateTimePickerSlotProps, 'MobileDateTimePicker'>>
>;
type AssertMobileTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MobileTimePickerSlotProps, 'MobileTimePicker'>>
>;
type AssertMonthCalendar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MonthCalendarSlotProps, 'MonthCalendar'>>
>;
type AssertMultiSectionDigitalClock = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      MultiSectionDigitalClockSlotProps,
      'MultiSectionDigitalClock'
    >
  >
>;
type AssertPickersCalendarHeader = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<PickersCalendarHeaderSlotProps, 'PickersCalendarHeader'>
  >
>;
type AssertPickersLayout = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<PickersLayoutSlotProps<PickerValidValue>, 'PickersLayout'>
  >
>;
type AssertPickersSectionList = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<PickersSectionListSlotProps, 'PickersSectionList'>>
>;
type AssertPickersTextField = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      PickersTextFieldSlotProps<PickersInputBaseProps>,
      'PickersTextField'
    >
  >
>;
type AssertStaticDatePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<StaticDatePickerSlotProps, 'StaticDatePicker'>>
>;
type AssertStaticDateTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<StaticDateTimePickerSlotProps, 'StaticDateTimePicker'>>
>;
type AssertStaticTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<StaticTimePickerSlotProps, 'StaticTimePicker'>>
>;
type AssertTimeClock = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TimeClockSlotProps, 'TimeClock'>>
>;
type AssertTimeField = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TimeFieldSlotProps, 'TimeField'>>
>;
type AssertTimePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TimePickerSlotProps, 'TimePicker'>>
>;
type AssertYearCalendar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<YearCalendarSlotProps, 'YearCalendar'>>
>;
