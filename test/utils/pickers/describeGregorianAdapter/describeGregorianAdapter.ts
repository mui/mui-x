import createDescribe from '@mui/internal-test-utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { testFormat } from './testFormat';
import {
  DescribeGregorianAdapterParams,
  DescribeGregorianAdapterTestSuiteParams,
} from './describeGregorianAdapter.types';

function innerGregorianDescribeAdapter<TLocale>(
  Adapter: new (...args: any) => MuiPickersAdapter,
  params: DescribeGregorianAdapterParams<TLocale>,
) {
  const prepareAdapter = params.prepareAdapter ?? ((adapter) => adapter);

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
    const testSuitParams: DescribeGregorianAdapterTestSuiteParams<TLocale> = {
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

type Params<TLocale> = [
  Adapter: new (...args: any) => MuiPickersAdapter,
  params: DescribeGregorianAdapterParams<TLocale>,
];

type DescribeGregorianAdapter = {
  <TLocale>(...args: Params<TLocale>): void;
  skip: <TLocale>(...args: Params<TLocale>) => void;
  only: <TLocale>(...args: Params<TLocale>) => void;
};

export const describeGregorianAdapter = createDescribe(
  'Adapter methods',
  innerGregorianDescribeAdapter,
) as DescribeGregorianAdapter;
