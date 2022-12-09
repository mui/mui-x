import { UseFieldResponse } from '@mui/x-date-pickers/internals';

export interface UseMultiInputRangeFieldResponse<TChildProps extends {}> {
  startDate: UseFieldResponse<TChildProps> & { error: boolean };
  endDate: UseFieldResponse<TChildProps> & { error: boolean };
}
