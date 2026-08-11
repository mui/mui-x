import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { adapter, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';

describe('<DayTimeGrid /> - viewConfig (startTime / endTime)', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });

  // 2025-07-03 is a Thursday.
  const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');

  function getTimeAxisCells() {
    return document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridTimeAxisCell}`);
  }

  const meeting = EventBuilder.new()
    .title('Meeting')
    .span('2025-07-03T14:00:00Z', '2025-07-03T20:00:00Z')
    .build();

  describe('week view', () => {
    it('should render the 24 hour rows by default', () => {
      render(<EventCalendar events={[]} visibleDate={visibleDate} view="week" />);
      expect(getTimeAxisCells()).to.have.length(24);
    });

    it('should render only the configured hour rows', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          view="week"
          viewConfig={{ week: { startTime: 8, endTime: 20 } }}
        />,
      );
      expect(getTimeAxisCells()).to.have.length(12);
    });

    it('should position events relative to the configured window', () => {
      render(
        <EventCalendar
          events={[meeting]}
          visibleDate={visibleDate}
          view="week"
          viewConfig={{ week: { startTime: 8, endTime: 20 } }}
        />,
      );
      // 14:00 → 20:00 inside the 08:00 → 20:00 window: starts halfway, fills the bottom half.
      const event = screen.getByRole('button', { name: /Meeting/ });
      expect(event.style.getPropertyValue('--y-position')).to.equal('50%');
      expect(event.style.getPropertyValue('--height')).to.equal('50%');
    });

    it('should clamp events starting before the window to the top edge', () => {
      const earlyEvent = EventBuilder.new()
        .title('Early')
        .span('2025-07-03T06:00:00Z', '2025-07-03T09:00:00Z')
        .build();
      render(
        <EventCalendar
          events={[earlyEvent]}
          visibleDate={visibleDate}
          view="week"
          viewConfig={{ week: { startTime: 8, endTime: 20 } }}
        />,
      );
      // 06:00 → 09:00 partially overlaps the 08:00 → 20:00 window: clamped to the top edge and
      // only the visible 08:00 → 09:00 portion (1h out of the 12h window) keeps a height.
      const event = screen.getByRole('button', { name: /Early/ });
      expect(event.style.getPropertyValue('--y-position')).to.equal('0%');
      expect(event.style.getPropertyValue('--height')).to.equal(`${(1 / 12) * 100}%`);
    });

    describe('resize handles on clipped edges', () => {
      // A bound hidden by the hour window renders at the window edge, not at its real
      // position, so offering a handle there would rewrite the hidden bound from the
      // 08:00/20:00 edge. The handles render in DOM order: start, content, end.
      function getHandles(name: RegExp) {
        const event = screen.getByRole('button', { name });
        const handles = Array.from(
          event.querySelectorAll(`.${eventCalendarClasses.timeGridEventResizeHandler}`),
        );
        return { event, handles };
      }

      function renderWindowedEvents() {
        const clippedStart = EventBuilder.new()
          .title('ClippedStart')
          .span('2025-07-03T06:00:00Z', '2025-07-03T09:00:00Z')
          .resizable(true)
          .build();
        const clippedEnd = EventBuilder.new()
          .title('ClippedEnd')
          .span('2025-07-03T18:00:00Z', '2025-07-03T22:00:00Z')
          .resizable(true)
          .build();
        const inside = EventBuilder.new()
          .title('Inside')
          .span('2025-07-03T10:00:00Z', '2025-07-03T12:00:00Z')
          .resizable(true)
          .build();

        render(
          <EventCalendar
            events={[clippedStart, clippedEnd, inside]}
            visibleDate={visibleDate}
            view="week"
            viewConfig={{ week: { startTime: 8, endTime: 20 } }}
          />,
        );
      }

      it('should render both handles on an event fully inside the window', () => {
        renderWindowedEvents();

        expect(getHandles(/Inside/).handles).to.have.length(2);
      });

      it('should not render the start handle when the window hides the real start', () => {
        renderWindowedEvents();

        const { event, handles } = getHandles(/ClippedStart/);
        expect(handles).to.have.length(1);
        // The surviving handle is the end one, so it is not the first child.
        expect(event.firstElementChild).to.not.equal(handles[0]);
      });

      it('should not render the end handle when the window hides the real end', () => {
        renderWindowedEvents();

        const { event, handles } = getHandles(/ClippedEnd/);
        expect(handles).to.have.length(1);
        expect(event.firstElementChild).to.equal(handles[0]);
      });
    });

    it('should not render occurrences that fall entirely outside the window', () => {
      const beforeWindow = EventBuilder.new()
        .title('Before')
        .span('2025-07-03T07:00:00Z', '2025-07-03T07:45:00Z')
        .build();
      const afterWindow = EventBuilder.new()
        .title('After')
        .span('2025-07-03T21:00:00Z', '2025-07-03T21:45:00Z')
        .build();
      render(
        <EventCalendar
          events={[beforeWindow, afterWindow, meeting]}
          visibleDate={visibleDate}
          view="week"
          viewConfig={{ week: { startTime: 8, endTime: 20 } }}
        />,
      );
      expect(screen.queryByRole('button', { name: /Before/ })).to.equal(null);
      expect(screen.queryByRole('button', { name: /After/ })).to.equal(null);
      // The in-window event is still rendered.
      expect(screen.getByRole('button', { name: /Meeting/ })).not.to.equal(null);
    });
  });

  describe('day view', () => {
    it('should apply the `day` key independently from the `week` key', () => {
      const view = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          view="week"
          viewConfig={{ week: { startTime: 8, endTime: 20 }, day: { startTime: 6, endTime: 22 } }}
        />,
      );
      // Week view honors its own window (08:00 → 20:00 = 12 rows).
      expect(getTimeAxisCells()).to.have.length(12);

      // Switching to the day view honors the day window (06:00 → 22:00 = 16 rows).
      view.setProps({ view: 'day' });
      expect(getTimeAxisCells()).to.have.length(16);
    });
  });

  describe('hour range validation wiring', () => {
    beforeEach(() => {
      clearWarningsCache();
    });

    it('should name `viewConfig.week` when the week view receives an invalid range', () => {
      expect(() => {
        render(
          <EventCalendar
            events={[]}
            visibleDate={visibleDate}
            view="week"
            viewConfig={{ week: { startTime: 20, endTime: 8 } }}
          />,
        );
      }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid hour range']);
    });

    it('should name `viewConfig.day` when the day view receives an invalid range', () => {
      expect(() => {
        render(
          <EventCalendar
            events={[]}
            visibleDate={visibleDate}
            view="day"
            viewConfig={{ day: { startTime: 20, endTime: 8 } }}
          />,
        );
      }).toWarnDev(['MUI X Scheduler: `viewConfig.day` received an invalid hour range']);
    });
  });
});
