import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

describe('<SparkLineChart />', () => {
  const { render } = createRenderer();

  describeConformance(<SparkLineChart height={100} width={100} data={[100, 200]} />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiSparkLineChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'slotPropsProp',
      'slotPropsCallback',
      'slotsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'themeCustomPalette',
    ],
  }));
});
