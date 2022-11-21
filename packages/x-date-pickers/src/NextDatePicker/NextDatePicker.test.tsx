import * as React from 'react';
import { expect } from 'chai';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import { createPickerRenderer, openPicker, stubMatchMedia } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<NextDatePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(NextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'new-picker',
  }));

  describe('prop: inputRef', () => {
    it('should forward ref to the text box', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<NextDatePicker inputRef={inputRef} />);

      expect(inputRef.current).to.have.tagName('input');
    });
  });

  describe('rendering', () => {
    it('should handle controlled `onChange` in desktop mode', () => {
      render(<NextDatePicker />);

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '02/22/2022' } });

      expect(screen.getByDisplayValue('02 / 22 / 2022')).not.to.equal(null);
    });

    it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = stubMatchMedia(false);

      render(<NextDatePicker />);

      expect(screen.getByLabelText(/Choose date/)).to.have.tagName('input');

      window.matchMedia = originalMatchMedia;
    });

    it('should keep focus when switching views', function test() {
      if (isJSDOM) {
        this.skip();
      }
      render(<NextDatePicker defaultValue={new Date(2019, 5, 5)} openTo="year" />);

      openPicker({ type: 'date', variant: 'desktop' });
      expect(document.activeElement).to.have.text('2019');

      fireEvent.click(screen.getByText('2020'));
      expect(document.activeElement).to.have.text('5');
    });
  });
});
