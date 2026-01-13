import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartDataProviderPremium } from './ChartDataProviderPremium';

describe('<ChartDataProviderPremium />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartDataProviderPremium height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartDataProviderPremium',
    testComponentPropWith: 'div',
    refInstanceof: window.SVGSVGElement,
    skip: [
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'refForwarding',
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
