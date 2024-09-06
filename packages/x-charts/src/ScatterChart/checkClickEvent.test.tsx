import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const config = {
  dataset: [
    { id: 1, x: 0, y: 10 },
    { id: 2, x: 10, y: 10 },
    { id: 3, x: 10, y: 0 },
    { id: 4, x: 0, y: 0 },
    { id: 5, x: 5, y: 5 },
  ],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width: 100,
  height: 100,
};

// Plot on series as a dice 5
//
// 1...2
// .....
// ..5..
// .....
// 4...3

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('ScatterChart - click event', () => {
  const { render } = createRenderer();

  describe('onItemClick - using vornoid', () => {
    it('should provide the right context as second argument when clicking svg', function test() {
      if (isJSDOM) {
        // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
        this.skip();
      }
      const onItemClick = spy();
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      fireEvent.click(svg, {
        clientX: 10,
        clientY: 10,
      });
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 0,
        seriesId: 's1',
      });

      fireEvent.click(svg, {
        clientX: 30,
        clientY: 30,
      });
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 4,
        seriesId: 's1',
      });

      expect(onItemClick.callCount).to.equal(2);
    });

    it('should provide the right context as second argument when clicking mark', function test() {
      if (isJSDOM) {
        this.skip();
      }
      const onItemClick = spy();
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
          />
        </div>,
      );
      const marks = document.querySelectorAll<HTMLElement>('circle');

      fireEvent.click(marks[1], {
        clientX: 99,
        clientY: 2,
      });

      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 1,
        seriesId: 's1',
      });
      expect(onItemClick.callCount).to.equal(1); // Make sure voronoid + item click does not duplicate event triggering
    });
  });

  describe('onItemClick - disabling vornoid', () => {
    it('should not call onItemClick when clicking the SVG', function test() {
      if (isJSDOM) {
        this.skip();
      }
      const onItemClick = spy();
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
            disableVoronoi
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      fireEvent.click(svg, {
        clientX: 10,
        clientY: 10,
      });
      expect(onItemClick.callCount).to.equal(0);
    });

    it('should provide the right context as second argument when clicking mark', function test() {
      if (isJSDOM) {
        this.skip();
      }
      const onItemClick = spy();
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
            disableVoronoi
          />
        </div>,
      );
      const marks = document.querySelectorAll<HTMLElement>('circle');

      fireEvent.click(marks[1], {
        clientX: 99,
        clientY: 2,
      });

      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 1,
        seriesId: 's1',
      });
      expect(onItemClick.callCount).to.equal(1); // Make sure voronoid + item click does not duplicate event triggering
    });
  });
});
