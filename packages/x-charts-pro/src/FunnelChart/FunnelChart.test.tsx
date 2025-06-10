import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, describeConformance, screen } from '@mui/internal-test-utils';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

const config = {
  series: [{ data: [{ value: 200 }, { value: 100 }] }],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width: 400,
  height: 400,
  hideLegend: true,
} as const;

describe('FunnelChart', () => {
  const { render } = createRenderer();

  describeConformance(
    <FunnelChart height={100} width={100} series={[{ data: [{ value: 100 }, { value: 50 }] }]} />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiFunnelChart',
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
    render(<FunnelChart series={[]} width={100} height={100} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  describe('gap', () => {
    it('should properly distance sections based on gap', async () => {
      render(
        <div
          style={{
            width: 400,
            height: 400,
          }}
        >
          <FunnelChart {...config} gap={13} />
        </div>,
      );
      const paths = document.querySelectorAll<HTMLElement>('path.MuiFunnelSection-root');

      const firstBCR = paths[0].getBoundingClientRect();
      const secondBCR = paths[1].getBoundingClientRect();
      expect(firstBCR.bottom).to.be.closeTo(
        secondBCR.top - 13,
        0.45,
        'The gap should be respected between sections',
      );
    });
  });
});
