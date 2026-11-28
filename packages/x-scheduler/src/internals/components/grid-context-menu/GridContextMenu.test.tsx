import * as React from 'react';
import { screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  createMatchMedia,
  createSchedulerRenderer,
  EventBuilder,
  mockElementBounds,
} from 'test/utils/scheduler';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('GridContextMenu', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = createMatchMedia(false);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  const event = EventBuilder.new()
    .id('event-1')
    .title('Morning Meeting')
    .singleDay('2025-07-03T10:00:00Z', 60)
    .build();

  function getTimeColumn(): HTMLElement {
    // The time grid column is the only grid cell rendering the events of the time grid.
    return screen
      .getAllByRole('gridcell')
      .find((cell) => cell.querySelector('[role="button"]') != null)!;
  }

  function getNewEventItem() {
    return screen.getByRole('menuitem', { name: 'New event' });
  }

  it('should open the menu with a New event item on right-click of a time column', () => {
    render(<StandaloneDayView events={[event]} resources={[]} />);

    fireEvent.contextMenu(getTimeColumn(), { clientX: 10, clientY: 10 });

    expect(screen.getByRole('menu', { name: 'Grid actions' })).not.to.equal(null);
    expect(getNewEventItem()).not.to.equal(null);
  });

  it('should start the creation at the right-clicked time when New event is clicked', () => {
    const onEventEditingStart = vi.fn();
    render(
      <StandaloneDayView
        events={[event]}
        resources={[]}
        displayTimezone="UTC"
        onEventEditingStart={onEventEditingStart}
      />,
    );

    const column = getTimeColumn();
    // 1px per minute of the day.
    mockElementBounds(column, { top: 0, height: 24 * 60 });
    fireEvent.contextMenu(column, { clientY: 14 * 60 + 10 });
    fireEvent.click(getNewEventItem());

    expect(screen.queryByRole('menu')).to.equal(null);
    expect(onEventEditingStart.mock.calls.length).to.equal(1);
    const [occurrence, eventDetails] = onEventEditingStart.mock.calls[0];
    expect(eventDetails.reason).to.equal('creation');
    expect(new Date(occurrence.start.epochMilliseconds).toISOString()).to.equal(
      '2025-07-03T14:00:00.000Z',
    );
    expect(screen.getByRole('textbox', { name: /Event title/i })).not.to.equal(null);
  });

  it('should open the event context menu, not the grid one, on right-click of an event', () => {
    render(<StandaloneDayView events={[event]} resources={[]} />);

    fireEvent.contextMenu(screen.getByRole('button', { name: /Morning Meeting/i }));

    expect(screen.getByRole('menu', { name: 'Event actions' })).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: 'New event' })).to.equal(null);
  });

  it('should open the menu in the week view', () => {
    render(<StandaloneWeekView events={[event]} resources={[]} />);

    fireEvent.contextMenu(getTimeColumn());

    expect(getNewEventItem()).not.to.equal(null);
  });

  it('should start an all-day creation on the right-clicked day of the month view', () => {
    const onEventEditingStart = vi.fn();
    render(
      <StandaloneMonthView
        events={[]}
        resources={[]}
        displayTimezone="UTC"
        onEventEditingStart={onEventEditingStart}
      />,
    );

    const cell = screen
      .getAllByRole('gridcell')
      .find((gridCell) => gridCell.textContent?.trim().startsWith('15'))!;
    fireEvent.contextMenu(cell);
    fireEvent.click(getNewEventItem());

    expect(onEventEditingStart.mock.calls.length).to.equal(1);
    const [occurrence, eventDetails] = onEventEditingStart.mock.calls[0];
    expect(eventDetails.reason).to.equal('creation');
    expect(occurrence.allDay).to.equal(true);
    expect(occurrence.start.toString()).to.contain('2025-07-15');
  });

  it('should close the menu on Escape without creating anything', async () => {
    const onEventEditingStart = vi.fn();
    render(
      <StandaloneDayView events={[]} resources={[]} onEventEditingStart={onEventEditingStart} />,
    );

    fireEvent.contextMenu(screen.getAllByRole('gridcell')[0]);
    fireEvent.keyDown(getNewEventItem(), { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).to.equal(null);
    });
    expect(onEventEditingStart.mock.calls.length).to.equal(0);
  });

  it('should not open an empty menu when `eventCreation` is `false`', () => {
    render(<StandaloneDayView events={[]} resources={[]} eventCreation={false} />);

    const cell = screen.getAllByRole('gridcell')[0];
    const contextMenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    fireEvent(cell, contextMenuEvent);

    expect(screen.queryByRole('menu')).to.equal(null);
    // The native browser menu is kept.
    expect(contextMenuEvent.defaultPrevented).to.equal(false);
  });

  it('should not open the menu when the scheduler is read-only', () => {
    render(<StandaloneDayView events={[]} resources={[]} readOnly />);

    fireEvent.contextMenu(screen.getAllByRole('gridcell')[0]);

    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('should not open the menu on a coarse pointer', () => {
    window.matchMedia = createMatchMedia(true);
    render(<StandaloneDayView events={[]} resources={[]} />);

    fireEvent.contextMenu(screen.getAllByRole('gridcell')[0]);

    expect(screen.queryByRole('menu')).to.equal(null);
  });
});
