import { expect } from 'chai';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { act, fireEvent } from '@mui/internal-test-utils';
import {
  adapterToUse,
  buildFieldInteractions,
  getCleanedSelectedContent,
  getTextbox,
  createPickerRenderer,
  expectFieldValueV7,
  expectFieldValueV6,
} from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Selection', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });
  const { renderWithProps } = buildFieldInteractions({
    clock,
    render,
    Component: SingleInputDateRangeField,
  });

  describe('Focus', () => {
    it('should select 1st section (v7) / all sections (v6) on mount focus (`autoFocus = true`)', () => {
      // Test with v7 input
      const v7Response = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
      });
      expectFieldValueV7(v7Response.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');

      v7Response.unmount();

      // Test with v6 input
      renderWithProps({ autoFocus: true, enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      expectFieldValueV6(input, 'MM/DD/YYYY – MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY – MM/DD/YYYY');
    });

    it('should select all on <Tab> focus (v6 only)', () => {
      // Test with v6 input
      renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      // Simulate a <Tab> focus interaction on desktop
      act(() => {
        input.focus();
      });
      clock.runToLast();
      input.select();

      expectFieldValueV6(input, 'MM/DD/YYYY – MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY – MM/DD/YYYY');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', () => {
      // Test with v7 input
      const v7Response = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      v7Response.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      v7Response.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      // End date
      v7Response.selectSection('month', 'last');
      expect(getCleanedSelectedContent()).to.equal('02');

      v7Response.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      v6Response.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      v6Response.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      // End date
      v6Response.selectSection('month', 'last');
      expect(getCleanedSelectedContent()).to.equal('02');

      v6Response.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');
    });

    it('should not change the selection when clicking on the only already selected section', () => {
      // Test with v7 input
      const v7Response = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      v7Response.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      v7Response.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      // End date
      v7Response.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      v7Response.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      v6Response.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      v6Response.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      // End date
      v6Response.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      v6Response.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');
    });
  });

  describe('key: ArrowRight', () => {
    it('should allow to move from left to right with ArrowRight', () => {
      // Test with v7 input
      const v7Response = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      v7Response.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(v7Response.getActiveSection(0), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(v7Response.getActiveSection(1), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      fireEvent.keyDown(v7Response.getActiveSection(2), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(v7Response.getActiveSection(3), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(v7Response.getActiveSection(4), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      v6Response.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', () => {
      // Test with v7 input
      const v7Response = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      v7Response.selectSection('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(v7Response.getActiveSection(5), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      v6Response.selectSection('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should allow to move from right to left with ArrowLeft', () => {
      // Test with v7 input
      const v7Response = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      v7Response.selectSection('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(v7Response.getActiveSection(5), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(v7Response.getActiveSection(4), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(v7Response.getActiveSection(3), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      fireEvent.keyDown(v7Response.getActiveSection(2), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(v7Response.getActiveSection(1), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      v6Response.selectSection('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', () => {
      // Test with v7 input
      const v7Response = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      v7Response.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(v7Response.getActiveSection(0), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      v7Response.unmount();

      // Test with v6 input
      const v6Response = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      v6Response.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });
  });
});
