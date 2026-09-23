import { describe, it, expect } from 'vitest';
import { heIL } from './heIL';

const localeText = heIL.components.MuiEventCalendar.defaultProps.localeText;

describe('heIL', () => {
  it('should write the weekday in full in the weekly preset label', () => {
    expect(
      localeText.recurrenceWeeklyPresetLabel!({ weekday: 'monday', weekdayName: 'Monday' }),
    ).to.equal('מדי שבוע ביום שני');
  });

  describe('monthly recurrence labels', () => {
    it('should write the weekday in full in the aria label and as a letter in the visible label', () => {
      expect(
        localeText.recurrenceMonthlyLastWeekAriaLabel!({
          weekday: 'monday',
          weekdayName: 'Monday',
        }),
      ).to.equal('יום שני האחרון בחודש');
      expect(
        localeText.recurrenceMonthlyLastWeekLabel!({ weekday: 'monday', weekdayName: 'Mon' }),
      ).to.equal('יום ב׳ האחרון בחודש');
    });

    it('should write Saturday in full in both labels', () => {
      expect(
        localeText.recurrenceMonthlyLastWeekAriaLabel!({
          weekday: 'saturday',
          weekdayName: 'Saturday',
        }),
      ).to.equal('יום שבת האחרון בחודש');
      expect(
        localeText.recurrenceMonthlyLastWeekLabel!({ weekday: 'saturday', weekdayName: 'Sat' }),
      ).to.equal('יום שבת האחרון בחודש');
    });

    it('should name the week of the month', () => {
      expect(
        localeText.recurrenceMonthlyWeekNumberAriaLabel!({
          ord: 2,
          weekday: 'monday',
          weekdayName: 'Monday',
        }),
      ).to.equal('יום שני השני בחודש');
      expect(
        localeText.recurrenceMonthlyWeekNumberLabel!({
          ord: 2,
          weekday: 'monday',
          weekdayName: 'Mon',
        }),
      ).to.equal('יום ב׳ השני בחודש');
    });
  });
});
