import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { testFormat } from './testFormat';
import { DescribeGregorianAdapterParams } from './describeGregorianAdapter.types';

export const TEST_DATE_ISO = '2018-10-30T11:44:00.000Z';

function innerGregorianDescribeAdapter<TDate>(
  Adapter: new (...args: any) => MuiPickersAdapter<TDate>,
  params: DescribeGregorianAdapterParams,
) {
  const adapter = new Adapter({});

  describe(adapter.lib, () => {
    const testSuitParams = {
      ...params,
      adapter,
      testDateISO: TEST_DATE_ISO,
      testDate: adapter.date(TEST_DATE_ISO),
    };

    testCalculations(testSuitParams);
    testLocalization(testSuitParams);
    testFormat(testSuitParams);
  });
}

export const describeGregorianAdapter = createDescribe(
  'Adapter methods',
  innerGregorianDescribeAdapter,
);
