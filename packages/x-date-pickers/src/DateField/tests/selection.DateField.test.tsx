import * as React from 'react';
import { expect } from 'chai';
import { DateField } from '@mui/x-date-pickers/DateField';
import { act, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
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
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({ render, Component: DateField });

  describe('Focus', () => {
    it('should select 1st section (v7) / all sections (v6) on mount (`autoFocus = true`)', () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();

      // Test with non-accessible DOM structure
      renderWithProps({ enableAccessibleFieldDOMStructure: false, autoFocus: true });
      const input = getTextbox();
      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select 1st section (v7) / all sections (v6) (`autoFocus = true`) with start separator', () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      expectFieldValueV7(view.getSectionsContainer(), '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();

      // Test with non-accessible DOM structure
      renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      const input = getTextbox();
      expectFieldValueV6(input, '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });

    it('should not select 1st section (v7) on mount (`autoFocus = true` and `disabled = true`)', () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
        disabled: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('');
      view.unmount();
    });

    it('should select all on <Tab> focus (v6 only)', async () => {
      // Test with non-accessible DOM structure
      const { user } = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();

      await user.tab();
      await act(async () => input.select());

      await waitFor(() => {
        expectFieldValueV6(input, 'MM/DD/YYYY');
      });

      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select all on <Tab> focus with start separator (v6 only)', async () => {
      // Test with non-accessible DOM structure
      const { user } = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `- ${adapterToUse.formats.year}`,
      });
      const input = getTextbox();

      // Simulate a <Tab> focus interaction on desktop
      await user.tab();
      await act(async () => input.select());

      await waitFor(() => {
        expectFieldValueV6(input, '- YYYY');
      });

      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });

    it('should select day on mobile (v6 only)', async () => {
      // Test with non-accessible DOM structure
      renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      // Simulate a touch focus interaction on mobile
      act(() => {
        input.focus();
      });

      await waitFor(() => {
        expectFieldValueV6(input, 'MM/DD/YYYY');
      });

      input.setSelectionRange(3, 5);
      expect(input.selectionStart).to.equal(3);
      expect(input.selectionEnd).to.equal(5);
    });

    it('should select day on desktop (v6 only)', async () => {
      // Test with non-accessible DOM structure
      const view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      const input = getTextbox();
      await view.selectSectionAsync('day');

      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });

    it('should not select section on click (`disabled = true`)', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        disabled: true,
      });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        disabled: true,
      });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('');

      view.unmount();
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('month');
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('month');
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select all sections with start separator', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      await view.selectSectionAsync('year');
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('- YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        format: `- ${adapterToUse.formats.year}`,
      });
      const input = getTextbox();
      await view.selectSectionAsync('year');
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the next section when editing after all the sections were selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowDown' });
      expect(getCleanedSelectedContent()).to.equal('12');

      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(getCleanedSelectedContent()).to.equal('12');

      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', async () => {
      // Test with accessible DOM structure
      let view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(view.getSectionsContainer(), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();

      // Test with non-accessible DOM structure
      view = renderWithProps({ enableAccessibleFieldDOMStructure: false });
      const input = getTextbox();
      await view.selectSectionAsync('month');

      // Select all sections
      fireEvent.keyDown(input, { key: 'a', keyCode: 65, ctrlKey: true });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the first section when `inputRef.current` is focused', () => {
      function TestCase() {
        const inputRef = React.useRef<HTMLInputElement>(null);
        return (
          <React.Fragment>
            <DateField inputRef={inputRef} />
            <button onClick={() => inputRef.current?.focus()}>Focus input</button>
          </React.Fragment>
        );
      }
      render(<TestCase />);

      fireEvent.click(screen.getByRole('button', { name: 'Focus input' }));

      expect(getCleanedSelectedContent()).to.equal('MM');
    });
  });
});
