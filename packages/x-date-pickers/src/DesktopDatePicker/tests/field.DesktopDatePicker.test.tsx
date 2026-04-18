import * as React from 'react';
import { act } from '@mui/internal-test-utils';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  buildFieldInteractions,
  expectFieldValue,
  adapterToUse,
  describeAdapters,
} from 'test/utils/pickers';

describe('<DesktopDatePicker /> - Field', () => {
  describe('Basic behaviors', () => {
    const { render } = createPickerRenderer({
      clockConfig: new Date('2018-01-01T10:05:05.000'),
    });
    const { renderWithProps } = buildFieldInteractions({
      render,
      Component: DesktopDatePicker,
    });

    it('should be able to reset a single section', async () => {
      const view = renderWithProps(
        {
          format: `${adapterToUse.formats.month} ${adapterToUse.formats.dayOfMonth}`,
        },
        { componentFamily: 'picker' },
      );

      view.selectSection('month');
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
    it('should clear the selected section when all sections are completed when using timezones', () => {
      const view = renderWithProps(
        {
          defaultValue: adapter.date()!,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          timezone: 'America/Chicago',
        },
        { componentFamily: 'picker' },
      );

      expectFieldValue(view.getSectionsContainer(), 'June 2022');
      view.selectSection('month');

      view.pressKey(0, '');
      expectFieldValue(view.getSectionsContainer(), 'MMMM 2022');
    });
  });

  describeAdapters(
    'Controlled invalid value',
    DesktopDatePicker,
    ({ adapter, renderWithProps }) => {
      it('should keep the entered sections when the controlled value ignores a validator-invalid date', async () => {
        const view = renderWithProps(
          {
            minDate: adapter.date('2022-01-01'),
            maxDate: adapter.date('2022-12-31'),
          },
          {
            componentFamily: 'picker',
            hook: function useControlledInvalidValueProps() {
              const [value, setValue] = React.useState(null);

              return {
                value,
                onChange: (newValue, context) => {
                  if (context.validationError == null) {
                    setValue(newValue);
                  }
                },
              };
            },
          },
        );

        await view.selectSectionAsync('month');
        await view.user.keyboard('04');
        await view.selectSectionAsync('day');
        await view.user.keyboard('17');
        expectFieldValue(view.getSectionsContainer(), '04/17/YYYY');

        await view.selectSectionAsync('year');
        await view.user.keyboard('2023');

        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 0);
          });
        });

        expectFieldValue(view.getSectionsContainer(), '04/17/2023');

        await view.selectSectionAsync('year');
        await view.user.keyboard('2022');
        expectFieldValue(view.getSectionsContainer(), '04/17/2022');
      });
    },
  );
});
