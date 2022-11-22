import * as React from 'react';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<StaticNextDatePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(StaticNextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'new-static-picker',
  }));

  it('render proper month', () => {
    render(<StaticNextDatePicker defaultValue={adapterToUse.date(new Date(2019, 0, 1))} />);

    expect(screen.getByText('January 2019')).toBeVisible();
    expect(screen.getAllByMuiTest('day')).to.have.length(31);
  });

  it('switches between months', () => {
    render(
      <StaticNextDatePicker
        reduceAnimations
        defaultValue={adapterToUse.date(new Date(2019, 0, 1))}
      />,
    );

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

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<StaticNextDatePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });

  describe('props - autoFocus', () => {
    function Test(props) {
  return <div id="pickerWrapper">
        <StaticNextDatePicker {...props} />
      </div>
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
