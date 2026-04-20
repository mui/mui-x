import { MuiPickersAdapter } from '@mui/x-date-pickers/models';

export interface DescribeBuddhistAdapterParams {
  before?: () => void;
  after?: () => void;
}

export type DescribeBuddhistAdapterTestSuite = (params: { adapter: MuiPickersAdapter }) => void;
