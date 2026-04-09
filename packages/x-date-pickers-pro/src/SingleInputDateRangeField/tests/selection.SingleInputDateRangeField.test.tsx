import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
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
      const view = renderWithProps({
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      // End date
      await view.selectSection('month', 'last');
      expect(getCleanedSelectedContent()).to.equal('02');

      await view.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      view.unmount();
    });

    it('should not change the selection when clicking on the only already selected section', async () => {
      const view = renderWithProps({
        value: [null, adapterToUse.date('2022-02-24')],
      });

      // Start date
      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.selectSection('day');
      expect(getCleanedSelectedContent()).to.equal('DD');

      // End date
      await view.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      await view.selectSection('day', 'last');
      expect(getCleanedSelectedContent()).to.equal('24');

      view.unmount();
    });
  });

  describe('key: ArrowRight', () => {
    it('should allow to move from left to right with ArrowRight', async () => {
      const view = renderWithProps({});

      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('MM');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      view.unmount();
    });

    it('should stay on the current section when the last section is selected', async () => {
      const view = renderWithProps({});

      await view.selectSection('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      await view.user.keyboard('{ArrowRight}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      view.unmount();
    });
  });

  describe('key: ArrowLeft', () => {
    it('should allow to move from right to left with ArrowLeft', async () => {
      const view = renderWithProps({});

      await view.selectSection('year', 'last');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');

      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('YYYY');

      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('DD');

      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();
    });

    it('should stay on the current section when the first section is selected', async () => {
      const view = renderWithProps({});

      await view.selectSection('month');
      expect(getCleanedSelectedContent()).to.equal('MM');
      await view.user.keyboard('{ArrowLeft}');
      expect(getCleanedSelectedContent()).to.equal('MM');

      view.unmount();
    });
  });
});
