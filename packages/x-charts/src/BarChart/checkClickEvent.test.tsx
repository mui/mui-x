import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { BarChart } from '@mui/x-charts/BarChart';

function firePointerEvent(
  target: Element,
  type: 'pointerstart' | 'pointermove' | 'pointerend',
  options: Pick<PointerEventInit, 'clientX' | 'clientY'>,
): void {
  const originalGetBoundingClientRect = target.getBoundingClientRect;
  target.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    bottom: 0,
    height: 400,
    left: 0,
    right: 0,
    top: 0,
    width: 400,
    toJSON() {
      return {
        x: 0,
        y: 0,
        bottom: 0,
        height: 400,
        left: 0,
        right: 0,
        top: 0,
        width: 400,
      };
    },
  });
  const event = new window.PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    isPrimary: true,
    ...options,
  });

  fireEvent(target, event);
  target.getBoundingClientRect = originalGetBoundingClientRect;
}

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

describe('BarChart - click event', () => {
  const { render } = createRenderer();

  it('should provide the accurate context as second argument', function test() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
      this.skip();
    }
    const onAxisClick = spy();
    render(
      <div
        style={{
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
      clientX: 201,
      clientY: 60,
    });
    fireEvent.click(svg);

    expect(onAxisClick.lastCall.args[1]).to.deep.equal({
      dataIndex: 0,
      axisValue: 'A',
      seriesValues: { s1: 4, s2: 2 },
    });
  });
});
