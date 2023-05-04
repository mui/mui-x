import * as React from 'react';
import { expect } from 'chai';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { act, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import {
  adapterToUse,
  createPickerRenderer,
  expectInputValue,
  getCleanedSelectedContent,
  getTextbox,
} from 'test/utils/pickers-utils';

describe('<SingleInputDateRangeField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const clickOnInput = (
    input: HTMLInputElement,
    position: number | string,
    isSecondItem?: boolean,
  ) => {
    act(() => {
      fireEvent.mouseDown(input);
      if (document.activeElement !== input) {
        input.focus();
      }
      fireEvent.mouseUp(input);
    });
    clock.runToLast();
    const clickPosition =
      typeof position === 'string'
        ? input.value.indexOf(position, isSecondItem ? input.value.indexOf(position) + 1 : 0)
        : position;
    if (clickPosition === -1) {
      throw new Error(
        `Failed to find value to select "${position}" in input value: ${input.value}`,
      );
    }
    act(() => {
      input.setSelectionRange(clickPosition, clickPosition);
      fireEvent.click(input);

      clock.runToLast();
    });
  };

  describe('Focus', () => {
    it('should select all on mount focus (`autoFocus = true`)', () => {
      render(<SingleInputDateRangeField autoFocus />);
      const input = getTextbox();

      expectInputValue(input, 'MM/DD/YYYY – MM/DD/YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY – MM/DD/YYYY');
    });

    it('should select all on <Tab> focus', () => {
      render(<SingleInputDateRangeField />);
      const input = getTextbox();
      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
      });
      clock.runToLast();
      input.select();

      expectInputValue(input, 'MM/DD/YYYY – MM/DD/YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY – MM/DD/YYYY');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      render(
        <SingleInputDateRangeField value={[null, adapterToUse.date(new Date(2022, 1, 24))]} />,
      );
      const input = getTextbox();
      // Start date
      clickOnInput(input, 'DD');
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      clickOnInput(input, 'MM');
      expect(getCleanedSelectedContent(input)).to.equal('MM');

      // End date
      clickOnInput(input, '02');
      expect(getCleanedSelectedContent(input)).to.equal('02');

      clickOnInput(input, '24');
      expect(getCleanedSelectedContent(input)).to.equal('24');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      render(
        <SingleInputDateRangeField value={[null, adapterToUse.date(new Date(2022, 1, 24))]} />,
      );
      const input = getTextbox();
      // Start date
      clickOnInput(input, 'DD');
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      clickOnInput(input, input.value.indexOf('DD') + 1);
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      // End date
      clickOnInput(input, '24');
      expect(getCleanedSelectedContent(input)).to.equal('24');

      clickOnInput(input, input.value.indexOf('24') + 1);
      expect(getCleanedSelectedContent(input)).to.equal('24');
    });
  });

  describe('key: ArrowRight', () => {
    it('should allows to move from left to right with ArrowRight', () => {
      render(<SingleInputDateRangeField />);
      const input = getTextbox();
      clickOnInput(input, 'MM');
      expect(getCleanedSelectedContent(input)).to.equal('MM');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', () => {
      render(<SingleInputDateRangeField />);
      const input = getTextbox();
      clickOnInput(input, 'YYYY', true);
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should allows to move from right to left with ArrowLeft', () => {
      render(<SingleInputDateRangeField />);
      const input = getTextbox();
      clickOnInput(input, 'YYYY', true);
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', () => {
      render(<SingleInputDateRangeField />);
      const input = getTextbox();
      clickOnInput(input, 'MM');
      expect(getCleanedSelectedContent(input)).to.equal('MM');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });
  });
});
