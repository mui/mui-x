import { MuiPickersAdapter } from '@mui/x-date-pickers/models';

export interface DescribeJalaliAdapterParams {
  before?: () => void;
  after?: () => void;
}

export type DescribeJalaliAdapterTestSuite = (params: { adapter: MuiPickersAdapter }) => void;
