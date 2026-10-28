import { describe, it, expect, vi } from 'vitest';
import { PlainDate } from './base-temporal/PlainDate';
import {
  formatPlainDate,
  formatPlainDateRange,
  formatTime,
  getLocaleAmpm,
  getLocaleWeekInfo,
} from './date-locale';

describe('date-locale', () => {
  describe('getLocaleWeekInfo', () => {
    it('should return the first day of the week and the minimal days of the first week', () => {
      expect(getLocaleWeekInfo('en-US')).to.deep.equal({ firstDay: 7, minimalDays: 1 });
      expect(getLocaleWeekInfo('fr-FR')).to.deep.equal({ firstDay: 1, minimalDays: 4 });
      expect(getLocaleWeekInfo('ar-EG')).to.deep.equal({ firstDay: 6, minimalDays: 1 });
    });

    it('should follow the first day of the week of the locale extension', () => {
      expect(getLocaleWeekInfo('en-US-u-fw-mon').firstDay).to.equal(1);
    });

    it('should read the first week of the year of the likely region of the language', () => {
      // French is likely spoken in France, and English in the United States.
      expect(getLocaleWeekInfo('fr').minimalDays).to.equal(4);
      expect(getLocaleWeekInfo('en').minimalDays).to.equal(1);
      expect(getLocaleWeekInfo('en-GB').minimalDays).to.equal(4);
    });

    it('should read the first week of the year of the region of the locale extension', () => {
      expect(getLocaleWeekInfo('en-US-u-rg-gbzzzz')).to.deep.equal({ firstDay: 1, minimalDays: 4 });
      expect(getLocaleWeekInfo('en-GB-u-rg-uszzzz')).to.deep.equal({ firstDay: 7, minimalDays: 1 });
      // Not an extension.
      expect(getLocaleWeekInfo('en-US-x-rg-gbzzzz').minimalDays).to.equal(1);
    });

    it('should use the first week of ISO 8601 with the ISO 8601 calendar', () => {
      expect(getLocaleWeekInfo('en-US-u-ca-iso8601')).to.deep.equal({
        firstDay: 1,
        minimalDays: 4,
      });
      expect(getLocaleWeekInfo('fr-CA-u-ca-iso8601')).to.deep.equal({
        firstDay: 1,
        minimalDays: 4,
      });
    });

    it('should start the weeks on Monday when the runtime knows no week of the locales', () => {
      const prototype = Intl.Locale.prototype as Record<string, any>;
      const getWeekInfo = Object.getOwnPropertyDescriptor(prototype, 'getWeekInfo');
      const weekInfo = Object.getOwnPropertyDescriptor(prototype, 'weekInfo');
      try {
        delete prototype.getWeekInfo;
        delete prototype.weekInfo;
        // Locales that aren't cached yet.
        expect(getLocaleWeekInfo('en-CA')).to.deep.equal({ firstDay: 1, minimalDays: 1 });
        expect(getLocaleWeekInfo('de-AT')).to.deep.equal({ firstDay: 1, minimalDays: 4 });
      } finally {
        if (getWeekInfo) {
          Object.defineProperty(prototype, 'getWeekInfo', getWeekInfo);
        }
        if (weekInfo) {
          Object.defineProperty(prototype, 'weekInfo', weekInfo);
        }
      }
    });

    it('should read the week of a locale once', () => {
      const spy = vi.spyOn(Intl, 'Locale');
      try {
        getLocaleWeekInfo('de-DE');
        getLocaleWeekInfo('de-DE');
        expect(spy.mock.calls.length).to.equal(1);
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('formatPlainDate', () => {
    const plainDate = PlainDate.from('2025-07-13');

    it('should format the date in the locale', () => {
      expect(formatPlainDate('en-US', plainDate, 'weekdayShortMonthShortAndDayOfMonth')).to.equal(
        'Sun, Jul 13',
      );
      expect(formatPlainDate('fr-FR', plainDate, 'fullDate')).to.equal('dimanche 13 juillet 2025');
      expect(formatPlainDate('en-US', plainDate, 'monthAndYear')).to.equal('July 2025');
    });

    it('should format the date itself, whatever its timezone', () => {
      // Pacific/Apia skipped December 30th, 2011.
      expect(formatPlainDate('en-US', PlainDate.from('2011-12-30'), 'fullDate')).to.equal(
        'Friday, December 30, 2011',
      );
    });

    it('should format the date on the Gregorian calendar when the locale has another one', () => {
      // The default calendar of Persian (Iran) is the Solar Hijri one.
      expect(formatPlainDate('fa-IR', plainDate, 'monthAndYear')).to.equal(
        new Intl.DateTimeFormat('fa-IR', {
          month: 'long',
          year: 'numeric',
          calendar: 'gregory',
          timeZone: 'UTC',
        }).format(Date.UTC(2025, 6, 13)),
      );
    });
  });

  describe('getLocaleAmpm', () => {
    it('should follow the hour cycle of the locale', () => {
      expect(getLocaleAmpm('en-US')).to.equal(true);
      expect(getLocaleAmpm('fr-FR')).to.equal(false);
      expect(getLocaleAmpm('en-GB')).to.equal(false);
      expect(getLocaleAmpm('en-US-u-hc-h23')).to.equal(false);
    });
  });

  describe('formatPlainDateRange', () => {
    it('should format the range in the order of the locale, writing the shared parts once', () => {
      const startPlainDate = PlainDate.from('2025-07-13');
      const endPlainDate = PlainDate.from('2025-07-19');
      const format = 'weekdayShortMonthShortAndDayOfMonth';
      expect(formatPlainDateRange('en-US', startPlainDate, endPlainDate, format)).to.equal(
        'Sun, Jul 13\u2009–\u2009Sat, Jul 19',
      );
      expect(formatPlainDateRange('fr-FR', startPlainDate, endPlainDate, format)).to.equal(
        'dim. 13\u2009–\u2009sam. 19 juil.',
      );
    });

    it('should format a range of one date as that date', () => {
      const plainDate = PlainDate.from('2025-07-13');
      expect(
        formatPlainDateRange('en-US', plainDate, plainDate, 'weekdayShortMonthShortAndDayOfMonth'),
      ).to.equal('Sun, Jul 13');
    });
  });

  describe('formatTime', () => {
    const minutesInDay = 13 * 60 + 5;

    it('should format a wall-clock time in 12-hour or 24-hour format', () => {
      expect(formatTime('en-US', minutesInDay, true)).to.equal('1:05 PM');
      expect(formatTime('en-US', minutesInDay, false)).to.equal('13:05');
      expect(formatTime('fr-FR', 0, false)).to.equal('0:00');
    });

    it('should format midnight as 12 AM in 12-hour format', () => {
      expect(formatTime('en-US', 0, true)).to.equal('12:00 AM');
    });
  });
});
