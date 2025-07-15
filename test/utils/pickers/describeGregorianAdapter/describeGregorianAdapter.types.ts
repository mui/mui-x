import { MuiPickersAdapter, PickersTimezone, PickerValidDate } from '@mui/x-date-pickers/models';

export interface DescribeGregorianAdapterParams<TLocale> {
  prepareAdapter?: (adapter: MuiPickersAdapter<TLocale>) => void;
  formatDateTime: string;
  getLocaleFromDate?: (value: PickerValidDate) => string;
  dateLibInstanceWithTimezoneSupport?: any;
  setDefaultTimezone: (timezone: PickersTimezone | undefined) => void;
  frenchLocale: TLocale;
}

export interface DescribeGregorianAdapterTestSuiteParams<TLocale>
  extends Omit<DescribeGregorianAdapterParams<TLocale>, 'frenchLocale'> {
  adapter: MuiPickersAdapter<TLocale>;
  adapterTZ: MuiPickersAdapter<TLocale>;
  adapterFr: MuiPickersAdapter<TLocale>;
}

export type DescribeGregorianAdapterTestSuite = <TLocale>(
  params: DescribeGregorianAdapterTestSuiteParams<TLocale>,
) => void;
