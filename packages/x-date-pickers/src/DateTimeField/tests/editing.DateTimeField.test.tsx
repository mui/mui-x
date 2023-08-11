import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { userEvent, screen } from '@mui/monorepo/test/utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { adapterToUse, buildFieldInteractions, createPickerRenderer } from 'test/utils/pickers';

describe('<DateTimeField /> - Editing', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2012, 4, 3, 14, 30, 15, 743),
  });

  const { renderWithProps } = buildFieldInteractions({
    clock,
    render,
    Component: DateTimeField,
  });

  describe('Reference value', () => {
    it('should use the referenceDate prop when defined', () => {
      const onChange = spy();
      const referenceDate = adapterToUse.date(new Date(2012, 4, 3, 14, 30));

      const { input, selectSection } = renderWithProps({
        onChange,
        referenceDate,
        format: adapterToUse.formats.month,
      });

      selectSection('month');
      userEvent.keyPress(input, { key: 'ArrowUp' });

      // All sections not present should equal the one from the referenceDate, and the month should equal January (because it's an ArrowUp on an empty month).
      expect(onChange.lastCall.firstArg).toEqualDateTime(adapterToUse.setMonth(referenceDate, 0));
    });

    it('should not use the referenceDate prop when a value is defined', () => {
      const onChange = spy();
      const value = adapterToUse.date(new Date(2018, 10, 3, 22, 15));
      const referenceDate = adapterToUse.date(new Date(2012, 4, 3, 14, 30));

      const { input, selectSection } = renderWithProps({
        onChange,
        referenceDate,
        value,
        format: adapterToUse.formats.month,
      });

      selectSection('month');
      userEvent.keyPress(input, { key: 'ArrowUp' });

      // Should equal the initial `value` prop with one less month.
      expect(onChange.lastCall.firstArg).toEqualDateTime(adapterToUse.setMonth(value, 11));
    });

    it('should not use the referenceDate prop when a defaultValue is defined', () => {
      const onChange = spy();
      const defaultValue = adapterToUse.date(new Date(2018, 10, 3, 22, 15));
      const referenceDate = adapterToUse.date(new Date(2012, 4, 3, 14, 30));

      const { input, selectSection } = renderWithProps({
        onChange,
        referenceDate,
        defaultValue,
        format: adapterToUse.formats.month,
      });

      selectSection('month');
      userEvent.keyPress(input, { key: 'ArrowUp' });

      // Should equal the initial `defaultValue` prop with one less month.
      expect(onChange.lastCall.firstArg).toEqualDateTime(adapterToUse.setMonth(defaultValue, 11));
    });

    describe('Reference value based on section granularity', () => {
      it('should only keep year when granularity = month', () => {
        const onChange = spy();

        const { input, selectSection } = renderWithProps({
          onChange,
          format: adapterToUse.formats.month,
        });

        selectSection('month');
        userEvent.keyPress(input, { key: 'ArrowUp' });

        expect(onChange.lastCall.firstArg).toEqualDateTime('2012-01-01');
      });

      it('should only keep year and month when granularity = day', () => {
        const onChange = spy();

        const { input, selectSection } = renderWithProps({
          onChange,
          format: adapterToUse.formats.dayOfMonth,
        });

        selectSection('day');
        userEvent.keyPress(input, { key: 'ArrowUp' });

        expect(onChange.lastCall.firstArg).toEqualDateTime('2012-05-01');
      });

      it('should only keep up to the hours when granularity = minutes', () => {
        const onChange = spy();

        const { input, selectSection } = renderWithProps({
          onChange,
          format: adapterToUse.formats.fullTime24h,
        });

        selectSection('hours');

        // Set hours
        userEvent.keyPress(input, { key: 'ArrowUp' });

        // Set minutes
        userEvent.keyPress(input, { key: 'ArrowRight' });
        userEvent.keyPress(input, { key: 'ArrowUp' });

        expect(onChange.lastCall.firstArg).toEqualDateTime('2012-05-03T00:00:00.000Z');
      });
    });

    describe('Reference value based on validation props', () => {
      it("should create a reference date just after the `minDate` if it's after the current date", () => {
        const onChange = spy();
        const minDate = adapterToUse.date(new Date(2030, 4, 5, 18, 30));

        const { input, selectSection } = renderWithProps({
          onChange,
          minDate,
          format: adapterToUse.formats.month,
        });

        selectSection('month');
        userEvent.keyPress(input, { key: 'ArrowUp' });

        // Respect the granularity and the minDate
        expect(onChange.lastCall.firstArg).toEqualDateTime('2030-01-01T00:00');
      });

      it("should ignore the `minDate` if  it's before the current date", () => {
        const onChange = spy();
        const minDate = adapterToUse.date(new Date(2007, 4, 5, 18, 30));

        const { input, selectSection } = renderWithProps({
          onChange,
          minDate,
          format: adapterToUse.formats.month,
        });

        selectSection('month');
        userEvent.keyPress(input, { key: 'ArrowUp' });

        // Respect the granularity but not the minDate
        expect(onChange.lastCall.firstArg).toEqualDateTime('2012-01-01T00:00');
      });

      it("should create a reference date just before the `maxDate` if it's before the current date", () => {
        const onChange = spy();
        const maxDate = adapterToUse.date(new Date(2007, 4, 5, 18, 30));

        const { input, selectSection } = renderWithProps({
          onChange,
          maxDate,
          format: adapterToUse.formats.month,
        });

        selectSection('month');
        userEvent.keyPress(input, { key: 'ArrowUp' });

        // Respect the granularity and the minDate
        expect(onChange.lastCall.firstArg).toEqualDateTime('2007-01-01T00:00');
      });

      it("should ignore the `maxDate` if  it's after the current date", () => {
        const onChange = spy();
        const maxDate = adapterToUse.date(new Date(2030, 4, 5, 18, 30));

        const { input, selectSection } = renderWithProps({
          onChange,
          maxDate,
          format: adapterToUse.formats.month,
        });

        selectSection('month');
        userEvent.keyPress(input, { key: 'ArrowUp' });

        // Respect the granularity but not the maxDate
        expect(onChange.lastCall.firstArg).toEqualDateTime('2012-01-01T00:00');
      });
    });
  });

  it('should correctly update `value` when both `format` and `value` are changed', () => {
    const { setProps } = render(<DateTimeField value={null} format="P" />);
    expect(screen.getByRole<HTMLInputElement>('textbox').value).to.equal('');

    setProps({
      format: 'Pp',
      value: adapterToUse.date(new Date(2012, 4, 3, 14, 30)),
    });
    expect(screen.getByRole<HTMLInputElement>('textbox').value).to.equal('05/03/2012, 02:30 PM');
  });
});
