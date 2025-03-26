import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { Unstable_RadarChart as RadarChart, RadarChartProps } from '@mui/x-charts/RadarChart';
import { expect } from 'chai';

const radarConfig: RadarChartProps = {
  height: 100,
  width: 100,
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
});
