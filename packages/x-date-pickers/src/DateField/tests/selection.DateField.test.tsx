import * as React from 'react';
import { expect } from 'chai';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import {
  createPickerRenderer,
  expectInputValue,
  getCleanedSelectedContent,
  adapterToUse,
  getTextbox,
} from 'test/utils/pickers-utils';

describe('<DateField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const clickOnInput = (input: HTMLInputElement, position: number | string) => {
    act(() => {
      fireEvent.mouseDown(input);
      if (document.activeElement !== input) {
        input.focus();
      }
      fireEvent.mouseUp(input);
    });
    clock.runToLast();
    const clickPosition = typeof position === 'string' ? input.value.indexOf(position) : position;
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
      render(<DateField autoFocus />);
      const input = getTextbox();

      expectInputValue(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');
    });

    it('should select all on mount focus (`autoFocus = true`) with start separator', () => {
      render(<DateField autoFocus format={`- ${adapterToUse.formats.year}`} />);
      const input = getTextbox();

      expectInputValue(input, '- YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('- YYYY');
    });

    it('should select all on <Tab> focus', () => {
      render(<DateField />);
      const input = getTextbox();
      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
      });
      clock.runToLast();
      input.select();

      expectInputValue(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');
    });

    it('should select all on <Tab> focus with start separator', () => {
      render(<DateField format={`- ${adapterToUse.formats.year}`} />);
      const input = getTextbox();
      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
      });
      clock.runToLast();
      input.select();

      expectInputValue(input, '- YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('- YYYY');
    });

    it('should select day on mobile', () => {
      render(<DateField />);
      const input = getTextbox();
      // Simulate a touch focus interaction on mobile
      act(() => {
        input.focus();
      });
      clock.runToLast();
      expectInputValue(input, 'MM/DD/YYYY');

      input.setSelectionRange(3, 5);
      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(5);
    });

    it('should select day on desktop', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 'DD');

      expectInputValue(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 'DD');
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      clickOnInput(input, 'MM');
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 'DD');
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      clickOnInput(input, input.value.indexOf('DD') + 1);
      expect(getCleanedSelectedContent(input)).to.equal('DD');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 1);

      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');
    });

    it('should select all sections with start separator', () => {
      render(<DateField format={`- ${adapterToUse.formats.year}`} />);
      const input = getTextbox();
      clickOnInput(input, 1);

      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('- YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 'DD');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 'YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 'DD');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 1);
      expect(getCleanedSelectedContent(input)).to.equal('MM');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', () => {
      render(<DateField />);
      const input = getTextbox();
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });
  });
});
