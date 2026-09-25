import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, act } from '@mui/internal-test-utils';
import { StandaloneEvent } from '@mui/x-scheduler/standalone-event';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { schedulerExternalEventKind } from '@mui/x-scheduler/drag-and-drop';
import {
  createSchedulerRenderer,
  getMonthViewCell,
  simulateDragAndDrop,
  cancelDrag,
  dropDrag,
  ResourceBuilder,
  DEFAULT_TESTING_VISIBLE_DATE,
} from 'test/utils/scheduler';
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getEventRow,
  mockAllEventRowBounds,
} from '../event-timeline-premium/tests/dependencyTestUtils';

function Source({ onEventDrop, duration = 4320 }: { onEventDrop: () => void; duration?: number }) {
  return (
    <Draggable.Provider>
      <Draggable.Root
        kind={schedulerExternalEventKind}
        payload={{ eventData: { id: 'external', title: 'External job', duration }, onEventDrop }}
        data-testid="external-source"
      >
        External job
        <Draggable.Preview>
          <span data-testid="external-preview">Floating card</span>
        </Draggable.Preview>
      </Draggable.Root>
    </Draggable.Provider>
  );
}

describe('External Scheduler drag kind', () => {
  const { renderSettled } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });
  afterEach(cancelDrag);

  it('creates multi-day calendar previews and drops from a custom source', async () => {
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
    await act(async () => {
      simulateDragAndDrop({
        source: screen.getByTestId('external-source'),
        target: getMonthViewCell(5),
        hold: true,
      });
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    });
    expect(document.querySelectorAll('.MuiEventCalendar-dayGridEventPlaceholder')).toHaveLength(2);
    // A plain Base UI preview remains visible alongside Scheduler's placeholders.
    expect(screen.getByTestId('external-preview')).toBeVisible();
    await act(async () => dropDrag(getMonthViewCell(5)));
    expect(onEventsChange).toHaveBeenCalledTimes(1);
    expect(onEventsChange.mock.calls[0][0][0].title).toBe('External job');
    expect(onEventDrop).toHaveBeenCalledTimes(1);
  });

  it('uses the latest StandaloneEvent callback after a rerender during a drag', async () => {
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

  it('does not notify StandaloneEvent when the target has event creation disabled', async () => {
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
    'does not transfer on disallowed or canceled drags: allowed=%s',
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

  it('drops into a timeline resource row from a separate provider', async () => {
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
});
