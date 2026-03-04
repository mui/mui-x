import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartsDataProviderPro } from '@mui/x-charts-pro/ChartsDataProviderPro';

describe('<ChartsDataProviderPro />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsDataProviderPro height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartsDataProviderPro',
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
