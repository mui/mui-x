import * as React from 'react';
import { act, screen } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cancelDrag,
  createSchedulerRenderer,
  EventBuilder,
  moveDrag,
  startDrag,
} from 'test/utils/scheduler';
import { EventCalendarProvider } from '../../event-calendar-provider';
import { SchedulerDraggable } from './SchedulerDraggable';
import { schedulerDayEventMoveKind } from './schedulerDrag';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';

const occurrence = EventBuilder.new().fullDay('2025-07-03').toOccurrence();
const snapshot: CalendarGridDayEvent.DragData = {
  originalOccurrence: occurrence,
  start: occurrence.displayTimezone.start.value,
  end: occurrence.displayTimezone.end.value,
  draggedDay: occurrence.displayTimezone.start.value,
};

function Fixture({
  getDragData,
  onMove,
}: {
  getDragData: SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['getDragData'];
  onMove?: SchedulerDraggable.Props<CalendarGridDayEvent.DragData>['onMove'];
}) {
  return (
    <EventCalendarProvider events={[]} resources={[]}>
      <SchedulerDraggable
        kind={schedulerDayEventMoveKind}
        getDragData={getDragData}
        onMove={onMove}
        render={<div data-testid="source">Event</div>}
      />
    </EventCalendarProvider>
  );
}

describe('Scheduler drag snapshots', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('should capture once per gesture and keep the snapshot across source rerenders', async () => {
    const getDragData = vi.fn(() => snapshot);
    const onMove = vi.fn();
    const view = render(<Fixture getDragData={getDragData} onMove={onMove} />);
    expect(getDragData).not.toHaveBeenCalled();
    startDrag(screen.getByTestId('source'));
    expect(getDragData).toHaveBeenCalledTimes(1);

    const nextSnapshot = { ...snapshot };
    const nextGetDragData = vi.fn(() => nextSnapshot);
    view.setProps({ getDragData: nextGetDragData });
    await act(async () => {
      moveDrag(document.body, { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(onMove.mock.lastCall![0].source.dragData).toBe(snapshot);
    expect(nextGetDragData).not.toHaveBeenCalled();

    cancelDrag();
    startDrag(screen.getByTestId('source'));
    expect(nextGetDragData).toHaveBeenCalledTimes(1);
  });

  // Resize handles draw their own feedback: Base UI's default clone of the source would repeat it.
  it('should not show a clone of the source while it is dragged without a preview', async () => {
    render(<Fixture getDragData={() => snapshot} />);
    startDrag(screen.getByTestId('source'));
    await act(async () => {
      moveDrag(document.body, { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(screen.getAllByText('Event')).toHaveLength(1);
  });

  // A `Draggable.Target` that wraps it in `render` clones it with a ref. React 17 and 18 only hand
  // that ref to a `forwardRef` component, so a drop target on the timeline event body depends on it.
  it('should forward its ref to the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <EventCalendarProvider events={[]} resources={[]}>
        <SchedulerDraggable
          ref={ref}
          kind={schedulerDayEventMoveKind}
          getDragData={() => snapshot}
          render={<div data-testid="source">Event</div>}
        />
      </EventCalendarProvider>,
    );
    expect(ref.current).toBe(screen.getByTestId('source'));
  });

  // Base UI marks a disabled draggable with `data-disabled`. A Scheduler event that can't be
  // dragged is still an enabled control, which styles for `[data-disabled]` must not dim.
  it('should not mark the element as disabled when dragging is disabled', () => {
    render(
      <EventCalendarProvider events={[]} resources={[]}>
        <SchedulerDraggable
          kind={schedulerDayEventMoveKind}
          disabled
          getDragData={() => snapshot}
          render={<div data-testid="source">Event</div>}
        />
      </EventCalendarProvider>,
    );
    expect(screen.getByTestId('source')).not.to.have.attribute('data-disabled');
  });

  it('should keep the data-disabled attribute of the element it renders', () => {
    render(
      <EventCalendarProvider events={[]} resources={[]}>
        <SchedulerDraggable
          kind={schedulerDayEventMoveKind}
          getDragData={() => snapshot}
          render={<div data-testid="source" data-disabled="" />}
        />
      </EventCalendarProvider>,
    );
    expect(screen.getByTestId('source')).to.have.attribute('data-disabled');
  });

  // The preview only has to be inside the root. As a child of the render element, it would break a
  // `render` that wraps a single child or ignores its children.
  it('should not add children to the element it renders', () => {
    const receivedChildren: React.ReactNode[] = [];
    function SingleChild(props: { children?: React.ReactNode }) {
      receivedChildren.push(props.children);
      return <div data-testid="source">{props.children}</div>;
    }
    render(
      <EventCalendarProvider events={[]} resources={[]}>
        <SchedulerDraggable
          kind={schedulerDayEventMoveKind}
          getDragData={() => snapshot}
          render={
            <SingleChild>
              <span>Event</span>
            </SingleChild>
          }
        />
      </EventCalendarProvider>,
    );
    expect(receivedChildren.length).toBeGreaterThan(0);
    receivedChildren.forEach((children) => {
      expect(React.isValidElement(children) && children.type).toBe('span');
    });
  });
});
