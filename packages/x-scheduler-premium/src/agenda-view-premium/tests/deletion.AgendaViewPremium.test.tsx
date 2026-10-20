import * as React from 'react';
import { screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { describe, it, expect } from 'vitest';

function deleteThroughContextMenu(row: HTMLElement, scope?: RegExp) {
  fireEvent.contextMenu(row);
  fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
  const dialog = screen.queryByRole('dialog', { name: /delete this event/i });
  if (dialog) {
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));
    return;
  }
  // A recurring occurrence opens the scope dialog instead.
  const scopeDialog = screen.getByRole('dialog', { name: /apply this change to/i });
  if (scope) {
    fireEvent.click(within(scopeDialog).getByRole('radio', { name: scope }));
  }
  fireEvent.click(within(scopeDialog).getByRole('button', { name: /confirm/i }));
}

describe('<EventCalendarPremium /> - Agenda view event deletion (Data Source)', () => {
  const { renderSettled } = createSchedulerRenderer();

  it('should skip the other rows of the deleted event even though a pending persist keeps them in the document', async () => {
    // Renders one row per day it spans: Jul 3, 4 and 5 all belong to the same event.
    const multiDay = EventBuilder.new()
      .id('multi-day')
      .title('MultiDay')
      .span('2025-07-03T10:00:00Z', '2025-07-05T11:00:00Z')
      .build();
    const other = EventBuilder.new()
      .id('other')
      .title('Other')
      .singleDay('2025-07-05T14:00:00Z', 60)
      .build();

    let resolvePersist: (result: { success: boolean }) => void = () => {};
    const dataSource = {
      getEvents: async () => [multiDay, other],
      persistEvents: () =>
        new Promise<{ success: boolean }>((resolve) => {
          resolvePersist = resolve;
        }),
    };

    await renderSettled(
      <EventCalendarPremium
        dataSource={dataSource}
        defaultView="agenda"
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /MultiDay/i })).to.have.length(3);
    });

    // Deleting from the first (Jul 3) row.
    const [firstRow] = screen.getAllByRole('button', { name: /MultiDay/i });
    deleteThroughContextMenu(firstRow);

    // `persistEvents` is still pending: the lazy-loading plugin only removes the event from the
    // cache (and its rows from the DOM) once it resolves, so all three `MultiDay` rows — Jul 4
    // included — are still in the document when the deferred fallback focus runs. The dialog
    // leaves them `aria-hidden` while it closes, so they're queried by DOM presence rather than
    // through a role query (which skips `aria-hidden` subtrees).
    expect(document.querySelectorAll('[data-event-id="multi-day"]')).to.have.length(3);
    await waitFor(() => {
      expect(document.activeElement).to.have.attribute('data-event-id', 'other');
    });

    // Resolving the persist now unmounts every `MultiDay` row — `Other`'s row untouched — focus
    // must still be there, not swept away with them.
    resolvePersist({ success: true });
    await waitFor(() => {
      expect(document.querySelectorAll('[data-event-id="multi-day"]')).to.have.length(0);
    });
    expect(document.activeElement).to.have.attribute('data-event-id', 'other');
  });

  it('should skip only the removed occurrences of a recurring series even though a pending persist keeps them in the document', async () => {
    // Daily series rendering one row per occurrence: Jul 3, 4 and 5.
    const daily = EventBuilder.new()
      .id('daily')
      .title('Daily Standup')
      .singleDay('2025-07-03T10:00:00Z', 30)
      .recurrent('DAILY', { count: 3 })
      .build();
    const other = EventBuilder.new()
      .id('other')
      .title('Unrelated')
      .singleDay('2025-07-06T10:00:00Z', 30)
      .build();

    let resolvePersist: (result: { success: boolean }) => void = () => {};
    const dataSource = {
      getEvents: async () => [daily, other],
      persistEvents: () =>
        new Promise<{ success: boolean }>((resolve) => {
          resolvePersist = resolve;
        }),
    };

    await renderSettled(
      <EventCalendarPremium
        dataSource={dataSource}
        defaultView="agenda"
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Daily Standup/i })).to.have.length(3);
    });

    // "This and following" from Jul 4 removes Jul 4 and Jul 5, leaving Jul 3. If the fallback
    // filtered survivors by `.isConnected` instead of identity, Jul 5 would still read as
    // connected here (the persist hasn't resolved) and get wrongly picked over `Unrelated`.
    const [, jul4] = screen.getAllByRole('button', { name: /Daily Standup/i });
    deleteThroughContextMenu(jul4, /this and following/i);

    expect(document.querySelectorAll('[data-event-id="daily"]')).to.have.length(3);
    await waitFor(() => {
      expect(document.activeElement).to.have.attribute('data-event-id', 'other');
    });

    resolvePersist({ success: true });
    await waitFor(() => {
      expect(document.querySelectorAll('[data-event-id="daily"]')).to.have.length(1);
    });
    expect(document.activeElement).to.have.attribute('data-event-id', 'other');
  });
});

