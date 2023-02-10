import * as React from 'react'
import moment from 'moment';
import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import {
  AdapterName,
  buildFieldInteractions,
  createPickerRenderer,
} from 'test/utils/pickers-utils';

type AdapterTestRunner = (
  params: ReturnType<typeof createPickerRenderer> &
    ReturnType<typeof buildFieldInteractions> & { adapterName: AdapterName },
) => void;

const ADAPTERS: AdapterName[] = ['dayjs', 'date-fns', 'luxon', 'moment'];

function innerDescribeAdapters<P extends {}>(
  title: string, FieldComponent: React.FunctionComponent<P>, testRunner: AdapterTestRunner,
) {
  ADAPTERS.forEach((adapterName) => {
    describe(`${title} - adapter: ${adapterName}`, () => {
      if (adapterName === 'moment') {
        moment.locale('en');
      }

      const pickerRendererResponse = createPickerRenderer({
        adapterName,
        clock: 'fake',
        clockConfig: new Date(2022, 5, 15),
      });

      const fieldInteractions = buildFieldInteractions<P>({
        clock: pickerRendererResponse.clock,
        render: pickerRendererResponse.render,
        FieldComponent,
      });

      testRunner({ adapterName, ...pickerRendererResponse, ...fieldInteractions });
    });
  });
}

export const describeAdapters = createDescribe('Adapter specific tests', innerDescribeAdapters);
