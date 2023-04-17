import * as React from 'react';
import { expect } from 'chai';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import {
  createPickerRenderer,
  openPicker,
  stubMatchMedia,
  expectInputValue,
  getTextbox,
} from 'test/utils/pickers-utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DatePicker />', () => {
  const { render } = createPickerRenderer();

  describe('prop: inputRef', () => {
    it('should forward ref to the text box', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<DatePicker inputRef={inputRef} />);

      expect(inputRef.current).to.have.tagName('input');
    });
  });

  describe('rendering', () => {
    it('should handle controlled `onChange` in desktop mode', () => {
      render(<DatePicker />);
      const input = getTextbox();

      fireEvent.change(input, { target: { value: '02/22/2022' } });
      expectInputValue(input, '02/22/2022');
    });

    it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = stubMatchMedia(false);

      render(<DatePicker />);

      expect(screen.getByLabelText(/Choose date/)).to.have.tagName('input');

      window.matchMedia = originalMatchMedia;
    });

    it('should keep focus when switching views', function test() {
      if (isJSDOM) {
        this.skip();
      }
      render(<DatePicker defaultValue={new Date(2019, 5, 5)} openTo="year" />);

      openPicker({ type: 'date', variant: 'desktop' });
      expect(document.activeElement).to.have.text('2019');

      fireEvent.click(screen.getByText('2020'));
      expect(document.activeElement).to.have.text('5');
    });
  });
});
