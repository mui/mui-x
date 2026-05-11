import { spy } from 'sinon';
import { DateTime } from 'luxon';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  createPickerRenderer,
  expectFieldValue,
  describeAdapters,
  buildFieldInteractions,
} from 'test/utils/pickers';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

describe('<DateTimeField /> - Timezone', () => {
  describeAdapters('Timezone prop', DateTimeField, ({ adapter, renderWithProps }) => {
    describe.skipIf(!adapter.isTimezoneCompatible)('timezoneCompatible', () => {
      const format = `${adapter.formats.keyboardDate} ${adapter.formats.hours24h}`;

      const fillEmptyValue = async (
        response: ReturnType<typeof renderWithProps>,
        timezone: string,
      ) => {
        await response.selectSection('month');

        // Set month
        await response.user.keyboard('{ArrowDown}');
        await response.user.keyboard('{ArrowRight}');

        // Set day
        await response.user.keyboard('{ArrowDown}');
        await response.user.keyboard('{ArrowRight}');

        // Set year
        await response.user.keyboard('{ArrowDown}');
        await response.user.keyboard('{ArrowRight}');

        // Set hours
        await response.user.keyboard('{ArrowDown}');
        await response.user.keyboard('{ArrowRight}');

        return adapter.setHours(
          adapter.setDate(adapter.setMonth(adapter.date(undefined, timezone), 11), 31),
          23,
        );
      };

      it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', async () => {
        const onChange = spy();
        const view = renderWithProps({
          onChange,
          format,
        });

        const expectedDate = await fillEmptyValue(view, 'default');

        // Check the rendered value (uses default timezone, for example: UTC, see TZ env variable)
        expectFieldValue(view.getSectionsContainer(), '12/31/2022 23');

        // Check the `onChange` value (uses default timezone, for example: UTC, see TZ env variable)
        const actualDate = onChange.lastCall.firstArg;

        // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
        // In a real world scenario, this should probably never occur.
        expect(adapter.getTimezone(actualDate)).to.equal(
          adapter.lib === 'dayjs' ? 'UTC' : 'system',
        );
        expect(actualDate).toEqualDateTime(expectedDate);
      });

      TIMEZONE_TO_TEST.forEach((timezone) => {
        describe(`Timezone: ${timezone}`, () => {
          it('should use timezone prop for onChange and rendering when no value is provided', async () => {
            const onChange = spy();
            const view = renderWithProps({
              onChange,
              format,
              timezone,
            });
            const expectedDate = await fillEmptyValue(view, timezone);

            // Check the rendered value (uses timezone prop)
            expectFieldValue(view.getSectionsContainer(), '12/31/2022 23');

            // Check the `onChange` value (uses timezone prop)
            const actualDate = onChange.lastCall.firstArg;
            expect(adapter.getTimezone(actualDate)).to.equal(timezone);
            expect(actualDate).toEqualDateTime(expectedDate);
          });

          it('should use timezone prop for rendering and value timezone for onChange when a value is provided', async () => {
            const onChange = spy();
            const view = renderWithProps({
              defaultValue: adapter.date(undefined, timezone),
              onChange,
              format,
              timezone: 'America/Chicago',
            });

            await view.selectSection('month');
            await view.user.keyboard('{ArrowDown}');

            // Check the rendered value (uses America/Chicago timezone)
            expectFieldValue(view.getSectionsContainer(), '05/14/2022 19');

            // Check the `onChange` value (uses timezone prop)
            const expectedDate = adapter.addMonths(adapter.date(undefined, timezone), -1);
            const actualDate = onChange.lastCall.firstArg;
            expect(adapter.getTimezone(actualDate)).to.equal(timezone);
            expect(actualDate).toEqualDateTime(expectedDate);
          });
        });
      });
    });
  });

  describe('Value timezone modification - Luxon', () => {
    const { render, adapter } = createPickerRenderer({
      adapterName: 'luxon',
    });
    const { renderWithProps } = buildFieldInteractions({
      render,
      Component: DateTimeField,
    });

    it('should update the field when the timezone changes (timestamp remains the same)', () => {
      const view = renderWithProps({ value: null });

      const date = (adapter.date('2020-06-18T14:30:10.000Z') as DateTime).setZone('UTC');
      view.setProps({ value: date });

      expectFieldValue(view.getSectionsContainer(), '06/18/2020 02:30 PM');

      view.setProps({ value: date.setZone('America/Los_Angeles') });

      expectFieldValue(view.getSectionsContainer(), '06/18/2020 07:30 AM');
    });
  });
});
