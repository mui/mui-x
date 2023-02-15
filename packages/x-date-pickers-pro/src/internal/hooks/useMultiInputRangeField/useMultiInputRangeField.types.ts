import * as React from 'react';
import { FieldRef } from '@mui/x-date-pickers';
import { UseFieldResponse } from '@mui/x-date-pickers/internals';
import { RangeFieldSection } from '../../models/fields';

export interface UseMultiInputRangeFieldParams<
  TSharedProps extends {},
  TTextFieldProps extends {},
> {
  sharedProps: TSharedProps;
  startTextFieldProps: TTextFieldProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  endTextFieldProps: TTextFieldProps;
  endInputRef?: React.Ref<HTMLInputElement>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export interface UseMultiInputRangeFieldResponse<TForwardedProps extends {}> {
  startDate: UseFieldResponse<TForwardedProps>;
  endDate: UseFieldResponse<TForwardedProps>;
}
