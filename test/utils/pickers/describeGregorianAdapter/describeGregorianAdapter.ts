import createDescribe from '@mui/internal-test-utils/createDescribe';
import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { testFormat } from './testFormat';
import {
  DescribeGregorianAdapterParams,
  DescribeGregorianAdapterTestSuiteParams,
} from './describeGregorianAdapter.types';

function innerGregorianDescribeAdapter<TDate extends PickerValidDate, TLocale>(
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

type Params<TDate extends PickerValidDate, TLocale> = [
  Adapter: new (...args: any) => MuiPickersAdapter<TDate>,
  params: DescribeGregorianAdapterParams<TDate, TLocale>,
];

type DescribeGregorianAdapter = {
  <TDate extends PickerValidDate, TLocale>(...args: Params<TDate, TLocale>): void;
  skip: <TDate extends PickerValidDate, TLocale>(...args: Params<TDate, TLocale>) => void;
  only: <TDate extends PickerValidDate, TLocale>(...args: Params<TDate, TLocale>) => void;
};

export const describeGregorianAdapter = createDescribe(
  'Adapter methods',
  innerGregorianDescribeAdapter,
) as DescribeGregorianAdapter;
