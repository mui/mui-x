import { setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect, vi } from 'vitest';
import { PlainDate } from './base-temporal/PlainDate';
import {
  checkDateLocale,
  formatDayOfMonth,
  formatFullDate,
  formatMonthAndYear,
  formatWeekdayMonthAndDayOfMonth,
  formatWeekdayShortMonthShortAndDayOfMonth,
  formatWeekdayShortMonthShortAndDayOfMonthRange,
  formatTime,
  formatWeekNumber,
  getLocaleAmpm,
  getLocaleWeekInfo,
} from './date-locale';

// The caches of the module are shared by the test files of a worker. The tests that need a locale
// that isn't cached yet use a private use subtag of their own, which `Intl` ignores.

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

    it('should read the week of the region when the runtime knows no week of the locales', () => {
      const prototype = Intl.Locale.prototype as Record<string, any>;
      const getWeekInfo = Object.getOwnPropertyDescriptor(prototype, 'getWeekInfo');
      const weekInfo = Object.getOwnPropertyDescriptor(prototype, 'weekInfo');
      try {
        delete prototype.getWeekInfo;
        delete prototype.weekInfo;
        expect(getLocaleWeekInfo('en-US-x-fallback')).to.deep.equal({
          firstDay: 7,
          minimalDays: 1,
        });
        expect(getLocaleWeekInfo('de-AT-x-fallback')).to.deep.equal({
          firstDay: 1,
          minimalDays: 4,
        });
        expect(getLocaleWeekInfo('ar-EG-x-fallback')).to.deep.equal({
          firstDay: 6,
          minimalDays: 1,
        });
        expect(getLocaleWeekInfo('dv-MV-x-fallback').firstDay).to.equal(5);
        // The extensions of the first day of the week and of the region.
        expect(getLocaleWeekInfo('de-DE-u-fw-sun-x-fallback').firstDay).to.equal(7);
        expect(getLocaleWeekInfo('de-DE-u-rg-uszzzz-x-fallback')).to.deep.equal({
          firstDay: 7,
          minimalDays: 1,
        });
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
        getLocaleWeekInfo('de-DE-x-once');
        getLocaleWeekInfo('de-DE-x-once');
        expect(spy.mock.calls.length).to.equal(1);
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('format functions', () => {
    const plainDate = PlainDate.from('2025-07-13');

    it('should format the date in the locale', () => {
      expect(formatWeekdayShortMonthShortAndDayOfMonth('en-US', plainDate)).to.equal('Sun, Jul 13');
      expect(formatFullDate('fr-FR', plainDate)).to.equal('dimanche 13 juillet 2025');
      expect(formatMonthAndYear('en-US', plainDate)).to.equal('July 2025');
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should format the date itself, whatever the timezone of the system',
      () => {
        // Pacific/Apia skipped December 30th, 2011.
        setSystemTimezone('Pacific/Apia');
        expect(formatFullDate('en-US', PlainDate.from('2011-12-30'))).to.equal(
          'Friday, December 30, 2011',
        );
      },
    );

    it('should format the weekday, the month and the day in the order of the locale', () => {
      expect(formatWeekdayMonthAndDayOfMonth('en-US', plainDate)).to.equal('Sunday, July 13');
      expect(formatWeekdayMonthAndDayOfMonth('ja-JP', plainDate)).to.equal('7月13日日曜日');
    });

    it('should format the day of the month without the literal of the locale', () => {
      expect(formatDayOfMonth('en-US', plainDate)).to.equal('13');
      expect(formatDayOfMonth('da-DK', plainDate)).to.equal('13');
      expect(formatDayOfMonth('ja-JP', plainDate)).to.equal('13');
      expect(formatDayOfMonth('ar-EG', plainDate)).to.equal('١٣');
    });

    it('should format the week numbers in the digits of the locale', () => {
      expect(formatWeekNumber('en-US', 29)).to.equal('29');
      expect(formatWeekNumber('ar-EG', 29)).to.equal('٢٩');
    });

    it('should format the date on the Gregorian calendar when the locale has another one', () => {
      // The default calendar of Persian (Iran) is the Solar Hijri one.
      expect(formatMonthAndYear('fa-IR', plainDate)).to.equal(
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

  describe('formatWeekdayShortMonthShortAndDayOfMonthRange', () => {
    it('should format the range in the order of the locale, writing the shared parts once', () => {
      const startPlainDate = PlainDate.from('2025-07-13');
      const endPlainDate = PlainDate.from('2025-07-19');
      // An en dash between spaces, thin ones in some runtimes.
      expect(
        formatWeekdayShortMonthShortAndDayOfMonthRange('en-US', startPlainDate, endPlainDate),
      ).to.match(/^Sun, Jul 13\s–\sSat, Jul 19$/);
      expect(
        formatWeekdayShortMonthShortAndDayOfMonthRange('fr-FR', startPlainDate, endPlainDate),
      ).to.match(/^dim\. 13\s–\ssam\. 19 juil\.$/);
    });

    it('should format a range of one date as that date', () => {
      const plainDate = PlainDate.from('2025-07-13');
      expect(
        formatWeekdayShortMonthShortAndDayOfMonthRange('en-US', plainDate, plainDate),
      ).to.equal('Sun, Jul 13');
    });
  });

  describe('formatTime', () => {
    const minutesInDay = 13 * 60 + 5;

    it('should format a wall-clock time in 12-hour or 24-hour format', () => {
      expect(formatTime('en-US', minutesInDay, true)).to.equal('1:05 PM');
      expect(formatTime('en-US', minutesInDay, false)).to.equal('13:05');
      expect(formatTime('ar-EG', minutesInDay, true)).to.equal('١:٠٥ م');
    });

    it('should pad the hour of the 24-hour times in every locale', () => {
      expect(formatTime('fr-FR', 0, false)).to.equal('00:00');
      expect(formatTime('fr-FR', 7 * 60 + 30, false)).to.equal('07:30');
      expect(formatTime('en-US', 7 * 60 + 30, false)).to.equal('07:30');
    });

    it('should use the 12-hour cycle of the locale', () => {
      // Japanese writes the half hour after midnight with a 0.
      expect(formatTime('ja-JP', 30, true)).to.equal('午前0:30');
      expect(formatTime('en-US', 30, true)).to.equal('12:30 AM');
    });

    it('should format midnight as 12 AM in 12-hour format', () => {
      expect(formatTime('en-US', 0, true)).to.equal('12:00 AM');
    });

    it('should format midnight when the clock and Intl are faked', () => {
      // The fake `Intl` formats the current date instead of a falsy timestamp.
      vi.useFakeTimers({ now: Date.UTC(2014, 7, 18, 19, 11), toFake: ['Date', 'Intl'] });
      try {
        expect(formatTime('en-CA-x-faked', 0, false)).to.equal('00:00');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('checkDateLocale', () => {
    it('should warn when the tag is not a valid language tag', () => {
      expect(() => checkDateLocale('en_US')).toWarnDev(
        'MUI X Scheduler: `dateLocale` received "en_US", which is not a valid BCP 47 language tag.',
      );
    });

    it('should warn when Intl does not support the locale', () => {
      expect(() => checkDateLocale('xx-XX')).toWarnDev(
        'MUI X Scheduler: `dateLocale` received "xx-XX", which the `Intl` API of the browser does not support.',
      );
    });

    it('should not warn for a supported locale', () => {
      expect(() => checkDateLocale('fr-FR')).not.toWarnDev();
    });
  });
});
