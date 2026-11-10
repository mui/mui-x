import { TimeField } from '@mui/x-date-pickers/TimeField';
import { expectFieldValue } from 'test/utils/pickers';
import { describeAdapters } from 'test/utils/pickers/describeAdapters';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('<TimeField /> - Timezone', () => {
  describeAdapters('DST meridiem toggling', TimeField, ({ adapter, renderWithProps }) => {
    describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
      const timezone = 'America/Los_Angeles';
      // 2024-03-10 is the DST spring-forward day in America/Los_Angeles.
      // On this day, clocks move forward at 2:00 AM (PST, UTC-8) to 3:00 AM (PDT, UTC-7).
      // Toggling meridiem with the old `addHours(±12)` implementation was broken
      // because absolute-time arithmetic crosses the DST gap.
      // Regression tests for https://github.com/mui/mui-x/issues/21687

      it('should correctly toggle meridiem from PM to AM on a DST spring-forward date', async () => {
        const onChange = vi.fn();
        // noon PDT (UTC-7) = 2024-03-10T19:00:00Z
        const initialValue = adapter.date('2024-03-10T12:00:00', timezone);

        const view = renderWithProps({
          defaultValue: initialValue,
          format: adapter.formats.fullTime12h,
          timezone,
          onChange,
        });

        await view.selectSection('meridiem');
        // Toggle PM → AM
        await view.user.keyboard('{ArrowDown}');

        // Old code (addHours(-12)) would have produced "11:00 PM" (wrong).
        // New code (setHours) correctly produces "12:00 AM" (midnight).
        expectFieldValue(view.getSectionsContainer(), '12:00 AM');

        // Verify the onChange value is midnight on March 10 (2024-03-10T08:00:00Z),
        // not 11:00 PM on March 9 (2024-03-09T07:00:00Z).
        const expectedDate = adapter.setHours(initialValue, 0);
        expect(onChange.mock.lastCall?.[0]).toEqualDateTime(expectedDate);
      });

      it('should correctly toggle meridiem from AM to PM on a DST spring-forward date', async () => {
        const onChange = vi.fn();
        // midnight PST (UTC-8) = 2024-03-10T08:00:00Z
        const initialValue = adapter.date('2024-03-10T00:00:00', timezone);

        const view = renderWithProps({
          defaultValue: initialValue,
          format: adapter.formats.fullTime12h,
          timezone,
          onChange,
        });

        await view.selectSection('meridiem');
        // Toggle AM → PM
        await view.user.keyboard('{ArrowUp}');

        // Old code (addHours(+12)) would have produced "01:00 PM" (wrong).
        // New code (setHours) correctly produces "12:00 PM" (noon).
        expectFieldValue(view.getSectionsContainer(), '12:00 PM');

        // Verify the onChange value is noon on March 10 (2024-03-10T19:00:00Z),
        // not 1:00 PM (2024-03-10T20:00:00Z).
        const expectedDate = adapter.setHours(initialValue, 12);
        expect(onChange.mock.lastCall?.[0]).toEqualDateTime(expectedDate);
      });
    });
  });

  describeAdapters('Day without midnight', TimeField, ({ adapter, renderWithProps }) => {
    beforeEach(() => {
      // `America/Santiago` skips from 00:00 to 01:00 on 2026-09-06.
      vi.setSystemTime(new Date('2026-09-06T15:00:00.000Z'));
    });

    it.skipIf(!adapter.isTimezoneCompatible)(
      'should accept every hour in a 12-hour format',
      async () => {
        const view = renderWithProps({
          format: adapter.formats.fullTime12h,
          timezone: 'America/Santiago',
        });

        await view.selectSection('hours');
        await view.pressKey('1');
        await view.pressKey('0');
        expectFieldValue(view.getSectionsContainer(), '10:mm aa');
      },
    );
  });
});
