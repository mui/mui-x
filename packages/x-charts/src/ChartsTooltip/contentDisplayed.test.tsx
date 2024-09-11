import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
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

describe('ChartsTooltip', () => {
  const { render } = createRenderer();

  describe('axis trigger', () => {
    it('should show right values with vertical layout', function test() {
      if (isJSDOM) {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        this.skip();
      }

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
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      firePointerEvent(svg, 'pointermove', {
        clientX: 198,
        clientY: 60,
      });

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'A',
        // First row
        '', // mark
        'S1', // label
        '4', // value
        // Second row
        '',
        'S2',
        '2',
      ]);

      firePointerEvent(svg, 'pointermove', {
        clientX: 201,
        clientY: 60,
      });

      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'B',
        // First row
        '',
        'S1',
        '1',
        // Second row
        '',
        'S2',
        '1',
      ]);
    });

    it('should show right values with horizontal layout', function test() {
      if (isJSDOM) {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        this.skip();
      }

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
            layout="horizontal"
            series={[
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            yAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      firePointerEvent(svg, 'pointermove', {
        clientX: 150,
        clientY: 60,
      });

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'A',
        // First row
        '',
        'S1',
        '4',
        // Second row
        '',
        'S2',
        '2',
      ]);

      firePointerEvent(svg, 'pointermove', {
        clientX: 150,
        clientY: 220,
      });

      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'B',
        // First row
        '',
        'S1',
        '1',
        // Second row
        '',
        'S2',
        '1',
      ]);
    });
  });

  describe('item trigger', () => {
    it('should show right values with vertical layout', function test() {
      if (isJSDOM) {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        this.skip();
      }

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
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
            tooltip={{ trigger: 'item' }}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;
      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      fireEvent.pointerEnter(rectangles[0]);

      firePointerEvent(svg, 'pointermove', {
        clientX: 150,
        clientY: 60,
      }); // Only to set the tooltip position

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S1', '4']);

      fireEvent.pointerEnter(rectangles[3]);
      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S2', '1']);
    });

    it('should show right values with horizontal layout', function test() {
      if (isJSDOM) {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        this.skip();
      }

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
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            layout="horizontal"
            yAxis={[{ scaleType: 'band', dataKey: 'x' }]}
            tooltip={{ trigger: 'item' }}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;
      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      fireEvent.pointerEnter(rectangles[0]);

      firePointerEvent(svg, 'pointermove', {
        clientX: 150,
        clientY: 60,
      }); // Only to set the tooltip position

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S1', '4']);

      fireEvent.pointerEnter(rectangles[3]);
      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S2', '1']);
    });
  });
});
