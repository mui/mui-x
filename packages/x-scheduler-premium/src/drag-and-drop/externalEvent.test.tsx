import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, act, fireEvent } from '@mui/internal-test-utils';
import { StandaloneEvent } from '@mui/x-scheduler/standalone-event';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import type { EventTimelinePremiumStore } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import {
  createSchedulerRenderer,
  getEventByTitle,
  getEventRow,
  getMonthViewCell,
  mockAllEventRowBounds,
  moveDragAndWait,
  simulateDragAndDrop,
  startDrag,
  cancelDrag,
  dropDrag,
  EventBuilder,
  ExternalEventSource,
  ResourceBuilder,
  DEFAULT_TESTING_VISIBLE_DATE,
} from 'test/utils/scheduler';
import { describe, it, expect, vi } from 'vitest';
import { TestTimeline } from '../event-timeline-premium/tests/dependencyTestUtils';

const floatingCardPreview = (
  <Draggable.Preview>
    <span data-testid="external-preview">Floating card</span>
  </Draggable.Preview>
);

function Source({ onEventDrop, duration = 4320 }: { onEventDrop: () => void; duration?: number }) {
  return (
    <ExternalEventSource
      eventData={{ id: 'external', title: 'External job', duration }}
      onEventDrop={onEventDrop}
      preview={floatingCardPreview}
    />
  );
}

/** Ends the drag the way the user abandons it. */
async function endExternalDrag(ending: 'escape' | 'release outside') {
  if (ending === 'escape') {
    fireEvent.keyDown(document.body, { key: 'Escape' });
  } else {
    await moveDragAndWait(document.body, { clientX: 2000 });
    dropDrag(document.body, { clientX: 2000 });
  }
}

