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
import {
  BaseSingleInputFieldProps,
  FieldSection,
  DateOrTimeView,
  MuiPickersAdapter,
} from '../../../models';
import {
  ExportedPickersLayoutSlotsComponent,
  ExportedPickersLayoutSlotsComponentsProps,
  PickersLayoutSlotsComponentsProps,
} from '../../../PickersLayout/PickersLayout.types';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue.types';
import { UsePickerViewsNonStaticProps, UsePickerViewsProps } from '../usePicker/usePickerViews';
import { UncapitalizeObjectKeys } from '../../utils/slots-migration';

export interface UseMobilePickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends PickersModalDialogSlotsComponent,
    ExportedPickersLayoutSlotsComponent<TDate | null, TDate, TView> {
  /**
   * Component used to enter the date with the keyboard.
   */
  Field: React.ElementType<BaseSingleInputFieldProps<TDate | null, FieldSection, any>>;
  /**
   * Form control with an input to render the value inside the default field.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType<TextFieldProps>;
}

export interface ExportedUseMobilePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends PickersModalDialogSlotsComponentsProps,
    ExportedPickersLayoutSlotsComponentsProps<TDate | null, TDate, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseSingleInputFieldProps<TDate | null, FieldSection, unknown>>,
    {},
    UsePickerProps<TDate | null, any, FieldSection, any, any, any>
  >;
  textField?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
}

export interface UseMobilePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  extends ExportedUseMobilePickerSlotsComponentsProps<TDate, TView>,
    Pick<PickersLayoutSlotsComponentsProps<TDate | null, TDate, TView>, 'toolbar'> {}

export interface MobileOnlyPickerProps<TDate>
  extends BaseNonStaticPickerProps,
    BaseNonRangeNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null, FieldSection>,
    UsePickerViewsNonStaticProps {}

export interface UseMobilePickerProps<
  TDate,
  TView extends DateOrTimeView,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends BasePickerProps<TDate | null, TDate, TView, TError, TExternalProps, {}>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UncapitalizeObjectKeys<UseMobilePickerSlotsComponent<TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobilePickerSlotsComponentsProps<TDate, TView>;
}

export interface UseMobilePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobilePickerProps<TDate, TView, any, TExternalProps>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, FieldSection, TExternalProps, {}>,
    'valueManager' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
