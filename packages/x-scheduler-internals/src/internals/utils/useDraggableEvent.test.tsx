import * as React from 'react';
import { act, screen } from '@mui/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  startDrag,
  moveDrag,
  dropDrag,
  cancelDrag,
} from 'test/utils/scheduler';
import { EventCalendarProvider } from '../../event-calendar-provider';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import type { SchedulerStoreInContext } from '../../use-scheduler-store-context';
import { schedulerOccurrencePlaceholderSelectors } from '../../scheduler-selectors';
import type { CalendarGridDayEvent } from '../../calendar-grid/day-event/CalendarGridDayEvent';
import { useDraggableEvent } from './useDraggableEvent';
import { SchedulerDraggable } from './SchedulerDraggable';
import { SchedulerDropTarget } from './SchedulerDropTarget';
import { schedulerDayEventMoveKind } from './schedulerDrag';

const builder = EventBuilder.new().fullDay('2025-07-03').draggable(true);
const occurrence = builder.toOccurrence();
const accept = [schedulerDayEventMoveKind];

function Source() {
  const { draggableProps } = useDraggableEvent<CalendarGridDayEvent.DragData>({
    kind: schedulerDayEventMoveKind,
    eventId: occurrence.id,
    occurrenceKey: occurrence.key,
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    position: { position: 0, duration: 1, startingBeforeEdge: false, endingAfterEdge: false },
    isDraggable: true,
    renderDragPreview: () => null,
    getDragData: () => ({
      eventId: occurrence.id,
      occurrenceKey: occurrence.key,
      originalOccurrence: occurrence,
      start: occurrence.displayTimezone.start.value,
      end: occurrence.displayTimezone.end.value,
      draggedDay: occurrence.displayTimezone.start.value,
    }),
  });
  return <SchedulerDraggable {...draggableProps} render={<div data-testid="source" />} />;
}

function StoreProbe({ onStore }: { onStore: (store: SchedulerStoreInContext<any, any>) => void }) {
  const store = useSchedulerStoreContext();
  React.useEffect(() => onStore(store), [store, onStore]);
  return null;
}

