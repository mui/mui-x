import * as React from 'react';
import { expect } from 'chai';
import { DatePicker2 } from '@mui/x-date-pickers/DatePicker2';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import {createPickerRenderer, openPicker, stubMatchMedia} from 'test/utils/pickers-utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe.only('<DatePicker2 />', () => {
  const { render } = createPickerRenderer();

  describe('prop: inputRef', () => {
    it('should forward ref to the text box', () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<DatePicker2 inputRef={inputRef} />);

      expect(inputRef.current).to.have.tagName('input');
    });
  });

  describe('rendering', () => {
    it('should handle controlled `onChange` in desktop mode', () => {
      render(<DatePicker2 />);

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '02/22/2022' } });

      expect(screen.getByDisplayValue('02 / 22 / 2022')).not.to.equal(null);
    });

    it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = stubMatchMedia(false);

      render(<DatePicker2 />);

      expect(screen.getByLabelText(/Choose date/)).to.have.tagName('input');

      window.matchMedia = originalMatchMedia;
    });

    it.only('should keep focus when switching views', function test() {
      if (isJSDOM) {
        this.skip();
      }
      render(<DatePicker2 defaultValue={new Date(2019, 5, 5)} openTo="year" />);

      openPicker({ type: 'date', variant: 'desktop' })
      expect(document.activeElement).to.have.text('2019');

      fireEvent.click(screen.getByText('2020'));
      expect(document.activeElement).to.have.text('5');
    });
  });
});
