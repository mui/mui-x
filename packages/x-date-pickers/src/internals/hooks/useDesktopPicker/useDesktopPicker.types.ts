import * as React from 'react';
import { MakeRequired, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { BasePickerProps } from '../../models/props/basePickerProps';
import {
  PickerPopperSlots,
  PickerPopperSlotProps,
} from '../../components/PickerPopper/PickerPopper';
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
import { PickerStep } from '../useNonRangePickerStepNavigation';

export interface UseDesktopPickerSlots
  extends Pick<
      PickerPopperSlots,
      'desktopPaper' | 'desktopTransition' | 'desktopTrapFocus' | 'popper'
    >,
    ExportedPickersLayoutSlots<PickerValue>,
    PickerFieldUISlotsFromContext {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
}

export interface ExportedUseDesktopPickerSlotProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends PickerPopperSlotProps,
    ExportedPickersLayoutSlotProps<PickerValue>,
    PickerFieldUISlotPropsFromContext {
  field?: SlotComponentPropsFromProps<
    PickerFieldSlotProps<PickerValue, TEnableAccessibleFieldDOMStructure>,
    {},
    PickerOwnerState
  >;
}

export interface UseDesktopPickerSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends ExportedUseDesktopPickerSlotProps<TEnableAccessibleFieldDOMStructure>,
    Pick<PickersLayoutSlotProps<PickerValue>, 'toolbar'> {}

export interface DesktopOnlyPickerProps extends UsePickerNonStaticProps {
  /**
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
}

export interface UseDesktopPickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
  TExternalProps extends UsePickerProps<PickerValue, TView, TError, any>,
> extends BasePickerProps<PickerValue, any, TError, TExternalProps>,
    MakeRequired<DesktopOnlyPickerProps, 'format'> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: UseDesktopPickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseDesktopPickerSlotProps<TEnableAccessibleFieldDOMStructure>;
}

export interface UseDesktopPickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopPickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
> extends Pick<
    UsePickerParameters<PickerValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor' | 'ref'
  > {
  props: TExternalProps;
  /**
   * Steps available for the picker.
   * This will be used to generate the "previous" and "next" actions.
   * If null, the picker will not have any step navigation.
   */
  steps: PickerStep[] | null;
}
