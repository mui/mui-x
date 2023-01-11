import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotComponentProps } from '@mui/base/utils';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout/PickersLayout.types';
import {
  DateOrTimeView,
  UsePickerParams,
  BaseNextPickerProps,
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
  ExportedBaseToolbarProps,
  MobileOnlyPickerProps,
  UsePickerViewsProps,
  UncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import { DateRange, RangePositionProps } from '../../models';
import { BaseMultiInputFieldProps } from '../../models/fields';

export interface UseMobileRangePickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends PickersModalDialogSlotsComponent,
    ExportedPickersLayoutSlotsComponent<DateRange<TDate>, TView> {
  Field: React.ElementType;
  FieldRoot?: React.ElementType<StackProps>;
  FieldSeparator?: React.ElementType<TypographyProps>;
  /**
   * Form control with an input to render a date or time inside the default field.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType<TextFieldProps>;
}

export interface UseMobileRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  // TODO v6: Remove `Pick` once `PickersModalDialog` does not handle the layouting parts
  extends Pick<
      PickersModalDialogSlotsComponentsProps,
      'dialog' | 'mobilePaper' | 'mobileTransition'
    >,
    ExportedPickersLayoutSlotsComponentsProps<DateRange<TDate>, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, unknown>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, unknown>;
  textField?: SlotComponentProps<typeof TextField, {}, unknown>;
  toolbar?: ExportedBaseToolbarProps;
}

export interface MobileRangeOnlyPickerProps<TDate> extends MobileOnlyPickerProps<TDate> {}

export interface UseMobileRangePickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends MobileRangeOnlyPickerProps<TDate>,
    BaseNextPickerProps<
      DateRange<TDate>,
      TDate,
      TView,
      TError,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    > {
  /**
  * Overrideable component slots.
  * @default {}
   */
  slots: UncapitalizeObjectKeys<UseMobileRangePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: UseMobileRangePickerSlotsComponentsProps<TDate, TView>;
}

export interface MobileRangePickerAdditionalViewProps extends RangePositionProps {}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<
      DateRange<TDate>,
      TDate,
      TView,
      TExternalProps,
      MobileRangePickerAdditionalViewProps
    >,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
}
