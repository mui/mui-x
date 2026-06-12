import { type MakeOptional } from '@mui/x-internals/types';
import { type DateTimeValidationError, type BuiltInFieldTextFieldProps } from '../models';
import { type UseFieldInternalProps } from '../internals/hooks/useField';
import { type ExportedValidateDateTimeProps } from '../validation/validateDateTime';
import { type AmPmProps } from '../internals/models/props/time';
import { type PickerValue } from '../internals/models';
import {
  type ExportedPickerFieldUIProps,
  type PickerFieldUISlotProps,
  type PickerFieldUISlots,
} from '../internals/components/PickerFieldUI';

export interface UseDateTimeFieldProps
  extends
    MakeOptional<UseFieldInternalProps<PickerValue, DateTimeValidationError>, 'format'>,
    ExportedValidateDateTimeProps,
    ExportedPickerFieldUIProps,
    AmPmProps {}

export type DateTimeFieldProps =
  // The hook props
  UseDateTimeFieldProps &
    // The TextField props
    Omit<BuiltInFieldTextFieldProps, keyof UseDateTimeFieldProps> & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: DateTimeFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: DateTimeFieldSlotProps;
    };

export interface DateTimeFieldSlots extends PickerFieldUISlots {}

export interface DateTimeFieldSlotProps extends PickerFieldUISlotProps {}
