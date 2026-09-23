import { StandaloneEvent } from '@mui/x-scheduler-internals/standalone-event';
import {
  createSchedulerRenderer,
  describeConformance,
  EventBuilder,
  startDrag,
  cancelDrag,
} from 'test/utils/scheduler';
import * as React from 'react';
import { act, screen } from '@mui/internal-test-utils';
import { describe, it, expect, afterEach } from 'vitest';

describe('<StandaloneEvent />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <StandaloneEvent data={EventBuilder.new().toProcessed()} renderDragPreview={() => null} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render,
    }),
  );
  afterEach(cancelDrag);

  it('forwards Root dragging state to render, className and style for only the active source', async () => {
    const data = EventBuilder.new().toProcessed();
    render(
      <div>
        {['first', 'second'].map((id) => (
          <StandaloneEvent
            key={id}
            data={data}
            renderDragPreview={() => null}
            className={({ dragging }) => (dragging ? 'active' : 'idle')}
            style={({ dragging }) => ({ opacity: dragging ? 0.5 : 1 })}
            render={(props, { dragging }) => (
              <div {...props} data-testid={id} data-active={dragging} />
            )}
          />
        ))}
      </div>,
    );
    const first = screen.getByTestId('first');
    const second = screen.getByTestId('second');
    await act(async () => startDrag(first));
    expect(first).to.have.attribute('data-active', 'true');
    expect(first).to.have.class('active');
    expect(first.style.opacity).toBe('0.5');
    expect(second).to.have.attribute('data-active', 'false');
    expect(second).to.have.class('idle');
    cancelDrag();
    expect(first).to.have.attribute('data-active', 'false');
    expect(first).to.have.class('idle');
    expect(first.style.opacity).toBe('1');
  });

  it('preserves custom render children and preview context without a Scheduler provider', async () => {
    const Context = React.createContext('missing context');
    function Preview() {
      return <span>{React.useContext(Context)}</span>;
    }
    render(
      <Context.Provider value="External preview">
        <StandaloneEvent
          data={{ id: 'external', title: 'External event' }}
          render={<div>Custom children</div>}
          renderDragPreview={() => <Preview />}
        />
      </Context.Provider>,
    );
    const source = screen.getByText('Custom children');
    await act(async () => startDrag(source));
    expect(await screen.findByText('External preview')).toBeVisible();
    expect(screen.getByText('Custom children')).toBe(source);
    cancelDrag();
    expect(screen.queryByText('External preview')).toBe(null);
  });

  it('supports a native button render and forwards its ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <StandaloneEvent
        ref={ref}
        nativeButton
        data={{ id: 'external', title: 'External event' }}
        render={<button type="button">External event</button>}
        renderDragPreview={() => null}
      />,
    );
    const button = screen.getByRole('button', { name: 'External event' });
    expect(ref.current).toBe(button);
    expect(button).not.to.have.attribute('nativeButton');
  });
});
