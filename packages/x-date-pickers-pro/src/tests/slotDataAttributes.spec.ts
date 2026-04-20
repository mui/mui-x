import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type { DateRangeCalendarSlotProps } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import type { DateRangePickerSlotProps } from '@mui/x-date-pickers-pro/DateRangePicker';
import type { DateTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import type { DesktopDateRangePickerSlotProps } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import type { DesktopDateTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/DesktopDateTimeRangePicker';
import type { DesktopTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';
import type { MobileDateRangePickerSlotProps } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import type { MobileDateTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import type { MobileTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import type { PickersRangeCalendarHeaderSlotProps } from '@mui/x-date-pickers-pro/PickersRangeCalendarHeader';
import type { SingleInputDateRangeFieldSlotProps } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import type { SingleInputDateTimeRangeFieldSlotProps } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import type { SingleInputTimeRangeFieldSlotProps } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import type { StaticDateRangePickerSlotProps } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import type { TimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/TimeRangePicker';

// Compile-time assertion: every slot in every exported SlotProps type of `x-date-pickers-pro`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.
// A regression on any slot surfaces as a TS error pointing at the offending slot by name.

type AssertDateRangeCalendar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateRangeCalendarSlotProps, 'DateRangeCalendar'>>
>;
type AssertDateRangePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateRangePickerSlotProps, 'DateRangePicker'>>
>;
type AssertDateTimeRangePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateTimeRangePickerSlotProps, 'DateTimeRangePicker'>>
>;
type AssertDesktopDateRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<DesktopDateRangePickerSlotProps, 'DesktopDateRangePicker'>
  >
>;
type AssertDesktopDateTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      DesktopDateTimeRangePickerSlotProps,
      'DesktopDateTimeRangePicker'
    >
  >
>;
type AssertDesktopTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<DesktopTimeRangePickerSlotProps, 'DesktopTimeRangePicker'>
  >
>;
type AssertMobileDateRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<MobileDateRangePickerSlotProps, 'MobileDateRangePicker'>
  >
>;
type AssertMobileDateTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      MobileDateTimeRangePickerSlotProps,
      'MobileDateTimeRangePicker'
    >
  >
>;
type AssertMobileTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<MobileTimeRangePickerSlotProps, 'MobileTimeRangePicker'>
  >
>;
type AssertPickersRangeCalendarHeader = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      PickersRangeCalendarHeaderSlotProps,
      'PickersRangeCalendarHeader'
    >
  >
>;
type AssertSingleInputDateRangeField = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      SingleInputDateRangeFieldSlotProps,
      'SingleInputDateRangeField'
    >
  >
>;
type AssertSingleInputDateTimeRangeField = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      SingleInputDateTimeRangeFieldSlotProps,
      'SingleInputDateTimeRangeField'
    >
  >
>;
type AssertSingleInputTimeRangeField = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      SingleInputTimeRangeFieldSlotProps,
      'SingleInputTimeRangeField'
    >
  >
>;
type AssertStaticDateRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<StaticDateRangePickerSlotProps, 'StaticDateRangePicker'>
  >
>;
type AssertTimeRangePicker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TimeRangePickerSlotProps, 'TimeRangePicker'>>
>;
