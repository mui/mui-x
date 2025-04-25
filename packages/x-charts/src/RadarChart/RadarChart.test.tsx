import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { Unstable_RadarChart as RadarChart, RadarChartProps } from '@mui/x-charts/RadarChart';
import { expect } from 'chai';
import { spy } from 'sinon';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

const radarConfig: RadarChartProps = {
  height: 100,
  width: 100,
  margin: 0,
  series: [{ data: [10, 15, 20, 25] }],
  radar: { metrics: ['A', 'B', 'C', 'D'] },
};

describe('<RadarChart />', () => {
  const { render } = createRenderer();
  describeConformance(<RadarChart {...radarConfig} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiRadarChart',
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
  }));

  it('should render "No Data" overlay when series prop is an empty array', () => {
    render(<RadarChart height={100} width={100} series={[]} radar={{ metrics: [] }} />);

    const noDataOverlay = screen.getByText('No data to display');
    expect(noDataOverlay).toBeVisible();
  });

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  testSkipIf(isJSDOM)('should call onHighlightChange', async () => {
    const onHighlightChange = spy();
    const { user } = render(<RadarChart {...radarConfig} onHighlightChange={onHighlightChange} />);

    const path = document.querySelector<HTMLElement>('svg .MuiRadarSeriesPlot-area')!;
    await user.pointer({ target: path });

    expect(onHighlightChange.callCount).to.equal(1);
  });

  testSkipIf(isJSDOM)('should highlight axis on hover', async () => {
    const { user } = render(
      <div
        style={{
          margin: -8, // Removes the body default margins
          width: 100,
          height: 100,
        }}
      >
        <RadarChart {...radarConfig} />
      </div>,
    );

    const svg = document.querySelector<HTMLElement>('svg')!;
    await user.pointer([{ target: svg, coords: { clientX: 45, clientY: 45 } }]);

    expect(document.querySelector<HTMLElement>('svg .MuiRadarAxisHighlight-root')!).toBeVisible();
  });
});
