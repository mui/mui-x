import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { LineChart } from '@mui/x-charts/LineChart';

describe('keyboard activation listeners', () => {
  const { render } = createRenderer();

  /**
   * Re-subscribing the activation listeners on every render drops keystrokes landing between a
   * keyboard navigation update and its commit, which is how a re-rendering app loses `onAxisClick`.
   */
  it('should not re-subscribe the keydown listeners when the chart re-renders', async () => {
    const added: string[] = [];
    const removed: string[] = [];
    const originalAdd = Element.prototype.addEventListener;
    const originalRemove = Element.prototype.removeEventListener;

    Element.prototype.addEventListener = function trackedAdd(
      this: Element,
      type: string,
      ...rest: [any, any]
    ) {
      if (type === 'keydown') {
        added.push(type);
      }
      return originalAdd.call(this, type, ...rest);
    } as typeof originalAdd;
    Element.prototype.removeEventListener = function trackedRemove(
      this: Element,
      type: string,
      ...rest: [any, any]
    ) {
      if (type === 'keydown') {
        removed.push(type);
      }
      return originalRemove.call(this, type, ...rest);
    } as typeof originalRemove;

    onTestFinished(() => {
      Element.prototype.addEventListener = originalAdd;
      Element.prototype.removeEventListener = originalRemove;
    });

    function Demo() {
      const [count, setCount] = React.useState(0);

      return (
        <React.Fragment>
          <button onClick={() => setCount((value) => value + 1)}>rerender {count}</button>
          <LineChart
            height={200}
            width={300}
            margin={0}
            skipAnimation
            series={[{ id: 'series-1', data: [3, 4, 1] }]}
            xAxis={[{ data: [0, 3, 6], scaleType: 'linear' }]}
            experimentalFeatures={{ keyboardActivation: true }}
            onMarkClick={() => {}}
            onAxisClick={() => {}}
          />
        </React.Fragment>
      );
    }

    const { user } = render(<Demo />);

    // Mount settles first: StrictMode double-invokes the effects.
    await user.click(screen.getByRole('button'));
    const addedAfterMount = added.length;
    const removedAfterMount = removed.length;

    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await user.click(screen.getByRole('button'));
    }

    expect(added.length).to.equal(addedAfterMount);
    expect(removed.length).to.equal(removedAfterMount);
  });

  it('should fire both callbacks on every activation', async () => {
    const onMarkClick = vi.fn();
    const onAxisClick = vi.fn();
    const { user } = render(
      <LineChart
        height={200}
        width={300}
        margin={0}
        skipAnimation
        series={[{ id: 'series-1', data: [3, 4, 1] }]}
        xAxis={[{ data: [0, 3, 6], scaleType: 'linear' }]}
        experimentalFeatures={{ keyboardActivation: true }}
        onMarkClick={(event, d) => onMarkClick(d)}
        onAxisClick={(event, d) => onAxisClick(d)}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onMarkClick.mock.calls.length).to.equal(2);
    expect(onAxisClick.mock.calls.length).to.equal(2);
    expect(onAxisClick.mock.lastCall?.[0].dataIndex).to.equal(1);
  });
});
