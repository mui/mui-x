import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import { DateOrTimeView, MuiPickersAdapter } from '../../models';
import {
  BaseNextNonStaticPickerProps,
  BaseNextPickerProps,
} from '../../models/props/basePickerProps';
import {
  PickersModalDialogSlotsComponent,
  PickersModalDialogSlotsComponentsProps,
} from '../../components/PickersModalDialog';
import { UsePickerParams, UsePickerProps } from '../usePicker';
import { BaseFieldProps } from '../../models/fields';
import {
  ExportedPickersViewLayoutSlotsComponent,
  ExportedPickersViewLayoutSlotsComponentsProps,
} from '../../components/PickersViewLayout';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue';
import { UsePickerViewsNonStaticProps } from '../usePicker/usePickerViews';

export interface UseMobilePickerSlotsComponent<TDate>
  extends PickersModalDialogSlotsComponent,
    ExportedPickersViewLayoutSlotsComponent {
  /**
   * Component used to enter the date with the keyboard.
   */
  Field: React.ElementType<BaseFieldProps<TDate | null, any>>;
  /**
   * Component used to render an HTML input inside the field.
   * @default TextField
   */
  Input?: React.ElementType<TextFieldProps>;
}

export interface UseMobilePickerSlotsComponentsProps<TDate, TView extends DateOrTimeView>
  // TODO v6: Remove `Pick` once `PickersModalDialog` does not handle the layouting parts
  extends Pick<
      PickersModalDialogSlotsComponentsProps,
      'dialog' | 'mobilePaper' | 'mobileTransition'
    >,
    ExportedPickersViewLayoutSlotsComponentsProps<TDate | null, TView> {
  field?: SlotComponentProps<
    React.ElementType<BaseFieldProps<TDate | null, unknown>>,
    {},
    UsePickerProps<TDate | null, any, any>
  >;
  input?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
}

export interface MobileOnlyPickerProps<TDate>
  extends BaseNextNonStaticPickerProps,
    UsePickerValueNonStaticProps<TDate | null>,
    UsePickerViewsNonStaticProps {}

export interface UseMobilePickerProps<TDate, TView extends DateOrTimeView, TError>
  extends BaseNextPickerProps<TDate | null, TDate, TView, TError>,
    MobileOnlyPickerProps<TDate> {
  /**
   * Overrideable components.
   * @default {}
   */
  components: UseMobilePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: UseMobilePickerSlotsComponentsProps<TDate, TView>;
}

export interface UseMobilePickerParams<
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobilePickerProps<TDate, TView, any>,
> extends Pick<
    UsePickerParams<TDate | null, TDate, TView, TExternalProps, {}>,
    'valueManager' | 'viewLookup' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: TDate | null, utils: MuiPickersAdapter<TDate>) => string;
}
