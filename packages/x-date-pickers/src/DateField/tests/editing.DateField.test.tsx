import * as React from 'react';
import { expect } from 'chai';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import { createPickerRenderer, adapterToUse, clickOnField } from 'test/utils/pickers-utils';

describe('<DateField /> - Editing', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2022, 1, 1, 1, 1, 1, 1),
  });

  describe.only('ArrowDown / ArrowUp edition', () => {
    it("should set the year to today's value when pressing ArrowDown and no value provided", () => {
      render(<DateField format={adapterToUse.formats.year} />);
      const input = screen.getByRole('textbox');
      clickOnField(input, 1, clock);
      userEvent.keyPress(input, { key: 'ArrowDown' });
      expect(input.value).to.equal('2022');
    });

    it("should set the year to today's value when pressing ArrowUp and no value provided", () => {
      render(<DateField format={adapterToUse.formats.year} />);
      const input = screen.getByRole('textbox');
      clickOnField(input, 1, clock);
      userEvent.keyPress(input, { key: 'ArrowUp' });
      expect(input.value).to.equal('2022');
    });

    it('should set the month to December when pressing ArrowDown and no value provided', () => {
      render(<DateField format={adapterToUse.formats.month} />);
      const input = screen.getByRole('textbox');
      clickOnField(input, 1, clock);
      userEvent.keyPress(input, { key: 'ArrowDown' });
      expect(input.value).to.equal('December');
    });

    it('should set the month to January when pressing ArrowUp and no value provided', () => {
      render(<DateField format={adapterToUse.formats.month} />);
      const input = screen.getByRole('textbox');
      clickOnField(input, 1, clock);
      userEvent.keyPress(input, { key: 'ArrowUp' });
      expect(input.value).to.equal('January');
    });

    it("should set the day to the last day of today's month when pressing ArrowDown and no value provided", () => {
      render(<DateField format={adapterToUse.formats.dayOfMonth} />);
      const input = screen.getByRole('textbox');
      clickOnField(input, 1, clock);
      userEvent.keyPress(input, { key: 'ArrowDown' });
      expect(input.value).to.equal('28');
    });

    it('should set the day to 1 when pressing ArrowUp and no value provided', () => {
      render(<DateField format={adapterToUse.formats.dayOfMonth} />);
      const input = screen.getByRole('textbox');
      clickOnField(input, 1, clock);
      userEvent.keyPress(input, { key: 'ArrowUp' });
      expect(input.value).to.equal('1');
    });

    describe('prop: readOnly', () => {
      it('should not edit value when pressing ArrowUp and no value provided', () => {
        render(<DateField readOnly format={adapterToUse.formats.year} />);
        const input = screen.getByRole('textbox');
        clickOnField(input, 1, clock);
        userEvent.keyPress(input, { key: 'ArrowUp' });
        expect(input.value).to.equal('year');
      });

      it('should not edit value when pressing ArrowUp and a default value provided', () => {
        render(
          <DateField
            readOnly
            defaultValue={adapterToUse.date()}
            format={adapterToUse.formats.year}
          />,
        );
        const input = screen.getByRole('textbox');
        clickOnField(input, 1, clock);
        userEvent.keyPress(input, { key: 'ArrowUp' });
        expect(input.value).to.equal('2022');
      });
    });
  });

  describe('Digit editing', () => {
    describe('prop: readOnly', () => {
      it('should not edit when pressing a digit and no value provided', () => {
        render(<DateField readOnly format={adapterToUse.formats.year} />);
        const input = screen.getByRole('textbox');
        clickOnField(input, 1, clock);
        userEvent.keyPress(input, { key: '1' });
        expect(input.value).to.equal('year');
      });

      it('should not edit value when pressing a digit and a default value provided', () => {
        render(
          <DateField
            readOnly
            defaultValue={adapterToUse.date()}
            format={adapterToUse.formats.year}
          />,
        );
        const input = screen.getByRole('textbox');
        clickOnField(input, 1, clock);
        userEvent.keyPress(input, { key: '1' });
        expect(input.value).to.equal('2022');
      });
    });
  });

  describe('Letter editing', () => {
    describe('prop: readOnly', () => {
      it('should not edit when pressing a letter and no value provided', () => {
        render(<DateField readOnly format={adapterToUse.formats.month} />);
        const input = screen.getByRole('textbox');
        clickOnField(input, 1, clock);
        userEvent.keyPress(input, { key: 'A' });
        expect(input.value).to.equal('month');
      });

      it('should not edit value when pressing a letter and a default value provided', () => {
        render(
          <DateField
            readOnly
            defaultValue={adapterToUse.date()}
            format={adapterToUse.formats.month}
          />,
        );
        const input = screen.getByRole('textbox');
        clickOnField(input, 1, clock);
        userEvent.keyPress(input, { key: 'A' });
        expect(input.value).to.equal('February');
      });
    });
  });
});
