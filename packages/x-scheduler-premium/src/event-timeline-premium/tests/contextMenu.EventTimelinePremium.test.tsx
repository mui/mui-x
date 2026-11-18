import * as React from 'react';
import { act, screen, fireEvent, waitFor, within } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createMatchMedia,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEventElement } from './dependencyTestUtils';

const engineering = ResourceBuilder.new().build();

describe('EventTimelinePremium - Context menu', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = createMatchMedia(false);
  });
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should close the menu when its event is removed', async () => {
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .build();
    const { setProps } = await renderSettled(
      <EventTimelinePremium
        resources={[engineering]}
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
      />,
    );

    fireEvent.contextMenu(getEventElement('Team Standup'));
    expect(screen.getByRole('menu')).not.to.equal(null);

    setProps({ events: [] });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).to.equal(null);
    });
  });

  describe('focus', () => {
    const event = EventBuilder.new()
      .title('Team Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(engineering)
      .build();

    function getEventRow() {
      return getEventElement('Team Standup').parentElement!.closest<HTMLElement>('[tabindex]')!;
    }

    it('should move focus to the event row after Delete', async () => {
      function StatefulTimeline() {
        const [events, setEvents] = React.useState([event]);
        return (
          <EventTimelinePremium
            resources={[engineering]}
            events={events}
            onEventsChange={setEvents}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndMonth"
            presets={['dayAndMonth']}
          />
        );
      }
      await renderSettled(<StatefulTimeline />);
      const row = getEventRow();

      fireEvent.contextMenu(getEventElement('Team Standup'));
      fireEvent.click(screen.getByRole('menuitem', { name: /delete/i }));
      const dialog = screen.queryByRole('dialog', { name: /delete this event/i });
      if (dialog) {
        fireEvent.click(within(dialog).getByRole('button', { name: 'Delete event' }));
      }

      await waitFor(() => {
        expect(document.activeElement).to.equal(row);
      });
    });

    it('should move focus to the event row when the event is removed while its menu is open', async () => {
      const { setProps } = await renderSettled(
        <EventTimelinePremium
          resources={[engineering]}
          events={[event]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndMonth"
          presets={['dayAndMonth']}
        />,
      );
      const row = getEventRow();
      await act(async () => {
        getEventElement('Team Standup').focus();
      });
      fireEvent.contextMenu(getEventElement('Team Standup'));

      setProps({ events: [] });

      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(row);
      });
    });

    it('should move focus to the event row when the focused event is removed', async () => {
      const { setProps } = await renderSettled(
        <EventTimelinePremium
          resources={[engineering]}
          events={[event]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndMonth"
          presets={['dayAndMonth']}
        />,
      );
      const row = getEventRow();
      await act(async () => {
        getEventElement('Team Standup').focus();
      });

      setProps({ events: [] });

      await waitFor(() => {
        expect(document.activeElement).to.equal(row);
      });
    });
  });
});
