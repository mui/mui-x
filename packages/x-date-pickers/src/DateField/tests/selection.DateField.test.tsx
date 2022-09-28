import * as React from 'react';
import { expect } from 'chai';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen, act, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { createPickerRenderer } from 'test/utils/pickers-utils';

const getSelectedContent = (input: HTMLInputElement) =>
  input.value.slice(input.selectionStart ?? 0, input.selectionEnd ?? 0);

describe('<DateField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const clickOnInput = (input: HTMLInputElement, cursorPosition: number) => {
    act(() => {
      fireEvent.mouseDown(input);
      if (document.activeElement !== input) {
        input.focus();
      }
      fireEvent.mouseUp(input);
      input.setSelectionRange(cursorPosition, cursorPosition);
      fireEvent.click(input);

      clock.runToLast();
    });
  };

  describe('Focus', () => {
    it('should select all on <Tab> focus', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
        input.select();
      });

      expect(input.value).to.equal('month/day/year');
      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(input.value.length);
    });

    it('should select day on mobile', () => {
      render(<DateField />);
      const input: HTMLInputElement = screen.getByRole('textbox');
      // Simulate a touch focus interaction on mobile
      act(() => {
        input.focus();
        input.setSelectionRange(7, 9);
        clock.runToLast();
      });

      expect(input.value).to.equal('month/day/year');
      expect(input.selectionStart).to.equal(6);
      expect(input.selectionEnd).to.equal(9);
    });

    it('should select day on desktop', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);

      expect(input.value).to.equal('month/day/year');
      expect(getSelectedContent(input)).to.equal('day');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('day');

      clickOnInput(input, 1);
      expect(getSelectedContent(input)).to.equal('month');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('day');

      clickOnInput(input, 8);
      expect(getSelectedContent(input)).to.equal('day');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getSelectedContent(input)).to.equal('month/day/year');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('day');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getSelectedContent(input)).to.equal('year');
    });

    it('should stay on the current section when the last section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 11);
      expect(getSelectedContent(input)).to.equal('year');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getSelectedContent(input)).to.equal('year');
    });

    it('should select the last section when all the sections are selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getSelectedContent(input)).to.equal('month/day/year');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getSelectedContent(input)).to.equal('month');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('day');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getSelectedContent(input)).to.equal('month');
    });

    it('should stay on the current section when the first section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);
      expect(getSelectedContent(input)).to.equal('month');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getSelectedContent(input)).to.equal('month');
    });

    it('should select the last section when all the sections are selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getSelectedContent(input)).to.equal('month/day/year');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getSelectedContent(input)).to.equal('year');
    });
  });
});
