import { act, waitFor } from '@mui/internal-test-utils';
import { DateField } from '@mui/x-date-pickers/DateField';
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

    it('should select section by index on user-initiated focus (Click)', async () => {
      const view = renderWithProps({
        initialFocusedSection: 1,
        enableAccessibleFieldDOMStructure: true,
      });
      const root = view.getSectionsContainer();
      await view.user.click(root);
      expectFieldValueV7(root, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
      view.unmount();
    });

    it('should select section by index on user-initiated focus (Tab)', async () => {
      const view = renderWithProps({
        initialFocusedSection: 1,
        enableAccessibleFieldDOMStructure: true,
      });
      const root = view.getSectionsContainer();
      await view.user.tab();
      expectFieldValueV7(root, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
      view.unmount();
    });

    it('should fall back to first section and warn if index is invalid', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const view = renderWithProps({
        autoFocus: true,
        initialFocusedSection: 99,
        enableAccessibleFieldDOMStructure: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/The section index "99" is out of bounds/));
      view.unmount();
      warnSpy.mockRestore();
    });

    it('should fall back to first section and warn if type is invalid', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const view = renderWithProps({
        autoFocus: true,
        initialFocusedSection: 'weekDay',
        enableAccessibleFieldDOMStructure: true,
      });
      expectFieldValueV7(view.getSectionsContainer(), 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('MM');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/The section type "weekDay" does not exist/));
      view.unmount();
      warnSpy.mockRestore();
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

    it('should select section by index on user-initiated focus (Tab)', async () => {
      const { user, unmount } = renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        initialFocusedSection: 1,
      });
      const input = getTextbox();
      await user.tab();
      expectFieldValueV6(input, 'MM/DD/YYYY');
      expect(getCleanedSelectedContent()).to.equal('DD');
      unmount();
    });
  });
});
