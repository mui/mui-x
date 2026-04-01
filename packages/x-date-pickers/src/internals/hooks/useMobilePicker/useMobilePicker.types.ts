import * as React from 'react';
import { MakeRequired, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { BasePickerProps } from '../../models/props/basePickerProps';
import {
  PickersModalDialogSlots,
  PickersModalDialogSlotProps,
} from '../../components/PickersModalDialog';
import { UsePickerParameters, UsePickerNonStaticProps, UsePickerProps } from '../usePicker';
import { PickerFieldSlotProps, PickerOwnerState } from '../../../models';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
  PickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { DateOrTimeViewWithMeridiem, PickerValue } from '../../models';
import {
  PickerFieldUISlotsFromContext,
  PickerFieldUISlotPropsFromContext,
} from '../../components/PickerFieldUI';
import { PickerStep } from '../../utils/createNonRangePickerStepNavigation';

export interface UseMobilePickerSlots
  extends
    PickersModalDialogSlots,
    ExportedPickersLayoutSlots<PickerValue>,
    PickerFieldUISlotsFromContext {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
}

export interface ExportedUseMobilePickerSlotProps
  extends
    PickersModalDialogSlotProps,
    ExportedPickersLayoutSlotProps<PickerValue>,
    PickerFieldUISlotPropsFromContext {
  field?: SlotComponentPropsFromProps<
    PickerFieldSlotProps<PickerValue>,
    {},
    PickerOwnerState
  >;
}

export interface UseMobilePickerSlotProps
  extends
    ExportedUseMobilePickerSlotProps,
    Pick<PickersLayoutSlotProps<PickerValue>, 'toolbar'> {}

export interface MobileOnlyPickerProps extends UsePickerNonStaticProps {}

export interface UseMobilePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerValue, TView, TError, any>,
>
  extends
    BasePickerProps<PickerValue, TView, TError, TExternalProps>,
    MakeRequired<MobileOnlyPickerProps, 'format'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseMobilePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseMobilePickerSlotProps;
}

export interface UseMobilePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobilePickerProps<
    TView,
    any,
    TExternalProps
  >,
> extends Pick<
  UsePickerParameters<PickerValue, TView, TExternalProps>,
  'valueManager' | 'valueType' | 'validator' | 'ref'
> {
  props: TExternalProps;
  /**
   * Steps available for the picker.
   * This will be used to define the behavior of navigation actions.
   * If null, the picker will not have any step navigation.
   */
  steps: PickerStep[] | null;
}
