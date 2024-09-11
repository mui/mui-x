import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { PieChart } from '@mui/x-charts/PieChart';

const config = {
  width: 400,
  height: 400,
};

describe('PieChart - click event', () => {
  const { render } = createRenderer();

  describe('onItemClick', () => {
    it('should add cursor="pointer" to bar elements', function test() {
      render(
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
      const slices = document.querySelectorAll<HTMLElement>('path.MuiPieArc-root');

      expect(Array.from(slices).map((slice) => slice.getAttribute('cursor'))).to.deep.equal([
        'pointer',
        'pointer',
      ]);
    });

    it('should provide the right context as second argument', function test() {
      const onItemClick = spy();
      render(
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

      fireEvent.click(slices[0]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'pie',
        seriesId: 's1',
        dataIndex: 0,
      });

      fireEvent.click(slices[1]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'pie',
        seriesId: 's1',
        dataIndex: 1,
      });
    });
  });
});