describe('<EventCalendarPremium /> - Agenda view recurring event deletion (focus fallback)', () => {
  const { render } = createSchedulerRenderer();

  function renderEvents(events: SchedulerEvent[]) {
    function StatefulAgenda() {
      const [currentEvents, setCurrentEvents] = React.useState<SchedulerEvent[]>(events);
      return (
        <EventCalendarPremium
          events={currentEvents}
          onEventsChange={setCurrentEvents}
          defaultView="agenda"
          defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />
      );
    }

    return render(<StatefulAgenda />);
  }

  // "Only this" keeps every occurrence but the deleted one, "this and following" also drops
  // everything after it — only "all" (or a non-recurring delete) removes the whole series.
  function buildDailySeries() {
    return EventBuilder.new()
      .id('daily')
      .title('Daily Standup')
      .singleDay('2025-07-03T10:00:00Z', 30)
      .recurrent('DAILY', { count: 3 })
      .build();
  }

  it('should move focus to the next surviving occurrence of the same series for the default "only this" scope', async () => {
    const other = EventBuilder.new()
      .id('other')
      .title('Unrelated')
      .singleDay('2025-07-06T10:00:00Z', 30)
      .build();
    renderEvents([buildDailySeries(), other]);

    const rows = await screen.findAllByRole('button', { name: /Daily Standup/i });
    expect(rows).to.have.length(3);
    // Default scope "only this" excludes just Jul 4 — Jul 3 and Jul 5 survive.
    deleteThroughContextMenu(rows[1]);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Daily Standup/i })).to.have.length(2);
    });
    const [, later] = screen.getAllByRole('button', { name: /Daily Standup/i });
    await waitFor(() => {
      expect(document.activeElement).to.equal(later);
    });
  });

  // Regression test for https://github.com/mui/mui-x/issues/23883: "this and following" on the
  // last occurrence, with nothing else in view, used to leave focus on <body>.
  it('should move focus to the previous occurrence for "this and following" on the last occurrence, with nothing else in view', async () => {
    renderEvents([buildDailySeries()]);

    const rows = await screen.findAllByRole('button', { name: /Daily Standup/i });
    const [, jul4, jul5] = rows;
    deleteThroughContextMenu(jul5, /this and following/i);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Daily Standup/i })).to.have.length(2);
    });
    expect(document.activeElement).not.to.equal(document.body);
    await waitFor(() => {
      expect(document.activeElement).to.equal(jul4);
    });
  });

  it('should skip every occurrence of the series for "all", same as a non-recurring delete', async () => {
    const other = EventBuilder.new()
      .id('other')
      .title('Unrelated')
      .singleDay('2025-07-06T10:00:00Z', 30)
      .build();
    renderEvents([buildDailySeries(), other]);

    const rows = await screen.findAllByRole('button', { name: /Daily Standup/i });
    deleteThroughContextMenu(rows[1], /all events/i);

    await waitFor(() => {
      expect(screen.queryAllByRole('button', { name: /Daily Standup/i })).to.have.length(0);
    });
    await waitFor(() => {
      expect(document.activeElement).to.equal(screen.getByRole('button', { name: /Unrelated/i }));
    });
  });
});
