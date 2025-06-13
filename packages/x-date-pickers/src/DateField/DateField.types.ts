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

export interface UseDateFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, DateValidationError>,
      'format'
    >,
    ExportedValidateDateProps,
    ExportedPickerFieldUIProps {}

export type DateFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseDateFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateFieldProps<TEnableAccessibleFieldDOMStructure>
    > & {
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

export type DateFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  DateFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface DateFieldSlots extends PickerFieldUISlots {}

export interface DateFieldSlotProps extends PickerFieldUISlotProps {}
