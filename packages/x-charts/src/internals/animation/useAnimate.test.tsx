import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useAnimate } from '@mui/x-charts/internals/animation/useAnimate';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';

describe('useAnimate', () => {
  const { render } = createRenderer();

  /* Need to reduce interval to ensure we get the first call.
   * The default of 50ms is too slow because a transition is happening every frame.  */
  const RAF_INTERVAL = 3;

  function interpolateWidth(lastProps: { width: number }, newProps: { width: number }) {
    const interpolate = interpolateNumber(lastProps.width, newProps.width);
    return (t: number) => ({ width: interpolate(t) });
  }

  function waitTwoFrames() {
    let resolve: () => void;
    const twoAnimationFrames = new Promise<void>((res) => {
      resolve = res;
    });
    // Wait two frames to ensure no transition was initiated
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    return twoAnimationFrames;
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
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;
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
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;
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
      { interval: RAF_INTERVAL },
    );

    expect(lastCall).to.be.lessThan(lastIncreasingCall);

    // Until the animation is complete
    await waitFor(() => {
      expect(lastCall).to.equal(0);
    });
  });

  it('jumps to end of animation if `skip` becomes true while animating', async () => {
    let calls = 0;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;
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
      { interval: RAF_INTERVAL },
    );

    // Should jump to 0 immediately after first call
    expect(lastCall).to.equal(0);
  });

  it('does not start animation if `skip` is true from the beginning', async () => {
    let calls = 0;

    function applyProps() {
      calls += 1;
    }

    function TestComponent({ width }: { width: number }) {
      const ref = useAnimate(
        { width },
        {
          createInterpolator: interpolateWidth,
          applyProps,
          initialProps: { width: 0 },
          skip: true,
        },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    render(<TestComponent width={1000} />);

    // Wait two frames to ensure no transition was initiated
    await waitTwoFrames();

    expect(calls).to.equal(0);
  });

  it('resumes animation if `skip` becomes false after having been true', async () => {
    let calls = 0;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;
      lastCall = props.width;
    }

    function TestComponent({ width, skip }: { width: number; skip: boolean }) {
      const ref = useAnimate(
        { width },
        {
          createInterpolator: interpolateWidth,
          applyProps,
          initialProps: { width: 0 },
          skip,
        },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    const { rerender } = render(<TestComponent width={1000} skip={false} />);

    await waitFor(
      () => {
        expect(calls).to.equal(1);
      },
      { interval: RAF_INTERVAL },
    );
    expect(lastCall).to.be.greaterThan(0);
    expect(lastCall).to.be.lessThan(1000);

    rerender(<TestComponent width={2000} skip />);

    // Transition finishes immediately
    await waitFor(() => {
      expect(calls).to.equal(2);
    });
    expect(lastCall).to.equal(2000);

    rerender(<TestComponent width={1000} skip={false} />);

    await waitFor(
      () => {
        expect(calls).to.equal(3);
      },
      { interval: RAF_INTERVAL },
    );
    expect(lastCall).to.be.lessThan(2000);
    expect(lastCall).to.be.greaterThan(1000);
  });

  it('stops animation when its ref is removed from the DOM', async () => {
    let calls = 0;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;
      lastCall = props.width;
    }

    function TestComponent({ width }: { width: number }) {
      const [mountPath, setMountPath] = React.useState(true);
      const ref = useAnimate(
        { width },
        { createInterpolator: interpolateWidth, applyProps, initialProps: { width: 0 } },
      );

      return (
        <React.Fragment>
          <svg>{mountPath ? <path ref={ref} /> : null}</svg>
          <button onClick={() => setMountPath(false)}>Unmount Path</button>
        </React.Fragment>
      );
    }

    const { user } = render(<TestComponent width={1000} />);

    await waitFor(() => {
      expect(lastCall).to.be.greaterThan(10);
    });

    expect(lastCall).to.be.lessThan(1000);
    const numCallsBeforeUnmount = calls;

    await user.click(screen.getByRole('button'));

    // Wait two frames to ensure the transition is stopped
    await waitTwoFrames();

    // Clicking the button is async, so at most one more call could have happened
    expect(calls).to.lessThanOrEqual(numCallsBeforeUnmount + 1);
  });

  it('stops animation when the hook is unmounted', async () => {
    let calls = 0;
    let lastCall: number | null = null;

    function applyProps(element: SVGPathElement, props: { width: number }) {
      calls += 1;

      lastCall = props.width;
    }

    function TestComponent({ width }: { width: number }) {
      const ref = useAnimate(
        { width },
        { createInterpolator: interpolateWidth, applyProps, initialProps: { width: 0 } },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    const { unmount } = render(<TestComponent width={1000} />);

    await waitFor(() => {
      expect(lastCall).to.be.greaterThan(10);
    });
    const lastCallBeforeUnmount = lastCall;
    const numCallsBeforeUnmount = calls;
    expect(lastCallBeforeUnmount).to.be.lessThan(1000);

    unmount();

    // Wait two frames to ensure the transition is stopped
    await waitTwoFrames();

    expect(lastCall).to.equal(lastCallBeforeUnmount);
    expect(calls).to.equal(numCallsBeforeUnmount);
  });
});
