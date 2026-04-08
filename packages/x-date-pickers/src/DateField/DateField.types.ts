import { MakeOptional } from '@mui/x-internals/types';
import { DateValidationError, BuiltInFieldTextFieldProps } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { ExportedValidateDateProps } from '../validation/validateDate';
import { PickerValue } from '../internals/models';
import {
  ExportedPickerFieldUIProps,
  PickerFieldUISlotProps,
  PickerFieldUISlots,
} from '../internals/components/PickerFieldUI';

export interface UseDateFieldProps
  extends
    MakeOptional<UseFieldInternalProps<PickerValue, DateValidationError>, 'format'>,
    ExportedValidateDateProps,
    ExportedPickerFieldUIProps {}

export type DateFieldProps =
  // The hook props
  UseDateFieldProps &
    // The TextField props
    Omit<BuiltInFieldTextFieldProps, keyof UseDateFieldProps> & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: DateFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: DateFieldSlotProps;
    };

export type DateFieldOwnerState = DateFieldProps;

export interface DateFieldSlots extends PickerFieldUISlots {}

export interface DateFieldSlotProps extends PickerFieldUISlotProps {}
