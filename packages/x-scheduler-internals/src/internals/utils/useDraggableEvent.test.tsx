import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  adapter,
  createSchedulerRenderer,
  EventBuilder,
  ExternalEventSource,
  startDrag,
  moveDragAndWait,
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
import { schedulerDayEventMoveKind, schedulerExternalEventKind } from './schedulerDrag';

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
    dataTimezone: occurrence.dataTimezone,
    position: { position: 0, duration: 1, startingBeforeEdge: false, endingAfterEdge: false },
    isDraggable: true,
    renderDragPreview: () => null,
    getExtraDragData: () => ({ draggedDay: occurrence.displayTimezone.start.value }),
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

  it('should commit the last preview when the drop position returns no data', async () => {
    const onEventsChange = vi.fn();
    const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
    const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);
    const getEventDropDates = vi.fn<SchedulerDropTarget.GetEventDropDates>(() => ({ start, end }));
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
          getEventDropDates={getEventDropDates}
          render={<div data-testid="target" />}
        />
      </EventCalendarProvider>,
    );
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getEventDropDates).toHaveBeenCalled();
    expect(onEventsChange).not.toHaveBeenCalled();
    getEventDropDates.mockReturnValue(undefined);
    dropDrag(screen.getByTestId('target'), { clientX: 110 });
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(
      adapter.isEqual(adapter.date(onEventsChange.mock.calls[0][0][0].start, 'default'), start),
    ).toBe(true);
  });

  it('should commit a pen drop that ends within 5px of where the drag activated', async () => {
    const onEventsChange = vi.fn();
    const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
    const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);
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
          getEventDropDates={() => ({ start, end })}
          render={<div data-testid="target" />}
        />
      </EventCalendarProvider>,
    );

    // The pen presses at x=94, and the drag activates once it has moved 6px.
    startDrag(screen.getByTestId('source'), { clientX: 100, pointerType: 'pen' });
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 101, pointerType: 'pen' });
    dropDrag(screen.getByTestId('target'), { clientX: 102, pointerType: 'pen' });

    expect(onEventsChange).toHaveBeenCalledTimes(1);
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
          getEventDropDates={() => ({ start, end })}
          render={<div data-testid="target" />}
        />
        <div data-testid="elsewhere" />
      </EventCalendarProvider>,
    );
    const getPlaceholder = () => schedulerOccurrencePlaceholderSelectors.value(store.state);

    // Canceled over a target.
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getPlaceholder()).not.toBe(null);
    cancelDrag();
    expect(getPlaceholder()).toBe(null);

    // Released outside every target.
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getPlaceholder()).not.toBe(null);
    dropDrag(document.body, { clientX: 300 });
    expect(getPlaceholder()).toBe(null);
  });
});

describe('SchedulerDropTarget when the pointer leaves it', () => {
  const { render } = createSchedulerRenderer();

  const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
  const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);

  function setup(parameters: { external?: boolean; canDropEventsToTheOutside?: boolean }) {
    const { external = false, canDropEventsToTheOutside = false } = parameters;
    let store!: SchedulerStoreInContext<any, any>;
    render(
      <EventCalendarProvider
        events={[builder.build()]}
        resources={[]}
        canDropEventsToTheOutside={canDropEventsToTheOutside}
        canDragEventsFromTheOutside
      >
        <StoreProbe
          onStore={(value) => {
            store = value;
          }}
        />
        {external ? (
          <ExternalEventSource
            eventData={{ id: 'external', title: 'External' }}
            data-testid="source"
          />
        ) : (
          <Source />
        )}
        <SchedulerDropTarget
          surfaceType="day-grid"
          accept={[schedulerDayEventMoveKind, schedulerExternalEventKind]}
          getEventDropDates={() => (external ? { start } : { start, end })}
          render={<div data-testid="target" />}
        />
      </EventCalendarProvider>,
    );
    return () => schedulerOccurrencePlaceholderSelectors.value(store.state);
  }

  it('should hide the placeholder of a dragged event when it can be dropped outside', async () => {
    const getPlaceholder = setup({ canDropEventsToTheOutside: true });
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getPlaceholder()).toMatchObject({ type: 'internal-drag' });
    expect(getPlaceholder()).not.toMatchObject({ isHidden: true });

    await moveDragAndWait(document.body, { clientX: 300 });

    expect(getPlaceholder()).toMatchObject({ isHidden: true });
  });

  it('should keep the placeholder of a dragged event when it cannot be dropped outside', async () => {
    const getPlaceholder = setup({ canDropEventsToTheOutside: false });
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getPlaceholder()).toMatchObject({ type: 'internal-drag' });

    await moveDragAndWait(document.body, { clientX: 300 });

    expect(getPlaceholder()).not.toMatchObject({ isHidden: true });
  });

  it('should hide the placeholder of an external item', async () => {
    const getPlaceholder = setup({ external: true });
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getPlaceholder()).toMatchObject({ type: 'external-drag' });
    expect(getPlaceholder()).not.toMatchObject({ isHidden: true });

    await moveDragAndWait(document.body, { clientX: 300 });

    expect(getPlaceholder()).toMatchObject({ isHidden: true });
  });
});

