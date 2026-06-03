import { type MakeOptional } from '@mui/x-internals/types';
import { type UseFieldInternalProps } from '../internals/hooks/useField';
import { type TimeValidationError, type BuiltInFieldTextFieldProps } from '../models';
import { type ExportedValidateTimeProps } from '../validation/validateTime';
import { type AmPmProps } from '../internals/models/props/time';
import { type PickerValue } from '../internals/models';
import {
  type ExportedPickerFieldUIProps,
  type PickerFieldUISlotProps,
  type PickerFieldUISlots,
} from '../internals/components/PickerFieldUI';

export interface UseTimeFieldProps
  extends
    MakeOptional<UseFieldInternalProps<PickerValue, TimeValidationError>, 'format'>,
    ExportedValidateTimeProps,
    ExportedPickerFieldUIProps,
    AmPmProps {}

export type TimeFieldProps =
  // The hook props
  UseTimeFieldProps &
    // The TextField props
    Omit<BuiltInFieldTextFieldProps, keyof UseTimeFieldProps> & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: TimeFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: TimeFieldSlotProps;
    };

export interface TimeFieldSlots extends PickerFieldUISlots {}

export interface TimeFieldSlotProps extends PickerFieldUISlotProps {}
