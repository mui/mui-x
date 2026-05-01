import dayjs, { Dayjs } from 'dayjs';
import { spy, stub } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterFormats, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  expectFieldValue,
  createPickerRenderer,
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
  buildFieldInteractions,
} from 'test/utils/pickers';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
// We import the plugins here just to have the typing
import 'dayjs/plugin/utc';
import 'dayjs/plugin/timezone';

describe('<AdapterDayjs />', () => {
  const commonParams = {
    formatDateTime: 'YYYY-MM-DD HH:mm:ss',
    setDefaultTimezone: dayjs.tz.setDefault,
    getLocaleFromDate: (value: PickerValidDate) => (value as Dayjs).locale(),
    frenchLocale: 'fr',
  };

  describeGregorianAdapter(AdapterDayjs, commonParams);

  // Makes sure that all the tests that do not use timezones works fine when dayjs do not support UTC / timezone.
  describeGregorianAdapter(AdapterDayjs, {
    ...commonParams,
    prepareAdapter: (adapter) => {
      // @ts-ignore
      adapter.hasUTCPlugin = () => false;
      // @ts-ignore
      adapter.hasTimezonePlugin = () => false;
      // Makes sure that we don't run timezone related tests, that would not work.
      adapter.isTimezoneCompatible = false;
    },
  });

  describe('Adapter timezone', () => {
    it('setTimezone: should throw warning if no plugin is available', () => {
      const modifiedAdapter = new AdapterDayjs();
      // @ts-ignore
      modifiedAdapter.hasTimezonePlugin = () => false;

      const date = modifiedAdapter.date(TEST_DATE_ISO_STRING) as Dayjs;
      expect(() => modifiedAdapter.setTimezone(date, 'Europe/London')).to.throw();
    });

    it('should keep system-timezone dates compatible with plain `dayjs()` dates when `dayjs.tz.guess()` is non-UTC', () => {
      // Regression: before the fix, `createSystemDate` called
      // `dayjs.tz(value, dayjs.tz.guess())` when the guessed zone was not UTC,
      // which set `$x.$timezone` on the result. That made `getTimezone()` return
      // the guessed zone name (e.g. `America/New_York`) instead of `'system'`, so
      // comparisons against plain `dayjs()` dates (for which `getTimezone()`
      // returns `'system'`) went through an unnecessary `setTimezone` conversion
      // that could shift the day across midnight. CI runs in UTC, so the non-UTC
      // branch is only reachable by stubbing `dayjs.tz.guess()`. The Sinon
      // default sandbox is restored by the global `afterEach` in
      // `test/setupVitest.ts`, so no manual cleanup is needed.
      stub(dayjs.tz, 'guess').returns('America/New_York');

      const adapter = new AdapterDayjs();
      const resolvedDate = adapter.date(TEST_DATE_ISO_STRING, 'system') as Dayjs;

      expect(adapter.getTimezone(resolvedDate)).to.equal('system');
      expect(adapter.isSameDay(resolvedDate, dayjs(TEST_DATE_ISO_STRING))).to.equal(true);
    });

    it('should not mutate `$offset` on plain `dayjs()` values when `dayjs.tz.guess()` is non-UTC (regression #21669)', () => {
      // Regression: the previous `adjustOffset` implementation set
      // `value.$offset = fixedValue.$offset` on every `setX`/`addX` result.
      // For plain dayjs values (no `$x.$timezone`), `valueOf()` is computed as
      // `$d.getTime() - ($offset + $d.getTimezoneOffset()) * 60000`. Mutating
      // only `$offset` (without updating `$d`) drifted `valueOf()` by the
      // guessed-zone offset, even though the local time getters still looked
      // correct. In Los Angeles on March 8 (DST start) this caused the time
      // picker to silently shift the picked hour by one when the user clicked
      // 04:00 AM. CI runs in UTC so the guess has to be stubbed to a non-UTC
      // zone to reproduce the drift.
      stub(dayjs.tz, 'guess').returns('America/Los_Angeles');

      const adapter = new AdapterDayjs();
      const noon = adapter.date('2026-03-08T12:00:00', 'system') as Dayjs;
      const fourAM = adapter.setHours(noon, 4) as Dayjs;

      // The result must remain a plain dayjs value, otherwise `DateRangePicker`
      // breaks with "timezone of start and end should be the same" (#13290).
      expect(adapter.getTimezone(fourAM)).to.equal('system');
      // @ts-ignore - reaching into dayjs internals to assert the invariant
      // that drives the bug: `$offset` must stay undefined so the `valueOf()`
      // formula reduces to `$d.getTime()`.
      expect(fourAM.$offset).to.equal(undefined);
      expect(adapter.getHours(fourAM)).to.equal(4);
      // CI runs in TZ=UTC, so the underlying instant of "4 AM system" is 4 AM
      // UTC. With the buggy mutation this would shift to 11 AM or 12 PM UTC
      // depending on whether DST applies in the guessed zone.
      expect(fourAM.toDate().toISOString()).to.equal('2026-03-08T04:00:00.000Z');
    });

    it('should not mutate `$offset` on plain `dayjs()` values across `addMonths` (regression #21669)', () => {
      stub(dayjs.tz, 'guess').returns('America/Los_Angeles');

      const adapter = new AdapterDayjs();
      const winter = adapter.date('2026-01-15T12:00:00', 'system') as Dayjs;
      const summer = adapter.addMonths(winter, 6) as Dayjs;

      expect(adapter.getTimezone(summer)).to.equal('system');
      // @ts-ignore - dayjs internals
      expect(summer.$offset).to.equal(undefined);
      expect(summer.toDate().toISOString()).to.equal('2026-07-15T12:00:00.000Z');
    });

    it('should mutate `$offset` on `.tz()`-touched values that lack `$x.$timezone` (regression #21669)', () => {
      // The picker's `useNow()` calls `adapter.date(undefined, 'default')`,
      // which goes through `createTZDate` -> `dayjs(undefined).tz(undefined,
      // false)`. In a non-UTC system zone the result has `$offset` set to the
      // system offset at construction time but `$x.$timezone` is `undefined`
      // (because the `t` arg passed to `.tz()` was `undefined`). After
      // `setHours(now, 1)` to a PST hour on March 8 in LA, `$d.setHours`
      // moves `$d` to the new local time but `$offset` would stay at the
      // PDT construction value, so the `$offset + $d.getTimezoneOffset()`
      // term in `valueOf()` no longer cancels - the instant emitted to
      // `onChange` would drift an hour from the picked time. CI runs in
      // TZ=UTC where `dayjs(...).tz(undefined, false)` returns a UTC value
      // (no `$offset`), so we manually shape the value to mirror the
      // non-UTC `now` shape and stub `dayjs.tz.guess()` so the `'system'`
      // path resolves to LA.
      stub(dayjs.tz, 'guess').returns('America/Los_Angeles');

      const now = dayjs('2026-03-08T12:58:00') as Dayjs;
      // @ts-ignore - mirror the construction-time PDT offset that LA env
      // would have given.
      now.$offset = -420;
      // @ts-ignore - dayjs.utc plugin reads `$u` to decide which Date getter
      // family to use; `false` matches the non-UTC `.tz()` result.
      now.$u = false;

      const adapter = new AdapterDayjs();
      const oneAM = adapter.setHours(now, 1) as Dayjs;

      expect(adapter.getHours(oneAM)).to.equal(1);
      // @ts-ignore - dayjs internals; the mutation must update `$offset` to
      // the recomputed PST offset for the new local hour. Without it the
      // value would still report `-420` and `valueOf()` would drift an hour.
      expect(oneAM.$offset).to.equal(-480);
    });

    it('should not shift `$d` or drop `$x.$localOffset` on tz-aware values across `setHours` (regression #21669)', () => {
      // The picker validates each hour option by calling
      // `getHours(setHours(value, X)) === X`, where `getHours()` reads
      // `$d.getHours()`. An earlier attempt at `adjustOffset` returned
      // `value.tz(timezone, true)`, which has two side effects:
      //  - the timezone plugin's "keep local time" branch runs an internal
      //    `n.add(i - m, 'minute')` that shifts `$d` whenever the offset
      //    changes;
      //  - dayjs's `utcOffset(_, true)` does not set `$x.$localOffset`,
      //    leaving the side table that `valueOf()` consults empty.
      // For tz-aware values with `$x.$localOffset` set (the `dayjs.tz(...)`
      // construction path - distinct from the adapter's `createTZDate` path
      // which uses `.tz(tz, true)` and never sets `$localOffset`), those two
      // shifts together caused `$d.getHours()` to land on the wrong side of
      // the DST gap in a non-UTC system timezone. Mutating `$offset` in
      // place avoids both - this test pins the invariants.
      const value = dayjs.tz('2026-03-08T12:00:00', 'America/Los_Angeles');
      // @ts-ignore - dayjs internals: the `dayjs.tz(...)` path goes through
      // `utcOffset(c)` (no keep-local-time), which sets `$localOffset`.
      const localOffsetBefore = value.$x.$localOffset;
      expect(localOffsetBefore).not.to.equal(undefined);

      const adapter = new AdapterDayjs();
      for (const hour of [0, 1, 3, 4, 5, 11]) {
        const dWithoutAdjust = (value.set('hour', hour) as Dayjs).$d.getTime();
        const result = adapter.setHours(value, hour) as Dayjs;

        // @ts-ignore - dayjs internals
        expect(result.$d.getTime()).to.equal(dWithoutAdjust);
        // @ts-ignore - dayjs internals
        expect(result.$x.$localOffset).to.equal(localOffsetBefore);
        expect(adapter.getHours(result)).to.equal(hour);
      }
    });

    describe('Time picker (regression #21669)', () => {
      const { render, adapter } = createPickerRenderer({ adapterName: 'dayjs' });

      it('should call `onChange` with the clicked hour when picking on a DST start day with system timezone', async () => {
        // The reproduction in #21669 is on March 8, 2026 in Los Angeles —
        // the day local clocks jump from 02:00 PST to 03:00 PDT. The picker
        // uses plain `dayjs(...)` for `system`/`default` timezone (since
        // PR #22170), and the previous `adjustOffset` mutated `$offset` on
        // those plain values, which corrupted the underlying instant. The
        // regression made clicking "04:00 AM" silently produce a different
        // hour. We stub `dayjs.tz.guess()` so the path runs in CI's UTC env.
        stub(dayjs.tz, 'guess').returns('America/Los_Angeles');

        const onChange = spy();
        const { user } = render(
          <DigitalClock
            onChange={onChange}
            referenceDate={adapter.date('2026-03-08T12:00:00', 'system') as Dayjs}
            timezone="system"
            timeStep={60}
          />,
        );

        await user.click(screen.getByRole('option', { name: '04:00 AM' }));

        const result = onChange.lastCall.firstArg as Dayjs;
        expect(adapter.getHours(result)).to.equal(4);
        // CI runs in TZ=UTC, so a plain dayjs value reports as 'UTC' (since
        // `dayjs.isUTC()` is true in that env). The key regression invariant
        // is that the value remains plain - no `$offset` mutation - so the
        // underlying instant matches the picked hour.
        // @ts-ignore - dayjs internals; the bug was that the previous
        // `adjustOffset` set `$offset` here, which corrupted `valueOf()`.
        expect(result.$offset).to.equal(undefined);
        expect(result.toDate().toISOString()).to.equal('2026-03-08T04:00:00.000Z');
      });
    });
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const date = adapter.date(TEST_DATE_ISO_STRING) as Dayjs;

      it('getWeekArray: should start on Sunday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterDayjs({ locale: 'ru' });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING) as Dayjs;
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const adapterRu = new AdapterDayjs({ locale: 'ru' });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z') as Dayjs;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
        expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 вечера');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
    });

    it('should warn when trying to use a non-loaded locale', () => {
      const adapter = new AdapterDayjs({ locale: 'pl' });
      expect(() => adapter.is12HourCycleInCurrentLocale()).toWarnDev(
        'Your locale has not been found.',
      );
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      undefined: {
        placeholder: 'MM/DD/YYYY hh:mm aa',
        value: '05/15/2018 09:35 AM',
      },
      fr: {
        placeholder: 'DD/MM/YYYY hh:mm',
        value: '15/05/2018 09:35',
      },
      de: {
        placeholder: 'DD.MM.YYYY hh:mm',
        value: '15.05.2018 09:35',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
      const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

      describe(`test with the ${localeName} locale`, () => {
        const { render, adapter } = createPickerRenderer({
          adapterName: 'dayjs',
          locale: localeObject,
        });

        const { renderWithProps } = buildFieldInteractions({
          render,
          Component: DateTimeField,
        });

        it('should have correct placeholder', () => {
          const view = renderWithProps({});

          expectFieldValue(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
        });

        it('should have well formatted value', () => {
          const view = renderWithProps({
            value: adapter.date(testDate),
          });

          expectFieldValue(view.getSectionsContainer(), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
