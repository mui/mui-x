import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { userEvent, screen } from '@mui/monorepo/test/utils';
import { DayPicker } from './DayPicker';
import { adapterToUse, createPickerRenderer } from '../../../../test/utils/pickers-utils';

describe('<DayPicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('should set time to be midnight when selecting a date without a previous date', () => {
    const onChange = spy();

    render(
      <DayPicker
        date={null}
        focusedDay={null}
        onFocusedDayChange={() => {}}
        onMonthSwitchingAnimationEnd={() => {}}
        isDateDisabled={() => false}
        isMonthSwitchingAnimating={false}
        slideDirection="right"
        reduceAnimations={false}
        currentMonth={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={onChange}
      />,
    );

    userEvent.mousePress(screen.getByLabelText('Jan 2, 2018'));
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-02T00:00:00.000'));
  });

  it('should keep the time of the currently provided date', () => {
    const onChange = spy();

    render(
      <DayPicker
        date={adapterToUse.date('2018-01-03T11:11:11.111')}
        focusedDay={null}
        onFocusedDayChange={() => {}}
        onMonthSwitchingAnimationEnd={() => {}}
        isDateDisabled={() => false}
        isMonthSwitchingAnimating={false}
        slideDirection="right"
        reduceAnimations={false}
        currentMonth={adapterToUse.date('2018-01-01T00:00:00.000')}
        onChange={onChange}
      />,
    );

    userEvent.mousePress(screen.getByLabelText('Jan 2, 2018'));
    expect(onChange.callCount).to.equal(1);
    expect(onChange.lastCall.args[0]).toEqualDateTime(adapterToUse.date('2018-01-02T11:11:11.000'));
  });
});
