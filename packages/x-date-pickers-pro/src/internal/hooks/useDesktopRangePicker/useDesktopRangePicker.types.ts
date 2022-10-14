import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import {
  CalendarOrClockPickerView,
  UsePickerParams,
  BasePickerProps2,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models';

export interface UseDesktopRangePickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType<TextFieldProps>;
}

// TODO: Type props of all slots
export interface UseDesktopRangePickerSlotsComponentsProps
  extends PickersPopperSlotsComponentsProps {
  field?: Record<string, any>;
  input?: Record<string, any>;
}

export interface ExportedUseDesktopRangePickerProps {}

interface UseDesktopRangePickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends ExportedUseDesktopRangePickerProps,
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
