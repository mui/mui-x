import { UseFieldResponse } from '@mui/x-date-pickers/internals';
import { MultiInputFieldRefs } from '../../models/fields';

export interface UseMultiInputRangeFieldParams<
  TSharedProps extends {},
  TTextFieldSlotProps extends {},
> extends MultiInputFieldRefs {
  sharedProps: TSharedProps;
  startTextFieldProps: TTextFieldSlotProps;
  endTextFieldProps: TTextFieldSlotProps;
}

export interface UseMultiInputRangeFieldResponse<TForwardedProps extends {}> {
  startDate: UseFieldResponse<TForwardedProps>;
  endDate: UseFieldResponse<TForwardedProps>;
}
