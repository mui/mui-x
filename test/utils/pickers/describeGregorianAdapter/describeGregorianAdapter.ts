import createDescribe from '@mui-internal/test-utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { testFormat } from './testFormat';
import {
  DescribeGregorianAdapterParams,
  DescribeGregorianAdapterTestSuiteParams,
} from './describeGregorianAdapter.types';

function innerGregorianDescribeAdapter<TDate, TLocale>(
  Adapter: new (...args: any) => MuiPickersAdapter<TDate>,
  params: DescribeGregorianAdapterParams<TDate, TLocale>,
) {
  const prepareAdapter = params.prepareAdapter ?? ((e) => e);

  const adapter = new Adapter();
  const adapterTZ = params.dateLibInstanceWithTimezoneSupport
    ? new Adapter({
        dateLibInstance: params.dateLibInstanceWithTimezoneSupport,
      })
    : new Adapter();
  const adapterFr = new Adapter({
    locale: params.frenchLocale,
    dateLibInstance: params.dateLibInstanceWithTimezoneSupport,
  });

  prepareAdapter(adapter);
  prepareAdapter(adapterTZ);

  describe(adapter.lib, () => {
    const testSuitParams: DescribeGregorianAdapterTestSuiteParams<TDate, TLocale> = {
      ...params,
      adapter,
      adapterTZ,
      adapterFr,
    };

    testCalculations(testSuitParams);
    testLocalization(testSuitParams);
    testFormat(testSuitParams);
  });
}

type Params<TDate, TLocale> = [
  Adapter: new (...args: any) => MuiPickersAdapter<TDate>,
  params: DescribeGregorianAdapterParams<TDate, TLocale>,
];

type DescribeGregorianAdapter = {
  <TDate, TLocale>(...args: Params<TDate, TLocale>): void;
  skip: <TDate, TLocale>(...args: Params<TDate, TLocale>) => void;
  only: <TDate, TLocale>(...args: Params<TDate, TLocale>) => void;
};

export const describeGregorianAdapter = createDescribe(
  'Adapter methods',
  innerGregorianDescribeAdapter,
) as DescribeGregorianAdapter;
