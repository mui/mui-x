import { expect } from 'chai';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, fireEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  expectFieldValueV7,
  expectFieldValueV6,
  getCleanedSelectedContent,
  getTextbox,
  buildFieldInteractions,
  adapterToUse,
} from 'test/utils/pickers';

describe('<DateField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });
  const { renderWithProps } = buildFieldInteractions({ clock, render, Component: DateField });

  describe('Focus', () => {
    it('should select 1st section (v7) / all sections (v6) on mount focus (`autoFocus = true`)', () => {
      // Text with v7 input
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();

      // Text with v6 input
      renderWithProps({ enableAccessibleFieldDOMStructure: false, autoFocus: true });
      const input = getTextbox();
      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select 1st section (v7) / all sections (v6) (`autoFocus = true`) with start separator', () => {
      // Text with v7 input
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      expectFieldValueV7(view.getSectionsContainer(), '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();

      // Text with v6 input
      renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      const input = getTextbox();
      expectFieldValueV6(input, '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });

    it('should select all on <Tab> focus (v6 only)', () => {
      // Text with v6 input
      renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();

      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
      });
      clock.runToLast();
      input.select();

      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select all on <Tab> focus with start separator (v6 only)', () => {
      // Text with v6 input
      renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `- ${adapterToUse.formats.year}`,
      });
      const input = getTextbox();

      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
      });
      clock.runToLast();
      input.select();

      expectFieldValueV6(input, '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });

    it('should select day on mobile (v6 only)', () => {
      // Test with v6 input
      renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      // Simulate a touch focus interaction on mobile
      act(() => {
        input.focus();
      });
      clock.runToLast();
      expectFieldValueV6(input, 'MM/DD/YYYY');

      input.setSelectionRange(3, 5);
      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(5);
    });

    it('should select day on desktop (v6 only)', () => {
      // Test with v6 input
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      view.selectSection('day');

      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('month');
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('month');
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select all sections with start separator', () => {
      // Test with v7 input
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      view.selectSection('year');
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('- YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `- ${adapterToUse.formats.year}`,
      });
      const input = getTextbox();
      view.selectSection('year');
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', () => {
      // Test with v7 input
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();

      // Test with v6 input
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      view.selectSection('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });
  });
});
