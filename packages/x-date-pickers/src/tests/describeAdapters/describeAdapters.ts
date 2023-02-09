import moment from 'moment'
import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import {
  AdapterName,
  buildFieldInteractions,
  createPickerRenderer,
} from 'test/utils/pickers-utils';

interface DescribeAdaptersParams {}

type AdapterTestsRunner = (
  params: ReturnType<typeof createPickerRenderer> &
    ReturnType<typeof buildFieldInteractions> & { adapterName: AdapterName },
) => void;

const ADAPTERS: AdapterName[] = ['dayjs', 'date-fns', 'luxon', 'moment'];

function innerDescribeAdapters(
  ...args: [string, AdapterTestsRunner] | [string, DescribeAdaptersParams, AdapterTestsRunner]
) {
  const [title, params, testRunner] = args.length === 3 ? args : [args[0], {}, args[1]];

  ADAPTERS.forEach((adapterName) => {
    describe(`${title} - adapter: ${adapterName}`, () => {
      if (adapterName === 'moment') {
        moment.locale('en')
      }


      const pickerRendererResponse = createPickerRenderer({
        adapterName,
        clock: 'fake',
        clockConfig: new Date(2022, 5, 15),
      });

      const fieldInteractions = buildFieldInteractions({
        clock: pickerRendererResponse.clock,
        render: pickerRendererResponse.render,
      });

      testRunner({ adapterName, ...pickerRendererResponse, ...fieldInteractions });
    });
  });
}

export const describeAdapters = createDescribe('Adapter specific tests', innerDescribeAdapters);
