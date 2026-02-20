import { DateField } from '@mui/x-date-pickers/DateField';
import { act, waitFor } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  buildFieldInteractions,
  expectFieldValueV7,
  expectFieldValueV6,
  getCleanedSelectedContent,
  getTextbox,
} from 'test/utils/pickers';

/**
 * This suite validates `initialFocusedSection` across:
 * - current structure (default, v7)
 * - explicit v7 structure (enableAccessibleFieldDOMStructure: true)
 * - v6 structure (enableAccessibleFieldDOMStructure: false)
 */

describe('<DateField /> - initialFocusedSection', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({ render, Component: DateField });

  describe('Current structure (default v7)', () => {
    it('should select section by index on mount (autoFocus)', () => {
      const view = renderWithProps({
        autoFocus: true,
        initialFocusedSection: 1,
        enableAccessibleFieldDOMStructure: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
      view.unmount();
    });

    it('should select section by name on mount (autoFocus)', () => {
      const view = renderWithProps({
        autoFocus: true,
        initialFocusedSection: 'year',
        enableAccessibleFieldDOMStructure: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();
    });

    it('should select all sections on mount when initialFocusedSection="all"', () => {
      const view = renderWithProps({
        autoFocus: true,
        initialFocusedSection: 'all',
        enableAccessibleFieldDOMStructure: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
      view.unmount();
    });
  });

  describe('V7 structure (enableAccessibleFieldDOMStructure: true)', () => {
    it('should select section by index on mount (autoFocus)', () => {
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
        initialFocusedSection: 1,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
      view.unmount();
    });

    it('should select section by name on mount (autoFocus)', () => {
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
        initialFocusedSection: 'year',
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      view.unmount();
    });

    it('should select all sections on mount when initialFocusedSection="all"', () => {
      const view = renderWithProps({
        enableAccessibleFieldDOMStructure: true,
        autoFocus: true,
        initialFocusedSection: 'all',
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
      view.unmount();
    });
  });

  describe('V6 structure (enableAccessibleFieldDOMStructure: false)', () => {
    it('should select section by index on mount (autoFocus)', () => {
      const { unmount } = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        autoFocus: true,
        initialFocusedSection: 1,
      });
      const input = getTextbox();
      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
      unmount();
    });

    it('should select section by name on mount (autoFocus)', () => {
      const { unmount } = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        autoFocus: true,
        initialFocusedSection: 'year',
      });
      const input = getTextbox();
      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('YYYY');
      unmount();
    });

    it('should select all sections on mount when initialFocusedSection="all"', () => {
      const { unmount } = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        autoFocus: true,
        initialFocusedSection: 'all',
      });
      const input = getTextbox();
      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
      unmount();
    });

    it('should apply initialFocusedSection on focus after mount (Tab) - all', async () => {
      const { user, unmount } = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        initialFocusedSection: 'all',
      });
      const input = getTextbox();

      await user.tab();
      await act(async () => input.select());

      await waitFor(() => {
        expectFieldValueV6(input, 'MM/DD/YYYY');
      });
      expect(getCleanedSelectedContent()).to.equal('MM/DD/YYYY');
      unmount();
    });
  });
});
