import * as React from 'react';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UseFieldResponse } from '@mui/x-date-pickers/internals';
import { RangeFieldSection } from '../../models/fields';

export interface UseMultiInputRangeFieldParams<
  TSharedProps extends {},
  TTextFieldSlotProps extends {},
> {
  sharedProps: TSharedProps;
  startTextFieldProps: TTextFieldSlotProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  endTextFieldProps: TTextFieldSlotProps;
  endInputRef?: React.Ref<HTMLInputElement>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export interface UseMultiInputRangeFieldResponse<TForwardedProps extends {}> {
  startDate: UseFieldResponse<TForwardedProps>;
  endDate: UseFieldResponse<TForwardedProps>;
}
