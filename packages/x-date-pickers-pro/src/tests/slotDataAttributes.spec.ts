import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { DateRangeCalendarSlotProps } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import type { DateRangePickerSlotProps } from '@mui/x-date-pickers-pro/DateRangePicker';
import type { DateTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import type { DesktopDateRangePickerSlotProps } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import type { DesktopDateTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/DesktopDateTimeRangePicker';
import type { DesktopTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';
import type { MobileDateRangePickerSlotProps } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import type { MobileDateTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import type { MobileTimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import type { MultiInputDateRangeFieldSlotProps } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import type { PickersRangeCalendarHeaderSlotProps } from '@mui/x-date-pickers-pro/PickersRangeCalendarHeader';
import type { SingleInputDateRangeFieldSlotProps } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import type { SingleInputDateTimeRangeFieldSlotProps } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import type { SingleInputTimeRangeFieldSlotProps } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import type { StaticDateRangePickerSlotProps } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import type { TimeRangePickerSlotProps } from '@mui/x-date-pickers-pro/TimeRangePicker';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot of every exported top-level component and provider
// `*SlotProps` in `x-date-pickers-pro` must accept `data-*` once `DataAttributesOverrides` is augmented,
// so a regression names the offending slot. Slots of nested components (plot elements,
// `use*` hooks) are exercised through their parent's `*SlotProps`.
// A regression on any slot surfaces as a TS error pointing at the offending slot by name.

type AssertDateRangeCalendar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<DateRangeCalendarSlotProps, 'DateRangeCalendar'>>
>;
type AssertDateRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      DateRangePickerSlotProps,
      'DateRangePicker',
      'desktopTrapFocus'
    >
  >
>;
type AssertDateTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      DateTimeRangePickerSlotProps,
      'DateTimeRangePicker',
      'desktopTrapFocus'
    >
  >
>;
type AssertDesktopDateRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      DesktopDateRangePickerSlotProps,
      'DesktopDateRangePicker',
      'desktopTrapFocus'
    >
  >
>;
type AssertDesktopDateTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      DesktopDateTimeRangePickerSlotProps,
      'DesktopDateTimeRangePicker',
      'desktopTrapFocus'
    >
  >
>;
type AssertDesktopTimeRangePicker = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      DesktopTimeRangePickerSlotProps,
      'DesktopTimeRangePicker',
      'desktopTrapFocus'
    >
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
type AssertMultiInputRangeField = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<MultiInputDateRangeFieldSlotProps, 'MultiInputRangeField'>
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
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      TimeRangePickerSlotProps,
      'TimeRangePicker',
      'desktopTrapFocus'
    >
  >
>;
