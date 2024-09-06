import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent } from '@mui/internal-test-utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeAdapters,
  buildFieldInteractions,
} from 'test/utils/pickers';

const TIMEZONE_TO_TEST = ['UTC', 'system', 'America/New_York'];

describe('<DateTimeField /> - Timezone', () => {
  describeAdapters('Timezone prop', DateTimeField, ({ adapter, renderWithProps }) => {
    if (!adapter.isTimezoneCompatible) {
      return;
    }

    const format = `${adapter.formats.keyboardDate} ${adapter.formats.hours24h}`;

    const fillEmptyValue = (v7Response: ReturnType<typeof renderWithProps>, timezone: string) => {
      v7Response.selectSection('month');

      // Set month
      fireEvent.keyDown(v7Response.getActiveSection(0), { key: 'ArrowDown' });
      fireEvent.keyDown(v7Response.getActiveSection(0), { key: 'ArrowRight' });

      // Set day
      fireEvent.keyDown(v7Response.getActiveSection(1), { key: 'ArrowDown' });
      fireEvent.keyDown(v7Response.getActiveSection(1), { key: 'ArrowRight' });

      // Set year
      fireEvent.keyDown(v7Response.getActiveSection(2), { key: 'ArrowDown' });
      fireEvent.keyDown(v7Response.getActiveSection(2), { key: 'ArrowRight' });

      // Set hours
      fireEvent.keyDown(v7Response.getActiveSection(3), { key: 'ArrowDown' });
      fireEvent.keyDown(v7Response.getActiveSection(3), { key: 'ArrowRight' });

      return adapter.setHours(
        adapter.setDate(adapter.setMonth(adapter.date(undefined, timezone), 11), 31),
        23,
      );
    };

    it('should use default timezone for rendering and onChange when no value and no timezone prop are provided', () => {
      const onChange = spy();
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        onChange,
        format,
      });

      const expectedDate = fillEmptyValue(view, 'default');

      // Check the rendered value (uses default timezone, e.g: UTC, see TZ env variable)
      expectFieldValueV7(view.getSectionsContainer(), '12/31/2022 23');

      // Check the `onChange` value (uses default timezone, e.g: UTC, see TZ env variable)
      const actualDate = onChange.lastCall.firstArg;

      // On dayjs, we are not able to know if a date is UTC because it's the system timezone or because it was created as UTC.
      // In a real world scenario, this should probably never occur.
      expect(adapter.getTimezone(actualDate)).to.equal(adapter.lib === 'dayjs' ? 'UTC' : 'system');
      expect(actualDate).toEqualDateTime(expectedDate);
    });

    TIMEZONE_TO_TEST.forEach((timezone) => {
      describe(`Timezone: ${timezone}`, () => {
        it('should use timezone prop for onChange and rendering when no value is provided', () => {
          const onChange = spy();
          const view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            onChange,
            format,
            timezone,
          });
          const expectedDate = fillEmptyValue(view, timezone);

          // Check the rendered value (uses timezone prop)
          expectFieldValueV7(view.getSectionsContainer(), '12/31/2022 23');

          // Check the `onChange` value (uses timezone prop)
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });

        it('should use timezone prop for rendering and value timezone for onChange when a value is provided', () => {
          const onChange = spy();
          const view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            value: adapter.date(undefined, timezone),
            onChange,
            format,
            timezone: 'America/Chicago',
          });

          view.selectSection('month');
          fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowDown' });

          // Check the rendered value (uses America/Chicago timezone)
          expectFieldValueV7(view.getSectionsContainer(), '05/14/2022 19');

          // Check the `onChange` value (uses timezone prop)
          const expectedDate = adapter.addMonths(adapter.date(undefined, timezone), -1);
          const actualDate = onChange.lastCall.firstArg;
          expect(adapter.getTimezone(actualDate)).to.equal(timezone);
          expect(actualDate).toEqualDateTime(expectedDate);
        });
      });
    });
  });

  describe('Value timezone modification - Luxon', () => {
    const { render, adapter, clock } = createPickerRenderer({
      clock: 'fake',
      adapterName: 'luxon',
    });
    const { renderWithProps } = buildFieldInteractions({
      clock,
      render,
      Component: DateTimeField,
    });

    it('should update the field when time zone changes (timestamp remains the same)', () => {
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      const date = adapter.date('2020-06-18T14:30:10.000Z').setZone('UTC');
      view.setProps({ value: date });

      expectFieldValueV7(view.getSectionsContainer(), '06/18/2020 02:30 PM');

      view.setProps({ value: date.setZone('America/Los_Angeles') });

      expectFieldValueV7(view.getSectionsContainer(), '06/18/2020 07:30 AM');
    });
  });
});
