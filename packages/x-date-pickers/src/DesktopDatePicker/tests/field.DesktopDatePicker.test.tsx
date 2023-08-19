import * as React from 'react';
import { fireEvent, userEvent } from '@mui/monorepo/test/utils';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  buildFieldInteractions,
  getTextbox,
  expectInputValue,
  expectInputPlaceholder,
  adapterToUse,
} from 'test/utils/pickers';
import { describeAdapters } from '@mui/x-date-pickers/tests/describeAdapters';

describe('<DesktopDatePicker /> - Field', () => {
  describe('Basic behaviors', () => {
    const { render, clock } = createPickerRenderer({
      clock: 'fake',
      clockConfig: new Date('2018-01-01T10:05:05.000'),
    });
    const { clickOnInput } = buildFieldInteractions({
      clock,
      render,
      Component: DesktopDatePicker,
    });

    it('should be able to reset a single section', () => {
      render(<DesktopDatePicker format={adapterToUse.formats.monthAndDate} />);

      const input = getTextbox();
      expectInputPlaceholder(input, 'MMMM DD');
      clickOnInput(input, 1);

      fireEvent.change(input, { target: { value: 'N DD' } }); // Press "1"
      expectInputValue(input, 'November DD');

      fireEvent.change(input, { target: { value: 'November 4' } }); // Press "1"
      expectInputValue(input, 'November 04');

      userEvent.keyPress(input, { key: 'Backspace' });
      expectInputValue(input, 'November DD');
    });

    it('should adapt the default field format based on the props of the picker', () => {
      const testFormat = (props: DesktopDatePickerProps<any>, expectedFormat: string) => {
        const { unmount } = render(<DesktopDatePicker {...props} />);
        const input = getTextbox();
        expectInputPlaceholder(input, expectedFormat);
        unmount();
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

  describeAdapters('Timezone', DesktopDatePicker, ({ adapter, render, clickOnInput }) => {
    it('should clear the selected section when all sections are completed when using timezones', () => {
      function WrappedDesktopDatePicker() {
        const [value, setValue] = React.useState(adapter.date()!);
        return (
          <DesktopDatePicker
            value={value}
            onChange={setValue}
            format={adapter.formats.monthAndYear}
            timezone="America/Chicago"
          />
        );
      }
      render(<WrappedDesktopDatePicker />);

      const input = getTextbox();
      expectInputValue(input, 'June 2022');
      clickOnInput(input, 0);

      userEvent.keyPress(input, { key: 'Backspace' });
      expectInputValue(input, 'MMMM 2022');
    });
  });
});
