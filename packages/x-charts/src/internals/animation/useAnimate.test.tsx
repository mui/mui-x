import { createRenderer, reactMajor, screen, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';
import { useAnimateInternal } from '@mui/x-charts/internals/animation/useAnimateInternal';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { spy } from 'sinon';

// Wait for the next animation frame
const waitNextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

describe('useAnimate', () => {
  const { render } = createRenderer();

  function interpolateWidth(lastProps: { width: number }, newProps: { width: number }) {
    const interpolate = interpolateNumber(lastProps.width, newProps.width);
    return (t: number) => ({ width: interpolate(t) });
  }

  const applyProps = spy((element: SVGPathElement, props: { width: number }) => {
    element.setAttribute('width', props.width.toString());
  });

  const lastCallWidth = () => applyProps.lastCall?.args[1].width;
  const firstCallWidth = () => applyProps.firstCall?.args[1].width;
  const callCount = () => applyProps.callCount;

  afterEach(() => {
    applyProps.resetHistory();
  });

  it('starts animating from initial props', async () => {
    function TestComponent() {
      const ref = useAnimateInternal(
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
      expect(lastCallWidth()).to.be.equal(100);
    });

    expect(callCount()).to.be.greaterThan(0);
    expect(firstCallWidth()).to.be.lessThan(100);
  });

  it('animates from current props to new props', async () => {
    function TestComponent({ width }: { width: number }) {
      const ref = useAnimateInternal(
        { width },
        { createInterpolator: interpolateWidth, applyProps },
      );

      return (
        <svg>
          <path ref={ref} />
        </svg>
      );
    }

    const { rerender } = render(<TestComponent width={100} />);

    await waitFor(() => {
      expect(lastCallWidth()).to.equal(100);
    });

    expect(callCount()).to.be.greaterThan(0);

    rerender(<TestComponent width={200} />);

    await waitFor(() => {
      expect(lastCallWidth()).to.equal(200);
    });

    expect(callCount()).to.be.greaterThan(0);
  });

  it('animates from current state to new props if props change while animating', async () => {
    function TestComponent({ width }: { width: number }) {
      const ref = useAnimateInternal(
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

    await waitNextFrame();
    expect(callCount()).to.be.equal(reactMajor > 18 ? 3 : 2);

    const lastIncreasingCall = lastCallWidth();
    // Should be animating from 1000 to 2000
    expect(lastCallWidth()).to.be.greaterThan(1000);
    expect(lastCallWidth()).to.be.lessThan(2000);

    rerender(<TestComponent width={0} />);

    await waitNextFrame();

    expect(lastCallWidth()).to.be.lessThan(lastIncreasingCall);

    // Until the animation is complete
    await waitFor(() => {
      expect(lastCallWidth()).to.equal(0);
    });
  });

  it('jumps to end of animation if `skip` becomes true while animating', async () => {
    function TestComponent({
      width,
      skipAnimation = false,
    }: {
      width: number;
      skipAnimation?: boolean;
    }) {
      const ref = useAnimateInternal(
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

    await waitNextFrame();
    expect(callCount()).to.be.equal(reactMajor > 18 ? 3 : 2);

    // Should be animating from 1000 to 2000
    expect(lastCallWidth()).to.be.greaterThan(1000);
    expect(lastCallWidth()).to.be.lessThan(2000);

    rerender(<TestComponent width={0} skipAnimation />);

    await waitNextFrame();
    expect(callCount()).to.be.equal(reactMajor > 18 ? 5 : 4);

    // Should jump to 0 immediately after first call
    expect(lastCallWidth()).to.equal(0);
  });

  it('does not start animation if `skip` is true from the beginning', async () => {
    function TestComponent({ width }: { width: number }) {
      const ref = useAnimateInternal(
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

    // Wait a frame to ensure the transition is stopped
    await waitNextFrame();

    expect(callCount()).to.equal(0);
  });

  it('resumes animation if `skip` becomes false after having been true', async () => {
    function TestComponent({ width, skip }: { width: number; skip: boolean }) {
      const ref = useAnimateInternal(
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

    await waitNextFrame();
    expect(callCount()).to.be.equal(reactMajor > 18 ? 3 : 2);
    expect(lastCallWidth()).to.be.greaterThan(0);
    expect(lastCallWidth()).to.be.lessThan(1000);

    rerender(<TestComponent width={2000} skip />);

    // Transition finishes immediately
    await waitNextFrame();
    expect(callCount()).to.be.equal(reactMajor > 18 ? 5 : 4);
    expect(lastCallWidth()).to.equal(2000);

    rerender(<TestComponent width={1000} skip={false} />);

    await waitNextFrame();
    expect(callCount()).to.be.equal(reactMajor > 18 ? 7 : 6);
    expect(lastCallWidth()).to.be.lessThan(2000);
    expect(lastCallWidth()).to.be.greaterThan(1000);
  });

  it('stops animation when its ref is removed from the DOM', async () => {
    let callsAfterUnmount = 0;

    function TestComponent({ width }: { width: number }) {
      const [mountPath, setMountPath] = React.useState(true);
      const ref = useAnimateInternal(
        { width },
        { createInterpolator: interpolateWidth, applyProps, initialProps: { width: 0 } },
      );

      return (
        <React.Fragment>
          <svg>{mountPath ? <path ref={ref} /> : null}</svg>
          <button
            onClick={() => {
              callsAfterUnmount = callCount();
              setMountPath(false);
            }}
          >
            Unmount Path
          </button>
        </React.Fragment>
      );
    }

    const { user } = render(<TestComponent width={1000} />);

    await waitFor(() => {
      expect(lastCallWidth()).to.be.greaterThan(10);
    });

    expect(lastCallWidth()).to.be.lessThan(1000);

    await user.click(screen.getByRole('button'));

    // Wait a frame to ensure the transition is stopped
    await waitNextFrame();

    // Clicking the button is async, so at most one more call could have happened
    expect(callCount()).to.lessThanOrEqual(callsAfterUnmount + (reactMajor > 18 ? 1 : 2));
  });

  it('stops animation when the hook is unmounted', async () => {
    function TestComponent({ width }: { width: number }) {
      const ref = useAnimateInternal(
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
      expect(lastCallWidth()).to.be.greaterThan(10);
    });
    const lastCallBeforeUnmount = lastCallWidth();
    const numCallsBeforeUnmount = callCount();
    expect(lastCallBeforeUnmount).to.be.lessThan(1000);

    unmount();

    // Wait a frame to ensure the transition is stopped
    await waitNextFrame();

    expect(lastCallWidth()).to.equal(lastCallBeforeUnmount);
    expect(callCount()).to.equal(numCallsBeforeUnmount);
  });
});
