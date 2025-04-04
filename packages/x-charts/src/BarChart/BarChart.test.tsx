import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM, testSkipIf } from 'test/utils/skipIf';

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

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  testSkipIf(isJSDOM)(
    'should hide tooltip if the item the tooltip was showing is removed',
    async () => {
      const { rerender, user } = render(
        <BarChart
          height={100}
          width={100}
          series={[{ data: [10] }]}
          xAxis={[{ scaleType: 'band', data: ['A'] }]}
          hideLegend
          skipAnimation
        />,
      );

      const bar = document.querySelector(`.${barElementClasses.root}`)!;
      await user.pointer({ target: bar, coords: { x: 520, y: 40 } });

      expect(await screen.findByRole('tooltip')).toBeVisible();

      rerender(
        <BarChart
          height={100}
          width={100}
          series={[{ data: [] }]}
          xAxis={[{ scaleType: 'band', data: [] }]}
          hideLegend
          skipAnimation
        />,
      );

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  testSkipIf(isJSDOM)(
    'should hide tooltip if the series of the item the tooltip was showing is removed',
    async () => {
      const { rerender, user } = render(
        <BarChart
          height={100}
          width={100}
          series={[{ data: [10] }]}
          xAxis={[{ scaleType: 'band', data: ['A'] }]}
          hideLegend
          skipAnimation
        />,
      );

      const bar = document.querySelector(`.${barElementClasses.root}`)!;
      await user.pointer({ target: bar, coords: { x: 520, y: 40 } });

      expect(await screen.findByRole('tooltip')).toBeVisible();

      rerender(
        <BarChart height={100} width={100} series={[]} xAxis={[]} hideLegend skipAnimation />,
      );

      expect(screen.queryByRole('tooltip')).to.equal(null);
    },
  );
});
