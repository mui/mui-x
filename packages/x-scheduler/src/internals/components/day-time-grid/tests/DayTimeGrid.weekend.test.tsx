import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect } from 'vitest';

describe('<DayTimeGrid /> weekend of the date locale', () => {
  // Sunday, May 4th, 2025.
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-04Z') });

  function renderWeekView(dateLocale: string, showWeekends = true) {
    render(
      <EventCalendar
        events={[]}
        view="week"
        dateLocale={dateLocale}
        defaultPreferences={{ showWeekends }}
      />,
    );
  }

  function getWeekendFlags(selector: string) {
    return Array.from(document.querySelectorAll(selector)).map((element) =>
      element.hasAttribute('data-weekend'),
    );
  }

  function getTimeColumnFlags() {
    return getWeekendFlags(`.${eventCalendarClasses.dayTimeGridColumn}`);
  }

  function getAllDayCellFlags() {
    return getWeekendFlags(`.${eventCalendarClasses.dayTimeGridAllDayEventsCell}[role="gridcell"]`);
  }

  function getAllDayGrid() {
    return document.querySelector(`.${eventCalendarClasses.dayTimeGridAllDayEventsGrid}`);
  }

  it('should mark Saturday and Sunday in the United States', () => {
    renderWeekView('en-US');

    // From Sunday to Saturday.
    const expectedFlags = [true, false, false, false, false, false, true];
    expect(getTimeColumnFlags()).to.deep.equal(expectedFlags);
    expect(getAllDayCellFlags()).to.deep.equal(expectedFlags);
  });

  it('should mark Friday and Saturday in Saudi Arabia', () => {
    renderWeekView('ar-SA');

    // From Sunday to Saturday.
    const expectedFlags = [false, false, false, false, false, true, true];
    expect(getTimeColumnFlags()).to.deep.equal(expectedFlags);
    expect(getAllDayCellFlags()).to.deep.equal(expectedFlags);
  });

  it('should hide Friday and Saturday in Saudi Arabia when showWeekends=false', () => {
    renderWeekView('ar-SA', false);

    // From Sunday to Thursday.
    expect(getTimeColumnFlags()).to.deep.equal([false, false, false, false, false]);
  });

  it('should mark the all-day grid when the last day is in the weekend', () => {
    // Iran: from Saturday to Friday, and the weekend is Friday only.
    renderWeekView('fa-IR');

    expect(getTimeColumnFlags()).to.deep.equal([false, false, false, false, false, false, true]);
    expect(getAllDayGrid()).to.have.attribute('data-weekend');
  });

  it('should not mark the all-day grid when the last day is a Saturday outside the weekend', () => {
    // India: from Sunday to Saturday, and the weekend is Sunday only.
    renderWeekView('en-IN');

    expect(getTimeColumnFlags()).to.deep.equal([true, false, false, false, false, false, false]);
    expect(getAllDayGrid()).not.to.have.attribute('data-weekend');
  });
});
