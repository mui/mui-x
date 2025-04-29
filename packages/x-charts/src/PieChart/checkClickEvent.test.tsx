import * as React from 'react';
import { expect } from 'chai';
import { createRenderer } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { PieChart } from '@mui/x-charts/PieChart';

const config = {
  width: 400,
  height: 400,
  xAxis: [{ position: 'none' }],
  yAxis: [{ position: 'none' }],
} as const;

describe('PieChart - click event', () => {
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

  describe('onItemClick', () => {
    it('should add cursor="pointer" to arc elements', () => {
      const { container } = render(
        <PieChart
          {...config}
          series={[
            {
              id: 's1',
              data: [
                { id: 'p1', value: 5 },
                { id: 'p2', value: 2 },
              ],
            },
          ]}
          onItemClick={() => {}}
        />,
      );
      const slices = container.querySelectorAll<HTMLElement>('path.MuiPieArc-root');

      expect(Array.from(slices).map((slice) => slice.getAttribute('cursor'))).to.deep.equal([
        'pointer',
        'pointer',
      ]);
    });

    it('should provide the right context as second argument', async () => {
      const onItemClick = spy();
      const { user } = render(
        <PieChart
          {...config}
          series={[
            {
              id: 's1',
              data: [
                { id: 'p1', value: 5 },
                { id: 'p2', value: 2 },
              ],
            },
          ]}
          onItemClick={onItemClick}
        />,
      );
      const slices = document.querySelectorAll<HTMLElement>('path.MuiPieArc-root');

      await user.click(slices[0]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'pie',
        seriesId: 's1',
        dataIndex: 0,
      });

      await user.click(slices[1]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'pie',
        seriesId: 's1',
        dataIndex: 1,
      });
    });
  });
});
