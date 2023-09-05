import * as React from 'react';
import { expect } from 'chai';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, userEvent } from '@mui/monorepo/test/utils';
import {
  createPickerRenderer,
  expectInputValue,
  getCleanedSelectedContent,
  getTextbox,
  buildFieldInteractions,
  adapterToUse,
} from 'test/utils/pickers';

describe('<DateField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });
  const { renderWithProps } = buildFieldInteractions({ clock, render, Component: DateField });

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
      const { input, selectSection } = renderWithProps({});
      render(<DateField />);

      selectSection('day');

      expectInputValue(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      const { input, selectSection } = renderWithProps({});

      selectSection('day');
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      selectSection('month');
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      const { input, selectSection } = renderWithProps({});

      selectSection('day');
      expect(getCleanedSelectedContent(input)).to.equal('DD');

      selectSection('day');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', () => {
      const { input, selectSection } = renderWithProps({});

      selectSection('month');
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');
    });

    it('should select all sections with start separator', () => {
      const { input, selectSection } = renderWithProps({
        format: `- ${adapterToUse.formats.year}`,
      });

      selectSection('year');
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('- YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', () => {
      const { input, selectSection } = renderWithProps({});
      selectSection('day');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', () => {
      const { input, selectSection } = renderWithProps({});
      selectSection('year');
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', () => {
      const { input, selectSection } = renderWithProps({});
      selectSection('month');

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');

      userEvent.keyPress(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent(input)).to.equal('YYYY');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', () => {
      const { input, selectSection } = renderWithProps({});
      selectSection('day');
      expect(getCleanedSelectedContent(input)).to.equal('DD');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', () => {
      const { input, selectSection } = renderWithProps({});
      selectSection('month');
      expect(getCleanedSelectedContent(input)).to.equal('MM');
      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', () => {
      const { input, selectSection } = renderWithProps({});
      selectSection('month');

      // Select all sections
      userEvent.keyPress(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent(input)).to.equal('MM/DD/YYYY');

      userEvent.keyPress(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent(input)).to.equal('MM');
    });
  });
});
