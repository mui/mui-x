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

export interface UseMobileRangePickerSlotsComponent extends PickersPopperSlotsComponent {
  Field: React.ElementType;
  Input?: React.ElementType<TextFieldProps>;
}

export interface UseMobileRangePickerSlotsComponentsProps<TDate>
  extends PickersPopperSlotsComponentsProps {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
}

export interface MobileRangeOnlyPickerProps<TDate>
  extends UsePickerValueNonStaticProps<DateRange<TDate>>,
    UsePickerViewsNonStaticProps,
    BaseNextNonStaticPickerProps {}

export interface UseMobileRangePickerProps<TDate, TView extends CalendarOrClockPickerView, TError>
  extends MobileRangeOnlyPickerProps<TDate>,
    BaseNextPickerProps<DateRange<TDate>, TDate, TView, TError> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseMobileRangePickerSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseMobileRangePickerSlotsComponentsProps<TDate>;
}

interface MobileRangePickerAdditionalViewProps {
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends CalendarOrClockPickerView,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any>,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    >,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
}
