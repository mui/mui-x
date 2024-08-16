import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';

export interface DescribeHijriAdapterParams {
  before?: () => void;
  after?: () => void;
}

export type DescribeHijriAdapterTestSuite = <TDate extends PickerValidDate>(params: {
  adapter: MuiPickersAdapter<TDate>;
}) => void;
