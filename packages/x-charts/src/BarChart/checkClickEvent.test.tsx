import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { BarChart } from '@mui/x-charts/BarChart';
import { firePointerEvent } from '../tests/firePointerEvent';

const config = {
  dataset: [
    { x: 'A', v1: 4, v2: 2 },
    { x: 'B', v1: 1, v2: 1 },
  ],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width: 400,
  height: 400,
};

// Plot as follow to simplify click position
//
// | X
// | X
// | X X
// | X X X X
// ---A---B-

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('BarChart - click event', () => {
  const { render } = createRenderer();

  describe('onAxisClick', () => {
    it('should provide the right context as second argument', function test() {
      if (isJSDOM) {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        this.skip();
      }
      const onAxisClick = spy();
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 400,
            height: 400,
          }}
        >
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1' },
              { dataKey: 'v2', id: 's2' },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
            onAxisClick={onAxisClick}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      firePointerEvent(svg, 'pointermove', {
        clientX: 198,
        clientY: 60,
      });
      fireEvent.click(svg);

      expect(onAxisClick.lastCall.args[1]).to.deep.equal({
        dataIndex: 0,
        axisValue: 'A',
        seriesValues: { s1: 4, s2: 2 },
      });

      firePointerEvent(svg, 'pointermove', {
        clientX: 201,
        clientY: 60,
      });
      fireEvent.click(svg);

      expect(onAxisClick.lastCall.args[1]).to.deep.equal({
        dataIndex: 1,
        axisValue: 'B',
        seriesValues: { s1: 1, s2: 1 },
      });
    });
  });

  describe('onItemClick', () => {
    it('should add cursor="pointer" to bar elements', function test() {
      render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1' },
            { dataKey: 'v2', id: 's2' },
          ]}
          xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          onItemClick={() => {}}
        />,
      );
      const rectangles = document.querySelectorAll<HTMLElement>('rect.MuiBarElement-root');

      expect(
        Array.from(rectangles).map((rectangle) => rectangle.getAttribute('cursor')),
      ).to.deep.equal(['pointer', 'pointer', 'pointer', 'pointer']);
    });

    it('should provide the right context as second argument', function test() {
      if (isJSDOM) {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        this.skip();
      }
      const onItemClick = spy();
      render(
        <div
          style={{
            margin: -8, // No idea why, but that make the SVG coordinates match the HTML coordinates
            width: 400,
            height: 400,
          }}
        >
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1' },
              { dataKey: 'v2', id: 's2' },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
            onItemClick={onItemClick}
          />
        </div>,
      );

      const rectangles = document.querySelectorAll<HTMLElement>('rect.MuiBarElement-root');

      fireEvent.click(rectangles[0]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'bar',
        seriesId: 's1',
        dataIndex: 0,
      });

      fireEvent.click(rectangles[1]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'bar',
        seriesId: 's1',
        dataIndex: 1,
      });

      fireEvent.click(rectangles[2]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'bar',
        seriesId: 's2',
        dataIndex: 0,
      });
    });
  });
});
