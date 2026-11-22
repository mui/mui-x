import { screen } from '@mui/internal-test-utils';
import type { DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  buildFieldInteractions,
  expectFieldValue,
  adapterToUse,
} from 'test/utils/pickers';
import { describeAdapters } from 'test/utils/pickers/describeAdapters';
import { describe, expect, it, vi } from 'vitest';

describe('<DesktopDatePicker /> - Field', () => {
  describe('Basic behaviors', () => {
    const { render } = createPickerRenderer({
      clockConfig: new Date('2018-01-01T10:05:05.000'),
    });
    const { renderWithProps } = buildFieldInteractions({
      render,
      Component: DesktopDatePicker,
    });

    it('should open the calendar with Alt+ArrowDown without editing the selected section', async () => {
      const onChange = vi.fn();
      const view = renderWithProps(
        { defaultValue: adapterToUse.date('2022-06-18T00:00:00'), onChange },
        { componentFamily: 'picker' },
      );

      await view.selectSection('month');
      await view.user.keyboard('{Alt>}{ArrowDown}{/Alt}');

      expect(screen.getByRole('dialog')).toBeVisible();
      expectFieldValue(view.getSectionsContainer(), '06/18/2022');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should request opening a controlled picker and keep plain ArrowDown available for editing', async () => {
      const onOpen = vi.fn();
      const view = renderWithProps(
        { defaultValue: adapterToUse.date('2022-06-18T00:00:00'), open: false, onOpen },
        { componentFamily: 'picker' },
      );

      await view.selectSection('month');
      await view.user.keyboard('{Alt>}{ArrowDown}{/Alt}');
      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).to.equal(null);
      expectFieldValue(view.getSectionsContainer(), '06/18/2022');

      await view.user.keyboard('{ArrowDown}');
      expectFieldValue(view.getSectionsContainer(), '05/18/2022');
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('should ignore the shortcut in an already open picker', async () => {
      const onOpen = vi.fn();
      const view = renderWithProps(
        {
          defaultValue: adapterToUse.date('2022-06-18T00:00:00'),
          open: true,
          keepOpenDuringFieldFocus: true,
          onOpen,
        },
        { componentFamily: 'picker' },
      );

      await view.selectSection('month');
      await view.user.keyboard('{Alt>}{ArrowDown}{/Alt}');
      expect(onOpen).not.toHaveBeenCalled();
      expectFieldValue(view.getSectionsContainer(), '06/18/2022');
    });

    it('should let a field keydown handler cancel the opening shortcut', async () => {
      const view = renderWithProps(
        {
          defaultValue: adapterToUse.date('2022-06-18T00:00:00'),
          slotProps: { textField: { onKeyDown: (event) => event.preventDefault() } },
        },
        { componentFamily: 'picker' },
      );

      await view.selectSection('month');
      await view.user.keyboard('{Alt>}{ArrowDown}{/Alt}');
      expect(screen.queryByRole('dialog')).to.equal(null);
      expectFieldValue(view.getSectionsContainer(), '06/18/2022');
    });

    it('should keep a read-only picker closed on Alt+ArrowDown', async () => {
      const view = renderWithProps(
        { defaultValue: adapterToUse.date('2022-06-18T00:00:00'), readOnly: true },
        { componentFamily: 'picker' },
      );

      await view.selectSection('month');
      await view.user.keyboard('{Alt>}{ArrowDown}{/Alt}');
      expect(screen.queryByRole('dialog')).to.equal(null);
      expectFieldValue(view.getSectionsContainer(), '06/18/2022');
    });

    it('should be able to reset a single section', async () => {
      const view = renderWithProps(
        {
          format: `${adapterToUse.formats.month} ${adapterToUse.formats.dayOfMonth}`,
        },
        { componentFamily: 'picker' },
      );

      await view.selectSection('month');
      expectFieldValue(view.getSectionsContainer(), 'MMMM DD');

      await view.user.keyboard('N');
      expectFieldValue(view.getSectionsContainer(), 'November DD');

      await view.user.keyboard('4');
      expectFieldValue(view.getSectionsContainer(), 'November 04');

      await view.user.keyboard('[Backspace]');
      expectFieldValue(view.getSectionsContainer(), 'November DD');
    });

    it('should adapt the default field format based on the props of the picker', () => {
      const testFormat = (props: DesktopDatePickerProps, expectedFormat: string) => {
        const view = renderWithProps({ ...props }, { componentFamily: 'picker' });
        expectFieldValue(view.getSectionsContainer(), expectedFormat);
        view.unmount();
      };

      testFormat({ views: ['year'] }, 'YYYY');
      testFormat({ views: ['month'] }, 'MMMM');
      testFormat({ views: ['day'] }, 'DD');
      testFormat({ views: ['month', 'day'] }, 'MMMM DD');
      testFormat({ views: ['year', 'month'] }, 'MMMM YYYY');
      testFormat({ views: ['year', 'month', 'day'] }, 'MM/DD/YYYY');
      testFormat({ views: ['year', 'day'] }, 'MM/DD/YYYY');
    });
  });

  describeAdapters('Timezone', DesktopDatePicker, ({ adapter, renderWithProps }) => {
    it('should clear the selected section when all sections are completed when using timezones', async () => {
      const view = renderWithProps(
        {
          defaultValue: adapter.date()!,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          timezone: 'America/Chicago',
        },
        { componentFamily: 'picker' },
      );

      expectFieldValue(view.getSectionsContainer(), 'June 2022');
      await view.selectSection('month');

      await view.pressKey('');
      expectFieldValue(view.getSectionsContainer(), 'MMMM 2022');
    });
  });
});
