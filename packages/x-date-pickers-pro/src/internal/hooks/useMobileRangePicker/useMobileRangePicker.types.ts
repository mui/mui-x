import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotComponentProps } from '@mui/base/utils';
import {
  DateOrTimeView,
  UsePickerParams,
  BaseNextPickerProps,
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
  ExportedPickersViewLayoutSlotsComponent,
  ExportedPickersViewLayoutSlotsComponentsProps,
  ExportedBaseToolbarProps,
  MobileOnlyPickerProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, RangePositionProps } from '../../models';
import { BaseMultiInputFieldProps } from '../../models/fields';

export interface UseMobileRangePickerSlotsComponent
  extends PickersModalDialogSlotsComponent,
    ExportedPickersViewLayoutSlotsComponent {
  Field: React.ElementType;
  FieldRoot?: React.ElementType<StackProps>;
  FieldSeparator?: React.ElementType<TypographyProps>;
  Input?: React.ElementType<TextFieldProps>;
}

export interface UseMobileRangePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  // TODO v6: Remove `Pick` once `PickersModalDialog` does not handle the layouting parts
  extends Pick<
      PickersModalDialogSlotsComponentsProps,
      'dialog' | 'mobilePaper' | 'mobileTransition'
    >,
    ExportedPickersViewLayoutSlotsComponentsProps<DateRange<TDate>, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, unknown>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, unknown>;
  input?: SlotComponentProps<typeof TextField, {}, unknown>;
  toolbar?: ExportedBaseToolbarProps;
}

export interface MobileRangeOnlyPickerProps<TDate> extends MobileOnlyPickerProps<TDate> {}

export interface UseMobileRangePickerProps<TDate, TView extends DateOrTimeView, TError>
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
  componentsProps?: UseMobileRangePickerSlotsComponentsProps<TDate, TView>;
}

interface MobileRangePickerAdditionalViewProps extends RangePositionProps {}

export interface UseMobileRangePickerParams<
  TDate,
  TView extends DateOrTimeView,
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
