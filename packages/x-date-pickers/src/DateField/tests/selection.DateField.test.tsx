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
    it('should select all on mount focus (`autoFocus = true`)', () => {
      render(<DateField autoFocus />);
      const input = screen.getByRole('textbox');

      expect(input.value).to.equal('MM / DD / YYYY');
      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(input.value.length);
    });

    it('should select all on <Tab> focus', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
        input.select();
      });

      expect(input.value).to.equal('MM / DD / YYYY');
      expect(input.selectionStart).to.equal(0);
      expect(input.selectionEnd).to.equal(input.value.length);
    });

    it('should select day on mobile', () => {
      render(<DateField />);
      const input: HTMLInputElement = screen.getByRole('textbox');
      // Simulate a touch focus interaction on mobile
      act(() => {
        input.focus();
        input.setSelectionRange(6, 8);
        clock.runToLast();
      });

      expect(input.value).to.equal('MM / DD / YYYY');
      expect(input.selectionStart).to.equal(5);
      expect(input.selectionEnd).to.equal(7);
    });

    it('should select day on desktop', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 6);

      expect(input.value).to.equal('MM / DD / YYYY');
      expect(getSelectedContent(input)).to.equal('DD');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('DD');

      clickOnInput(input, 1);
      expect(getSelectedContent(input)).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('DD');

      clickOnInput(input, 8);
      expect(getSelectedContent(input)).to.equal('DD');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getSelectedContent(input)).to.equal('MM / DD / YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('DD');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getSelectedContent(input)).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 11);
      expect(getSelectedContent(input)).to.equal('YYYY');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getSelectedContent(input)).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getSelectedContent(input)).to.equal('MM / DD / YYYY');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getSelectedContent(input)).to.equal('YYYY');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 7);
      expect(getSelectedContent(input)).to.equal('DD');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getSelectedContent(input)).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);
      expect(getSelectedContent(input)).to.equal('MM');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getSelectedContent(input)).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', () => {
      render(<DateField />);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 1);

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getSelectedContent(input)).to.equal('MM / DD / YYYY');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getSelectedContent(input)).to.equal('MM');
    });
  });
});
