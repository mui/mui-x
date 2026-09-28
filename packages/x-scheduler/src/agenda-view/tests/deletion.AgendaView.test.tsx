import * as React from 'react';
import { screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { StandaloneAgendaView } from '@mui/x-scheduler/agenda-view';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { describe, it, expect } from 'vitest';

describe('AgendaView - event deletion', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderEvents(titles: string[]) {
    const initialEvents = titles.map((title, index) =>
      EventBuilder.new()
        .id(`event-${index}`)
        .title(title)
        .singleDay(`2025-07-03T${10 + index}:00:00Z`, 60)
        .build(),
    );

    function StatefulAgendaView() {
      const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
      return (
        <StandaloneAgendaView
          events={events}
          resources={[]}
          onEventsChange={setEvents}
          visibleDate={new Date('2025-07-03T00:00:00Z')}
        />
      );
    }

    render(<StatefulAgendaView />);
  }

  // Opens the event's context menu (the fine-pointer way to reach Delete) and confirms.
  async function deleteThroughContextMenu(title: RegExp) {
    fireEvent.contextMenu(screen.getByRole('button', { name: title }));
    fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
    const dialog = screen.getByRole('dialog', { name: /delete this event/i });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: title })).to.equal(null);
    });
  }

  it('should move focus to the next event after a confirmed delete', async () => {
    renderEvents(['First', 'Second']);

    await deleteThroughContextMenu(/First/);

    // The agenda events have no focusable ancestor inside the scheduler to fall back to.
    await waitFor(() => {
      expect(document.activeElement).to.equal(screen.getByRole('button', { name: /Second/ }));
    });
  });

  it('should move focus to the previous event when the last one is deleted', async () => {
    renderEvents(['First', 'Second']);

    await deleteThroughContextMenu(/Second/);

    await waitFor(() => {
      expect(document.activeElement).to.equal(screen.getByRole('button', { name: /First/ }));
    });
  });
});
