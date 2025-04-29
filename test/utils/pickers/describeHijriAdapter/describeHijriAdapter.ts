import createDescribe from '@mui/internal-test-utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { testFormat } from './testFormat';
import { DescribeHijriAdapterParams } from './describeHijriAdapter.types';

function innerJalaliDescribeAdapter(
  Adapter: new (...args: any) => MuiPickersAdapter,
  params: DescribeHijriAdapterParams,
) {
  const adapter = new Adapter();

  describe(adapter.lib, () => {
    const testSuitParams = {
      ...params,
      adapter,
    };

    if (params.before) {
      before(params.before);
    }

    if (params.after) {
      after(params.after);
    }

    testCalculations(testSuitParams);
    testLocalization(testSuitParams);
    testFormat(testSuitParams);
  });
}

export const describeHijriAdapter = createDescribe('Adapter methods', innerJalaliDescribeAdapter);
