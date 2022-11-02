import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import {
  CalendarOrClockPickerView,
  UsePickerParams,
  BaseNextPickerProps,
  BaseNextNonStaticPickerProps,
  PickersPopperSlotsComponent,
  PickersPopperSlotsComponentsProps,
  UsePickerValueNonStaticProps,
  UsePickerViewsNonStaticProps,
} from '@mui/x-date-pickers/internals';
import { DateRange } from '../../models';
import { BaseMultiInputFieldProps } from '../../models/fields';

export interface UseDesktopRangePickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType<TextFieldProps>;
}

export interface UseDesktopRangePickerSlotsComponentsProps<TDate>
  extends PickersPopperSlotsComponentsProps {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
}

export interface DesktopRangeOnlyPickerProps<TDate>
  extends UsePickerValueNonStaticProps<DateRange<TDate>>,
    UsePickerViewsNonStaticProps,
    BaseNextNonStaticPickerProps {}

export interface UseDesktopRangePickerProps<TDate, TView extends CalendarOrClockPickerView>
  extends DesktopRangeOnlyPickerProps<TDate>,
    BaseNextPickerProps<DateRange<TDate>, TDate, TView> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseDesktopRangePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseDesktopRangePickerSlotsComponentsProps<TDate>;
}

interface DesktopRangePickerAdditionalViewProps {
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export interface UseDesktopRangePickerParams<
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView>,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      TExternalProps,
      DesktopRangePickerAdditionalViewProps
    >,
    'valueManager' | 'viewLookup'
  > {
  props: TExternalProps;
}
