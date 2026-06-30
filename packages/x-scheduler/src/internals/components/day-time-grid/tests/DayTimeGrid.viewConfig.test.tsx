import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
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
});
