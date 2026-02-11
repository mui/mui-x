import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium/ChartsDataProviderPremium';

describe('<ChartsDataProviderPremium />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsDataProviderPremium height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartsDataProviderPremium',
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
