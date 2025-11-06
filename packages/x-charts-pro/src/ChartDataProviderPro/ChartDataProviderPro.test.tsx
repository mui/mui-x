import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface, chartsSurfaceClasses } from '@mui/x-charts/ChartsSurface';
import { isJSDOM } from '@mui/x-internals/platform';

describe('<ChartDataProviderPro />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartDataProviderPro height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartDataProviderPro',
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

  it.skipIf(isJSDOM)('should have touch-action=auto when zoom is disabled', () => {
    const { container } = render(
      <ChartDataProviderPro
        xAxis={[{ data: [1, 2] }]}
        series={[{ type: 'line', data: [10, 20] }]}
        width={100}
        height={100}
      >
        <ChartsSurface />
      </ChartDataProviderPro>,
    );

    // eslint-disable-next-line testing-library/no-container
    const surface = container.querySelector(`.${chartsSurfaceClasses.root}`) as HTMLElement;

    expect(getComputedStyle(surface).touchAction).to.eq('auto');
  });

  it.skipIf(isJSDOM)('should have touch-action=pan-y when zoom is enabled', () => {
    const { container } = render(
      <ChartDataProviderPro
        xAxis={[{ data: [1, 2], zoom: true }]}
        series={[{ type: 'line', data: [10, 20] }]}
        width={100}
        height={100}
      >
        <ChartsSurface />
      </ChartDataProviderPro>,
    );

    // eslint-disable-next-line testing-library/no-container
    const surface = container.querySelector(`.${chartsSurfaceClasses.root}`) as HTMLElement;

    expect(getComputedStyle(surface).touchAction).to.eq('pan-y');
  });

  it.skipIf(isJSDOM)(
    'should have touch-action=auto when zoom is disabled, but controlled zoom data is set',
    () => {
      const { container } = render(
        <ChartDataProviderPro
          xAxis={[{ id: 'x', data: [1, 2] }]}
          series={[{ type: 'line', xAxisId: 'x', data: [10, 20] }]}
          zoomData={[{ axisId: 'x', start: 0, end: 100 }]}
          width={100}
          height={100}
        >
          <ChartsSurface />
        </ChartDataProviderPro>,
      );

      // eslint-disable-next-line testing-library/no-container
      const surface = container.querySelector(`.${chartsSurfaceClasses.root}`) as HTMLElement;

      expect(getComputedStyle(surface).touchAction).to.eq('auto');
    },
  );

  it.skipIf(isJSDOM)(
    'should have touch-action=pan-y when zoom is enabled and controlled zoom data is set',
    () => {
      const { container } = render(
        <ChartDataProviderPro
          xAxis={[{ id: 'x', data: [1, 2], zoom: true }]}
          series={[{ type: 'line', xAxisId: 'x', data: [10, 20] }]}
          zoomData={[{ axisId: 'x', start: 0, end: 100 }]}
          width={100}
          height={100}
        >
          <ChartsSurface />
        </ChartDataProviderPro>,
      );

      // eslint-disable-next-line testing-library/no-container
      const surface = container.querySelector(`.${chartsSurfaceClasses.root}`) as HTMLElement;

      expect(getComputedStyle(surface).touchAction).to.eq('pan-y');
    },
  );
});
