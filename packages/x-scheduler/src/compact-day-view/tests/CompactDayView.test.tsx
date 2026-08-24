import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { CompactDayView } from '@mui/x-scheduler/compact-day-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect } from 'vitest';
import { EventDialogProvider } from '../../internals/components/event-dialog';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';

describe('<CompactDayView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  function renderWithProviders(
    ui: React.ReactElement,
    events: any[] = [],
    providerProps: Partial<React.ComponentProps<typeof EventCalendarProvider>> = {},
  ): ReturnType<typeof render> {
    return render(
      <EventCalendarProvider
        events={events}
        resources={[]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        {...providerProps}
      >
        <EventDialogProvider>{ui}</EventDialogProvider>
      </EventCalendarProvider>,
    );
  }

  function getDayTimeGrid() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridContainer}`)!;
  }

  function getTimeAxisCells() {
    return document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridTimeAxisCell}`);
  }

  it('should render 1 day column', () => {
    renderWithProviders(<CompactDayView />);

    const root = getDayTimeGrid();
    expect(root.getAttribute('aria-colcount')).to.equal('1');

    const headerCells = within(root).getAllByRole('columnheader');
    expect(headerCells.length).to.equal(1);
  });

  it('should render the event title and the (CSS-hidden on touch) time element', () => {
    const event = EventBuilder.new()
      .title('Compact Event')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();

    renderWithProviders(<CompactDayView />, [event]);

    expect(screen.getAllByText('Compact Event').length).to.be.greaterThan(0);

    // Touch hides the time with CSS instead of removing it, so assert the element and the class the
    // CSS targets are present.
    const timeElements = getDayTimeGrid().querySelectorAll(
      `.${eventCalendarClasses.timeGridEventTime}`,
    );
    expect(timeElements.length).to.be.greaterThan(0);
  });

  it('should render the resize handlers for a resizable event', () => {
    const event = EventBuilder.new()
      .title('Resizable Event')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .resizable(true)
      .build();

    renderWithProviders(<CompactDayView />, [event]);

    // Both handles always render and CSS decides when to reveal them, so only assert their presence.
    const handlers = getDayTimeGrid().querySelectorAll(
      `.${eventCalendarClasses.timeGridEventResizeHandler}`,
    );
    expect(handlers.length).to.equal(2);
  });

  describe('viewConfig (startTime / endTime)', () => {
    it('should render the 24 hour rows by default', () => {
      renderWithProviders(<CompactDayView />);

      expect(getTimeAxisCells()).to.have.length(24);
    });

    it('should render only the hour rows configured under the `day` key', () => {
      renderWithProviders(<CompactDayView />, [], {
        viewConfig: { day: { startTime: 8, endTime: 20 } },
      });

      expect(getTimeAxisCells()).to.have.length(12);
    });

    it('should position events relative to the configured window', () => {
      const event = EventBuilder.new()
        .title('Compact Event')
        .span('2025-07-03T14:00:00Z', '2025-07-03T20:00:00Z')
        .build();

      renderWithProviders(<CompactDayView />, [event], {
        viewConfig: { day: { startTime: 8, endTime: 20 } },
      });

      // 14:00 → 20:00 inside the 08:00 → 20:00 window: starts halfway, fills the bottom half.
      const element = screen.getByRole('button', { name: /Compact Event/ });
      expect(element.style.getPropertyValue('--y-position')).to.equal('50%');
      expect(element.style.getPropertyValue('--height')).to.equal('50%');
    });

    it('should ignore the `week` key', () => {
      renderWithProviders(<CompactDayView />, [], {
        viewConfig: { week: { startTime: 8, endTime: 20 } },
      });

      expect(getTimeAxisCells()).to.have.length(24);
    });

    it('should name `viewConfig.day` when it receives an invalid range', () => {
      // Same key, and therefore the same warning, as the regular day view: naming the
      // surface instead of the key would warn twice for one mistake when the layout
      // crosses the compact breakpoint.
      clearWarningsCache();
      expect(() => {
        renderWithProviders(<CompactDayView />, [], {
          viewConfig: { day: { startTime: 20, endTime: 8 } },
        });
      }).toWarnDev(['MUI X Scheduler: `viewConfig.day` received an invalid hour range']);
    });
  });
});
