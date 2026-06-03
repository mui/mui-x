import type * as React from 'react';
import { type MakeRequired, type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { type BasePickerProps } from '../../models/props/basePickerProps';
import {
  type PickerPopperSlots,
  type PickerPopperSlotProps,
} from '../../components/PickerPopper/PickerPopper';
import {
  type UsePickerParameters,
  type UsePickerNonStaticProps,
  type UsePickerProps,
} from '../usePicker';
import { type PickerFieldSlotProps, type PickerOwnerState } from '../../../models';
import {
  type ExportedPickersLayoutSlots,
  type ExportedPickersLayoutSlotProps,
  type PickersLayoutSlotProps,
} from '../../../PickersLayout/PickersLayout.types';
import { type DateOrTimeViewWithMeridiem, type PickerValue } from '../../models';
import {
  type PickerFieldUISlotsFromContext,
  type PickerFieldUISlotPropsFromContext,
} from '../../components/PickerFieldUI';
import { type PickerStep } from '../../utils/createNonRangePickerStepNavigation';

export interface UseDesktopPickerSlots
  extends
    Pick<PickerPopperSlots, 'desktopPaper' | 'desktopTransition' | 'desktopTrapFocus' | 'popper'>,
    ExportedPickersLayoutSlots<PickerValue>,
    PickerFieldUISlotsFromContext {
  /**
   * Component used to enter the date with the keyboard.
   */
  field: React.ElementType;
}

export interface ExportedUseDesktopPickerSlotProps
  extends
    PickerPopperSlotProps,
    ExportedPickersLayoutSlotProps<PickerValue>,
    PickerFieldUISlotPropsFromContext {
  field?: SlotComponentPropsFromProps<PickerFieldSlotProps<PickerValue>, {}, PickerOwnerState>;
}

export interface UseDesktopPickerSlotProps
  extends ExportedUseDesktopPickerSlotProps, Pick<PickersLayoutSlotProps<PickerValue>, 'toolbar'> {}

export interface DesktopOnlyPickerProps extends UsePickerNonStaticProps {
  /**
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;
}

export interface UseDesktopPickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerValue, TView, TError, any>,
>
  extends
    BasePickerProps<PickerValue, any, TError, TExternalProps>,
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
  slotProps?: UseDesktopPickerSlotProps;
}

export interface UseDesktopPickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseDesktopPickerProps<TView, any, TExternalProps>,
> extends Pick<
  UsePickerParameters<PickerValue, TView, TExternalProps>,
  'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor' | 'ref'
> {
  props: TExternalProps;
  /**
   * Steps available for the picker.
   * This will be used to define the behavior of navigation actions.
   * If null, the picker will not have any step navigation.
   */
  steps: PickerStep[] | null;
}
