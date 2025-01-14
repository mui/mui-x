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

export interface UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerValue,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    ExportedValidateDateTimeProps,
    ExportedPickerFieldUIProps,
    AmPmProps {}

export type DateTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>
    > & {
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
