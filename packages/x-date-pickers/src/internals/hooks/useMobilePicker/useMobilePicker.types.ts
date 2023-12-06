import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import {
  BaseNonStaticPickerProps,
  BasePickerProps,
  BaseNonRangeNonStaticPickerProps,
} from '../../models/props/basePickerProps';
import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../../components/PickersModalDialog';
import { UsePickerParams, UsePickerProps } from '../usePicker';
import { BaseSingleInputFieldProps, FieldSection, MuiPickersAdapter } from '../../../models';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
  PickersLayoutSlotsComponentsProps,
} from '../../../PickersLayout/PickersLayout.types';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue.types';
import { UsePickerViewsNonStaticProps, UsePickerViewsProps } from '../usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem } from '../../models';

export interface UseMobilePickerSlotsComponent<TDate, TView extends DateOrTimeViewWithMeridiem>
  extends PickersModalDialogSlotsComponent,
    ExportedPickersLayoutSlotsComponent<TDate | null, TDate, TView> {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType<BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, any>>;
  /**
   * Form control with an input to render the value inside the default field.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType<TextFieldProps>;
}

export interface ExportedUseMobilePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends PickersModalDialogSlotsComponentsProps,
    ExportedPickersLayoutSlotsComponentsProps<TDate | null, TDate, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseSingleInputFieldProps<TDate | null, TDate, FieldSection, unknown>>,
    {},
    UsePickerProps<TDate | null, TDate, any, FieldSection, any, any, any>
  >;
  textField?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
}

export interface UseMobilePickerSlotsComponentsProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
> extends ExportedUseMobilePickerSlotsComponentsProps<TDate, TView>,
    Pick<PickersLayoutSlotsComponentsProps<TDate | null, TDate, TView>, 'toolbar'> {}

export interface MobileOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    BaseNonRangeNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, FieldSection>,
    UsePickerViewsNonStaticProps {}

export interface UseMobilePickerProps<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerViewsProps<any, any, TView, any, any>,
> extends BasePickerProps<TDate | null, TDate, TView, TError, TExternalProps, {}>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobilePickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobilePickerSlotsComponentsProps<TDate, TView>;
}

export interface UseMobilePickerParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobilePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, FieldSection, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
