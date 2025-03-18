import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useAnimate } from '@mui/x-charts/internals/useAnimate';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';

describe('useAnimate', () => {
  const { render } = createRenderer();

  function interpolateWidth(lastProps: { width: number }, newProps: { width: number }) {
    const interpolate = interpolateNumber(lastProps.width, newProps.width);
    return (t: number) => ({ width: interpolate(t) });
  }

  it('starts animating from initial props', async () => {
    let calls = 0;
    let firstCall: number | null = null;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;

      if (firstCall === null) {
        firstCall = props.width;
      }

      lastCall = props.width;
    }

    function TestComponent() {
      const ref = useAnimate(
        { width: 100 },
        { initialProps: { width: 0 }, createInterpolator: interpolateWidth, applyProps },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    render(<TestComponent />);

    await waitFor(() => {
      expect(lastCall).to.be.equal(100);
    });

    expect(calls).to.be.greaterThan(0);
    expect(firstCall).to.be.lessThan(100);
  });

  it('animates from current props to new props', async () => {
    let calls = 0;
    let firstCall: number | null = null;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;

      if (firstCall === null) {
        firstCall = props.width;
      }

      lastCall = props.width;
    }

    function TestComponent({ width }: { width: number }) {
      const ref = useAnimate({ width }, { createInterpolator: interpolateWidth, applyProps });

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    const { rerender } = render(<TestComponent width={100} />);

    await waitFor(() => {
      expect(lastCall).to.equal(100);
    });

    expect(calls).to.be.greaterThan(0);

    calls = 0;
    lastCall = null;

    rerender(<TestComponent width={200} />);

    await waitFor(() => {
      expect(lastCall).to.equal(200);
    });

    expect(calls).to.be.greaterThan(0);
  });

  it('animates from current state to new props if props change while animating', async () => {
    let calls = 0;
    let firstCall: number | null = null;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;

      if (firstCall === null) {
        firstCall = props.width;
      }

      lastCall = props.width;
    }

    function TestComponent({ width }: { width: number }) {
      const ref = useAnimate(
        { width },
        { createInterpolator: interpolateWidth, applyProps, initialProps: { width: 1000 } },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    const { rerender } = render(<TestComponent width={2000} />);

    await waitFor(() => {
      expect(calls).to.be.greaterThan(0);
    });

    // Should be animating from 1000 to 2000
    expect(lastCall).to.be.greaterThan(1000);
    expect(lastCall).to.be.lessThan(2000);

    const lastIncreasingCall = lastCall!;
    calls = 0;
    lastCall = null;

    rerender(<TestComponent width={0} />);

    await waitFor(
      () => {
        expect(calls).to.equal(1);
      },
      {
        /* Need to reduce interval to ensure we get the first call.
         * The default of 50ms is too slow because a transition is happening every frame.  */
        interval: 3,
      },
    );

    expect(lastCall).to.be.lessThan(lastIncreasingCall);

    // Until the animation is complete
    await waitFor(() => {
      expect(lastCall).to.equal(0);
    });
  });

  it('jumps to end of animation if `skip` becomes true while animating', async () => {
    let calls = 0;
    let firstCall: number | null = null;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;

      if (firstCall === null) {
        firstCall = props.width;
      }

      lastCall = props.width;
    }

    function TestComponent({
      width,
      skipAnimation = false,
    }: {
      width: number;
      skipAnimation?: boolean;
    }) {
      const ref = useAnimate(
        { width },
        {
          createInterpolator: interpolateWidth,
          applyProps,
          initialProps: { width: 1000 },
          skip: skipAnimation,
        },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    const { rerender } = render(<TestComponent width={2000} />);

    await waitFor(() => {
      expect(calls).to.be.greaterThan(0);
    });

    // Should be animating from 1000 to 2000
    expect(lastCall).to.be.greaterThan(1000);
    expect(lastCall).to.be.lessThan(2000);

    calls = 0;
    lastCall = null;

    rerender(<TestComponent width={0} skipAnimation />);

    await waitFor(
      () => {
        expect(calls).to.equal(1);
      },
      {
        /* Need to reduce interval to ensure we get the first call.
         * The default of 50ms is too slow because a transition is happening every frame.  */
        interval: 3,
      },
    );

    // Should jump to 0 immediately after first call
    expect(lastCall).to.equal(0);
  });
});
