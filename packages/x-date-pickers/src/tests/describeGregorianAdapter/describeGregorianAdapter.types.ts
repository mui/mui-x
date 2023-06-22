import { MuiPickersAdapter, PickersTimezone } from '@mui/x-date-pickers/models';

export interface DescribeGregorianAdapterParams<TDate, TLocale> {
  prepareAdapter?: (adapter: MuiPickersAdapter<TDate, TLocale>) => void;
  formatDateTime: string;
  getLocaleFromDate?: (value: TDate) => string;
  dateLibInstanceWithTimezoneSupport?: any;
  setDefaultTimezone: (timezone: PickersTimezone | undefined) => void;
  frenchLocale: TLocale;
}

export interface DescribeGregorianAdapterTestSuiteParams<TDate, TLocale>
  extends Omit<DescribeGregorianAdapterParams<TDate, TLocale>, 'frenchLocale'> {
  adapter: MuiPickersAdapter<TDate, TLocale>;
  adapterTZ: MuiPickersAdapter<TDate, TLocale>;
  adapterFr: MuiPickersAdapter<TDate, TLocale>;
}

export type DescribeGregorianAdapterTestSuite = <TDate, TLocale>(
  params: DescribeGregorianAdapterTestSuiteParams<TDate, TLocale>,
) => void;
