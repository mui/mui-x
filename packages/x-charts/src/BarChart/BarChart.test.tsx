import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM, testSkipIf } from 'test/utils/skipIf';

describe('<BarChart />', () => {
  const { render } = createRenderer();

  // TODO: Remove beforeEach/afterEach after vitest becomes our main runner
  beforeEach(() => {
    if (window?.document?.body?.style) {
      window.document.body.style.margin = '0';
    }
  });

  afterEach(() => {
    if (window?.document?.body?.style) {
      window.document.body.style.margin = '8px';
    }
  });

  describeConformance(
    <BarChart height={100} width={100} series={[{ data: [100, 200] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiBarChart',
      testComponentPropWith: 'div',
      refInstanceof: window.SVGSVGElement,
      skip: [
        'componentProp',
        'componentsProp',
        'slotPropsProp',
        'slotPropsCallback',
        'slotsProp',
        'themeStyleOverrides',
        'themeVariants',
        'themeCustomPalette',
        'themeDefaultProps',
      ],
    }),
  );

  it('should render "No data to display" when axes are empty arrays', () => {
    render(<BarChart series={[]} width={100} height={100} xAxis={[]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  it('should render "No data to display" when series are empty and axes are not empty arrays', () => {
    render(
      <BarChart
        series={[]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[]}
      />,
    );

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 400, height: 400 }}>{children}</div>
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  testSkipIf(isJSDOM)(
    'should hide tooltip if the item the tooltip was showing is removed',
    async () => {
      const { setProps, user } = render(
        <BarChart
          height={400}
          width={400}
          series={[{ data: [10] }]}
          xAxis={[{ scaleType: 'band', data: ['A'] }]}
          hideLegend
          skipAnimation
        />,
        { wrapper },
      );

      const bar = document.querySelector(`.${barElementClasses.root}`)!;
      await user.pointer({ target: bar, coords: { x: 200, y: 200 } });

      expect(await screen.findByRole('tooltip')).toBeVisible();

      setProps({
        series: [{ data: [] }],
        xAxis: [{ scaleType: 'band', data: [] }],
      });

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  testSkipIf(isJSDOM)(
    'should hide tooltip if the series of the item the tooltip was showing is removed',
    async () => {
      const { setProps, user } = render(
        <BarChart
          height={400}
          width={400}
          series={[{ data: [10] }]}
          xAxis={[{ scaleType: 'band', data: ['A'] }]}
          hideLegend
          skipAnimation
        />,
        { wrapper },
      );

      const bar = document.querySelector(`.${barElementClasses.root}`)!;

      await user.pointer({ target: bar, coords: { x: 200, y: 200 } });

      expect(await screen.findByRole('tooltip')).toBeVisible();

      setProps({
        series: [],
        xAxis: [],
      });

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );
});
