import * as React from 'react';
import moment from 'moment';
import createDescribe from '@mui/monorepo/test/utils/createDescribe';
import {
  AdapterName,
  buildFieldInteractions,
  BuildFieldInteractionsResponse,
  createPickerRenderer,
} from 'test/utils/pickers-utils';

type AdapterTestRunner<P extends {}> = (
  params: ReturnType<typeof createPickerRenderer> &
    BuildFieldInteractionsResponse<P> & { adapterName: AdapterName },
) => void;

const ADAPTERS: AdapterName[] = ['dayjs', 'date-fns', 'luxon', 'moment'];

function innerDescribeAdapters<P extends {}>(
  title: string,
  FieldComponent: React.FunctionComponent<P>,
  testRunner: AdapterTestRunner<P>,
) {
  ADAPTERS.forEach((adapterName) => {
    // TODO: Set locale moment before the 1st test run
    if (adapterName === 'moment') {
      moment.locale('en');
    }

    describe(`${title} - adapter: ${adapterName}`, () => {
      const pickerRendererResponse = createPickerRenderer({
        adapterName,
        clock: 'fake',
        clockConfig: new Date(2022, 5, 15),
      });

      const fieldInteractions = buildFieldInteractions<P>({
        clock: pickerRendererResponse.clock,
        render: pickerRendererResponse.render,
        Component: FieldComponent,
      });

      testRunner({ adapterName, ...pickerRendererResponse, ...fieldInteractions });
    });
  });
}

type Params<P extends {}> = [string, React.FunctionComponent<P>, AdapterTestRunner<P>];

type DescribeAdapters = {
  <P extends {}>(...args: Params<P>): void;
  skip: <P extends {}>(...args: Params<P>) => void;
  only: <P extends {}>(...args: Params<P>) => void;
};

export const describeAdapters = createDescribe(
  'Adapter specific tests',
  innerDescribeAdapters,
) as DescribeAdapters;
