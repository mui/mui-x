import { createRenderer } from '@mui/internal-test-utils';
import { Gauge } from '@mui/x-charts/Gauge';
import { describeConformance } from 'test/utils/charts/describeConformance';

describe('<Gauge />', () => {
  const { render } = createRenderer();

  describeConformance(<Gauge height={100} width={100} value={60} />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiGauge',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
  }));
});
