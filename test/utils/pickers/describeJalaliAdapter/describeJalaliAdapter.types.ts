import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';

export interface DescribeJalaliAdapterParams {
  before?: () => void;
  after?: () => void;
}

export type DescribeJalaliAdapterTestSuite = <TDate extends PickerValidDate>(params: {
  adapter: MuiPickersAdapter<TDate>;
}) => void;
