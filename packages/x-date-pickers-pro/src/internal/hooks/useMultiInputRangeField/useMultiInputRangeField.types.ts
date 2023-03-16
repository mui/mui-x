import { UseFieldResponse, UseFieldForwardedProps } from '@mui/x-date-pickers/internals';

export interface UseMultiInputRangeFieldResponse<TForwardedProps extends UseFieldForwardedProps> {
  startDate: UseFieldResponse<TForwardedProps>;
  endDate: UseFieldResponse<TForwardedProps>;
}
