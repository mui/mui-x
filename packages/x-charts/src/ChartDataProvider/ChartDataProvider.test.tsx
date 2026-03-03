import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';

describe('<ChartsDataProvider />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsDataProvider height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartsDataProvider',
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
