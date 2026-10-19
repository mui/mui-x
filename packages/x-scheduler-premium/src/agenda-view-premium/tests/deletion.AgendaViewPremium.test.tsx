import { screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { describe, it, expect } from 'vitest';

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
    fireEvent.contextMenu(firstRow);
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));

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
});
