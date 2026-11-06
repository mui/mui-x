import * as React from 'react';
import { screen, waitFor, within } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { WeekView } from '@mui/x-scheduler/week-view';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect } from 'vitest';
import { EventCalendarProvider } from '../../EventCalendarProvider';
import { EventDialogProvider } from '../../event-dialog';

// `hasScroll` is derived from real layout (scrollHeight vs clientHeight), which jsdom does not implement.
describe.skipIf(isJSDOM)('<DayTimeGrid /> scroll gutter', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-04') });

  function getAllDayGrid() {
    return document.querySelector(`.${eventCalendarClasses.dayTimeGridAllDayEventsGrid}`);
  }

  it('should recompute the scroll gutter when the container resizes without a re-render', async () => {
    // Let the host fit its content so the time grid body does not overflow,
    // regardless of how tall the header renders.
    render(
      <div data-testid="host" style={{ height: 'fit-content' }}>
        <EventCalendarProvider events={[]} resources={[]}>
          <EventDialogProvider>
            <WeekView />
          </EventDialogProvider>
        </EventCalendarProvider>
      </div>,
    );

    const host = document.querySelector<HTMLElement>('[data-testid="host"]')!;

    await waitFor(() => {
      expect(getAllDayGrid()).not.to.have.attribute('data-has-scroll');
    });

    // Shrink the container via the DOM so the body overflows without triggering a React re-render.
    host.style.height = '400px';

    await waitFor(() => {
      expect(getAllDayGrid()).to.have.attribute('data-has-scroll');
    });
  });
});

// The all-day height cap and the column alignment depend on real layout, which jsdom does not implement.
describe.skipIf(isJSDOM)('<DayTimeGrid /> all-day events overflow', () => {
  const { renderSettled } = createSchedulerRenderer({ clockConfig: new Date('2025-05-04') });

  const createAllDayEvents = (day: string) =>
    Array.from({ length: 12 }, (_, index) =>
      EventBuilder.new().title(`All day ${index}`).fullDay(day).build(),
    );

  async function setupOverflowingWeek() {
    const { user } = await renderSettled(
      <div style={{ height: 800 }}>
        {/* Classic scrollbars take layout width, unlike the overlay ones of some platforms. */}
        <style>
          {
            '* { scrollbar-color: auto !important; } *::-webkit-scrollbar { width: 15px; height: 15px; }'
          }
        </style>
        <EventCalendar
          events={[
            ...createAllDayEvents('2025-05-06T00:00:00Z'),
            ...createAllDayEvents('2025-05-13T00:00:00Z'),
          ]}
          view="week"
        />
      </div>,
    );

    const row = document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.dayTimeGridAllDayEventsRow}`,
    )!;
    await waitFor(() => {
      expect(row.scrollHeight).to.be.greaterThan(row.clientHeight);
    });
    return { row, user };
  }

  function isFullyVisibleIn(element: Element, container: Element) {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
  }

  it('should show 6 all-day events and scroll to the others', async () => {
    const { row } = await setupOverflowingWeek();
    const events = within(row).getAllByRole('button', { name: /All day/ });

    expect(events.filter((event) => isFullyVisibleIn(event, row))).to.have.length(6);
    // The next event peeks out to hint that the area scrolls.
    expect(events[6].getBoundingClientRect().top).to.be.lessThan(
      row.getBoundingClientRect().bottom,
    );
    // A vertical scrollbar is shown, and no horizontal one eats into the height of the row.
    expect(row.offsetWidth - row.clientWidth).to.be.greaterThan(0);
    expect(row.offsetHeight - row.clientHeight).to.equal(0);

    row.scrollTop = row.scrollHeight;
    expect(isFullyVisibleIn(events[events.length - 1], row)).to.equal(true);
  });

  it('should keep the all-day cells aligned with the time grid columns when the row scrolls', async () => {
    const { row } = await setupOverflowingWeek();
    const columns = document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridColumn}`);
    const allDayCells = row.querySelectorAll(
      `.${eventCalendarClasses.dayTimeGridAllDayEventsCell}`,
    );

    expect(allDayCells.length).to.equal(columns.length);
    allDayCells.forEach((cell, index) => {
      const cellRect = cell.getBoundingClientRect();
      const columnRect = columns[index].getBoundingClientRect();
      expect(Math.abs(cellRect.left - columnRect.left)).to.be.lessThan(1);
      expect(Math.abs(cellRect.right - columnRect.right)).to.be.lessThan(1);
    });

    // The scrollbar of the row sits in the gutter instead of covering the last day.
    const rowRect = row.getBoundingClientRect();
    const lastCellRect = allDayCells[allDayCells.length - 1].getBoundingClientRect();
    expect(lastCellRect.right).to.be.at.most(rowRect.left + row.clientLeft + row.clientWidth + 0.5);
  });

  it('should scroll the all-day events back to the top when navigating to another period', async () => {
    const { row, user } = await setupOverflowingWeek();
    row.scrollTop = row.scrollHeight;

    await user.click(screen.getByRole('button', { name: /next week/i }));

    expect(row.scrollTop).to.equal(0);
  });
});
