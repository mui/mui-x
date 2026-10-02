import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { adapter, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect } from 'vitest';

describe('<DayTimeGrid /> - events crossing midnight', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });

  // 2025-07-03 is a Thursday, the week view renders Sunday June 29 to Saturday July 5.
  const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');
  const JULY_3_COLUMN_INDEX = 4;
  const JULY_4_COLUMN_INDEX = 5;

  const nightShift = EventBuilder.new()
    .title('Night shift')
    .span('2025-07-03T18:00:00Z', '2025-07-04T06:00:00Z')
    .resizable(true)
    .build();

  function getAllDayEvents() {
    return document.querySelectorAll(
      `.${eventCalendarClasses.dayTimeGridAllDayEventsGrid} .${eventCalendarClasses.dayGridEvent}`,
    );
  }

  function getTimeGridColumns() {
    return document.querySelectorAll(`.${eventCalendarClasses.dayTimeGridColumn}`);
  }

  describe('week view', () => {
    it('should split a timed event across the time grid of the days it covers', () => {
      render(<EventCalendar events={[nightShift]} visibleDate={visibleDate} view="week" />);

      expect(getAllDayEvents()).to.have.length(0);

      const [firstPart, secondPart] = screen.getAllByRole('button', { name: /Night shift/ });
      const columns = getTimeGridColumns();

      expect(firstPart.closest(`.${eventCalendarClasses.dayTimeGridColumn}`)).to.equal(
        columns[JULY_3_COLUMN_INDEX],
      );
      expect(firstPart.style.getPropertyValue('--y-position')).to.equal('75%');
      expect(firstPart.style.getPropertyValue('--height')).to.equal('25%');

      expect(secondPart.closest(`.${eventCalendarClasses.dayTimeGridColumn}`)).to.equal(
        columns[JULY_4_COLUMN_INDEX],
      );
      expect(secondPart.style.getPropertyValue('--y-position')).to.equal('0%');
      expect(secondPart.style.getPropertyValue('--height')).to.equal('25%');
    });

    it('should not render an event ending exactly at midnight on the next day', () => {
      const lateShift = EventBuilder.new()
        .title('Late shift')
        .span('2025-07-03T16:00:00Z', '2025-07-04T00:00:00Z')
        .build();

      render(<EventCalendar events={[lateShift]} visibleDate={visibleDate} view="week" />);

      expect(getAllDayEvents()).to.have.length(0);

      const parts = screen.getAllByRole('button', { name: /Late shift/ });
      expect(parts).to.have.length(1);
      expect(parts[0].closest(`.${eventCalendarClasses.dayTimeGridColumn}`)).to.equal(
        getTimeGridColumns()[JULY_3_COLUMN_INDEX],
      );
    });

    it('should keep timed events lasting 24 hours or more in the all-day row', () => {
      const longShift = EventBuilder.new()
        .title('Long shift')
        .span('2025-07-03T08:00:00Z', '2025-07-04T08:00:00Z')
        .build();

      render(<EventCalendar events={[longShift]} visibleDate={visibleDate} view="week" />);

      expect(getAllDayEvents()).not.to.have.length(0);
      expect(document.querySelector(`.${eventCalendarClasses.timeGridEvent}`)).to.equal(null);
    });

    it('should only render the resize handle of the edge each part shows', () => {
      render(<EventCalendar events={[nightShift]} visibleDate={visibleDate} view="week" />);

      const [firstPart, secondPart] = screen.getAllByRole('button', { name: /Night shift/ });

      expect(firstPart.querySelector('[data-start]')).not.to.equal(null);
      expect(firstPart.querySelector('[data-end]')).to.equal(null);
      expect(secondPart.querySelector('[data-start]')).to.equal(null);
      expect(secondPart.querySelector('[data-end]')).not.to.equal(null);
    });
  });

  describe('day view', () => {
    it('should render a timed event crossing midnight in the time grid', () => {
      render(<EventCalendar events={[nightShift]} visibleDate={visibleDate} view="day" />);

      expect(getAllDayEvents()).to.have.length(0);

      const part = screen.getByRole('button', { name: /Night shift/ });
      expect(part.style.getPropertyValue('--y-position')).to.equal('75%');
      expect(part.style.getPropertyValue('--height')).to.equal('25%');
    });
  });
});