// Virtualization unmounts and remounts rows and events while a drag auto-scrolls the timeline.
describe('useDraggableEvent when the virtualizer unmounts mid-drag', () => {
  const { render } = createSchedulerRenderer();

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
            getEventDropDates={() => ({ start, end })}
            render={<div data-testid="target" />}
          />
        )}
      </EventCalendarProvider>
    );
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
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    view.setProps({ showSource: false });
    expect(screen.queryByTestId('source')).toBe(null);

    dropDrag(screen.getByTestId('target'), { clientX: 110 });

    expect(onEventsChange).toHaveBeenCalledTimes(1);
  });

  it('should clear the placeholder when the source unmounted and the drag is released outside', async () => {
    const { view, getPlaceholder } = setup();
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
    expect(getPlaceholder()).not.toBe(null);
    view.setProps({ showSource: false });

    dropDrag(document.body, { clientX: 300 });

    expect(getPlaceholder()).toBe(null);
  });

  it('should hide the placeholder when the hovered target unmounts, then clear it on an outside release', async () => {
    const { view, onEventsChange, getPlaceholder } = setup();
    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('target'), { clientX: 100 });
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
    await moveDragAndWait(document.body, { clientX: 100 });
    view.setProps({ showTarget: true });

    dropDrag(screen.getByTestId('target'), { clientX: 110 });

    expect(onEventsChange).toHaveBeenCalledTimes(1);
  });

  it('should ignore a drop on another Scheduler and clear the placeholder', async () => {
    // Two calendars on the page, both showing the event.
    let store!: SchedulerStoreInContext<any, any>;
    const onEventsChangeOther = vi.fn();
    const start = adapter.addDays(occurrence.displayTimezone.start.value, 1);
    const end = adapter.addDays(occurrence.displayTimezone.end.value, 1);
    render(
      <React.Fragment>
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
            getEventDropDates={() => ({ start, end })}
            render={<div data-testid="own-target" />}
          />
        </EventCalendarProvider>
        <EventCalendarProvider
          events={[builder.build()]}
          resources={[]}
          onEventsChange={onEventsChangeOther}
        >
          <SchedulerDropTarget
            surfaceType="day-grid"
            accept={accept}
            getEventDropDates={() => ({ start, end })}
            render={<div data-testid="other-target" />}
          />
        </EventCalendarProvider>
      </React.Fragment>,
    );
    const getPlaceholder = () => schedulerOccurrencePlaceholderSelectors.value(store.state);

    startDrag(screen.getByTestId('source'));
    await moveDragAndWait(screen.getByTestId('own-target'), { clientX: 100 });
    expect(getPlaceholder()).not.toBe(null);
    await moveDragAndWait(screen.getByTestId('other-target'), { clientX: 200 });

    dropDrag(screen.getByTestId('other-target'), { clientX: 210 });

    // The other Scheduler does not know this event, so it takes no part in the drag.
    expect(onEventsChangeOther).not.toHaveBeenCalled();
    expect(getPlaceholder()).toBe(null);
  });
});
