import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { fireEvent, screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  expectFieldValue,
  getCleanedSelectedContent,
  buildFieldInteractions,
  adapterToUse,
} from 'test/utils/pickers';

describe('<DateField /> - Selection', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({ render, Component: DateField });

  describe('Focus', () => {
    it('should select 1st section on mount (`autoFocus = true`)', () => {
      const view = renderWithProps({
        autoFocus: true,
      });
      expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();
    });

    it('should select 1st section (`autoFocus = true`) with start separator', () => {
      const view = renderWithProps({
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      expectFieldValue(view.getSectionsContainer(), '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();
    });

    it('should not select 1st section (v7) on mount (`autoFocus = true` and `disabled = true`)', () => {
      const view = renderWithProps({
        autoFocus: true,
        disabled: true,
      });
      expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('');
      view.unmount();
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', async () => {
      const view = renderWithProps({});

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();
    });

    it('should not change the selection when clicking on the only already selected section', async () => {
      const view = renderWithProps({});

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      view.unmount();
    });

    it('should not select section on click (`disabled = true`)', async () => {
      const view = renderWithProps({
        disabled: true,
      });

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('');

      view.unmount();
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', async () => {
      const view = renderWithProps({});
      await view.selectSectionAsync('month');
      fireEvent.keyDown(view.getActiveSection(0), {
        key: 'a',
        keyCode: 65,
        ctrlKey: true,
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      view.unmount();
    });

    it('should select all sections with start separator', async () => {
      const view = renderWithProps({
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
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();
    });

    it('should stay on the current section when the last section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSectionAsync('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();
    });

    it('should select the last section when all the sections are selected', async () => {
      const view = renderWithProps({});
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
    });

    it('should select the next section when editing after all the sections were selected', async () => {
      const view = renderWithProps({});
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
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();
    });

    it('should stay on the current section when the first section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');
      view.unmount();
    });

    it('should select the first section when all the sections are selected', async () => {
      const view = renderWithProps({});
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
