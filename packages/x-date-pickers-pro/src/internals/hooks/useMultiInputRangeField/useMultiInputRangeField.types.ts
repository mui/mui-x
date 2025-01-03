import { UseFieldReturnValue } from '@mui/x-date-pickers/internals';
import { MultiInputFieldRefs } from '../../../models';

export interface UseMultiInputRangeFieldParams<
  TSharedProps extends {},
  TTextFieldSlotProps extends {},
> extends MultiInputFieldRefs {
  sharedProps: TSharedProps;
  startTextFieldProps: TTextFieldSlotProps;
  endTextFieldProps: TTextFieldSlotProps;
}

export interface UseMultiInputRangeFieldResponse<
  TEnableAccessibleFieldDOMStructure extends boolean,
  TForwardedProps extends {},
> {
  startDate: UseFieldReturnValue<TEnableAccessibleFieldDOMStructure, TForwardedProps>;
  endDate: UseFieldReturnValue<TEnableAccessibleFieldDOMStructure, TForwardedProps>;
}
