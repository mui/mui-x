import { MakeOptional } from '@mui/x-internals/types';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { TimeValidationError, BuiltInFieldTextFieldProps } from '../models';
import { ExportedValidateTimeProps } from '../validation/validateTime';
import { AmPmProps } from '../internals/models/props/time';
import { PickerValue } from '../internals/models';
import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlotProps,
  PickerFieldUISlots,
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
