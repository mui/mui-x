import * as React from 'react';
import { expect } from 'chai';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DatePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'legacy-picker',
  }));

  describe('prop: inputRef', () => {
    it('should forward ref to the text box', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(
        <DatePicker
          inputRef={inputRef}
          value={null}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      expect(inputRef.current).to.have.tagName('input');
    });
  });

  describe('rendering', () => {
    function ControlledDatePicker() {
      const [value, setValue] = React.useState<Date | null>(null);
      return (
        <DatePicker
          renderInput={(params) => <TextField {...params} />}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      );
    }

    it('should handle controlled `onChange` in desktop mode', () => {
      render(<ControlledDatePicker />);

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '02/22/2022' } });

      expect(screen.getByDisplayValue('02/22/2022')).not.to.equal(null);
    });

    it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = stubMatchMedia(false);

      render(
        <DatePicker
          renderInput={(params) => <TextField {...params} />}
          onChange={() => {}}
          value={null}
        />,
      );

      expect(screen.getByLabelText(/Choose date/)).to.have.tagName('input');

      window.matchMedia = originalMatchMedia;
    });

    it('should keep focus when switching views', function test() {
      if (isJSDOM) {
        this.skip();
      }
      render(
        <DatePicker
          renderInput={(params) => <TextField {...params} />}
          onChange={() => {}}
          value={new Date(2019, 5, 5)}
          openTo="year"
        />,
      );

      fireEvent.click(screen.getByRole('button'));
      expect(document.activeElement).to.have.text('2019');

      fireEvent.click(screen.getByText('2020'));
      expect(document.activeElement).to.have.text('5');
    });
  });
});
