import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartDataProvider } from '@mui/x-charts/context/ChartDataProvider';
import { ChartsSurface } from '../../ChartsSurface';

describe('<ChartDataProvider />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartDataProvider height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartDataProvider',
    testComponentPropWith: 'div',
    refInstanceof: window.SVGSVGElement,
    skip: [
      // Need `<ChartsSurface />` to work
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'refForwarding',
      // X
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

  describe('with ChartsSurface', () => {
    describeConformance(
      <ChartDataProvider height={100} width={100} series={[]}>
        <ChartsSurface />
      </ChartDataProvider>,
      () => ({
        classes: {} as any,
        inheritComponent: 'svg',
        render,
        muiName: 'MuiChartDataProvider',
        testComponentPropWith: 'div',
        refInstanceof: window.SVGSVGElement,
        only: ['refForwarding', 'mergeClassName', 'propsSpread', 'rootClass'],
      }),
    );
  });
});
