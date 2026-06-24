import type { MakeOptional } from '@mui/x-internals/types';
import type { DateValidationError, BuiltInFieldTextFieldProps } from '../models';
import type { UseFieldInternalProps } from '../internals/hooks/useField';
import type { ExportedValidateDateProps } from '../validation/validateDate';
import type { PickerValue } from '../internals/models';
import type {
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
