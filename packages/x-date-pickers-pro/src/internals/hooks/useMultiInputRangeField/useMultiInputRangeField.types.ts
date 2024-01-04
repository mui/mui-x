import * as React from 'react';
import { FieldRef, FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { UseFieldResponse } from '@mui/x-date-pickers/internals';
import { RangeFieldSection } from '../../../models';

export interface UseMultiInputRangeFieldParams<
  TSharedProps extends {},
  TTextFieldSlotProps extends {},
> {
  sharedProps: TSharedProps;
  startTextFieldProps: TTextFieldSlotProps;
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  endTextFieldProps: TTextFieldSlotProps;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export interface UseMultiInputRangeFieldResponse<
  TTextFieldVersion extends FieldTextFieldVersion,
  TForwardedProps extends {},
> {
  startDate: UseFieldResponse<TTextFieldVersion, TForwardedProps>;
  endDate: UseFieldResponse<TTextFieldVersion, TForwardedProps>;
}
