import * as React from 'react';
import { screen, waitFor } from '@mui/internal-test-utils';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import type { TemporalSupportedObject } from '@mui/x-scheduler-internals/models';
import { describe, it, expect, vi } from 'vitest';

describe('<StandaloneAgendaViewPremium /> - Data Source', () => {
  const { render } = createSchedulerRenderer();

  const pendingGetEvents = () => new Promise<SchedulerEvent[]>(() => {});

  function renderWithDataSource(
    getEvents: (
      start: TemporalSupportedObject,
      end: TemporalSupportedObject,
    ) => Promise<SchedulerEvent[]>,
    props: Partial<React.ComponentProps<typeof StandaloneAgendaViewPremium>> = {},
  ) {
    return render(
      <StandaloneAgendaViewPremium
        dataSource={{ getEvents, persistEvents: async () => ({ success: true }) }}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        {...props}
      />,
    );
  }

  const getSkeletons = () => document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`);
  const getRows = () => document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`);

  // The standalone views render `EventSkeleton`, which reads `SharedComponentsStyledContext`.
  // `EventCalendarProvider` (the wrapper used by every standalone view) must supply that
  // context, otherwise rendering the data-source loading state throws.
  it('should render the skeleton in a standalone view while events are loading', async () => {
    renderWithDataSource(pendingGetEvents);

    await waitFor(() => {
      expect(getSkeletons().length).to.be.greaterThan(0);
    });
  });

  describe('showEmptyDaysInAgenda=false', () => {
    const hideEmptyDays = { defaultPreferences: { showEmptyDaysInAgenda: false } };

    it('should render the loading skeletons instead of the empty state while events are loading', async () => {
      renderWithDataSource(pendingGetEvents, hideEmptyDays);

      await waitFor(() => {
        expect(getSkeletons().length).to.be.greaterThan(0);
      });
      expect(screen.queryByRole('status')).to.equal(null);
    });

    it('should replace the loading skeletons with the empty state once the data source resolves without events', async () => {
      renderWithDataSource(async () => [], hideEmptyDays);

      await waitFor(() => {
        expect(screen.getByRole('status')).to.have.text('No upcoming events');
      });
      expect(getSkeletons()).to.have.length(0);
    });

    it('should render the days with events and no empty state once the data source resolves with events', async () => {
      const event = EventBuilder.new()
        .title('Kickoff')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .build();
      renderWithDataSource(async () => [event], hideEmptyDays);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Kickoff/ })).not.to.equal(null);
      });
      expect(getRows()).to.have.length(1);
      expect(screen.queryByRole('status')).to.equal(null);
    });

    it('should not render the empty state when the data source fails', async () => {
      renderWithDataSource(async () => {
        throw new Error('Network down');
      }, hideEmptyDays);

      await waitFor(() => {
        expect(getSkeletons()).to.have.length(0);
      });
      expect(getRows()).to.have.length(0);
      expect(screen.queryByRole('status')).to.equal(null);
    });

    it('should fetch the wide range and settle when the loaded events spread beyond the first window', async () => {
      const weekly = EventBuilder.new()
        .title('Weekly sync')
        .singleDay(DEFAULT_TESTING_VISIBLE_DATE_STR)
        .recurrent('WEEKLY')
        .build();
      const getEvents = vi.fn(async () => [weekly]);

      renderWithDataSource(getEvents, hideEmptyDays);

      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: /Weekly sync/ })).to.have.length(12);
      });
      expect(getSkeletons()).to.have.length(0);

      // Give the debounced queue time to run again: the loop would keep flipping `isLoading`.
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      expect(getSkeletons()).to.have.length(0);
      expect(getEvents.mock.calls.length).to.be.lessThan(4);
    });

    it('should fetch the next window after navigating when the current one has no events', async () => {
      // 20 days after the default visible date, outside the first 12-day window
      const farEvent = EventBuilder.new()
        .title('Far away')
        .singleDay('2025-07-23T10:00:00Z')
        .build();
      const farEventStart = adapter.date('2025-07-23T10:00:00Z', 'default');
      const getEvents = vi.fn(
        async (start: TemporalSupportedObject, end: TemporalSupportedObject) =>
          adapter.isBefore(farEventStart, end) && adapter.isAfter(farEventStart, start)
            ? [farEvent]
            : [],
      );

      function Test() {
        const [visibleDate, setVisibleDate] = React.useState(DEFAULT_TESTING_VISIBLE_DATE);
        return (
          <React.Fragment>
            <StandaloneAgendaViewPremium
              dataSource={{ getEvents, persistEvents: async () => ({ success: true }) }}
              visibleDate={visibleDate}
              onVisibleDateChange={setVisibleDate}
              defaultPreferences={{ showEmptyDaysInAgenda: false }}
            />
            <button type="button" onClick={() => setVisibleDate(adapter.addDays(visibleDate, 12))}>
              Next
            </button>
          </React.Fragment>
        );
      }

      const { user } = render(<Test />);

      await waitFor(() => {
        expect(screen.getByRole('status')).to.have.text('No upcoming events');
      });
      expect(getEvents.mock.calls).to.have.length(1);

      await user.click(screen.getByRole('button', { name: 'Next' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Far away/ })).not.to.equal(null);
      });
      expect(getEvents.mock.calls).to.have.length(2);
      expect(screen.queryByRole('status')).to.equal(null);
    });
  });
});
