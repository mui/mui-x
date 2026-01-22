import createDescribe from '@mui/internal-test-utils/createDescribe';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { testCalculations } from './testCalculations';
import { testLocalization } from './testLocalization';
import { testFormat } from './testFormat';
import { DescribeBuddhistAdapterParams } from './describeBuddhistAdapter.types';

function innerBuddhistDescribeAdapter(
  Adapter: new (...args: any) => MuiPickersAdapter,
  params: DescribeBuddhistAdapterParams,
) {
  const adapter = new Adapter();

  describe(adapter.lib, () => {
    const testSuitParams = {
      ...params,
      adapter,
    };

    if (params.before) {
      beforeAll(params.before);
    }

    if (params.after) {
      afterAll(params.after);
    }

    testCalculations(testSuitParams);
    testLocalization(testSuitParams);
    testFormat(testSuitParams);
  });
}

export const describeBuddhistAdapter = createDescribe('Adapter methods', innerBuddhistDescribeAdapter);
