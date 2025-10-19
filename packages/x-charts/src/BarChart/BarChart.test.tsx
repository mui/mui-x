import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';

describe('<BarChart />', () => {
  const { render } = createRenderer();

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
    render(<BarChart series={[]} width={100} height={100} xAxis={[{ data: ['A'] }]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 400, height: 400 }}>{children}</div>
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should hide tooltip if the item the tooltip was showing is removed',
    async () => {
      const { setProps, user } = render(
        <BarChart
          height={400}
          width={400}
          series={[{ data: [10] }]}
          xAxis={[{ data: ['A'] }]}
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
        xAxis: [{ data: [] }],
      });

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should hide tooltip if the series of the item the tooltip was showing is removed',
    async () => {
      const { setProps, user } = render(
        <BarChart
          height={400}
          width={400}
          series={[{ data: [10] }]}
          xAxis={[{ data: ['A'] }]}
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

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)(
    'should highlight element on pointer enter and remove highlight on pointer leave',
    async () => {
      const { user } = render(
        <BarChart
          height={400}
          width={400}
          series={[
            { data: [5, 10], highlightScope: { highlight: 'item', fade: 'global' } },
            { data: [1, 2] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
          hideLegend
          skipAnimation
        />,
        { wrapper },
      );

      const bars = document.querySelectorAll(`.${barElementClasses.root}`);

      await user.pointer({ target: bars[0] });

      expect([...bars].map((b) => b.getAttribute('data-highlighted'))).to.deep.equal([
        'true',
        null,
        null,
        null,
      ]);
      expect([...bars].map((b) => b.getAttribute('data-faded'))).to.deep.equal([
        null,
        'true',
        'true',
        'true',
      ]);
    },
  );
});
