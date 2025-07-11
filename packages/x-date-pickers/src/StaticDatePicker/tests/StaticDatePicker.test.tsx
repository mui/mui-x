import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';

describe('<StaticDatePicker />', () => {
  const { render } = createPickerRenderer();

  it('render proper month', () => {
    render(<StaticDatePicker defaultValue={adapterToUse.date('2019-01-01')} />);

    expect(screen.getByText('January 2019')).toBeVisible();
    expect(screen.getAllByTestId('day')).to.have.length(31);
  });

  it('switches between months', () => {
    render(<StaticDatePicker reduceAnimations defaultValue={adapterToUse.date('2019-01-01')} />);

    expect(screen.getByTestId('calendar-month-and-year-text')).to.have.text('January 2019');

    const nextMonth = screen.getByLabelText('Next month');
    const previousMonth = screen.getByLabelText('Previous month');
    fireEvent.click(nextMonth);
    fireEvent.click(nextMonth);

    fireEvent.click(previousMonth);
    fireEvent.click(previousMonth);
    fireEvent.click(previousMonth);

    expect(screen.getByTestId('calendar-month-and-year-text')).to.have.text('December 2018');
  });

  describe('props - autoFocus', () => {
    function Test(props) {
      return (
        <div id="pickerWrapper">
          <StaticDatePicker {...props} />
        </div>
      );
    }

    it.skipIf(isJSDOM)('should take focus when `autoFocus=true`', () => {
      render(<Test autoFocus />);

      const isInside = document.getElementById('pickerWrapper')?.contains(document.activeElement);
      expect(isInside).to.equal(true);
    });

    it.skipIf(isJSDOM)('should not take focus when `autoFocus=false`', () => {
      render(<Test />);

      const isInside = document.getElementById('pickerWrapper')?.contains(document.activeElement);
      expect(isInside).to.equal(false);
    });
  });
});