describe('useDraggableEvent', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('should commit the last preview when the drop position returns no data', async () => {
    const onEventsChange = vi.fn();
    const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
    const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);
    const getEventDropData = vi.fn<SchedulerDropTarget.GetEventDropData>(
      ({ source, getDataFromInside }) => getDataFromInside(source.dragData!, start, end),
    );
    render(
      <EventCalendarProvider
        events={[builder.build()]}
        resources={[]}
        onEventsChange={onEventsChange}
      >
        <Source />
        <SchedulerDropTarget
          surfaceType="day-grid"
          accept={accept}
          getEventDropData={getEventDropData}
          render={<div data-testid="target" />}
        />
      </EventCalendarProvider>,
    );
    startDrag(screen.getByTestId('source'));
    await act(async () => {
      moveDrag(screen.getByTestId('target'), { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(getEventDropData).toHaveBeenCalled();
    expect(onEventsChange).not.toHaveBeenCalled();
    getEventDropData.mockReturnValue(undefined);
    dropDrag(screen.getByTestId('target'), { clientX: 110 });
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(
      adapter.isEqual(adapter.date(onEventsChange.mock.calls[0][0][0].start, 'default'), start),
    ).toBe(true);
  });

  it('should clear the placeholder unless the drag lands on a Scheduler target', async () => {
    let store!: SchedulerStoreInContext<any, any>;
    const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
    const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);
    render(
      <EventCalendarProvider events={[builder.build()]} resources={[]}>
        <StoreProbe
          onStore={(value) => {
            store = value;
          }}
        />
        <Source />
        <SchedulerDropTarget
          surfaceType="day-grid"
          accept={accept}
          getEventDropData={({ source, getDataFromInside }) =>
            getDataFromInside(source.dragData!, start, end)
          }
          render={<div data-testid="target" />}
        />
        <div data-testid="elsewhere" />
      </EventCalendarProvider>,
    );
    const getPlaceholder = () => schedulerOccurrencePlaceholderSelectors.value(store.state);

    // Canceled over a target.
    startDrag(screen.getByTestId('source'));
    await act(async () => {
      moveDrag(screen.getByTestId('target'), { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(getPlaceholder()).not.toBe(null);
    cancelDrag();
    expect(getPlaceholder()).toBe(null);

    // Released outside every target.
    startDrag(screen.getByTestId('source'));
    await act(async () => {
      moveDrag(screen.getByTestId('target'), { clientX: 100 });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(getPlaceholder()).not.toBe(null);
    dropDrag(document.body, { clientX: 300 });
    expect(getPlaceholder()).toBe(null);
  });
});

// Virtualization unmounts and remounts rows and events while a drag auto-scrolls the timeline.
describe('useDraggableEvent when the virtualizer unmounts mid-drag', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
  const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);

  function Fixture({
    showSource = true,
    showTarget = true,
    onEventsChange,
    onStore,
  }: {
    showSource?: boolean;
    showTarget?: boolean;
    onEventsChange: () => void;
    onStore: (store: SchedulerStoreInContext<any, any>) => void;
  }) {
    return (
      <EventCalendarProvider
        events={[builder.build()]}
        resources={[]}
        onEventsChange={onEventsChange}
        canDropEventsToTheOutside
      >
        <StoreProbe onStore={onStore} />
        {showSource && <Source />}
        {showTarget && (
          <SchedulerDropTarget
            surfaceType="day-grid"
            accept={accept}
            getEventDropData={({ source, getDataFromInside }) =>
              getDataFromInside(source.dragData!, start, end)
            }
            render={<div data-testid="target" />}
          />
        )}
      </EventCalendarProvider>
    );
  }

  async function moveTo(element: Element, clientX: number) {
    await act(async () => {
      moveDrag(element, { clientX });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
  }

  function setup(props: { showSource?: boolean; showTarget?: boolean } = {}) {
    const onEventsChange = vi.fn();
    let store!: SchedulerStoreInContext<any, any>;
    const view = render(
      <Fixture
        {...props}
        onEventsChange={onEventsChange}
        onStore={(value) => {
          store = value;
        }}
      />,
    );
    return {
      view,
      onEventsChange,
      getPlaceholder: () => schedulerOccurrencePlaceholderSelectors.value(store.state),
    };
  }

  it('should still commit the drop when the source unmounted', async () => {
    const { view, onEventsChange } = setup();
    startDrag(screen.getByTestId('source'));
    await moveTo(screen.getByTestId('target'), 100);
    view.setProps({ showSource: false });
    expect(screen.queryByTestId('source')).toBe(null);

    dropDrag(screen.getByTestId('target'), { clientX: 110 });

    expect(onEventsChange).toHaveBeenCalledTimes(1);
  });

  it('should clear the placeholder when the source unmounted and the drag is released outside', async () => {
    const { view, getPlaceholder } = setup();
    startDrag(screen.getByTestId('source'));
    await moveTo(screen.getByTestId('target'), 100);
    expect(getPlaceholder()).not.toBe(null);
    view.setProps({ showSource: false });

    dropDrag(document.body, { clientX: 300 });

    expect(getPlaceholder()).toBe(null);
  });

  it('should hide the placeholder when the hovered target unmounts, then clear it on an outside release', async () => {
    const { view, onEventsChange, getPlaceholder } = setup();
    startDrag(screen.getByTestId('source'));
    await moveTo(screen.getByTestId('target'), 100);
    expect(getPlaceholder()).not.toBe(null);
    expect(getPlaceholder()).not.toMatchObject({ isHidden: true });
    view.setProps({ showTarget: false });
    expect(getPlaceholder()).toMatchObject({ isHidden: true });

    dropDrag(document.body, { clientX: 300 });

    expect(getPlaceholder()).toBe(null);
    expect(onEventsChange).not.toHaveBeenCalled();
  });

  it('should let a target that mounts after the last move take the drop', async () => {
    const { view, onEventsChange } = setup({ showTarget: false });
    startDrag(screen.getByTestId('source'));
    await moveTo(document.body, 100);
    view.setProps({ showTarget: true });

    dropDrag(screen.getByTestId('target'), { clientX: 110 });

    expect(onEventsChange).toHaveBeenCalledTimes(1);
  });
});
