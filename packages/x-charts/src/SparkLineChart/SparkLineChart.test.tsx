import { createRenderer } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { describe } from 'vitest';

describe('<SparkLineChart />', () => {
  const { render } = createRenderer();

  describeConformance(<SparkLineChart height={100} width={100} data={[100, 200]} />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiSparkLineChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
  }));
});
