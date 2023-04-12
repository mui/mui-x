import { MuiPickersAdapter } from '@mui/x-date-pickers/models';

export interface DescribeGregorianAdapterParams {
  formatDateTime: string;
}

export type DescribeGregorianAdapterTestSuite = <TDate>(params: {
  adapter: MuiPickersAdapter<TDate>;
  testDate: TDate;
  testDateISO: string;
  formatDateTime: string;
}) => void;
