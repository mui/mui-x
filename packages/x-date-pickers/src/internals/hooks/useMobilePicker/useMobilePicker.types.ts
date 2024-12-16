import * as React from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import { MakeRequired, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  BaseNonStaticPickerProps,
  BasePickerProps,
  BaseNonRangeNonStaticPickerProps,
} from '../../models/props/basePickerProps';
import {
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
} from '../../components/PickersModalDialog';
import { UsePickerParams } from '../usePicker';
import {
  FieldOwnerState,
  PickerFieldSlotProps,
  PickerOwnerState,
  PickerValidDate,
} from '../../../models';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
  PickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { UsePickerValueNonStaticProps } from '../usePicker/usePickerValue.types';
import { UsePickerViewsProps } from '../usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import { PickersTextFieldProps } from '../../../PickersTextField';
import { UsePickerProviderNonStaticProps } from '../usePicker/usePickerProvider';

export interface UseMobilePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends PickersModalDialogSlots,
    ExportedPickersLayoutSlots<PickerValue, TView> {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
  /**
   * Form control with an input to render the value inside the default field.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface ExportedUseMobilePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends PickersModalDialogSlotProps,
    ExportedPickersLayoutSlotProps<PickerValue, TView> {
  field?: SlotComponentPropsFromProps<
    PickerFieldSlotProps<PickerValue, TEnableAccessibleFieldDOMStructure>,
    {},
    PickerOwnerState
  >;
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
}

export interface UseMobilePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends ExportedUseMobilePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>,
    Pick<PickersLayoutSlotProps<PickerValue, TView>, 'toolbar'> {}

export interface MobileOnlyPickerProps
  extends BaseNonStaticPickerProps,
    BaseNonRangeNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerProviderNonStaticProps {}

export interface UseMobilePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends BasePickerProps<PickerValue, TView, TError, TExternalProps, {}>,
    MakeRequired<MobileOnlyPickerProps, 'format'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobilePickerSlots<TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobilePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>;
}

export interface UseMobilePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseMobilePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends Pick<
    UsePickerParams<PickerValue, TView, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: PickerValidDate | null) => string;
}
