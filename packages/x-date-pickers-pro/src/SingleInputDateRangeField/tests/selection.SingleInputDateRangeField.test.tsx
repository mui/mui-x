import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { fireEvent } from '@mui/internal-test-utils';
import {
  adapterToUse,
  buildFieldInteractions,
  getCleanedSelectedContent,
  createPickerRenderer,
  expectFieldValue,
} from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Selection', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: SingleInputDateRangeField,
  });

  describe('Focus', () => {
    it('should select 1st section on mount focus (`autoFocus = true`)', () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        autoFocus: true,
      });
      expectFieldValue(view.getSectionsContainer(), 'MM/DD/YYYY – MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();
    });
  });

  describe('Click', () => {
    it('should select the clicked selection when the input is already focused', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      // End date
      await view.selectSectionAsync('month', 'last');
      expect(getCleanedSelectedContent()).to.equal('02');

      await view.selectSectionAsync('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      view.unmount();
    });

    it('should not change the selection when clicking on the only already selected section', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSectionAsync('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      // End date
      await view.selectSectionAsync('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      await view.selectSectionAsync('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      view.unmount();
    });
  });

  describe('key: ArrowRight', () => {
    it('should allow to move from left to right with ArrowRight', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({});

      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      view.unmount();
    });

    it('should stay on the current section when the last section is selected', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({});

      await view.selectSectionAsync('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(view.getActiveSection(5), { key: 'ArrowRight' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      view.unmount();
    });
  });

  describe('key: ArrowLeft', () => {
    it('should allow to move from right to left with ArrowLeft', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({});

      await view.selectSectionAsync('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      fireEvent.keyDown(view.getActiveSection(5), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(view.getActiveSection(4), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      fireEvent.keyDown(view.getActiveSection(3), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      fireEvent.keyDown(view.getActiveSection(2), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('DD');

      fireEvent.keyDown(view.getActiveSection(1), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();
    });

    it('should stay on the current section when the first section is selected', async () => {
      // Test with accessible DOM structure
      const view = renderWithProps({});

      await view.selectSectionAsync('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      fireEvent.keyDown(view.getActiveSection(0), { key: 'ArrowLeft' });
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();
    });
  });
});
