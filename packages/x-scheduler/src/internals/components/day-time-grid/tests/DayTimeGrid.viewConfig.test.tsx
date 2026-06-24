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
    it('renders the 24 hour rows by default', () => {
      render(<EventCalendar events={[]} visibleDate={visibleDate} view="week" />);
      expect(getTimeAxisCells()).to.have.length(24);
    });

    it('renders only the configured hour rows', () => {
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

    it('positions events relative to the configured window', () => {
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

    it('clamps events starting before the window to the top edge', () => {
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
      const event = screen.getByRole('button', { name: /Early/ });
      expect(event.style.getPropertyValue('--y-position')).to.equal('0%');
    });
  });

  describe('day view', () => {
    it('applies the `day` key independently from the `week` key', () => {
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
