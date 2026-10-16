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

describe('<EventCalendarPremium /> - Agenda view recurring event deletion (focus fallback)', () => {
  const { render } = createSchedulerRenderer();

  // "Only this" keeps every occurrence but the deleted one, "this and following" also drops
  // everything after it — only "all" (or a non-recurring delete) removes the whole series.
  function renderSeries() {
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

    function StatefulAgenda() {
      const [events, setEvents] = React.useState<SchedulerEvent[]>([daily, other]);
      return (
        <EventCalendarPremium
          events={events}
          onEventsChange={setEvents}
          defaultView="agenda"
          defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />
      );
    }

    return render(<StatefulAgenda />);
  }

  async function deleteThroughContextMenu(row: HTMLElement, scope?: RegExp) {
    fireEvent.contextMenu(row);
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    const dialog = screen.getByRole('dialog', { name: /apply this change to/i });
    if (scope) {
      fireEvent.click(within(dialog).getByRole('radio', { name: scope }));
    }
    fireEvent.click(within(dialog).getByRole('button', { name: /confirm/i }));
  }

  it('should move focus to the next surviving occurrence of the same series for the default "only this" scope', async () => {
    renderSeries();

    const rows = await screen.findAllByRole('button', { name: /Daily Standup/i });
    expect(rows).to.have.length(3);
    // Delete the middle occurrence (Jul 4): the default scope is "only this", which only excludes
    // it — Jul 3 and Jul 5 survive, so skipping both (as a plain `data-event-id` exclusion would)
    // would wrongly land focus on `Unrelated` instead of Jul 5.
    await deleteThroughContextMenu(rows[1]);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Daily Standup/i })).to.have.length(2);
    });
    // The survivor focus landed on is the later one chronologically (Jul 5), not the earlier
    // (Jul 3), confirming it skipped only the deleted occurrence, not every row of the series.
    const [earlier, later] = screen.getAllByRole('button', { name: /Daily Standup/i });
    await waitFor(() => {
      expect(document.activeElement).to.equal(later);
    });
    expect(document.activeElement).not.to.equal(earlier);
  });

  it('should move focus past the series for "this and following", which also removes every later occurrence', async () => {
    renderSeries();

    const rows = await screen.findAllByRole('button', { name: /Daily Standup/i });
    // Deleting Jul 4 with "this and following" also removes Jul 5: only Jul 3 (before) and
    // `Unrelated` (after) survive, so focus should land on `Unrelated`, not Jul 5's row.
    await deleteThroughContextMenu(rows[1], /this and following/i);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Daily Standup/i })).to.have.length(1);
    });
    await waitFor(() => {
      expect(document.activeElement).to.equal(screen.getByRole('button', { name: /Unrelated/i }));
    });
  });

  it('should skip every occurrence of the series for "all", same as a non-recurring delete', async () => {
    renderSeries();

    const rows = await screen.findAllByRole('button', { name: /Daily Standup/i });
    await deleteThroughContextMenu(rows[1], /all events/i);

    await waitFor(() => {
      expect(screen.queryAllByRole('button', { name: /Daily Standup/i })).to.have.length(0);
    });
    await waitFor(() => {
      expect(document.activeElement).to.equal(screen.getByRole('button', { name: /Unrelated/i }));
    });
  });
});
