import * as React from 'react';
import {
  CalendarOrClockPickerView,
  UsePickerParams,
  BasePickerProps2,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
  MuiPickersAdapter,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models';

export interface UseDesktopRangePickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType;
}

// TODO: Type props of all slots
export interface UseDesktopRangePickerSlotsComponentsProps
  extends PickersPopperSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

interface DesktopOnlyRangePickerProps {
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}

export interface UseDesktopRangePickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends DesktopOnlyRangePickerProps,
    BasePickerProps2<DateRange<TDate>, TDate, TView> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseDesktopRangePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseDesktopRangePickerSlotsComponentsProps;
}

interface DesktopRangePickerAdditionalViewProps {
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export interface UseDesktopRangePickerParams<TDate, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerParams<DateRange<TDate>, TDate, TView, DesktopRangePickerAdditionalViewProps>,
    'props' | 'valueManager' | 'sectionModeLookup' | 'renderViews'
  > {
  props: UseDesktopRangePickerProps<TDate, TView>;
}
