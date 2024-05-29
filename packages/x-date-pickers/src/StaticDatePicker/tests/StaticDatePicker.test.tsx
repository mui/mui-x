import * as React from 'react';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<StaticDatePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('render proper month', () => {
    render(<StaticDatePicker defaultValue={adapterToUse.date('2019-01-01')} />);

    expect(screen.getByText('January 2019')).toBeVisible();
    expect(screen.getAllByMuiTest('day')).to.have.length(31);
  });

  it('switches between months', () => {
    render(<StaticDatePicker reduceAnimations defaultValue={adapterToUse.date('2019-01-01')} />);

    expect(screen.getByMuiTest('calendar-month-and-year-text')).to.have.text('January 2019');

    const nextMonth = screen.getByLabelText('Next month');
    const previousMonth = screen.getByLabelText('Previous month');
    fireEvent.click(nextMonth);
    fireEvent.click(nextMonth);

    fireEvent.click(previousMonth);
    fireEvent.click(previousMonth);
    fireEvent.click(previousMonth);

    expect(screen.getByMuiTest('calendar-month-and-year-text')).to.have.text('December 2018');
  });

  describe('props - autoFocus', () => {
    function Test(props) {
      return (
        <div id="pickerWrapper">
          <StaticDatePicker {...props} />
        </div>
      );
    }

    it('should take focus when `autoFocus=true`', function test() {
      if (isJSDOM) {
        this.skip();
      }

      render(<Test autoFocus />);

      const isInside = document.getElementById('pickerWrapper')?.contains(document.activeElement);
      expect(isInside).to.equal(true);
    });

    it('should not take focus when `autoFocus=false`', function test() {
      if (isJSDOM) {
        this.skip();
      }

      render(<Test />);

      const isInside = document.getElementById('pickerWrapper')?.contains(document.activeElement);
      expect(isInside).to.equal(false);
    });
  });
});
