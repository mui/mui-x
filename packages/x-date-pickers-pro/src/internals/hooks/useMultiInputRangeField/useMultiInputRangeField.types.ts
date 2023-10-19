import * as React from 'react';
import { UseFieldResponse } from '@mui/x-date-pickers/internals';
import { MultiInputFieldRefs } from '../../models/fields';

export interface UseMultiInputRangeFieldParams<
  TSharedProps extends {},
  TTextFieldSlotProps extends {},
> extends MultiInputFieldRefs {
  sharedProps: TSharedProps;
  startTextFieldProps: TTextFieldSlotProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  endTextFieldProps: TTextFieldSlotProps;
  endInputRef?: React.Ref<HTMLInputElement>;
}

export interface UseMultiInputRangeFieldResponse<TForwardedProps extends {}> {
  startDate: UseFieldResponse<TForwardedProps>;
  endDate: UseFieldResponse<TForwardedProps>;
}