describe('External Scheduler drag kind', () => {
  const { renderSettled } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  it('should create multi-day calendar previews and drop from a custom source', async () => {
    const onEventDrop = vi.fn();
    const onEventsChange = vi.fn();
    await renderSettled(
      <React.Fragment>
        <Source onEventDrop={onEventDrop} />
        <StandaloneMonthView
          events={[]}
          resources={[]}
          canDragEventsFromTheOutside
          onEventsChange={onEventsChange}
        />
      </React.Fragment>,
    );
    startDrag(screen.getByTestId('external-source'));
    await moveDragAndWait(getMonthViewCell(5));
    expect(document.querySelectorAll('.MuiEventCalendar-dayGridEventPlaceholder')).toHaveLength(2);
    // A plain Base UI preview remains visible alongside Scheduler's placeholders.
    expect(screen.getByTestId('external-preview')).toBeVisible();
    await act(async () => dropDrag(getMonthViewCell(5)));
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(onEventsChange.mock.calls[0][0][0].title).toBe('External job');
    expect(onEventDrop).toHaveBeenCalledTimes(1);
  });

  it('should use the latest StandaloneEvent callback after a rerender during a drag', async () => {
    const data = { id: 'external', title: 'External job', duration: 60 };
    const onEventsChange = vi.fn();
    function Fixture({ onEventDrop }: { onEventDrop: () => void }) {
      return (
        <React.Fragment>
          <StandaloneEvent data={data} onEventDrop={onEventDrop} data-testid="external-source">
            External job
          </StandaloneEvent>
          <StandaloneMonthView
            events={[]}
            resources={[]}
            canDragEventsFromTheOutside
            onEventsChange={onEventsChange}
          />
        </React.Fragment>
      );
    }
    const onEventDrop = vi.fn();
    const nextOnEventDrop = vi.fn(() => {
      expect(onEventsChange).toHaveBeenCalledTimes(1);
    });
    const view = await renderSettled(<Fixture onEventDrop={onEventDrop} />);
    await act(async () => {
      simulateDragAndDrop({
        source: screen.getByTestId('external-source'),
        target: getMonthViewCell(5),
        hold: true,
      });
    });
    view.setProps({ onEventDrop: nextOnEventDrop });
    await act(async () => dropDrag(getMonthViewCell(5)));
    expect(onEventDrop).not.toHaveBeenCalled();
    expect(nextOnEventDrop).toHaveBeenCalledTimes(1);
    expect(onEventsChange.mock.calls[0][0][0].title).toBe('External job');
  });

  it('should not notify StandaloneEvent when the target has event creation disabled', async () => {
    const onEventDrop = vi.fn();
    const onEventsChange = vi.fn();
    await renderSettled(
      <React.Fragment>
        <StandaloneEvent
          data={{ id: 'external', title: 'External job' }}
          onEventDrop={onEventDrop}
          data-testid="external-source"
        />
        <StandaloneMonthView
          events={[]}
          resources={[]}
          canDragEventsFromTheOutside
          eventCreation={false}
          onEventsChange={onEventsChange}
        />
      </React.Fragment>,
    );
    await act(async () => {
      simulateDragAndDrop({
        source: screen.getByTestId('external-source'),
        target: getMonthViewCell(5),
      });
    });
    expect(onEventsChange).not.toHaveBeenCalled();
    expect(onEventDrop).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'should not transfer on disallowed or canceled drags: allowed=%s',
    async (allowed) => {
      const onEventDrop = vi.fn();
      const onEventsChange = vi.fn();
      await renderSettled(
        <React.Fragment>
          <Source onEventDrop={onEventDrop} />
          <StandaloneMonthView
            events={[]}
            resources={[]}
            canDragEventsFromTheOutside={allowed}
            onEventsChange={onEventsChange}
          />
        </React.Fragment>,
      );
      await act(async () => {
        simulateDragAndDrop({
          source: screen.getByTestId('external-source'),
          target: getMonthViewCell(5),
          hold: allowed,
        });
        if (allowed) {
          cancelDrag();
        }
      });
      expect(onEventsChange).not.toHaveBeenCalled();
      expect(onEventDrop).not.toHaveBeenCalled();
    },
  );

  it('should drop into a timeline resource row from a separate provider', async () => {
    const resource = ResourceBuilder.new().build();
    const onEventDrop = vi.fn();
    const onEventsChange = vi.fn();
    await renderSettled(
      <React.Fragment>
        <Source onEventDrop={onEventDrop} duration={60} />
        <EventTimelinePremium
          resources={[resource]}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndHour"
          presets={['dayAndHour']}
          presetConfig={{ dayAndHour: { startTime: 8, endTime: 20 } }}
          canDragEventsFromTheOutside
          onEventsChange={onEventsChange}
        />
      </React.Fragment>,
    );
    mockAllEventRowBounds(2160);
    await act(async () =>
      simulateDragAndDrop({
        source: screen.getByTestId('external-source'),
        target: getEventRow(resource.id),
        targetClientX: 840,
      }),
    );
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(onEventsChange.mock.calls[0][0][0].resource).toBe(resource.id);
    expect(onEventDrop).toHaveBeenCalledTimes(1);
  });

  describe('abandoned external drags', () => {
    it.each(['escape', 'release outside'] as const)(
      'should leave the calendar events clickable after an external drag ended with %s',
      async (ending) => {
        const existingEvent = EventBuilder.new()
          .title('Existing event')
          .fullDay('2025-07-08')
          .build();
        await renderSettled(
          <React.Fragment>
            <ExternalEventSource eventData={{ id: 'external', title: 'External job' }} />
            <StandaloneMonthView
              events={[existingEvent]}
              resources={[]}
              canDragEventsFromTheOutside
            />
          </React.Fragment>,
        );

        startDrag(screen.getByTestId('external-source'));
        await moveDragAndWait(getMonthViewCell(5));
        // Day-grid events let the pointer through to the cells while a placeholder exists.
        expect(getEventByTitle('Existing event').style.pointerEvents).toBe('none');

        await endExternalDrag(ending);

        expect(document.querySelector('.MuiEventCalendar-dayGridEventPlaceholder')).toBe(null);
        expect(getEventByTitle('Existing event').style.pointerEvents).toBe('');
      },
    );

    it.each(['escape', 'release outside'] as const)(
      'should clear the timeline placeholder after an external drag ended with %s',
      async (ending) => {
        const resource = ResourceBuilder.new().build();
        let store!: EventTimelinePremiumStore<any, any>;
        await renderSettled(
          <React.Fragment>
            <ExternalEventSource eventData={{ id: 'external', title: 'External job' }} />
            <div style={{ width: 1200, height: 600, display: 'flex', flexDirection: 'column' }}>
              <TestTimeline
                events={[]}
                resources={[resource]}
                canDragEventsFromTheOutside
                onStoreReady={(value) => {
                  store = value;
                }}
              />
            </div>
          </React.Fragment>,
        );
        mockAllEventRowBounds();
        const getPlaceholder = () => schedulerOccurrencePlaceholderSelectors.value(store.state);

        startDrag(screen.getByTestId('external-source'));
        await moveDragAndWait(getEventRow(resource.id), { clientX: 840 });
        expect(getPlaceholder()).toMatchObject({ type: 'external-drag' });

        await endExternalDrag(ending);

        expect(getPlaceholder()).toBe(null);
      },
    );
  });
});
