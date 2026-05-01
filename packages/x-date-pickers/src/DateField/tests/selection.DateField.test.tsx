import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';
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
    });

    it('should select 1st section (`autoFocus = true`) with start separator', () => {
      const view = renderWithProps({
        autoFocus: true,
        format: `- ${adapterToUse.formats.year}`,
      });
      expectFieldValue(view.getSectionsContainer(), '- YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should not select 1st section on mount (`autoFocus = true` and `disabled = true`)', () => {
      const view = renderWithProps({
        autoFocus: true,
        disabled: true,
      });
      expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('');
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', async () => {
      const view = renderWithProps({});

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should not change the selection when clicking on the only already selected section', async () => {
      const view = renderWithProps({});

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });

    it('should not select section on click (`disabled = true`)', async () => {
      const view = renderWithProps({
        disabled: true,
      });

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('');
    });
  });

  describe('Click on blank space', () => {
    // Browsers natively move focus to the focusable (`tabindex=0`) sections
    // container when its blank space (padding, the area past the last section,
    // separator gaps) is clicked. Simulate that focus event explicitly because
    // `fireEvent` does not replicate the native focus side-effect in jsdom.
    const clickOnBlankSpace = (sectionsContainer: HTMLDivElement) => {
      fireEvent.mouseDown(sectionsContainer);
      fireEvent.focus(sectionsContainer);
      fireEvent.click(sectionsContainer);
    };

    it('should not focus the field or select a section when clicking on blank space inside an unfocused field', () => {
      const view = renderWithProps({});

      const sectionsContainer = view.getSectionsContainer();
      clickOnBlankSpace(sectionsContainer);

      const inputRoot = sectionsContainer.closest(`.${pickersInputBaseClasses.root}`)!;
      expect(inputRoot.classList.contains(pickersInputBaseClasses.focused)).to.equal(false);
      expect(getCleanedSelectedContent()).to.equal('');
    });

    it('should not move the selection to the first section when clicking on blank space inside a focused field', async () => {
      const view = renderWithProps({});

      await view.selectSection('day');
      const daySection = view.getSection(1);
      expect(document.activeElement).to.equal(daySection);

      const sectionsContainer = view.getSectionsContainer();
      clickOnBlankSpace(sectionsContainer);

      // Without the fix, blank-space click moves the selection to the first
      // section (the month). Assert it does not.
      const monthSection = view.getSection(0);
      expect(document.activeElement).not.to.equal(monthSection);
    });

    it('should still select a section when clicking directly on it', () => {
      const view = renderWithProps({});

      const yearSection = view.getSection(2);
      fireEvent.mouseDown(yearSection);
      fireEvent.click(yearSection);

      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });
  });

  describe('key: Ctrl + A', () => {
    it('should select all sections', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
    });

    it('should select all sections with start separator', async () => {
      const view = renderWithProps({
        format: `- ${adapterToUse.formats.year}`,
      });
      await view.selectSection('year');
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('- YYYY');
    });
  });

  describe('key: ArrowRight', () => {
    it('should move selection to the next section when one section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should stay on the current section when the last section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('year');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the last section when all the sections are selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
    });

    it('should select the next section when editing after all the sections were selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      await view.user.keyboard('{ArrowDown}');
      expect(getCleanedSelectedContent()).to.equal('12');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('DD');
    });
  });

  describe('key: ArrowLeft', () => {
    it('should move selection to the previous section when one section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');
      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should stay on the current section when the first section is selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');
    });

    it('should select the first section when all the sections are selected', async () => {
      const view = renderWithProps({});
      await view.selectSection('month');

      // Select all sections
      await view.user.keyboard('{Control>}a{/Control}');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');

      await view.user.keyboard('{ArrowLeft}');
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
