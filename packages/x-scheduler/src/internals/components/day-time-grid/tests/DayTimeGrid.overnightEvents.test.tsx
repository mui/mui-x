import * as React from 'react';
import { screen, within } from '@mui/internal-test-utils';
import { adapter, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect } from 'vitest';

describe('<DayTimeGrid /> - events crossing midnight', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });

  // 2025-07-03 is a Thursday, the week view renders Sunday June 29 to Saturday July 5.
  const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
  const JUNE_29_COLUMN_INDEX = 0;
  const JULY_3_COLUMN_INDEX = 4;
  const JULY_4_COLUMN_INDEX = 5;

  const nightShift = EventBuilder.new()
    .title('Night shift')
    .span('2025-07-03T18:00:00Z', '2025-07-04T06:00:00Z')
    .resizable(true)
    .build();

  const longShift = EventBuilder.new()
    .title('Long shift')
    .span('2025-07-03T08:00:00Z', '2025-07-04T08:00:00Z')
    .build();

  function getDayGridEvents(name: RegExp) {
    const dayGrid = document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.dayTimeGridAllDayEventsGrid}`,
    )!;
    return within(dayGrid).queryAllByRole('button', { name });
  }

  function getTimeGridColumns() {
    return document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridColumn}`);
  }

  function getColumn(part: HTMLElement) {
    return part.closest(`.${eventCalendarClasses.dayTimeGridColumn}`);
  }

  describe('week view', () => {
    it('should split a timed event across the time grid of the days it covers', () => {
      render(<EventCalendar events={[nightShift]} visibleDate={visibleDate} view="week" />);

      expect(getDayGridEvents(/Night shift/)).to.have.length(0);

      const parts = screen.getAllByRole('button', { name: /Night shift/ });
      expect(parts).to.have.length(2);
      const [firstPart, secondPart] = parts;
      const columns = getTimeGridColumns();

      expect(getColumn(firstPart)).to.equal(columns[JULY_3_COLUMN_INDEX]);
      expect(firstPart.style.getPropertyValue('--y-position')).to.equal('75%');
      expect(firstPart.style.getPropertyValue('--height')).to.equal('25%');

      expect(getColumn(secondPart)).to.equal(columns[JULY_4_COLUMN_INDEX]);
      expect(secondPart.style.getPropertyValue('--y-position')).to.equal('0%');
      expect(secondPart.style.getPropertyValue('--height')).to.equal('25%');
    });

    it('should only render an event ending at midnight on its start day', () => {
      const lateShift = EventBuilder.new()
        .title('Late shift')
        .span('2025-07-03T16:00:00Z', '2025-07-04T00:00:00Z')
        .build();

      render(<EventCalendar events={[lateShift]} visibleDate={visibleDate} view="week" />);

      expect(getDayGridEvents(/Late shift/)).to.have.length(0);

      const parts = screen.getAllByRole('button', { name: /Late shift/ });
      expect(parts).to.have.length(1);
      expect(getColumn(parts[0])).to.equal(getTimeGridColumns()[JULY_3_COLUMN_INDEX]);
    });

    it('should keep a timed event lasting 23 hours and 59 minutes in the time grid', () => {
      const almostOneDay = EventBuilder.new()
        .title('Almost one day')
        .span('2025-07-03T08:00:00Z', '2025-07-04T07:59:00Z')
        .build();

      render(<EventCalendar events={[almostOneDay]} visibleDate={visibleDate} view="week" />);

      expect(getDayGridEvents(/Almost one day/)).to.have.length(0);
      expect(screen.getAllByRole('button', { name: /Almost one day/ })).to.have.length(2);
    });

    it('should keep timed events lasting one day or more in the day grid', () => {
      render(<EventCalendar events={[longShift]} visibleDate={visibleDate} view="week" />);

      expect(getDayGridEvents(/Long shift/)).to.have.length(1);
      expect(document.querySelector(`.${eventCalendarClasses.timeGridEvent}`)).to.equal(null);
    });

    it('should split an event at the midnight of the display timezone', () => {
      // 01:00 to 07:00 UTC on July 4 is 21:00 on July 3 to 03:00 on July 4 in New York.
      const evening = EventBuilder.new()
        .title('Evening')
        .span('2025-07-04T01:00:00Z', '2025-07-04T07:00:00Z')
        .build();

      render(
        <EventCalendar
          events={[evening]}
          visibleDate={visibleDate}
          view="week"
          displayTimezone="America/New_York"
        />,
      );

      const parts = screen.getAllByRole('button', { name: /Evening/ });
      expect(parts).to.have.length(2);
      const [firstPart, secondPart] = parts;
      const columns = getTimeGridColumns();

      expect(getColumn(firstPart)).to.equal(columns[JULY_3_COLUMN_INDEX]);
      expect(firstPart.style.getPropertyValue('--y-position')).to.equal('87.5%');
      expect(firstPart.style.getPropertyValue('--height')).to.equal('12.5%');

      expect(getColumn(secondPart)).to.equal(columns[JULY_4_COLUMN_INDEX]);
      expect(secondPart.style.getPropertyValue('--y-position')).to.equal('0%');
      expect(secondPart.style.getPropertyValue('--height')).to.equal('12.5%');
    });

    it('should render the part of an event that starts before the visible week', () => {
      const previousNightShift = EventBuilder.new()
        .title('Night shift')
        .span('2025-06-28T22:00:00Z', '2025-06-29T06:00:00Z')
        .build();

      render(<EventCalendar events={[previousNightShift]} visibleDate={visibleDate} view="week" />);

      expect(getDayGridEvents(/Night shift/)).to.have.length(0);

      const parts = screen.getAllByRole('button', { name: /Night shift/ });
      expect(parts).to.have.length(1);
      expect(getColumn(parts[0])).to.equal(getTimeGridColumns()[JUNE_29_COLUMN_INDEX]);
      expect(parts[0].style.getPropertyValue('--y-position')).to.equal('0%');
      expect(parts[0].style.getPropertyValue('--height')).to.equal('25%');
    });

    it('should only render the resize handle of the edge each part shows', () => {
      render(<EventCalendar events={[nightShift]} visibleDate={visibleDate} view="week" />);

      const parts = screen.getAllByRole('button', { name: /Night shift/ });
      expect(parts).to.have.length(2);
      const [firstPart, secondPart] = parts;

      expect(firstPart.querySelector('[data-start]')).not.to.equal(null);
      expect(firstPart.querySelector('[data-end]')).to.equal(null);
      expect(secondPart.querySelector('[data-start]')).to.equal(null);
      expect(secondPart.querySelector('[data-end]')).not.to.equal(null);
    });

    it('should lay out each part from the time it covers in its column', () => {
      const shortNight = EventBuilder.new()
        .title('Short night')
        .span('2025-07-03T23:30:00Z', '2025-07-04T07:00:00Z')
        .build();

      render(<EventCalendar events={[shortNight]} visibleDate={visibleDate} view="week" />);

      const parts = screen.getAllByRole('button', { name: /Short night/ });
      expect(parts).to.have.length(2);
      const [firstPart, secondPart] = parts;

      // 30 minutes on July 3: compact layout, the time rides on the title line.
      expect(firstPart).to.have.attribute('data-under-hour', 'true');
      expect(firstPart.querySelector('[data-stacked]')).to.equal(null);

      // 7 hours on July 4: the title and the time are stacked.
      expect(secondPart).not.to.have.attribute('data-under-hour');
      expect(secondPart.querySelector('[data-stacked]')).not.to.equal(null);
    });

    it('should give a part shorter than 15 minutes the tightest layout', () => {
      const shortMeeting = EventBuilder.new()
        .title('Short meeting')
        .span('2025-07-03T23:50:00Z', '2025-07-04T00:20:00Z')
        .build();

      render(<EventCalendar events={[shortMeeting]} visibleDate={visibleDate} view="week" />);

      const parts = screen.getAllByRole('button', { name: /Short meeting/ });
      expect(parts).to.have.length(2);
      const [firstPart, secondPart] = parts;

      expect(firstPart).to.have.attribute('data-under-fifteen-minutes', 'true');
      expect(secondPart).to.have.attribute('data-under-hour', 'true');
      expect(secondPart).not.to.have.attribute('data-under-fifteen-minutes');
    });

    it('should render a timed event crossing midnight in the day grid with `same-day-only`', () => {
      render(
        <EventCalendar
          events={[nightShift]}
          visibleDate={visibleDate}
          view="week"
          viewConfig={{ week: { timeGridEvents: 'same-day-only' } }}
        />,
      );

      expect(getDayGridEvents(/Night shift/)).to.have.length(1);
      expect(document.querySelector(`.${eventCalendarClasses.timeGridEvent}`)).to.equal(null);
    });

    it.each(['same-day', null])(
      'should fall back to `shorter-than-one-day` when `timeGridEvents` is %s',
      (timeGridEvents) => {
        render(
          <EventCalendar
            events={[nightShift, longShift]}
            visibleDate={visibleDate}
            view="week"
            viewConfig={{ week: { timeGridEvents: timeGridEvents as any } }}
          />,
        );

        expect(getDayGridEvents(/Night shift/)).to.have.length(0);
        expect(screen.getAllByRole('button', { name: /Night shift/ })).to.have.length(2);
        expect(getDayGridEvents(/Long shift/)).to.have.length(1);
      },
    );
  });

  describe('day view', () => {
    it('should render a timed event crossing midnight in the time grid', () => {
      render(<EventCalendar events={[nightShift]} visibleDate={visibleDate} view="day" />);

      expect(getDayGridEvents(/Night shift/)).to.have.length(0);

      const part = screen.getByRole('button', { name: /Night shift/ });
      expect(part.style.getPropertyValue('--y-position')).to.equal('75%');
      expect(part.style.getPropertyValue('--height')).to.equal('25%');
    });

    it('should render the second part of an overnight event on its end day', () => {
      render(
        <EventCalendar
          events={[nightShift]}
          visibleDate={adapter.date('2025-07-04T00:00:00Z', 'default')}
          view="day"
        />,
      );

      expect(getDayGridEvents(/Night shift/)).to.have.length(0);

      const part = screen.getByRole('button', { name: /Night shift/ });
      expect(part.style.getPropertyValue('--y-position')).to.equal('0%');
      expect(part.style.getPropertyValue('--height')).to.equal('25%');
    });

    it('should read `timeGridEvents` from `viewConfig.day`', () => {
      render(
        <EventCalendar
          events={[nightShift]}
          visibleDate={visibleDate}
          view="day"
          viewConfig={{
            day: { timeGridEvents: 'same-day-only' },
            week: { timeGridEvents: 'shorter-than-one-day' },
          }}
        />,
      );

      expect(getDayGridEvents(/Night shift/)).to.have.length(1);
      expect(document.querySelector(`.${eventCalendarClasses.timeGridEvent}`)).to.equal(null);
    });
  });
});
