import { MakeOptional } from '@mui/x-internals/types';
import { DateTimeValidationError, BuiltInFieldTextFieldProps } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { ExportedValidateDateTimeProps } from '../validation/validateDateTime';
import { AmPmProps } from '../internals/models/props/time';
import { PickerValue } from '../internals/models';
import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlotProps,
  PickerFieldUISlots,
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
