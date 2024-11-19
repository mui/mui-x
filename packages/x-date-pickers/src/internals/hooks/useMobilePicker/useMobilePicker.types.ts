import * as React from 'react';
import TextField from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/utils';
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
  FieldSection,
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
import { UsePickerViewsNonStaticProps, UsePickerViewsProps } from '../usePicker/usePickerViews';
import { DateOrTimeViewWithMeridiem } from '../../models';

export interface UseMobilePickerSlots<TView extends DateOrTimeViewWithMeridiem>
  extends PickersModalDialogSlots,
    ExportedPickersLayoutSlots<PickerValidDate | null, TView> {
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
    ExportedPickersLayoutSlotProps<PickerValidDate | null, TView> {
  field?: SlotComponentPropsFromProps<
    PickerFieldSlotProps<PickerValidDate | null, FieldSection, TEnableAccessibleFieldDOMStructure>,
    {},
    PickerOwnerState
  >;
  textField?: SlotComponentProps<typeof TextField, {}, Record<string, any>>;
}

export interface UseMobilePickerSlotProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends ExportedUseMobilePickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>,
    Pick<PickersLayoutSlotProps<PickerValidDate | null, TView>, 'toolbar'> {}

export interface MobileOnlyPickerProps
  extends BaseNonStaticPickerProps,
    BaseNonRangeNonStaticPickerProps,
    UsePickerValueNonStaticProps,
    UsePickerViewsNonStaticProps {}

export interface UseMobilePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerViewsProps<any, TView, any, any>,
> extends BasePickerProps<PickerValidDate | null, TView, TError, TExternalProps, {}>,
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
    UsePickerParams<PickerValidDate | null, TView, FieldSection, TExternalProps, {}>,
    'valueManager' | 'valueType' | 'validator'
  > {
  props: TExternalProps;
  getOpenDialogAriaText: (date: PickerValidDate | null) => string;
}
