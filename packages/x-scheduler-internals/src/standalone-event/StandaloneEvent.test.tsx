import { StandaloneEvent } from '@mui/x-scheduler-internals/standalone-event';
import {
  createSchedulerRenderer,
  describeConformance,
  EventBuilder,
  startDrag,
  cancelDrag,
} from 'test/utils/scheduler';
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
});
