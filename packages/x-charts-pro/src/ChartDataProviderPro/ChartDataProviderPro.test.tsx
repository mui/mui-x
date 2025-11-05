import { createRenderer, describeConformance, waitFor } from '@mui/internal-test-utils';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface, chartsSurfaceClasses } from '@mui/x-charts/ChartsSurface';

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

  it('allows touch horizontal scrolling when zoom is disabled', () => {
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

    const surface = container.querySelector(`.${chartsSurfaceClasses.root}`);

    expect(getComputedStyle(surface).touchAction).to.eq('auto');
  });

  it('disables touch horizontal scrolling when zoom is enabled', async () => {
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

    const surface = container.querySelector(`.${chartsSurfaceClasses.root}`);

    expect(getComputedStyle(surface).touchAction).to.eq('pan-y');
  });
});
